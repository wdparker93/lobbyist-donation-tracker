import { useState } from 'react'
import { formatDollars, formatDollarsExact, partyColor, partyBorder } from '../utils/formatters.js'

const COLUMNS = [
  { key: 'rank', label: '#', sortable: false },
  { key: 'name', label: 'Senator', sortable: true },
  { key: 'state', label: 'State', sortable: true },
  { key: 'party', label: 'Party', sortable: true },
  { key: 'total', label: 'Total Received', sortable: true },
  { key: 'itemCount', label: 'Filings', sortable: true },
]

function SortIcon({ active, dir }) {
  if (!active) return <span className="ml-1 text-gray-600">⇅</span>
  return <span className="ml-1 text-blue-400">{dir === 'asc' ? '↑' : '↓'}</span>
}

function DetailDrawer({ senator, onClose }) {
  return (
    <tr>
      <td colSpan={6} className="bg-gray-900 px-6 pb-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">
            Recent Contributions to {senator.firstName} {senator.lastName}
          </h4>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xs">Close ✕</button>
        </div>
        {senator.contributions.length === 0 ? (
          <p className="text-xs text-gray-500">No contribution details available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-1 pr-4 text-gray-500 font-medium">Registrant</th>
                  <th className="pb-1 pr-4 text-gray-500 font-medium">Payee (Committee)</th>
                  <th className="pb-1 pr-4 text-gray-500 font-medium">Amount</th>
                  <th className="pb-1 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {senator.contributions.slice(0, 15).map((c, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-1 pr-4 text-gray-300 max-w-xs truncate">{c.registrant}</td>
                    <td className="py-1 pr-4 text-gray-400 max-w-xs truncate">{c.payeeName ?? '—'}</td>
                    <td className="py-1 pr-4 font-mono text-green-400">{formatDollarsExact(c.amount)}</td>
                    <td className="py-1 text-gray-500">{c.date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {senator.contributions.length > 15 && (
              <p className="mt-1 text-xs text-gray-600">
                Showing first 15 of {senator.contributions.length} stored contributions.
              </p>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}

export default function DonationTable({ rows }) {
  const [sort, setSort] = useState({ key: 'total', dir: 'desc' })
  const [expanded, setExpanded] = useState(null)

  function handleSort(key) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: 'desc' }
    )
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sort.key] ?? ''
    const bv = b[sort.key] ?? ''
    const cmp = typeof av === 'number'
      ? av - bv
      : String(av).localeCompare(String(bv))
    return sort.dir === 'asc' ? cmp : -cmp
  })

  if (!rows.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-500 text-sm">
        No senators match the current filters.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400
                    ${col.sortable ? 'cursor-pointer select-none hover:text-gray-200' : ''}`}
                >
                  {col.label}
                  {col.sortable && <SortIcon active={sort.key === col.key} dir={sort.dir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((senator, idx) => (
              <>
                <tr
                  key={senator.id}
                  onClick={() => setExpanded(expanded === senator.id ? null : senator.id)}
                  className={`border-b border-gray-700/50 cursor-pointer transition-colors
                    ${expanded === senator.id ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                >
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <span className={`border-l-2 pl-2 font-medium text-white ${partyBorder(senator.party)}`}>
                      {senator.firstName} {senator.lastName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{senator.state}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${partyColor(senator.party)}`}>
                    {{ D: 'Dem', R: 'Rep', I: 'Ind' }[senator.party] ?? senator.party}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-green-400">
                    {senator.total > 0 ? formatDollars(senator.total) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {senator.itemCount > 0 ? senator.itemCount.toLocaleString() : '—'}
                  </td>
                </tr>
                {expanded === senator.id && (
                  <DetailDrawer
                    key={`${senator.id}-detail`}
                    senator={senator}
                    onClose={() => setExpanded(null)}
                  />
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-700 px-4 py-2 text-xs text-gray-600">
        {rows.length} senator{rows.length !== 1 ? 's' : ''} · Click a row to see contribution details
      </div>
    </div>
  )
}
