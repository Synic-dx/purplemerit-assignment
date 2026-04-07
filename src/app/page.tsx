import { UrlInput } from '@/components/url-input'
import { Sparkles, Zap, Lock, Download } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center px-4 py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          Design Token Extractor
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Style
            </span>
            <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Sync
            </span>
          </h1>
          <p className="text-base sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Paste any URL. Extract its design DNA.{' '}
            <span className="text-zinc-300">Edit, lock, and export</span> production-ready tokens.
          </p>
        </div>

        {/* Input + examples */}
        <UrlInput />

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 text-left">
          {[
            {
              icon: <Zap className="w-4 h-4 text-violet-400" />,
              title: 'Instant Extraction',
              desc: 'Colors, typography, and spacing pulled directly from computed styles.',
            },
            {
              icon: <Lock className="w-4 h-4 text-violet-400" />,
              title: 'Lock & Edit',
              desc: 'Lock tokens you like, tweak the rest. Full edit history tracked.',
            },
            {
              icon: <Download className="w-4 h-4 text-violet-400" />,
              title: 'Export Anywhere',
              desc: 'CSS variables, JSON tokens, or Tailwind config — ready to ship.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                {f.icon}
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
