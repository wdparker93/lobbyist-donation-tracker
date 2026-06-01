// LDA Senate API client
// Docs: https://lda.senate.gov/api/
// Uses Vite dev proxy (/lda-api → https://lda.senate.gov/api/v1) to avoid CORS in development.
// For production, deploy behind a serverless function or CORS proxy.

const PAGE_SIZE = 100
const MAX_PARALLEL = 5

function buildUrl(year, page) {
  const base = import.meta.env.DEV
    ? '/lda-api/contributions/'
    : 'https://lda.senate.gov/api/v1/contributions/'
  return `${base}?format=json&filing_year=${year}&limit=${PAGE_SIZE}&page=${page}`
}

async function fetchPage(year, page, signal) {
  const res = await fetch(buildUrl(year, page), { signal })
  if (!res.ok) throw new Error(`LDA API error: ${res.status}`)
  return res.json()
}

/**
 * Fetches all contribution filings for a year.
 * Calls onItems(items[]) after each parallel batch so the caller can update
 * the UI progressively. Calls onProgress(done, total) with page counts.
 *
 * @returns {Promise<Array>} all extracted contribution items
 */
export async function fetchAllContributions(year, { onProgress, onItems, signal } = {}) {
  const first = await fetchPage(year, 1, signal)
  const totalPages = Math.ceil(first.count / PAGE_SIZE)

  const allItems = extractItems(first.results)
  onItems?.(allItems)
  onProgress?.(1, totalPages)

  for (let startPage = 2; startPage <= totalPages; startPage += MAX_PARALLEL) {
    if (signal?.aborted) break

    const pageNums = []
    for (let p = startPage; p < startPage + MAX_PARALLEL && p <= totalPages; p++) {
      pageNums.push(p)
    }

    const pages = await Promise.all(pageNums.map((p) => fetchPage(year, p, signal)))

    const batchItems = []
    for (const page of pages) {
      batchItems.push(...extractItems(page.results))
    }
    allItems.push(...batchItems)
    onItems?.(batchItems)
    onProgress?.(Math.min(startPage + MAX_PARALLEL - 1, totalPages), totalPages)
  }

  return allItems
}

function extractItems(filings) {
  const out = []
  for (const filing of filings) {
    if (filing.no_contributions || !filing.contribution_items?.length) continue
    const registrant = filing.registrant?.name ?? 'Unknown Registrant'
    const lobbyist = filing.lobbyist
      ? `${filing.lobbyist.first_name ?? ''} ${filing.lobbyist.last_name ?? ''}`.trim()
      : null
    for (const item of filing.contribution_items) {
      const amount = parseFloat(item.amount)
      if (!item.honoree_name || isNaN(amount) || amount <= 0) continue
      out.push({
        honoreeName: item.honoree_name,
        amount,
        date: item.date,
        contributorName: item.contributor_name,
        payeeName: item.payee_name,
        contributionType: item.contribution_type,
        registrant,
        lobbyist,
        filingYear: filing.filing_year,
        filingPeriod: filing.filing_period_display,
      })
    }
  }
  return out
}
