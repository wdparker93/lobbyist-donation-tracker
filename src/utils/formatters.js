export function formatDollars(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

export function formatDollarsExact(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export function partyLabel(code) {
  return { D: 'Democrat', R: 'Republican', I: 'Independent' }[code] ?? code
}

export function partyColor(code) {
  return { D: 'text-blue-400', R: 'text-red-400', I: 'text-purple-400' }[code] ?? 'text-gray-400'
}

export function partyBg(code) {
  return { D: 'bg-blue-500', R: 'bg-red-500', I: 'bg-purple-500' }[code] ?? 'bg-gray-500'
}

export function partyBorder(code) {
  return { D: 'border-blue-500', R: 'border-red-500', I: 'border-purple-500' }[code] ?? 'border-gray-500'
}

export function timeAgo(date) {
  if (!date) return 'never'
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
