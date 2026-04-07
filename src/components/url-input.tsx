'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Globe } from 'lucide-react'

const EXAMPLES = ['stripe.com', 'linear.app', 'vercel.com', 'github.com']

export function UrlInput() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setError('')
    setLoading(true)

    let normalized = url.trim()
    if (!normalized.startsWith('http')) normalized = 'https://' + normalized

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      })
      let data: { siteId?: string; error?: string } = {}
      try {
        data = await res.json()
      } catch {
        throw new Error(`Server error (${res.status})`)
      }
      if (!res.ok) throw new Error(data.error || 'Failed')
      router.push(`/dashboard/${data.siteId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Globe className="absolute left-4 text-zinc-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://stripe.com"
            className="w-full pl-12 pr-4 py-4 pb-4 sm:pr-36 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-base font-mono"
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading || !url.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:flex absolute right-2 items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold text-sm transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Working...
              </span>
            ) : (
              <>Extract <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>

        {/* Mobile submit button */}
        <motion.button
          type="submit"
          disabled={loading || !url.trim()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="sm:hidden mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold text-sm transition-colors"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Working...
            </>
          ) : (
            <>Extract Tokens <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </form>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-600">
        <span>Try:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setUrl('https://' + example)}
            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}
