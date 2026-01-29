"use client";

import { useState } from "react";
import { ImageDropzone, ImagePreview } from "@/components/ImageDropzone";
import { Sparkles, Zap, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useImageProcessor, ProcessedItem } from "@/hooks/useImageProcessor";
import { clsx } from "clsx";

export default function Home() {
  const { items, processItem } = useImageProcessor();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('Minimalist Studio');
  const [isProcessing, setIsProcessing] = useState(false);

  // Combine pending files with processed items for display
  const allItems = [
    ...items,
    ...pendingFiles.map(f => ({ id: `pending-${f.name}`, originalFile: f, status: 'idle' as const }))
  ];

  const handleFilesAdded = (newFiles: File[]) => {
    setPendingFiles(prev => [...prev, ...newFiles]);
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startProcessing = async () => {
    if (pendingFiles.length === 0) return;
    setIsProcessing(true);

    // Process sequentially or parallel
    for (const file of pendingFiles) {
      await processItem(file, selectedStyle);
    }

    setPendingFiles([]); // Clear pending as they move to 'items' inside the hook logic? 
    // Wait, the hook adds to its own state. 
    // We should clear pending files immediately as they are added to the processor queue?
    // Actually, processItem is async but we called it in a loop.
    // Let's just clear pending files after loop starts? 
    // Better: Helper logic. The hook keeps track of 'processed' items.
    // We should probably just pass the files to the hook to manage entirely.
    // For simplicity: We will clear pendingFiles and rely on 'items' from hook.
    // However, the hook 'processItem' adds to state. 
    // So if we iterate, we are adding them.

    setPendingFiles([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black dark:bg-white rounded-lg">
              <Sparkles className="w-5 h-5 text-white dark:text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ProductAI Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:opacity-80 transition-opacity">
              History
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs font-mono text-zinc-400">v1.0.0 (Free Tier)</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto pb-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white bg-clip-text text-transparent pb-2">
            Product Photos at Scale
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Upload generic product shots. Get studio-quality marketing assets.
            <br />Powered by <span className="text-indigo-500 font-medium">Gemini</span>, <span className="text-blue-500 font-medium">Cerebras</span> & <span className="text-orange-500 font-medium">Flux</span>.
          </p>
        </div>

        {/* Upload & Gallery */}
        <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-all hover:shadow-md">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-bold">1</div>
                Upload Products
              </h3>
              {(allItems.length > 0) && (
                <span className="text-sm text-zinc-500">{allItems.length} items</span>
              )}
            </div>

            <ImageDropzone onFilesAdded={handleFilesAdded} disabled={isProcessing} className="max-w-2xl mx-auto" />

            {/* Combined Gallery */}
            {allItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Pending Files */}
                {pendingFiles.map((file, i) => (
                  <div key={`pending-${i}`} className="relative">
                    <ImagePreview
                      file={file}
                      onRemove={() => removePendingFile(i)}
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-zinc-100/90 text-xs font-medium text-zinc-600 backdrop-blur-sm">
                      Pending
                    </div>
                  </div>
                ))}

                {/* Processed/Processing Items */}
                {items.map((item) => (
                  <ProcessedItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Configuration & Controls */}
        <section className={clsx("transition-all duration-500", pendingFiles.length === 0 ? "opacity-50 pointer-events-none blur-sm grayscale" : "opacity-100")}>
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 relative overflow-hidden">

            {/* Dynamic background gradient */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-bold">2</div>
                Select Branding Style
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              {['Minimalist Studio', 'Neon Cyberpunk', 'Nature Outdoor', 'Luxury Gold', 'Industrial Concrete'].map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={clsx(
                    "group relative h-24 rounded-xl border overflow-hidden text-left transition-all duration-200",
                    selectedStyle === style ? "border-purple-500 ring-1 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20" : "border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 bg-zinc-50 dark:bg-zinc-900"
                  )}
                >
                  <div className="relative p-4 z-10 flex flex-col justify-center h-full">
                    <span className={clsx("font-medium block", selectedStyle === style ? "text-purple-700 dark:text-purple-300" : "text-zinc-700 dark:text-zinc-300")}>
                      {style}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800 relative z-10">
              <button
                onClick={startProcessing}
                disabled={isProcessing}
                className="flex items-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-8 py-3.5 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-zinc-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Generate {pendingFiles.length} Images
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function ProcessedItemCard({ item }: { item: ProcessedItem }) {
  // Determine status color/icon
  const isError = item.status === 'error';
  const isComplete = item.status === 'completed';
  const isLoading = !isError && !isComplete;

  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
      {/* Show Final or Original or NoBg */}
      {/* If we have a final image (even if loading finished), show it? No, wait until completed. */}
      {/* During processing, we might show the NoBg version as progress? */}

      {/* Background Layer (Original or Processed) */}
      <div className={clsx("absolute inset-0 transition-opacity duration-500", isLoading ? "opacity-50 blur-sm scale-110" : "opacity-100")}>
        <ImagePreview file={item.originalFile} onRemove={() => { }} />
      </div>

      {/* Overlay Status */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium text-white truncate uppercase tracking-wider">
            {item.status.replace('_', ' ')}
          </span>
          {isLoading && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
          {isComplete && <CheckCircle2 className="w-3 h-3 text-green-400" />}
          {isError && <AlertCircle className="w-3 h-3 text-red-400" />}
        </div>
      </div>

      {/* Error Message Tooltip */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center p-2 bg-black/80">
          <p className="text-xs text-red-200 text-center">{item.error?.slice(0, 50)}...</p>
        </div>
      )}
    </div>
  );
}
