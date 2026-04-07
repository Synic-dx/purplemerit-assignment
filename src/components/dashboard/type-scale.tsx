import { computeTypeScale } from '@/lib/token-utils'
import { useTokenStore } from '@/store/token-store'

const TYPE_LEVELS = [
  { var: '--text-4xl', label: 'Display', specimen: 'Heading Display' },
  { var: '--text-3xl', label: 'H1', specimen: 'Large Heading' },
  { var: '--text-2xl', label: 'H2', specimen: 'Section Heading' },
  { var: '--text-xl', label: 'H3', specimen: 'Sub Heading' },
  { var: '--text-lg', label: 'H4', specimen: 'Card Title' },
  { var: '--text-base', label: 'Body', specimen: 'The quick brown fox jumps over the lazy dog.' },
  { var: '--text-sm', label: 'Small', specimen: 'Helper text and descriptions' },
  { var: '--text-xs', label: 'Caption', specimen: 'Fine print and metadata' },
]

export function TypeScale() {
  const { typography } = useTokenStore()

  return (
    <div>
      <p className="text-xs font-mono text-zinc-500 mb-4">Type Scale</p>
      <div className="space-y-3">
        {TYPE_LEVELS.map(({ var: cssVar, label, specimen }) => (
          <div key={cssVar} className="flex items-baseline gap-4 group">
            <span className="text-xs font-mono text-zinc-600 w-12 flex-shrink-0 group-hover:text-zinc-400 transition-colors">
              {label}
            </span>
            <p
              className="leading-tight truncate"
              style={{
                fontSize: `var(${cssVar})`,
                fontFamily: cssVar.includes('4xl') || cssVar.includes('3xl') || cssVar.includes('2xl') || cssVar.includes('xl')
                  ? 'var(--font-heading)'
                  : 'var(--font-body)',
                color: 'var(--color-text)',
                lineHeight: 'var(--lh-tight, 1.25)',
              }}
            >
              {specimen}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
