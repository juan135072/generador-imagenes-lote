"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageDropzone, ImagePreview } from "@/components/ImageDropzone";
import { Sparkles, Zap, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useImageProcessor, ProcessedItem, ProcessStatus } from "@/hooks/useImageProcessor";
import { clsx } from "clsx";

export default function Home() {
  const { items, processItem } = useImageProcessor();
  const [pendingItems, setPendingItems] = useState<{ file: File, description: string }[]>([]);
  const [basePrompt, setBasePrompt] = useState('Iluminación de estudio, fotografía de producto profesional, resolución 8k, altamente detallado, fondo minimalista');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    const newItems = newFiles.map(file => ({ file, description: "" }));
    setPendingItems(prev => [...prev, ...newItems]);
  };

  const removePendingItem = (index: number) => {
    setPendingItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateDescription = (index: number, description: string) => {
    setPendingItems(prev => prev.map((item, i) => i === index ? { ...item, description } : item));
  };

  const startProcessing = async () => {
    if (pendingItems.length === 0) return;
    setIsProcessing(true);

    for (const item of pendingItems) {
      await processItem(item.file, item.description, basePrompt);
    }

    setPendingItems([]);
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
            <h1 className="text-xl font-bold tracking-tight">FotoEstudio AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:opacity-80 transition-opacity">
              Historial
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs font-mono text-zinc-400">v1.0.0 (Versión Gratuita)</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto pb-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white bg-clip-text text-transparent pb-2">
            Generador de Fotos de Producto
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Sube fotos genéricas de tus productos y crea imágenes de marketing profesionales al instante.
          </p>
        </div>

        {/* 1. Base Prompt (Global) */}
        <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-all">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-bold">1</div>
              Prompt Base Global (Estilo de Marca)
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Define el fondo común, la iluminación y el ambiente para TODAS las imágenes de este lote.
            </p>
            <label htmlFor="global-base-prompt" className="sr-only">Prompt Base Global</label>
            <textarea
              id="global-base-prompt"
              name="basePrompt"
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              placeholder="Ej: Fondo de cocina de lujo, luz solar suave de la mañana, efecto bokeh..."
              className="w-full h-32 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none font-medium"
            />
          </div>
        </section>

        {/* 2. Upload & Gallery */}
        <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-all hover:shadow-md">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-bold">2</div>
                Sube Productos y Describe
              </h3>
            </div>

            <ImageDropzone onFilesAdded={handleFilesAdded} disabled={isProcessing} className="max-w-2xl mx-auto" />

            {/* Combined Gallery */}
            {(pendingItems.length > 0 || items.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pending Items with Inputs */}
                {pendingItems.map((item, i) => (
                  <div key={`pending-${i}`} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
                      <ImagePreview
                        file={item.file}
                        onRemove={() => removePendingItem(i)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor={`description-${i}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
                      >
                        Descripción Breve
                      </label>
                      <input
                        id={`description-${i}`}
                        name={`description-${i}`}
                        type="text"
                        value={item.description}
                        onChange={(e) => updateDescription(i, e.target.value)}
                        placeholder="Ej: Zapatilla roja, suela blanca..."
                        className="w-full bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                ))}

                {/* Processed/Processing Items */}
                {items.map((item) => (
                  <ProcessedItemCard key={item.id} item={item} />
                ))}
              </div>
            )}

            <div className="flex justify-end pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={startProcessing}
                disabled={isProcessing || pendingItems.length === 0}
                className="flex items-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-10 py-4 rounded-2xl font-bold text-xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-zinc-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando Lote...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 fill-current text-yellow-500" />
                    Generar {pendingItems.length} Fotos de Marketing
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
  const isError = item.status === 'error';
  const isComplete = item.status === 'completed';
  const isLoading = !isError && !isComplete;
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);

  useEffect(() => { // Changed from useState to useEffect
    if (item.finalImage) {
      const url = URL.createObjectURL(item.finalImage);
      setFinalImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [item.finalImage]); // Dependency array to re-run when finalImage changes

  const statusMap: Record<ProcessStatus, string> = {
    idle: 'En espera',
    removing_bg: 'Quitando fondo',
    analyzing: 'Analizando',
    prompting: 'Creando prompt',
    generating: 'Generando',
    completed: 'Completado',
    error: 'Error'
  };

  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all">
      <div className={clsx("absolute inset-0 transition-opacity duration-500", isLoading ? "opacity-50 blur-sm scale-110" : "opacity-100")}>
        {isComplete && finalImageUrl ? (
          <Image
            src={finalImageUrl}
            alt="Final generated"
            fill
            className="object-cover"
          />
        ) : (
          <ImagePreview file={item.originalFile} onRemove={() => { }} />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium text-white truncate uppercase tracking-wider">
            {statusMap[item.status]}
          </span>
          {isLoading && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
          {isComplete && <CheckCircle2 className="w-3 h-3 text-green-400" />}
          {isError && <AlertCircle className="w-3 h-3 text-red-400" />}
        </div>
      </div>

      {isComplete && finalImageUrl && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <a
            href={finalImageUrl}
            download={`foto-producto-${item.id}.png`}
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Zap className="w-4 h-4 fill-current text-yellow-500" />
            Descargar HD
          </a>
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center p-2 bg-black/80">
          <p className="text-xs text-red-200 text-center">{item.error?.slice(0, 100)}</p>
        </div>
      )}
    </div>
  );
}
