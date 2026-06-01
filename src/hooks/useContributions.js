import { useQuery } from '@tanstack/react-query'
import Papa from 'papaparse'
import { SENATORS } from '../data/senators.js'

const BASE = import.meta.env.BASE_URL

async function loadContributions() {
  const [ldaRes, fecRes, stateRes] = await Promise.all([
    fetch(`${BASE}data/contributions.csv`),
    fetch(`${BASE}data/fec_contributions.csv`),
    fetch(`${BASE}data/sync_state.json`),
  ])

  if (!ldaRes.ok) throw new Error('contributions.csv not found')
  const syncState = stateRes.ok ? await stateRes.json() : null

  // ── LDA (LD-203 direct lobbyist contributions) ───────────────────────────
  const { data: ldaRows } = Papa.parse(await ldaRes.text(), {
    header: true, skipEmptyLines: true, dynamicTyping: { amount: true },
  })

  const ldaById = new Map()
  for (const row of ldaRows) {
    if (!row.senator_id || !row.amount) continue
    const amount = typeof row.amount === 'number' ? row.amount : parseFloat(row.amount)
    if (isNaN(amount)) continue
    if (!ldaById.has(row.senator_id)) {
      ldaById.set(row.senator_id, { ldaTotal: 0, itemCount: 0, contributions: [] })
    }
    const e = ldaById.get(row.senator_id)
    e.ldaTotal  += amount
    e.itemCount += 1
    if (e.contributions.length < 50) {
      e.contributions.push({
        source: 'lda',
        registrant: row.registrant,
        payeeName: row.payee_name,
        amount,
        date: row.date,
        filingYear: row.filing_year,
        filingPeriod: row.filing_period,
        honoreeRaw: row.honoree_raw,
      })
    }
  }

  // ── FEC (PAC + party + individual itemized contributions) ────────────────
  const fecById = new Map()
  if (fecRes.ok) {
    const { data: fecRows } = Papa.parse(await fecRes.text(), {
      header: true, skipEmptyLines: true, dynamicTyping: true,
    })
    for (const row of fecRows) {
      if (!row.senator_id) continue
      if (!fecById.has(row.senator_id)) {
        fecById.set(row.senator_id, { fecPac: 0, fecParty: 0, fecIndividual: 0, fecByCycle: {} })
      }
      const e = fecById.get(row.senator_id)
      e.fecPac        += row.pac_contributions        ?? 0
      e.fecParty      += row.party_contributions      ?? 0
      e.fecIndividual += row.individual_contributions ?? 0
      if (row.cycle) {
        e.fecByCycle[row.cycle] = e.fecByCycle[row.cycle] ?? { pac: 0, party: 0, individual: 0 }
        e.fecByCycle[row.cycle].pac        += row.pac_contributions        ?? 0
        e.fecByCycle[row.cycle].party      += row.party_contributions      ?? 0
        e.fecByCycle[row.cycle].individual += row.individual_contributions ?? 0
      }
    }
  }

  // ── Merge into senator rows ───────────────────────────────────────────────
  const senators = SENATORS.map(s => {
    const lda = ldaById.get(s.id) ?? { ldaTotal: 0, itemCount: 0, contributions: [] }
    const fec = fecById.get(s.id) ?? { fecPac: 0, fecParty: 0, fecIndividual: 0, fecByCycle: {} }
    const fecTotal = fec.fecPac + fec.fecParty
    return {
      ...s,
      // Combined total drives all sorting and charts
      total:         lda.ldaTotal + fecTotal,
      ldaTotal:      lda.ldaTotal,
      fecTotal,
      fecPac:        fec.fecPac,
      fecParty:      fec.fecParty,
      fecIndividual: fec.fecIndividual,
      fecByCycle:    fec.fecByCycle,
      itemCount:     lda.itemCount,
      contributions: lda.contributions,
    }
  }).sort((a, b) => b.total - a.total)

  return {
    senators,
    syncState,
    ldaRowCount: ldaRows.length,
    hasFec: fecRes.ok && fecById.size > 0,
  }
}

export function useContributions() {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: loadContributions,
    staleTime: Infinity,
    retry: 1,
  })
}
