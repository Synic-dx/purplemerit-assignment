'use client'

import { useCallback, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTokenStore } from '@/store/token-store'
import { LockToggle } from './lock-toggle'
import { getContrastRatio, getWcagLevel } from '@/lib/token-utils'
import { getSessionId } from '@/lib/session'

const COLOR_LABELS: Record<string, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  background: 'Background',
  surface: 'Surface',
  text: 'Text',
  textSecondary: 'Text Secondary',
  border: 'Border',
  error: 'Error',
  success: 'Success',
}

export function ColorEditor() {
  const { colors, tokenId, isLocked, updateToken } = useTokenStore()
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const handleChange = useCallback(
    (key: string, value: string, oldValue: string) => {
      if (isLocked(`colors.${key}`)) return
      updateToken(`colors.${key}`, value)

      clearTimeout(debounceRef.current[key])
      debounceRef.current[key] = setTimeout(async () => {
        if (!tokenId) return
        await fetch(`/api/tokens/${tokenId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: `colors.${key}`,
            value,
            oldValue,
            sessionId: getSessionId(),
          }),
        })
      }, 500)
    },
    [tokenId, isLocked, updateToken]
  )

  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider px-1 mb-4">
        Colors
      </h3>
      {Object.entries(colors).map(([key, value]) => {
        const path = `colors.${key}`
        const locked = isLocked(path)
        const isTextColor = key === 'text' || key === 'textSecondary'
        const contrast = isTextColor ? getContrastRatio(value, colors.background) : null
        const wcag = contrast ? getWcagLevel(contrast) : null

        return (
          <div
            key={key}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              locked ? 'bg-violet-500/5 ring-1 ring-violet-500/20' : 'hover:bg-zinc-800/50'
            }`}
          >
            <Popover>
              <PopoverTrigger
                disabled={locked}
                title={locked ? 'Token locked' : 'Pick color'}
                className="w-10 h-10 rounded-lg border border-zinc-700 flex-shrink-0 transition-transform hover:scale-105 disabled:cursor-not-allowed shadow-sm"
                style={{ backgroundColor: value }}
              />
              <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-700" side="right">
                <HexColorPicker
                  color={value}
                  onChange={(c) => handleChange(key, c, value)}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value, value)}
                  className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white font-mono"
                />
              </PopoverContent>
            </Popover>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-zinc-200">{COLOR_LABELS[key] || key}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {wcag && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{ backgroundColor: wcag.color + '20', color: wcag.color }}
                    >
                      {wcag.level}
                    </span>
                  )}
                  <LockToggle path={path} value={value} />
                </div>
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value, value)}
                disabled={locked}
                className="text-xs text-zinc-500 font-mono bg-transparent border-none outline-none w-full disabled:cursor-not-allowed mt-0.5"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
