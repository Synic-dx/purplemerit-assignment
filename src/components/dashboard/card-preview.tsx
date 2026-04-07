export function CardPreview() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-mono text-zinc-500 mb-4">Cards</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Elevated */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p className="font-semibold text-base mb-1.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            Elevated
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Card with shadow elevation
          </p>
          <button
            className="mt-4 px-4 py-2 text-sm font-medium rounded"
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
          className="p-6 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p className="font-semibold text-base mb-1.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            Flat
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            No shadow, clean surface
          </p>
          <div className="mt-4 flex gap-2">
            <span
              className="px-3 py-1 text-sm rounded-full"
              style={{ backgroundColor: 'var(--color-success)', color: '#fff', borderRadius: 'var(--radius-full)' }}
            >
              Active
            </span>
          </div>
        </div>

        {/* Bordered */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p className="font-semibold text-base mb-1.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            Bordered
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Defined with border
          </p>
          <div
            className="mt-4 h-2 rounded-full overflow-hidden"
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
