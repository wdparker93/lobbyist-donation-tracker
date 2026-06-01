#!/usr/bin/env node
/**
 * LDA Contribution Sync Script
 * Fetches new filings from the Senate LDA API and appends matched senator
 * contributions to public/data/contributions.csv.
 *
 * Incremental: uses the filing_uuid as the deduplication key.
 * The CSV itself is the source of truth for what's been processed.
 *
 * Name matching order:
 *   1. Exact match against name_overrides.csv (human-curated)
 *   2. Exact alias match from senators roster
 *   3. Fuzzy Levenshtein match (confidence threshold)
 *   4. Multi-name split (e.g. "Sanders/Warren" → two rows)
 * Unmatched names go to data/unmatched.csv for review.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')

const CONTRIBUTIONS_CSV = path.join(ROOT, 'public', 'data', 'contributions.csv')
const SYNC_STATE_JSON   = path.join(ROOT, 'public', 'data', 'sync_state.json')
const NAME_OVERRIDES_CSV = path.join(ROOT, 'data', 'name_overrides.csv')
const UNMATCHED_CSV     = path.join(ROOT, 'data', 'unmatched.csv')
const SENATORS_JS       = path.join(ROOT, 'src', 'data', 'senators.js')

const LEGISLATORS_URL = 'https://unitedstates.github.io/congress-legislators/legislators-current.json'
const LDA_BASE        = 'https://lda.senate.gov/api/v1/contributions/'
const PAGE_SIZE       = 100
const MAX_PARALLEL    = 2     // conservative to avoid 429s
const BATCH_DELAY_MS  = 500   // pause between parallel batches
const FUZZY_THRESHOLD = 0.75

const PARTY_ABBREV = { Democrat: 'D', Republican: 'R', Independent: 'I' }

const STATES = [
  { code: 'AL', name: 'Alabama' },    { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },    { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },{ code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },    { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },     { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },   { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },       { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },   { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },      { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },{ code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },   { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },   { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },{ code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },{ code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },       { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },     { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },{ code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },{ code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },      { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },    { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },  { code: 'WY', name: 'Wyoming' },
]

// ── Levenshtein similarity (0–1) ─────────────────────────────────────────────
function similarity(a, b) {
  if (a === b) return 1
  if (!a || !b) return 0
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return 1 - dp[m][n] / Math.max(m, n)
}

// ── Name normalisation ────────────────────────────────────────────────────────
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/^(the\s+)?honorable\s+/i, '')
    // Longer alternatives must come before their prefixes (senator before sen.)
    .replace(/\b(senator|representative|sen\.?|rep\.?|dr\.?|mr\.?|ms\.?|mrs\.?)\s*/gi, '')
    .replace(/\b[a-z]\.\s*/g, '')          // strip lone initials: "J. "
    .replace(/[^a-z\s\-]/g, '')            // strip punctuation except hyphens
    .replace(/\s+/g, ' ')
    .trim()
}

// Split compound names: "Sanders/Warren", "Cruz and Cornyn", "Cruz & Cornyn"
function splitCompoundName(raw) {
  return raw
    .split(/[\/|]|\s+and\s+|\s*&\s*/i)
    .map(p => p.trim())
    .filter(p => p.length > 2)
}

// ── Fetch current senator roster and regenerate senators.js ──────────────────
function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function fetchAndWriteSenatorRoster() {
  console.log('\n-- Updating senator roster from unitedstates/congress-legislators --')
  const res = await fetch(LEGISLATORS_URL)
  if (!res.ok) throw new Error(`Legislators fetch failed: ${res.status}`)
  const all = await res.json()

  const senators = all
    .filter(m => m.terms.at(-1)?.type === 'sen')
    .map(m => {
      const term = m.terms.at(-1)
      const displayFirst = m.name.nickname || m.name.first
      const last = m.name.last
      const id = toSlug(`${displayFirst} ${last}`)

      // Collect all known name forms as aliases for the matcher
      const aliasSet = new Set([
        `${displayFirst} ${last}`,
        `${m.name.first} ${last}`,
        m.name.official_full,
        m.name.nickname ? `${m.name.nickname} ${last}` : null,
      ].filter(Boolean))

      return {
        id,
        firstName: displayFirst,
        lastName: last,
        state: term.state,
        party: PARTY_ABBREV[term.party] ?? 'I',
        bioguide: m.id.bioguide,
        aliases: [...aliasSet],
      }
    })
    .sort((a, b) => a.state.localeCompare(b.state) || a.lastName.localeCompare(b.lastName))

  console.log(`  ${senators.length} current senators`)

  // Regenerate src/data/senators.js so the next Vite build picks up fresh data
  const entries = senators.map(s => {
    const esc = v => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const aliases = s.aliases.map(a => `'${esc(a)}'`).join(', ')
    return `  { id: '${s.id}', firstName: '${esc(s.firstName)}', lastName: '${esc(s.lastName)}', state: '${s.state}', party: '${s.party}', bioguide: '${s.bioguide}', aliases: [${aliases}] },`
  }).join('\n')

  const statesEntries = STATES.map(s => `  { code: '${s.code}', name: '${s.name}' },`).join('\n')

  const js = `// Auto-generated by .github/scripts/sync.js — do not edit manually.
// Source: https://github.com/unitedstates/congress-legislators
// Updated: ${new Date().toISOString().slice(0, 10)}
export const SENATORS = [
${entries}
]

export const STATES = [
${statesEntries}
]
`
  fs.writeFileSync(SENATORS_JS, js)
  console.log(`  Wrote src/data/senators.js`)
  return senators
}

// ── Load senator roster from senators.js (parse the export statically) ───────
// Used only as a fallback if the live fetch fails.
function loadSenators() {
  const src = fs.readFileSync(SENATORS_JS, 'utf8')
  // Quick-and-dirty extraction: find SENATORS array entries
  const senators = []
  const re = /\{[^}]+id:\s*'([^']+)'[^}]+firstName:\s*'([^']+)'[^}]+lastName:\s*'([^']+)'[^}]+state:\s*'([^']+)'[^}]+party:\s*'([^']+)'[^}]+aliases:\s*\[([^\]]+)\]/g
  let m
  while ((m = re.exec(src)) !== null) {
    const [, id, firstName, lastName, state, party, aliasesRaw] = m
    const aliases = aliasesRaw.match(/'([^']+)'/g)?.map(s => s.slice(1, -1)) ?? []
    senators.push({ id, firstName, lastName, state, party, aliases })
  }
  return senators
}

// ── Load name_overrides.csv ───────────────────────────────────────────────────
function loadOverrides() {
  const overrides = new Map() // normalised raw_name → senator_id
  if (!fs.existsSync(NAME_OVERRIDES_CSV)) return overrides
  const lines = fs.readFileSync(NAME_OVERRIDES_CSV, 'utf8').trim().split('\n').slice(1) // skip header
  for (const line of lines) {
    const [raw, senatorId] = parseCSVLine(line)
    if (raw && senatorId) {
      overrides.set(normalizeName(raw), senatorId.trim())
    }
  }
  return overrides
}

// ── Load unmatched names from existing unmatched.csv ─────────────────────────
function loadUnmatched() {
  const unmatched = new Map() // normalised name → { raw, count, last_seen, sample_registrant }
  if (!fs.existsSync(UNMATCHED_CSV)) return unmatched
  const lines = fs.readFileSync(UNMATCHED_CSV, 'utf8').trim().split('\n').slice(1)
  for (const line of lines) {
    const [raw, count, last_seen, sample_registrant] = parseCSVLine(line)
    if (raw) {
      unmatched.set(normalizeName(raw), {
        raw,
        count: parseInt(count, 10) || 0,
        last_seen,
        sample_registrant,
      })
    }
  }
  return unmatched
}

// ── Load existing filing_uuids from contributions.csv ────────────────────────
function loadProcessedUUIDs() {
  if (!fs.existsSync(CONTRIBUTIONS_CSV)) return new Set()
  const content = fs.readFileSync(CONTRIBUTIONS_CSV, 'utf8')
  const uuids = new Set()
  const lines = content.trim().split('\n').slice(1) // skip header
  for (const line of lines) {
    // id column = filing_uuid_N, so uuid = everything before the last underscore+digits
    const id = parseCSVLine(line)[0]
    if (id) {
      const uuid = id.replace(/_\d+$/, '')
      uuids.add(uuid)
    }
  }
  return uuids
}

// ── Build matcher ─────────────────────────────────────────────────────────────
function buildMatcher(senators, overrides) {
  // Alias map: normalised alias → senator id
  const aliasMap = new Map()
  for (const s of senators) {
    const fullName = `${s.firstName} ${s.lastName}`
    aliasMap.set(normalizeName(fullName), s.id)
    for (const alias of s.aliases) {
      aliasMap.set(normalizeName(alias), s.id)
    }
  }

  function matchOne(raw) {
    const norm = normalizeName(raw)
    if (!norm || norm.length < 3) return null

    // 1. Human override
    if (overrides.has(norm)) return { id: overrides.get(norm), confidence: 1, method: 'override' }

    // 2. Exact alias
    if (aliasMap.has(norm)) return { id: aliasMap.get(norm), confidence: 1, method: 'alias' }

    // 3. Fuzzy match against all known aliases
    let best = null, bestScore = 0
    for (const [alias, id] of aliasMap) {
      const score = similarity(norm, alias)
      if (score > bestScore) { bestScore = score; best = id }
    }
    if (bestScore >= FUZZY_THRESHOLD) {
      return { id: best, confidence: bestScore, method: 'fuzzy' }
    }

    return null
  }

  // Returns array of { id, confidence, method } — may be >1 for compound names
  function match(rawHonoreeName) {
    const single = matchOne(rawHonoreeName)
    if (single) return [single]

    // Try splitting compound names
    const parts = splitCompoundName(rawHonoreeName)
    if (parts.length > 1) {
      const results = parts.map(matchOne).filter(Boolean)
      if (results.length > 0) return results
    }

    return []
  }

  return { match }
}

// ── LDA API fetcher with retry / backoff ─────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchPage(year, page, attempt = 0) {
  const url = `${LDA_BASE}?format=json&filing_year=${year}&limit=${PAGE_SIZE}&page=${page}`
  const res = await fetch(url)
  if (res.ok) return res.json()

  if (res.status === 429 && attempt < 6) {
    // Honour Retry-After if present, otherwise exponential backoff (4s, 8s, 16s…)
    const retryAfter = parseInt(res.headers.get('Retry-After') ?? '0', 10)
    const wait = retryAfter > 0 ? retryAfter * 1000 : Math.min(60_000, 4_000 * 2 ** attempt)
    process.stdout.write(`\n  429 on page ${page} — waiting ${wait / 1000}s...\n`)
    await sleep(wait)
    return fetchPage(year, page, attempt + 1)
  }

  throw new Error(`LDA API ${res.status} on page ${page} (attempt ${attempt + 1})`)
}

function extractItems(filings) {
  const out = []
  for (const filing of filings) {
    if (!filing.contribution_items?.length) continue
    const registrant = filing.registrant?.name ?? ''
    const lobbyist = filing.lobbyist
      ? `${filing.lobbyist.first_name ?? ''} ${filing.lobbyist.last_name ?? ''}`.trim()
      : ''
    for (let i = 0; i < filing.contribution_items.length; i++) {
      const item = filing.contribution_items[i]
      const amount = parseFloat(item.amount)
      if (!item.honoree_name || isNaN(amount) || amount <= 0) continue
      out.push({
        id: `${filing.filing_uuid}_${i}`,
        filing_uuid: filing.filing_uuid,
        filing_year: filing.filing_year,
        filing_period: filing.filing_period_display ?? '',
        honoree_raw: item.honoree_name,
        registrant,
        lobbyist,
        amount,
        date: item.date ?? '',
        payee_name: item.payee_name ?? '',
      })
    }
  }
  return out
}

// ── CSV helpers ───────────────────────────────────────────────────────────────
function csvEscape(v) {
  const s = String(v ?? '')
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

function csvRow(fields) {
  return fields.map(csvEscape).join(',')
}

function parseCSVLine(line) {
  // Simple CSV line parser (handles quoted fields)
  const fields = []
  let field = '', inQuote = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { field += '"'; i++ }
      else inQuote = !inQuote
    } else if (ch === ',' && !inQuote) {
      fields.push(field); field = ''
    } else {
      field += ch
    }
  }
  fields.push(field)
  return fields
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const now = new Date()
  const currentYear = now.getFullYear()

  // Always cover the last 5 years so every run includes the prior election cycle.
  // e.g. in 2026 → [2022, 2023, 2024, 2025, 2026]
  const LOOKBACK_YEARS = 5
  const yearsToSync = Array.from({ length: LOOKBACK_YEARS }, (_, i) => currentYear - (LOOKBACK_YEARS - 1 - i))

  console.log(`\n=== LDA Sync — ${now.toISOString()} ===`)
  console.log(`Years window: ${yearsToSync[0]}–${yearsToSync.at(-1)} (${LOOKBACK_YEARS}-year lookback)`)

  let senators
  try {
    senators = await fetchAndWriteSenatorRoster()
  } catch (err) {
    console.warn(`  Roster fetch failed (${err.message}), falling back to static senators.js`)
    senators = loadSenators()
  }
  console.log(`Using ${senators.length} senators`)

  const overrides = loadOverrides()
  console.log(`Loaded ${overrides.size} name overrides`)

  const processedUUIDs = loadProcessedUUIDs()
  console.log(`Already processed: ${processedUUIDs.size} filing UUIDs`)

  const unmatchedMap = loadUnmatched()
  const { match } = buildMatcher(senators, overrides)

  // Load per-year filing counts cached from the last run.
  // The LDA API returns filings oldest-first, so when the total count grows
  // we can skip straight to the new pages instead of re-scanning everything.
  const existingState = JSON.parse(fs.readFileSync(SYNC_STATE_JSON, 'utf8'))
  const apiCountByYear = existingState.api_count_by_year ?? {}

  let totalNewMatched = 0, totalNewRows = 0

  for (const year of yearsToSync) {
    console.log(`\n-- ${year} --`)
    const first = await fetchPage(year, 1)
    const totalCount = first.count
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)
    const cachedCount = apiCountByYear[year] ?? 0

    if (totalCount === cachedCount) {
      console.log(`  ${totalCount} filings — unchanged since last sync, skipping`)
      continue
    }

    const startPage = cachedCount > 0 ? Math.floor(cachedCount / PAGE_SIZE) + 1 : 1
    const newCount = totalCount - cachedCount
    console.log(`  ${totalCount} filings total, ${newCount} new — fetching pages ${startPage}–${totalPages}`)

    const yearRows = []
    let processed = 0, skipped = 0, yearMatched = 0, yearUnmatched = 0

    for (let start = startPage; start <= totalPages; start += MAX_PARALLEL) {
      const pageNums = []
      for (let p = start; p < start + MAX_PARALLEL && p <= totalPages; p++) pageNums.push(p)

      const pages = await Promise.all(pageNums.map(p => fetchPage(year, p)))
      for (const page of pages) {
        const items = extractItems(page.results)
        for (const item of items) {
          if (processedUUIDs.has(item.filing_uuid)) { skipped++; continue }
          processed++
          processedUUIDs.add(item.filing_uuid) // prevent intra-run dupes

          const matches = match(item.honoree_raw)
          if (matches.length === 0) {
            const norm = normalizeName(item.honoree_raw)
            const existing = unmatchedMap.get(norm) ?? {
              raw: item.honoree_raw, count: 0, last_seen: '', sample_registrant: item.registrant
            }
            unmatchedMap.set(norm, {
              ...existing,
              count: existing.count + 1,
              last_seen: item.date || now.toISOString().slice(0, 10),
            })
            yearUnmatched++
          } else {
            for (const m of matches) {
              const splitAmount = (item.amount / matches.length).toFixed(2)
              yearRows.push(csvRow([
                `${item.id}_s${matches.indexOf(m)}`,
                item.filing_uuid,
                item.filing_year,
                item.filing_period,
                m.id,
                item.honoree_raw,
                item.registrant,
                item.lobbyist,
                splitAmount,
                item.date,
                item.payee_name,
              ]))
              yearMatched++
            }
          }
        }
      }

      const done = Math.min(start + MAX_PARALLEL - 1, totalPages)
      process.stdout.write(`\r  Page ${done}/${totalPages} — ${yearMatched} matched, ${yearUnmatched} unmatched`)
      await sleep(BATCH_DELAY_MS)
    }

    // Flush this year's rows to disk immediately so a failure on a later
    // year doesn't lose progress (UUID dedup prevents re-processing on retry)
    if (yearRows.length > 0) {
      const needsHeader = !fs.existsSync(CONTRIBUTIONS_CSV) ||
        fs.readFileSync(CONTRIBUTIONS_CSV, 'utf8').trim() === 'id,filing_uuid,filing_year,filing_period,senator_id,honoree_raw,registrant,lobbyist,amount,date,payee_name'
      if (needsHeader) {
        fs.writeFileSync(CONTRIBUTIONS_CSV,
          'id,filing_uuid,filing_year,filing_period,senator_id,honoree_raw,registrant,lobbyist,amount,date,payee_name\n' +
          yearRows.join('\n') + '\n')
      } else {
        fs.appendFileSync(CONTRIBUTIONS_CSV, yearRows.join('\n') + '\n')
      }
    }

    apiCountByYear[year] = totalCount
    totalNewMatched += yearMatched
    totalNewRows += yearRows.length
    console.log(`\n  Done: ${processed} processed, ${skipped} skipped, ${yearMatched} matched, ${yearUnmatched} unmatched`)
  }

  console.log(`\nTotal new rows written: ${totalNewRows}`)
  if (totalNewRows === 0) console.log('(No new contributions found)')

  // ── Write unmatched.csv ─────────────────────────────────────────────────────
  const unmatchedHeader = 'raw_name,count,last_seen,sample_registrant\n'
  const unmatchedRows = [...unmatchedMap.values()]
    .sort((a, b) => b.count - a.count)
    .map(u => csvRow([u.raw, u.count, u.last_seen, u.sample_registrant]))
  fs.writeFileSync(UNMATCHED_CSV, unmatchedHeader + unmatchedRows.join('\n') + '\n')
  console.log(`Updated unmatched.csv with ${unmatchedMap.size} unique unmatched names`)

  // ── Write sync_state.json ───────────────────────────────────────────────────
  const newState = {
    last_synced_at: now.toISOString(),
    lookback_years: LOOKBACK_YEARS,
    api_count_by_year: apiCountByYear,
    stats: {
      total_rows: (existingState.stats?.total_rows ?? 0) + totalNewRows,
      total_matched: (existingState.stats?.total_matched ?? 0) + totalNewMatched,
      total_unmatched: unmatchedMap.size,
    },
  }
  fs.writeFileSync(SYNC_STATE_JSON, JSON.stringify(newState, null, 2) + '\n')
  console.log(`Updated sync_state.json`)
  console.log(`\nSync complete. ${totalNewMatched} new matched rows, ${unmatchedMap.size} total unmatched names.`)
}

main().catch(err => { console.error(err); process.exit(1) })
