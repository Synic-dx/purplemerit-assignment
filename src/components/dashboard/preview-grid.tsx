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
    <div style={cssVars as React.CSSProperties} className="h-full overflow-y-auto bg-zinc-50">
      <div className="min-h-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <section className="rounded-xl p-6 bg-white border border-zinc-200 shadow-sm">
          <ButtonPreview />
        </section>

        <section className="rounded-xl p-6 bg-white border border-zinc-200 shadow-sm">
          <InputPreview />
        </section>

        <section className="rounded-xl p-6 bg-white border border-zinc-200 shadow-sm">
          <CardPreview />
        </section>

        <section className="rounded-xl p-6 bg-white border border-zinc-200 shadow-sm">
          <TypeScale />
        </section>
      </div>
    </div>
  )
}
