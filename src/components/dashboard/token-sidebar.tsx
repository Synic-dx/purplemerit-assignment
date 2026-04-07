'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ColorEditor } from './color-editor'
import { TypographyEditor } from './typography-editor'
import { SpacingEditor } from './spacing-editor'
import { Palette, Type, LayoutGrid } from 'lucide-react'

export function TokenSidebar() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] border-r border-zinc-800/60">
      <Tabs defaultValue="colors" className="flex flex-col h-full">
        <TabsList className="flex-shrink-0 bg-zinc-900/80 border-b border-zinc-800 rounded-none h-13 px-3 gap-1">
          <TabsTrigger value="colors" className="flex items-center gap-2 text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 rounded-md px-4 py-2">
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2 text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 rounded-md px-4 py-2">
            <Type className="w-4 h-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="spacing" className="flex items-center gap-2 text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 rounded-md px-4 py-2">
            <LayoutGrid className="w-4 h-4" />
            Spacing
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="colors" className="m-0 p-5">
            <ColorEditor />
          </TabsContent>
          <TabsContent value="typography" className="m-0 p-5">
            <TypographyEditor />
          </TabsContent>
          <TabsContent value="spacing" className="m-0 p-5">
            <SpacingEditor />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
