'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTokenStore } from '@/store/token-store'
import { generateCssVariables } from '@/lib/css-generator'
import { generateTailwindConfig } from '@/lib/tailwind-generator'
import { Copy, Download, Check } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export function ExportModal({ open, onClose }: Props) {
  const { colors, typography, spacing, shadows, radii } = useTokenStore()
  const [copied, setCopied] = useState<string | null>(null)

  const cssOutput = generateCssVariables(colors, typography, spacing, shadows, radii)
  const jsonOutput = JSON.stringify({ colors, typography, spacing, shadows, radii }, null, 2)
  const tailwindOutput = generateTailwindConfig(colors, typography, spacing)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const download = (text: string, filename: string, mime: string) => {
    const blob = new Blob([text], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'css', label: 'CSS Variables', content: cssOutput, filename: 'tokens.css', mime: 'text/css' },
    { id: 'json', label: 'JSON Tokens', content: jsonOutput, filename: 'tokens.json', mime: 'application/json' },
    { id: 'tailwind', label: 'Tailwind Config', content: tailwindOutput, filename: 'tailwind.config.js', mime: 'text/javascript' },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Tokens</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="css">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => (
            <TabsContent key={t.id} value={t.id}>
              <div className="relative">
                <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-zinc-300 overflow-auto max-h-96 leading-relaxed">
                  {t.content}
                </pre>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => copy(t.content, t.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-300 transition-colors"
                  >
                    {copied === t.id ? (
                      <><Check className="w-3 h-3 text-green-400" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                  <button
                    onClick={() => download(t.content, t.filename, t.mime)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 rounded text-xs text-white transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
