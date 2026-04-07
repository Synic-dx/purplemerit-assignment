'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTokenStore } from '@/store/token-store'
import { TokenSidebar } from '@/components/dashboard/token-sidebar'
import { PreviewGrid } from '@/components/dashboard/preview-grid'
import { VersionTimeline } from '@/components/dashboard/version-timeline'
import { ExportModal } from '@/components/dashboard/export-modal'
import { ScrapingLoader } from '@/components/scraping-loader'
import { DBTokenRow, DBLockRow, DBSiteRow } from '@/types/tokens'
import { Globe, RefreshCw, History, Download, ArrowLeft } from 'lucide-react'

interface Props {
  site: DBSiteRow
  tokens: DBTokenRow | null
  locks: DBLockRow[]
}

export function DashboardClient({ site, tokens, locks }: Props) {
  const { initFromDB } = useTokenStore()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(!tokens)
  const router = useRouter()

  useEffect(() => {
    if (tokens) {
      initFromDB(tokens, locks)
      setIsLoading(false)
    }
  }, [tokens, locks, initFromDB])

  const handleExtractionComplete = useCallback(() => {
    router.refresh()
  }, [router])

  async function handleRescrape() {
    await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: site.url }),
    })
    router.push('/')
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="flex-shrink-0 h-12 bg-zinc-950 border-b border-zinc-800/60 flex items-center px-4 gap-3">
        <a href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </a>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Globe className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span className="text-sm text-zinc-300 font-mono truncate">{site.url}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded font-mono flex-shrink-0 ${
              site.extraction_status === 'completed'
                ? 'bg-green-500/10 text-green-400'
                : site.extraction_status === 'failed'
                ? 'bg-red-500/10 text-red-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            {site.extraction_status}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRescrape}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-scrape
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <History className="w-3.5 h-3.5" /> History
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <ScrapingLoader siteId={site.id} onComplete={handleExtractionComplete} />
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <div className="w-[360px] flex-shrink-0 h-full overflow-hidden">
              <TokenSidebar />
            </div>

            {/* Preview */}
            <motion.div
              className="flex-1 min-w-0 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <PreviewGrid />
            </motion.div>
          </>
        )}
      </div>

      <VersionTimeline open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}
