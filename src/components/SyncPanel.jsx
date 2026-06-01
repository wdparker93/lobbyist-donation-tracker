import { timeAgo } from '../utils/formatters.js'

export default function SyncPanel({ status, onSync, onAbort }) {
  const { phase, progress, total, savedAt, year, error } = status

  const isRunning = phase === 'fetching'
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            {isRunning && (
              <span className="inline-block h-2 w-2 animate-ping rounded-full bg-blue-500" />
            )}
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {isRunning ? 'Syncing LDA Data…' : 'Data Sync'}
            </span>
          </div>
          {savedAt && !isRunning && (
            <p className="text-xs text-gray-500">
              Last synced {timeAgo(savedAt)} · {year} filings
            </p>
          )}
          {!savedAt && !isRunning && !error && (
            <p className="text-xs text-gray-500">No data loaded. Sync to fetch from LDA API.</p>
          )}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>

        <div className="flex gap-2">
          {isRunning ? (
            <button
              onClick={onAbort}
              className="rounded border border-gray-600 px-3 py-1 text-xs text-gray-300 hover:border-red-500 hover:text-red-400 transition-colors"
            >
              Cancel
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={year}
                onChange={(e) => status.onYearChange?.(Number(e.target.value))}
                className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                {[2024, 2023, 2022, 2021, 2020].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button
                onClick={onSync}
                className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {savedAt ? 'Refresh' : 'Sync Data'}
              </button>
            </div>
          )}
        </div>
      </div>

      {isRunning && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Page {progress} of {total}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-700">
            <div
              className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-600">
            This may take 1–3 minutes depending on your connection.
            Results update as each batch arrives.
          </p>
        </div>
      )}
    </div>
  )
}
