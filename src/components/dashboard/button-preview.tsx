export function ButtonPreview() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-mono text-zinc-500 mb-4">Buttons</p>
      <div className="flex flex-wrap gap-4">
        {/* Primary */}
        <button
          className="px-6 py-3 rounded-md font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
          }}
        >
          Primary
        </button>

        {/* Secondary */}
        <button
          className="px-6 py-3 rounded-md font-medium border transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
          }}
        >
          Secondary
        </button>

        {/* Ghost */}
        <button
          className="px-6 py-3 rounded-md font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
          }}
        >
          Ghost
        </button>

        {/* Accent */}
        <button
          className="px-6 py-3 rounded-md font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
          }}
        >
          Accent
        </button>

        {/* Danger */}
        <button
          className="px-6 py-3 rounded-md font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-error)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
          }}
        >
          Danger
        </button>
      </div>
    </div>
  )
}
