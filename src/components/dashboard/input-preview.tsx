export function InputPreview() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-mono text-zinc-500 mb-4">Inputs</p>
      <div className="space-y-4 max-w-sm">
        {/* Default */}
        <input
          type="text"
          placeholder="Default input"
          readOnly
          className="w-full px-4 py-3 outline-none"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
          }}
        />

        {/* Focus state */}
        <input
          type="text"
          placeholder="Focused input"
          readOnly
          className="w-full px-4 py-3 outline-none"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
          }}
        />

        {/* Error state */}
        <div>
          <input
            type="text"
            placeholder="Error input"
            readOnly
            className="w-full px-4 py-3 outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '2px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
            }}
          />
          <p
            className="mt-1.5 text-sm"
            style={{ color: 'var(--color-error)', fontFamily: 'var(--font-body)' }}
          >
            This field is required
          </p>
        </div>
      </div>
    </div>
  )
}
