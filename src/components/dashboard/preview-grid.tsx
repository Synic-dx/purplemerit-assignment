'use client'

import { useTokenStore } from '@/store/token-store'
import { ButtonPreview } from './button-preview'
import { InputPreview } from './input-preview'
import { CardPreview } from './card-preview'
import { TypeScale } from './type-scale'

export function PreviewGrid() {
  const getCssVars = useTokenStore((s) => s.getCssVars)
  const cssVars = getCssVars()

  return (
    <div style={cssVars as React.CSSProperties} className="h-full overflow-y-auto">
      <div
        className="min-h-full p-8 space-y-10"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <section
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <ButtonPreview />
        </section>

        <section
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <InputPreview />
        </section>

        <section
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <CardPreview />
        </section>

        <section
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <TypeScale />
        </section>
      </div>
    </div>
  )
}
