'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useTokenStore } from '@/store/token-store'
import { VersionHistoryRow } from '@/types/tokens'
import { getSessionId } from '@/lib/session'
import { History, RotateCcw } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const CHANGE_COLORS: Record<string, string> = {
  user_edit: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  rescrape: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  lock: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  unlock: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

function isHexColor(v: string) {
  return /^#[0-9a-fA-F]{3,6}$/.test(v)
}

export function VersionTimeline({ open, onClose }: Props) {
  const { tokenId, updateToken } = useTokenStore()
  const [history, setHistory] = useState<VersionHistoryRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !tokenId) return
    setLoading(true)
    const sessionId = getSessionId()
    fetch(`/api/history/${tokenId}?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [open, tokenId])

  async function handleRestore(entry: VersionHistoryRow) {
    if (!tokenId) return
    const res = await fetch(`/api/history/${tokenId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historyId: entry.id, sessionId: getSessionId() }),
    })
    const data = await res.json()
    if (data.restoredValue && data.path) {
      updateToken(data.path, data.restoredValue)
      // Refresh history
      const sid = getSessionId()
      fetch(`/api/history/${tokenId}?sessionId=${sid}`)
        .then((r) => r.json())
        .then(setHistory)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[420px] bg-zinc-950 border-zinc-800 text-white p-0">
        <SheetHeader className="px-6 py-4 border-b border-zinc-800">
          <SheetTitle className="text-white flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            Version History
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-full pb-20 px-6 py-4 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && history.length === 0 && (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No changes recorded yet
            </div>
          )}

          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <code className="text-xs text-zinc-400 font-mono truncate">{entry.token_path}</code>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${CHANGE_COLORS[entry.change_type] || 'bg-zinc-800 text-zinc-400'}`}>
                    {entry.change_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {isHexColor(entry.old_value) ? (
                    <span
                      className="w-4 h-4 rounded border border-zinc-700 flex-shrink-0"
                      style={{ backgroundColor: entry.old_value }}
                    />
                  ) : null}
                  <span className="text-zinc-500 font-mono truncate max-w-[80px]">{entry.old_value}</span>
                  <span className="text-zinc-600">→</span>
                  {isHexColor(entry.new_value) ? (
                    <span
                      className="w-4 h-4 rounded border border-zinc-700 flex-shrink-0"
                      style={{ backgroundColor: entry.new_value }}
                    />
                  ) : null}
                  <span className="text-zinc-300 font-mono truncate max-w-[80px]">{entry.new_value}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleRestore(entry)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 text-zinc-500 hover:text-violet-400 transition-all"
                title="Restore this value"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
