'use client'

import { useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { useTokenStore } from '@/store/token-store'
import { LockToggle } from './lock-toggle'
import { getSessionId } from '@/lib/session'

export function TypographyEditor() {
  const { typography, tokenId, isLocked, updateToken } = useTokenStore()
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const persist = (path: string, value: string | number, oldValue: string | number) => {
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

  const update = (path: string, value: string | number, oldValue: string | number) => {
    const fullPath = `typography.${path}`
    if (isLocked(fullPath)) return
    updateToken(fullPath, value)
    persist(fullPath, value, oldValue)
  }

  const baseSize = parseFloat(typography.baseSize)

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
        Typography
      </h3>

      {/* Fonts */}
      {[
        { key: 'headingFont', label: 'Heading Font' },
        { key: 'bodyFont', label: 'Body Font' },
        { key: 'monoFont', label: 'Mono Font' },
      ].map(({ key, label }) => {
        const path = `typography.${key}`
        const locked = isLocked(path)
        return (
          <div key={key} className={`space-y-1 ${locked ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-400">{label}</label>
              <LockToggle path={path} value={(typography as unknown as Record<string, string>)[key]} />
            </div>
            <input
              type="text"
              value={(typography as unknown as Record<string, string>)[key]}
              onChange={(e) => update(key, e.target.value, (typography as unknown as Record<string, string>)[key])}
              disabled={locked}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white font-mono disabled:cursor-not-allowed"
            />
          </div>
        )
      })}

      {/* Base size */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-400">Base Size</label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-300">{typography.baseSize}</span>
            <LockToggle path="typography.baseSize" value={typography.baseSize} />
          </div>
        </div>
        <Slider
          min={12}
          max={24}
          step={1}
          value={[baseSize]}
          onValueChange={(vals) => update('baseSize', `${(vals as number[])[0]}px`, typography.baseSize)}
          disabled={isLocked('typography.baseSize')}
          className="w-full"
        />
      </div>

      {/* Scale ratio */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-400">Scale Ratio</label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-300">{typography.scaleRatio.toFixed(3)}</span>
            <LockToggle path="typography.scaleRatio" value={typography.scaleRatio} />
          </div>
        </div>
        <Slider
          min={1.125}
          max={1.618}
          step={0.001}
          value={[typography.scaleRatio]}
          onValueChange={(vals) => update('scaleRatio', (vals as number[])[0], typography.scaleRatio)}
          disabled={isLocked('typography.scaleRatio')}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>1.125 Minor 2nd</span>
          <span>1.618 Golden</span>
        </div>
      </div>

      {/* Specimen */}
      <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg space-y-1 border border-zinc-700/50">
        <p className="text-xs text-zinc-500 mb-2">Specimen</p>
        {(['headingFont', 'bodyFont', 'monoFont'] as const).map((k) => (
          <p
            key={k}
            style={{ fontFamily: `"${typography[k]}", sans-serif`, fontSize: '13px' }}
            className="text-zinc-300 truncate"
          >
            The quick brown fox
          </p>
        ))}
      </div>
    </div>
  )
}
