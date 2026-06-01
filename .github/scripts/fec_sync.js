#!/usr/bin/env node
/**
 * FEC Contribution Sync Script
 * Fetches PAC/committee contribution totals for each U.S. senator from the
 * Federal Election Commission API and writes fec_contributions.csv.
 *
 * Uses the /candidate/{fec_id}/totals/ endpoint — one call per senator per
 * election cycle, no per-transaction pagination needed.
 *
 * Required env var:
 *   FEC_API_KEY — free key from https://api.data.gov/signup/
 *                 (1,000 req/hour; DEMO_KEY works for testing at 30/hour)
 *
 * FEC election cycles in a 5-year window ending in current year:
 *   2022 → Jan 2021–Dec 2022
 *   2024 → Jan 2023–Dec 2024
 *   2026 → Jan 2025–Dec 2026
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')

const FEC_CSV       = path.join(ROOT, 'public', 'data', 'fec_contributions.csv')
const SYNC_STATE    = path.join(ROOT, 'public', 'data', 'sync_state.json')
const LEGISLATORS_URL = 'https://unitedstates.github.io/congress-legislators/legislators-current.json'

const FEC_BASE    = 'https://api.open.fec.gov/v1'
const FEC_API_KEY = process.env.FEC_API_KEY ?? 'DEMO_KEY'
// Election cycles: even years — pick the two completed + current
const FEC_CYCLES  = [2022, 2024, 2026]

const CSV_HEADER = 'senator_id,fec_candidate_id,cycle,pac_contributions,party_contributions,individual_contributions,total_receipts\n'

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ── FEC API ───────────────────────────────────────────────────────────────────

async function fecGet(path_, attempt = 0) {
  const sep = path_.includes('?') ? '&' : '?'
  const url = `${FEC_BASE}${path_}${sep}api_key=${FEC_API_KEY}`
  const res = await fetch(url)
  if (res.ok) return res.json()
  if (res.status === 429 && attempt < 5) {
    const wait = Math.min(60_000, 4_000 * 2 ** attempt)
    console.log(`\n  FEC 429 — waiting ${wait / 1000}s`)
    await sleep(wait)
    return fecGet(path_, attempt + 1)
  }
  if (res.status === 404) return null
  throw new Error(`FEC API ${res.status}: ${url}`)
}

async function fetchCandidateTotals(fecId, cycle) {
  const data = await fecGet(`/candidate/${fecId}/totals/?cycle=${cycle}&election_full=false`)
  // Results is an array; find the entry matching this cycle
  return data?.results?.find(r => r.cycle === cycle) ?? null
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

function csvEscape(v) {
  const s = String(v ?? 0)
  return s.includes(',') ? `"${s}"` : s
}

function csvRow(fields) {
  return fields.map(csvEscape).join(',')
}

function loadExistingRows() {
  if (!fs.existsSync(FEC_CSV)) return new Set()
  const lines = fs.readFileSync(FEC_CSV, 'utf8').trim().split('\n').slice(1)
  // key = senator_id|fec_candidate_id|cycle
  return new Set(lines.map(l => {
    const [senId, fecId, cycle] = l.split(',')
    return `${senId}|${fecId}|${cycle}`
  }).filter(Boolean))
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (FEC_API_KEY === 'DEMO_KEY') {
    console.warn('WARNING: Using DEMO_KEY (30 req/hour). Add FEC_API_KEY secret for full rate limits.')
  }

  console.log('\n=== FEC Sync ===')
  console.log(`Cycles: ${FEC_CYCLES.join(', ')}`)

  // Fetch current senator roster (same source as LDA sync)
  const res = await fetch(LEGISLATORS_URL)
  if (!res.ok) throw new Error(`Legislators fetch failed: ${res.status}`)
  const all = await res.json()

  const senators = all.filter(m => m.terms.at(-1)?.type === 'sen')
  console.log(`${senators.length} current senators`)

  const existingKeys = loadExistingRows()
  console.log(`${existingKeys.size} rows already in fec_contributions.csv`)

  const newRows = []
  let fetched = 0, skipped = 0, missing = 0

  for (const senator of senators) {
    const lastName  = senator.name.last
    const firstName = senator.name.nickname || senator.name.first
    const slug      = `${firstName} ${lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // FEC IDs are in id.fec — filter to senate candidate IDs (start with S)
    const fecIds = (senator.id.fec ?? []).filter(id => id.startsWith('S'))
    if (!fecIds.length) {
      console.log(`  No senate FEC ID: ${firstName} ${lastName}`)
      missing++
      continue
    }

    for (const fecId of fecIds) {
      for (const cycle of FEC_CYCLES) {
        const key = `${slug}|${fecId}|${cycle}`
        if (existingKeys.has(key)) { skipped++; continue }

        const totals = await fetchCandidateTotals(fecId, cycle)
        fetched++

        if (!totals) continue  // senator didn't run this cycle

        const pac          = totals.other_political_committee_contributions ?? 0
        const party        = totals.political_party_committee_contributions ?? 0
        const individual   = totals.individual_itemized_contributions ?? 0
        const total        = totals.receipts ?? 0

        if (pac + party + individual === 0) continue  // no activity this cycle

        newRows.push(csvRow([slug, fecId, cycle, pac, party, individual, total]))
        process.stdout.write(`\r  ${fetched} fetched, ${newRows.length} rows, ${skipped} skipped`)
        await sleep(120)  // gentle pacing — ~500 req/min well under 1000/hour limit
      }
    }
  }

  console.log(`\n  Done: ${fetched} API calls, ${newRows.length} new rows, ${skipped} skipped, ${missing} no FEC ID`)

  if (newRows.length > 0) {
    const needsHeader = !fs.existsSync(FEC_CSV) ||
      fs.readFileSync(FEC_CSV, 'utf8').trim() === CSV_HEADER.trim()
    if (needsHeader) {
      fs.writeFileSync(FEC_CSV, CSV_HEADER + newRows.join('\n') + '\n')
    } else {
      fs.appendFileSync(FEC_CSV, newRows.join('\n') + '\n')
    }
    console.log(`Wrote ${newRows.length} rows to fec_contributions.csv`)
  }

  // Update sync_state with FEC info
  const state = JSON.parse(fs.readFileSync(SYNC_STATE, 'utf8'))
  state.fec_last_synced_at = new Date().toISOString()
  state.fec_cycles_synced  = FEC_CYCLES
  state.fec_stats = {
    total_rows: (state.fec_stats?.total_rows ?? 0) + newRows.length,
  }
  fs.writeFileSync(SYNC_STATE, JSON.stringify(state, null, 2) + '\n')
  console.log('Updated sync_state.json with FEC info')
}

main().catch(err => { console.error(err); process.exit(1) })
