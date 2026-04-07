export function InputPreview() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-mono text-zinc-500 mb-3">Inputs</p>
      <div className="space-y-3 max-w-xs">
        {/* Default */}
        <input
          type="text"
          placeholder="Default input"
          readOnly
          className="w-full px-3 py-2 outline-none"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
          }}
        />

        {/* Focus state */}
        <input
          type="text"
          placeholder="Focused input"
          readOnly
          className="w-full px-3 py-2 outline-none"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
          }}
        />

        {/* Error state */}
        <div>
          <input
            type="text"
            placeholder="Error input"
            readOnly
            className="w-full px-3 py-2 outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '2px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
            }}
          />
          <p
            className="mt-1 text-xs"
            style={{ color: 'var(--color-error)', fontFamily: 'var(--font-body)' }}
          >
            This field is required
          </p>
        </div>
      </div>
    </div>
  )
}
