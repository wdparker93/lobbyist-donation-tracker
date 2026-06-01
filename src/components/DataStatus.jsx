import { timeAgo } from '../utils/formatters.js'

export default function DataStatus({ syncState, rowCount, isLoading }) {
  if (isLoading) return null

  const lastSynced = syncState?.last_synced_at ? new Date(syncState.last_synced_at) : null
  const years = syncState?.years_synced ?? []
  const stats = syncState?.stats ?? {}

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <span>
          <span className="text-gray-600">Database: </span>
          <span className="font-mono text-white">{(rowCount ?? 0).toLocaleString()} rows</span>
        </span>
        {lastSynced && (
          <span>
            <span className="text-gray-600">Last sync: </span>
            <span className="text-white">{timeAgo(lastSynced)}</span>
            <span className="text-gray-600"> · {lastSynced.toLocaleDateString()}</span>
          </span>
        )}
        {years.length > 0 && (
          <span>
            <span className="text-gray-600">Years: </span>
            <span className="text-white">{years.join(', ')}</span>
          </span>
        )}
        {stats.total_unmatched > 0 && (
          <span className="text-yellow-600">
            ⚠ {stats.total_unmatched} unmatched names in{' '}
            <a
              href="https://github.com/wdparker93/lobbyist-donation-tracker/blob/master/data/unmatched.csv"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-400"
            >
              data/unmatched.csv
            </a>
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/wdparker93/lobbyist-donation-tracker/actions/workflows/weekly-sync.yml"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-gray-600 px-3 py-1 text-xs text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
        >
          Run Sync ↗
        </a>
        <a
          href="https://github.com/wdparker93/lobbyist-donation-tracker/blob/master/data/name_overrides.csv"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-gray-600 px-3 py-1 text-xs text-gray-300 hover:border-green-500 hover:text-green-400 transition-colors"
        >
          Fix Names ↗
        </a>
      </div>
    </div>
  )
}
