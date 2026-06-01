import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import StatsSummary from './components/StatsSummary.jsx'
import DonationChart from './components/DonationChart.jsx'
import DonationTable from './components/DonationTable.jsx'
import SyncPanel from './components/SyncPanel.jsx'
import { fetchAllContributions } from './api/lda.js'
import {
  aggregateContributions,
  saveToCache,
  loadFromCache,
  buildSenatorRows,
} from './store/donationStore.js'

export default function App() {
  const [donationMap, setDonationMap] = useState(null)
  const [filters, setFilters] = useState({ state: '', party: '', senator: '', search: '' })
  const [syncYear, setSyncYear] = useState(2024)
  const [syncPhase, setSyncPhase] = useState('idle')
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncTotal, setSyncTotal] = useState(0)
  const [cacheInfo, setCacheInfo] = useState(null)
  const [syncError, setSyncError] = useState(null)

  const abortRef = useRef(null)
  // Mutable ref so onItems closure always appends to the live array without stale captures
  const accumulatedRef = useRef([])

  useEffect(() => {
    const cached = loadFromCache()
    if (cached) {
      setDonationMap(cached.data)
      setCacheInfo({ savedAt: cached.savedAt, year: cached.year })
    }
  }, [])

  const startSync = useCallback(async () => {
    setSyncError(null)
    setSyncPhase('fetching')
    setSyncProgress(0)
    setSyncTotal(0)
    accumulatedRef.current = []

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await fetchAllContributions(syncYear, {
        signal: controller.signal,
        onItems: (batchItems) => {
          accumulatedRef.current.push(...batchItems)
        },
        onProgress: (done, total) => {
          setSyncProgress(done)
          setSyncTotal(total)
          // Update UI every 20 pages so the table shows data while syncing
          if (done % 20 === 0 || done === total) {
            const map = aggregateContributions(accumulatedRef.current)
            setDonationMap(new Map(map))
          }
        },
      })

      if (!controller.signal.aborted) {
        const finalMap = aggregateContributions(accumulatedRef.current)
        setDonationMap(finalMap)
        saveToCache(syncYear, finalMap)
        const savedAt = new Date()
        setCacheInfo({ savedAt, year: syncYear })
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setSyncError(`Sync failed: ${err.message}`)
      }
    } finally {
      setSyncPhase('idle')
    }
  }, [syncYear])

  const abortSync = useCallback(() => {
    abortRef.current?.abort()
    setSyncPhase('idle')
  }, [])

  const allRows = donationMap ? buildSenatorRows(donationMap) : []

  const filteredRows = allRows.filter((r) => {
    if (filters.state && r.state !== filters.state) return false
    if (filters.party && r.party !== filters.party) return false
    if (filters.senator && r.id !== filters.senator) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const fullName = `${r.firstName} ${r.lastName}`.toLowerCase()
      if (!fullName.includes(q) && !r.state.toLowerCase().includes(q)) return false
    }
    return true
  })

  const syncStatus = {
    phase: syncPhase,
    progress: syncProgress,
    total: syncTotal,
    savedAt: cacheInfo?.savedAt,
    year: syncYear,
    error: syncError,
    onYearChange: setSyncYear,
  }

  return (
    <div className="min-h-screen bg-gov-950 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <main className="mx-auto max-w-screen-2xl px-4 py-6">
        <div className="mb-4">
          <SyncPanel status={syncStatus} onSync={startSync} onAbort={abortSync} />
        </div>

        {donationMap && (
          <div className="mb-4">
            <StatsSummary rows={filteredRows} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          <FilterPanel filters={filters} onChange={setFilters} />

          <div className="flex flex-col gap-4 min-w-0 flex-1">
            {donationMap ? (
              <>
                <DonationChart rows={filteredRows} />
                <DonationTable rows={filteredRows} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-16 text-center gap-3">
                <div className="text-4xl">📊</div>
                <h2 className="text-lg font-semibold text-gray-200">No Data Yet</h2>
                <p className="text-sm text-gray-500 max-w-sm">
                  Click <strong className="text-white">Sync Data</strong> above to fetch
                  lobbyist contribution filings from the Senate LDA database.
                  Results appear progressively as pages load. Data is cached locally for 7 days.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-8 px-6 py-4 text-center text-xs text-gray-600">
        Data sourced from the{' '}
        <a
          href="https://lda.senate.gov/api/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-400"
        >
          U.S. Senate Lobbying Disclosure Act API
        </a>
        {' '}· Public domain data per the Lobbying Disclosure Act of 1995 ·{' '}
        <a
          href="https://lda.senate.gov/api/tos/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-400"
        >
          Terms of Service
        </a>
      </footer>
    </div>
  )
}
