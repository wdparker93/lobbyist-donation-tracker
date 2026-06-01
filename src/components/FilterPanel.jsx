import { SENATORS, STATES } from '../data/senators.js'

export default function FilterPanel({ filters, onChange }) {
  const { state, party, search } = filters

  const filteredSenators = SENATORS.filter((s) => {
    if (state && s.state !== state) return false
    if (party && s.party !== party) return false
    return true
  }).sort((a, b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`))

  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  function reset() {
    onChange({ state: '', party: '', senator: '', search: '' })
  }

  const hasFilters = state || party || filters.senator || search

  return (
    <aside className="flex flex-col gap-4 w-full lg:w-64 shrink-0">
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Filters</h2>
          {hasFilters && (
            <button
              onClick={reset}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* State */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">State</label>
            <select
              value={state}
              onChange={(e) => update('state', e.target.value)}
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">All States</option>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Party */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Party</label>
            <select
              value={party}
              onChange={(e) => update('party', e.target.value)}
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Parties</option>
              <option value="D">Democrat</option>
              <option value="R">Republican</option>
              <option value="I">Independent</option>
            </select>
          </div>

          {/* Senator */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Senator</label>
            <select
              value={filters.senator}
              onChange={(e) => update('senator', e.target.value)}
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Senators</option>
              {filteredSenators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.state})
                </option>
              ))}
            </select>
          </div>

          {/* Name search */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Search Name</label>
            <input
              type="text"
              value={search}
              onChange={(e) => update('search', e.target.value)}
              placeholder="e.g. Warren, Cruz…"
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
