'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'
import { useTokenStore } from '@/store/token-store'
import { createClient } from '@/lib/supabase/client'
import { getSessionId } from '@/lib/session'

interface Props {
  path: string
  value: string | number
}

export function LockToggle({ path, value }: Props) {
  const { tokenId, isLocked, toggleLock } = useTokenStore()
  const locked = isLocked(path)

  async function handleToggle() {
    toggleLock(path)
    if (!tokenId) return
    const sessionId = getSessionId()
    await fetch(`/api/tokens/${tokenId}/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, value, sessionId, locked: !locked }),
    })
  }

  return (
    <button
      onClick={handleToggle}
      title={locked ? 'Unlock token' : 'Lock token'}
      className={`p-1 rounded transition-colors ${
        locked
          ? 'text-violet-400 hover:text-violet-300'
          : 'text-zinc-600 hover:text-zinc-400'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={locked ? 'locked' : 'unlocked'}
          initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotate: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
