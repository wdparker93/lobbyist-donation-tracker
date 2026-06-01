import { formatDollars } from '../utils/formatters.js'

export default function StatsSummary({ rows }) {
  const total = rows.reduce((s, r) => s + r.total, 0)
  const dTotal = rows.filter((r) => r.party === 'D').reduce((s, r) => s + r.total, 0)
  const rTotal = rows.filter((r) => r.party === 'R').reduce((s, r) => s + r.total, 0)
  const iTotal = rows.filter((r) => r.party === 'I').reduce((s, r) => s + r.total, 0)
  const topRecipient = rows[0]

  const stats = [
    { label: 'Total Contributions', value: formatDollars(total), accent: 'text-white' },
    { label: 'Democrats', value: formatDollars(dTotal), accent: 'text-blue-400' },
    { label: 'Republicans', value: formatDollars(rTotal), accent: 'text-red-400' },
    { label: 'Independents', value: formatDollars(iTotal), accent: 'text-purple-400' },
    {
      label: 'Top Recipient',
      value: topRecipient?.total > 0
        ? `${topRecipient.firstName} ${topRecipient.lastName}`
        : '—',
      accent: 'text-yellow-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-gray-700 bg-gray-800 p-3"
        >
          <p className="text-xs text-gray-500 mb-1 truncate">{s.label}</p>
          <p className={`text-sm font-semibold font-mono truncate ${s.accent}`}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}
