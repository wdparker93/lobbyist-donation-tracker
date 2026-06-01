import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { formatDollars } from '../utils/formatters.js'

const PARTY_COLORS = { D: '#3b82f6', R: '#ef4444', I: '#a855f7' }

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-white">{d.fullName}</p>
      <p className="text-gray-400">{d.state} · {d.partyLabel}</p>
      <p className="mt-1 font-mono text-green-400">{formatDollars(d.total)}</p>
    </div>
  )
}

export default function DonationChart({ rows }) {
  const data = rows
    .filter((r) => r.total > 0)
    .slice(0, 20)
    .map((r) => ({
      name: r.lastName,
      fullName: `${r.firstName} ${r.lastName}`,
      state: r.state,
      party: r.party,
      partyLabel: { D: 'Democrat', R: 'Republican', I: 'Independent' }[r.party] ?? r.party,
      total: r.total,
    }))

  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-600 text-sm">
        No contribution data to chart.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Top Recipients (by total — showing up to 20)
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
          <XAxis
            type="number"
            tickFormatter={formatDollars}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="total" radius={[0, 3, 3, 0]}>
            {data.map((entry) => (
              <Cell key={entry.fullName} fill={PARTY_COLORS[entry.party] ?? '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
