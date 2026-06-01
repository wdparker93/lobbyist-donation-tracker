import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import Header from './components/Header.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import StatsSummary from './components/StatsSummary.jsx'
import DonationChart from './components/DonationChart.jsx'
import DonationTable from './components/DonationTable.jsx'
import DataStatus from './components/DataStatus.jsx'
import { useContributions } from './hooks/useContributions.js'

const queryClient = new QueryClient()

function Dashboard() {
  const { data, isLoading, isError, error } = useContributions()
  const [filters, setFilters] = useState({ state: '', party: '', senator: '', search: '' })

  const allRows = data?.senators ?? []

  const filteredRows = allRows.filter(r => {
    if (filters.state && r.state !== filters.state) return false
    if (filters.party && r.party !== filters.party) return false
    if (filters.senator && r.id !== filters.senator) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const name = `${r.firstName} ${r.lastName}`.toLowerCase()
      if (!name.includes(q) && !r.state.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gov-950 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <main className="mx-auto max-w-screen-2xl px-4 py-6">
        <div className="mb-4">
          <DataStatus
            syncState={data?.syncState}
            ldaRowCount={data?.ldaRowCount}
            hasFec={data?.hasFec}
            isLoading={isLoading}
          />
        </div>

        {isError && (
          <div className="mb-4 rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
            <strong>Could not load contribution data:</strong> {error?.message}.{' '}
            {data === undefined && 'Run the weekly sync workflow to populate contributions.csv.'}
          </div>
        )}

        {!isLoading && data && (
          <div className="mb-4">
            <StatsSummary rows={filteredRows} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          <FilterPanel filters={filters} onChange={setFilters} />

          <div className="flex flex-col gap-4 min-w-0 flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-16 text-gray-500 text-sm gap-2">
                <span className="animate-spin">⟳</span> Loading contribution data…
              </div>
            ) : data?.rowCount === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-16 text-center gap-3">
                <div className="text-4xl">📋</div>
                <h2 className="text-lg font-semibold text-gray-200">No Data Yet</h2>
                <p className="text-sm text-gray-500 max-w-md">
                  The database is empty. Go to{' '}
                  <a
                    href="https://github.com/wdparker93/lobbyist-donation-tracker/actions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    GitHub Actions
                  </a>{' '}
                  and run the <strong className="text-white">Weekly LDA Data Sync</strong> workflow
                  manually to populate the CSV.
                </p>
                <p className="text-xs text-gray-600 max-w-md">
                  After the sync, the site will rebuild and deploy automatically.
                  Subsequent syncs are incremental — only new filings are fetched.
                </p>
              </div>
            ) : (
              <>
                <DonationChart rows={filteredRows} />
                <DonationTable rows={filteredRows} />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-8 px-6 py-4 text-center text-xs text-gray-600">
        Data sourced from the{' '}
        <a href="https://lda.senate.gov/api/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">
          U.S. Senate Lobbying Disclosure Act API
        </a>
        {' '}· Public domain per the Lobbying Disclosure Act of 1995 ·{' '}
        <a href="https://lda.senate.gov/api/tos/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">
          Terms of Service
        </a>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}
