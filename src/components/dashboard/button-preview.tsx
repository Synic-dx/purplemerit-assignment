export function ButtonPreview() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-mono text-zinc-500 mb-3">Buttons</p>
      <div className="flex flex-wrap gap-3">
        {/* Primary */}
        <button
          className="px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
          }}
        >
          Primary
        </button>

        {/* Secondary */}
        <button
          className="px-4 py-2 rounded-md text-sm font-medium border transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
          }}
        >
          Secondary
        </button>

        {/* Ghost */}
        <button
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
          }}
        >
          Ghost
        </button>

        {/* Accent */}
        <button
          className="px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
          }}
        >
          Accent
        </button>

        {/* Danger */}
        <button
          className="px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-error)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
          }}
        >
          Danger
        </button>
      </div>
    </div>
  )
}
