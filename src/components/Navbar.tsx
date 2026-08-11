import React from 'react';
import { AspectRatioType } from '../types';
import { 
  Sparkles, 
  Download, 
  Layout, 
  Bookmark, 
  Share2, 
  Smartphone, 
  Square, 
  RectangleVertical, 
  Monitor, 
  Settings2,
  Wand2,
  Type
} from 'lucide-react';

interface NavbarProps {
  aspectRatio: AspectRatioType;
  setAspectRatio: (ratio: AspectRatioType) => void;
  onOpenTemplates: () => void;
  onOpenAiQuotes: () => void;
  onOpenAiCaptions: () => void;
  onOpenSavedPosts: () => void;
  onExportImage: () => void;
  isExporting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  aspectRatio,
  setAspectRatio,
  onOpenTemplates,
  onOpenAiQuotes,
  onOpenAiCaptions,
  onOpenSavedPosts,
  onExportImage,
  isExporting,
}) => {
  const formats: { id: AspectRatioType; label: string; icon: React.ReactNode }[] = [
    { id: '1:1', label: '1:1 Quadrado', icon: <Square className="w-3.5 h-3.5" /> },
    { id: '4:5', label: '4:5 Retrato Insta', icon: <RectangleVertical className="w-3.5 h-3.5" /> },
    { id: '9:16', label: '9:16 Story / Reels', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: '16:9', label: '16:9 Banner / X', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white font-sans">
                Postly <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Studio</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Gerador Inteligente de Frases, Posts & Marcas</p>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setAspectRatio(f.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                aspectRatio === f.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Templates Drawer Toggle */}
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all hover:border-slate-600 active:scale-95"
          >
            <Layout className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Modelos</span>
          </button>

          {/* AI Quotes Generator Button */}
          <button
            onClick={onOpenAiQuotes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-200 text-xs font-semibold border border-indigo-700/50 transition-all hover:border-indigo-500 active:scale-95 shadow-sm"
          >
            <Wand2 className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">Criar Frases IA</span>
          </button>

          {/* AI Captions & Hashtags */}
          <button
            onClick={onOpenAiCaptions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 text-xs font-semibold border border-purple-700/50 transition-all hover:border-purple-500 active:scale-95 shadow-sm"
          >
            <Type className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Legendas & Tags</span>
          </button>

          {/* Saved Creations */}
          <button
            onClick={onOpenSavedPosts}
            title="Meus Posts Salvos"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all hover:text-white"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
          </button>

          {/* Download Export PNG Button */}
          <button
            onClick={onExportImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Exportando...' : 'Baixar Imagem'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
