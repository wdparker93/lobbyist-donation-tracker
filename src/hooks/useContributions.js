import { useQuery } from '@tanstack/react-query'
import Papa from 'papaparse'
import { SENATORS } from '../data/senators.js'

const BASE = import.meta.env.BASE_URL

async function loadContributions() {
  const [csvRes, stateRes] = await Promise.all([
    fetch(`${BASE}data/contributions.csv`),
    fetch(`${BASE}data/sync_state.json`),
  ])

  if (!csvRes.ok) throw new Error('contributions.csv not found')
  const csvText = await csvRes.text()
  const syncState = stateRes.ok ? await stateRes.json() : null

  const { data: rows, errors } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: { amount: true },
  })

  if (errors.length) console.warn('CSV parse warnings:', errors.slice(0, 3))

  // Aggregate by senator_id
  const byId = new Map()
  for (const row of rows) {
    if (!row.senator_id || !row.amount) continue
    const amount = typeof row.amount === 'number' ? row.amount : parseFloat(row.amount)
    if (isNaN(amount)) continue

    if (!byId.has(row.senator_id)) {
      byId.set(row.senator_id, { total: 0, itemCount: 0, contributions: [] })
    }
    const entry = byId.get(row.senator_id)
    entry.total += amount
    entry.itemCount += 1
    if (entry.contributions.length < 50) {
      entry.contributions.push({
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

  const senators = SENATORS.map(s => ({
    ...s,
    ...(byId.get(s.id) ?? { total: 0, itemCount: 0, contributions: [] }),
  })).sort((a, b) => b.total - a.total)

  return { senators, syncState, rowCount: rows.length }
}

export function useContributions() {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: loadContributions,
    staleTime: Infinity,   // CSV is static — never refetch automatically
    retry: 1,
  })
}
