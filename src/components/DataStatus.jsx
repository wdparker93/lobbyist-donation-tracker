import { timeAgo } from '../utils/formatters.js'

export default function DataStatus({ syncState, ldaRowCount, hasFec, isLoading }) {
  if (isLoading) return null

  const lastLdaSynced = syncState?.last_synced_at ? new Date(syncState.last_synced_at) : null
  const lastFecSynced = syncState?.fec_last_synced_at ? new Date(syncState.fec_last_synced_at) : null
  const cycles        = syncState?.fec_cycles_synced ?? []
  const ldaYears      = Object.keys(syncState?.api_count_by_year ?? {}).sort()
  const stats         = syncState?.stats ?? {}

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <span>
          <span className="text-gray-600">LDA: </span>
          <span className="font-mono text-white">{(ldaRowCount ?? 0).toLocaleString()} rows</span>
          {lastLdaSynced && (
            <span className="text-gray-600"> · {timeAgo(lastLdaSynced)}</span>
          )}
          {ldaYears.length > 0 && (
            <span className="text-gray-600"> · {ldaYears[0]}–{ldaYears.at(-1)}</span>
          )}
        </span>
        <span>
          <span className="text-gray-600">FEC: </span>
          {hasFec ? (
            <>
              <span className="font-mono text-white">loaded</span>
              {lastFecSynced && (
                <span className="text-gray-600"> · {timeAgo(lastFecSynced)}</span>
              )}
              {cycles.length > 0 && (
                <span className="text-gray-600"> · cycles {cycles.join(', ')}</span>
              )}
            </>
          ) : (
            <span className="text-yellow-600">not yet synced</span>
          )}
        </span>
        {stats.total_unmatched > 0 && (
          <span className="text-yellow-600">
            ⚠ {stats.total_unmatched} unmatched LDA names —{' '}
            <a
              href="https://github.com/wdparker93/lobbyist-donation-tracker/blob/master/data/unmatched.csv"
              target="_blank" rel="noopener noreferrer"
              className="underline hover:text-yellow-400"
            >
              review
            </a>
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/wdparker93/lobbyist-donation-tracker/actions/workflows/weekly-sync.yml"
          target="_blank" rel="noopener noreferrer"
          className="rounded border border-gray-600 px-3 py-1 text-xs text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
        >
          Run Sync ↗
        </a>
        <a
          href="https://github.com/wdparker93/lobbyist-donation-tracker/blob/master/data/name_overrides.csv"
          target="_blank" rel="noopener noreferrer"
          className="rounded border border-gray-600 px-3 py-1 text-xs text-gray-300 hover:border-green-500 hover:text-green-400 transition-colors"
        >
          Fix Names ↗
        </a>
      </div>
    </div>
  )
}
