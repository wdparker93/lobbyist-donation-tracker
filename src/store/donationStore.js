import { SENATORS } from '../data/senators.js'

const STORAGE_KEY = 'ldt_v2_donations'
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// Normalise a name for fuzzy matching: lowercase, strip punctuation & middle initials
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\b[a-z]\.\s*/g, '')   // strip single-letter initials like "R." or "J."
    .replace(/[^a-z\s]/g, '')        // strip non-alpha
    .replace(/\s+/g, ' ')
    .trim()
}

// Build a lookup: normalized alias → senator id
const aliasMap = new Map()
for (const s of SENATORS) {
  for (const alias of s.aliases) {
    aliasMap.set(normalizeName(alias), s.id)
  }
  // Also index full name directly
  aliasMap.set(normalizeName(`${s.firstName} ${s.lastName}`), s.id)
}

function matchSenator(honoreeName) {
  const norm = normalizeName(honoreeName)
  // Exact alias match
  if (aliasMap.has(norm)) return aliasMap.get(norm)

  // Fallback: check if normalized honoree name contains the senator's normalized last name
  // and the first two letters of their first name (reduces false positives)
  for (const s of SENATORS) {
    const ln = normalizeName(s.lastName)
    const fn2 = normalizeName(s.firstName).slice(0, 3)
    if (ln.length >= 4 && norm.includes(ln) && norm.includes(fn2)) {
      return s.id
    }
  }
  return null
}

/**
 * Aggregate a flat array of contribution items (from lda.js) into a map of
 * senatorId → { total, itemCount, contributions[] }.
 */
export function aggregateContributions(items) {
  const byId = new Map()

  for (const item of items) {
    const senatorId = matchSenator(item.honoreeName)
    if (!senatorId) continue

    if (!byId.has(senatorId)) {
      byId.set(senatorId, { total: 0, itemCount: 0, contributions: [] })
    }
    const entry = byId.get(senatorId)
    entry.total += item.amount
    entry.itemCount += 1
    if (entry.contributions.length < 50) {
      entry.contributions.push(item)
    }
  }

  return byId
}

export function saveToCache(year, aggregated) {
  const payload = {
    year,
    savedAt: Date.now(),
    data: Object.fromEntries(aggregated),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // localStorage may be full; silently skip caching
  }
}

export function loadFromCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const payload = JSON.parse(raw)
    const age = Date.now() - payload.savedAt
    if (age > CACHE_MAX_AGE_MS) return null
    return {
      year: payload.year,
      savedAt: new Date(payload.savedAt),
      data: new Map(Object.entries(payload.data)),
    }
  } catch {
    return null
  }
}

export function clearCache() {
  localStorage.removeItem(STORAGE_KEY)
}

export function buildSenatorRows(donationMap) {
  return SENATORS.map((senator) => {
    const entry = donationMap.get(senator.id)
    return {
      ...senator,
      total: entry?.total ?? 0,
      itemCount: entry?.itemCount ?? 0,
      contributions: entry?.contributions ?? [],
    }
  }).sort((a, b) => b.total - a.total)
}
