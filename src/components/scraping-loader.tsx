'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle } from 'lucide-react'

const STEPS = [
  'Connecting to site...',
  'Analyzing DOM structure...',
  'Extracting colors...',
  'Reading typography...',
  'Mapping spacing...',
  'Building style guide...',
]

interface Props {
  siteId: string
  onComplete: () => void
}

export function ScrapingLoader({ siteId, onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const poll = setInterval(async () => {
      const { data } = await supabase
        .from('scraped_sites')
        .select('extraction_status, error_message')
        .eq('id', siteId)
        .single()

      if (data?.extraction_status === 'completed') {
        clearInterval(poll)
        onComplete()
      } else if (data?.extraction_status === 'failed') {
        clearInterval(poll)
        setError(data.error_message || 'Extraction failed')
      }
    }, 2000)
    return () => clearInterval(poll)
  }, [siteId, onComplete])

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <p className="text-white font-semibold">Extraction failed</p>
          <p className="text-zinc-400 text-sm mt-1">{error}</p>
        </div>
        <a href="/" className="text-violet-400 hover:text-violet-300 text-sm underline">
          Try another URL
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Animated tree visualization */}
      <div className="relative w-64 h-64">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-violet-500/20 border border-violet-500/30 rounded-md"
            style={{
              width: `${110 - i * 12}px`,
              height: '28px',
              left: `${i * 8}px`,
              top: `${i * 34}px`,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: [0, 1, 0.6], x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
          >
            <motion.div
              className="h-full bg-violet-500/40 rounded-md"
              animate={{ width: ['0%', `${60 + i * 5}%`] }}
              transition={{ delay: i * 0.2, duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Step text */}
      <div className="text-center h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-zinc-300 font-medium"
          >
            {STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              i <= stepIndex ? 'bg-violet-500' : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
