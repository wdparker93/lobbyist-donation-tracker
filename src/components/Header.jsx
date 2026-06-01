export default function Header() {
  return (
    <header className="border-b border-gray-700 bg-gov-900 px-6 py-4">
      <div className="mx-auto max-w-screen-2xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            <span className="text-blue-400">⬡</span> Lobbyist Donation Tracker
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Senate LD-203 filings · Lobbying Disclosure Act of 1995 ·{' '}
            <a
              href="https://lda.senate.gov/api/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 underline"
            >
              Data source
            </a>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Democrat
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            Republican
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
            Independent
          </span>
        </div>
      </div>
    </header>
  )
}
