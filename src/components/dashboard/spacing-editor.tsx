'use client'

import { useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { useTokenStore } from '@/store/token-store'
import { LockToggle } from './lock-toggle'
import { getSessionId } from '@/lib/session'

export function SpacingEditor() {
  const { spacing, tokenId, isLocked, updateToken } = useTokenStore()
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const persist = (path: string, value: number, oldValue: number) => {
    if (!tokenId) return
    clearTimeout(debounceRef.current[path])
    debounceRef.current[path] = setTimeout(async () => {
      await fetch(`/api/tokens/${tokenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, value, oldValue, sessionId: getSessionId() }),
      })
    }, 500)
  }

  const maxBar = spacing.unit * Math.max(...spacing.scale)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider px-1 mb-2">
        Spacing
      </h3>

      {/* Base unit */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm text-zinc-400">Base Unit</label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-300">{spacing.unit}px</span>
            <LockToggle path="spacing.unit" value={spacing.unit} />
          </div>
        </div>
        <Slider
          min={2}
          max={8}
          step={1}
          value={[spacing.unit]}
          onValueChange={(vals) => {
            const v = (vals as number[])[0]
            if (isLocked('spacing.unit')) return
            updateToken('spacing.unit', v)
            persist('spacing.unit', v, spacing.unit)
          }}
          disabled={isLocked('spacing.unit')}
        />
      </div>

      {/* Scale visualization */}
      <div className="space-y-1.5">
        <p className="text-xs text-zinc-500">Scale</p>
        {spacing.scale.map((s, i) => {
          const px = s * spacing.unit
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-600 w-8">{i}</span>
              <div
                className="h-4 bg-violet-500/30 rounded-sm border-r-2 border-violet-500 flex-shrink-0"
                style={{ width: `${Math.max(2, (px / maxBar) * 140)}px` }}
              />
              <span className="text-xs font-mono text-zinc-400">{px}px</span>
            </div>
          )
        })}
      </div>

      {/* Preview box */}
      <div className="mt-2 border border-zinc-700 rounded-lg overflow-hidden">
        <p className="text-xs text-zinc-500 px-2 py-1 bg-zinc-800/50 border-b border-zinc-700">
          Box Model Preview
        </p>
        <div
          className="bg-zinc-800 m-2 rounded flex items-center justify-center"
          style={{ padding: `${spacing.scale[4] * spacing.unit}px` }}
        >
          <div
            className="bg-violet-500/20 border border-violet-500/40 rounded text-xs text-zinc-400 text-center"
            style={{ padding: `${spacing.scale[2] * spacing.unit}px ${spacing.scale[3] * spacing.unit}px` }}
          >
            Content
          </div>
        </div>
      </div>
    </div>
  )
}
