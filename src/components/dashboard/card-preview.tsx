export function CardPreview() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-mono text-zinc-500 mb-3">Cards</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Elevated */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            Elevated
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Card with shadow elevation
          </p>
          <button
            className="mt-3 px-3 py-1.5 text-xs font-medium rounded"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Action
          </button>
        </div>

        {/* Flat */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            Flat
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            No shadow, clean surface
          </p>
          <div className="mt-3 flex gap-2">
            <span
              className="px-2 py-0.5 text-xs rounded-full"
              style={{ backgroundColor: 'var(--color-success)', color: '#fff', borderRadius: 'var(--radius-full)' }}
            >
              Active
            </span>
          </div>
        </div>

        {/* Bordered */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            Bordered
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Defined with border
          </p>
          <div
            className="mt-3 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--color-border)' }}
          >
            <div
              className="h-full w-2/3 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
