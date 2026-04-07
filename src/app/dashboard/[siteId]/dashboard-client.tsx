'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTokenStore } from '@/store/token-store'
import { TokenSidebar } from '@/components/dashboard/token-sidebar'
import { PreviewGrid } from '@/components/dashboard/preview-grid'
import { VersionTimeline } from '@/components/dashboard/version-timeline'
import { ExportModal } from '@/components/dashboard/export-modal'
import { ScrapingLoader } from '@/components/scraping-loader'
import { DBTokenRow, DBLockRow, DBSiteRow } from '@/types/tokens'
import { Globe, RefreshCw, History, Download, ArrowLeft, Sliders, Eye } from 'lucide-react'

interface Props {
  site: DBSiteRow
  tokens: DBTokenRow | null
  locks: DBLockRow[]
}

type MobileTab = 'tokens' | 'preview'

export function DashboardClient({ site, tokens, locks }: Props) {
  const { initFromDB } = useTokenStore()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(!tokens)
  const [mobileTab, setMobileTab] = useState<MobileTab>('tokens')
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

  const statusColor =
    site.extraction_status === 'completed'
      ? 'bg-green-500/10 text-green-400'
      : site.extraction_status === 'failed'
      ? 'bg-red-500/10 text-red-400'
      : 'bg-amber-500/10 text-amber-400'

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0b]">
      {/* Header */}
      <header className="flex-shrink-0 bg-zinc-950 border-b border-zinc-800/60 px-3 py-2 flex items-center gap-2 min-h-[48px]">
        <a
          href="/"
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 flex-shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </a>

        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Globe className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-zinc-300 font-mono truncate">{site.domain ?? site.url}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-mono flex-shrink-0 hidden sm:inline ${statusColor}`}>
            {site.extraction_status}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleRescrape}
            title="Re-scrape"
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-scrape</span>
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            title="History"
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors shadow-lg shadow-violet-900/30"
          >
            <Download className="w-4 h-4" />
            <span>Export Tokens</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <ScrapingLoader siteId={site.id} onComplete={handleExtractionComplete} />
          </div>
        ) : (
          <>
            {/* Desktop: sidebar + preview side by side */}
            <div className="hidden md:flex flex-1 min-h-0">
              <div className="w-[400px] lg:w-[460px] flex-shrink-0 h-full overflow-hidden">
                <TokenSidebar />
              </div>
              <motion.div
                className="flex-1 min-w-0 h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <PreviewGrid />
              </motion.div>
            </div>

            {/* Mobile: tab-switched panels */}
            <div className="flex md:hidden flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 relative">
                <AnimatePresence mode="wait" initial={false}>
                  {mobileTab === 'tokens' ? (
                    <motion.div
                      key="tokens"
                      className="absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TokenSidebar />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      className="absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PreviewGrid />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile bottom tab bar */}
              <div className="flex-shrink-0 border-t border-zinc-800/60 bg-zinc-950 flex">
                <button
                  onClick={() => setMobileTab('tokens')}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                    mobileTab === 'tokens' ? 'text-violet-400' : 'text-zinc-500'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  Tokens
                </button>
                <button
                  onClick={() => setMobileTab('preview')}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                    mobileTab === 'preview' ? 'text-violet-400' : 'text-zinc-500'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <VersionTimeline open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}
