import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Navbar } from './components/Navbar';
import { CanvasEditor } from './components/CanvasEditor';
import { ControlPanel } from './components/ControlPanel';
import { TemplatesModal } from './components/TemplatesModal';
import { AiQuoteGeneratorModal } from './components/AiQuoteGeneratorModal';
import { AiCaptionModal } from './components/AiCaptionModal';
import { SavedPostsModal } from './components/SavedPostsModal';
import { INITIAL_POST } from './data/presets';
import { PostDesignState, AspectRatioType, TemplatePreset } from './types';
import { Bookmark, Sparkles, Check, Download, Undo, Redo, Layout } from 'lucide-react';

export default function App() {
  const [design, setDesign] = useState<PostDesignState>(() => {
    const local = localStorage.getItem('postly_current_design');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_POST as PostDesignState;
  });

  const [savedPosts, setSavedPosts] = useState<PostDesignState[]>(() => {
    const local = localStorage.getItem('postly_saved_creations');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Modal Visibility States
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAiQuotesOpen, setIsAiQuotesOpen] = useState(false);
  const [isAiCaptionsOpen, setIsAiCaptionsOpen] = useState(false);
  const [isSavedPostsOpen, setIsSavedPostsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Save current design to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('postly_current_design', JSON.stringify(design));
  }, [design]);

  // Save saved posts array to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('postly_saved_creations', JSON.stringify(savedPosts));
  }, [savedPosts]);

  // Handle Aspect Ratio Change
  const handleAspectRatioChange = (ratio: AspectRatioType) => {
    setDesign((prev) => ({ ...prev, aspectRatio: ratio }));
  };

  // Handle Template Preset Application
  const handleSelectTemplate = (template: TemplatePreset) => {
    setDesign((prev) => ({
      ...prev,
      ...template.design,
    }));
  };

  // Handle AI Quote Application
  const handleApplyQuote = (quote: string, author: string) => {
    setDesign((prev) => ({
      ...prev,
      mainText: quote,
      authorText: author,
    }));
  };

  // Save current post design to My Creations
  const handleSaveToGallery = () => {
    const newPost: PostDesignState = {
      ...design,
      id: `post_${Date.now()}`,
    };
    setSavedPosts((prev) => [newPost, ...prev]);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  // Delete saved post
  const handleDeleteSavedPost = (id: string) => {
    setSavedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Export Design to High-Res PNG Image
  const handleExportImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      // Ensure smooth fonts render
      await document.fonts.ready;

      const canvas = await html2canvas(canvasRef.current, {
        scale: 3, // High DPI render for sharp social media graphics
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      const sanitizedTitle = design.mainText
        ? design.mainText.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')
        : 'postly';
      link.download = `postly_${sanitizedTitle}.png`;
      link.click();
    } catch (err) {
      console.error('Error exporting canvas image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        aspectRatio={design.aspectRatio}
        setAspectRatio={handleAspectRatioChange}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenAiQuotes={() => setIsAiQuotesOpen(true)}
        onOpenAiCaptions={() => setIsAiCaptionsOpen(true)}
        onOpenSavedPosts={() => setIsSavedPostsOpen(true)}
        onExportImage={handleExportImage}
        isExporting={isExporting}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: Live Interactive Canvas Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
          
          {/* Top Quick Tools Bar above Canvas */}
          <div className="w-full max-w-[540px] flex items-center justify-between px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider">Formato:</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-indigo-400 font-bold">
                {design.aspectRatio}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Creation Button */}
              <button
                onClick={handleSaveToGallery}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  savedFeedback
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {savedFeedback ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 text-amber-400" />}
                <span>{savedFeedback ? 'Salvo!' : 'Salvar no Studio'}</span>
              </button>

              {/* Templates Drawer Quick Button */}
              <button
                onClick={() => setIsTemplatesOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold"
              >
                <Layout className="w-3.5 h-3.5 text-purple-400" />
                <span>Modelos</span>
              </button>
            </div>
          </div>

          {/* Canvas Render Stage */}
          <div className="w-full flex items-center justify-center">
            <CanvasEditor ref={canvasRef} design={design} />
          </div>

          {/* Quick AI Caption Trigger below Canvas */}
          <div className="w-full max-w-[540px] p-3 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-900 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Pronto para publicar no Instagram?</p>
                <p className="text-[11px] text-slate-400">Gere legenda completa com hashtags para esta frase</p>
              </div>
            </div>
            <button
              onClick={() => setIsAiCaptionsOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
            >
              Criar Legenda
            </button>
          </div>

        </div>

        {/* RIGHT: Studio Customization & AI Control Panel */}
        <div className="lg:col-span-5 w-full">
          <ControlPanel
            design={design}
            onChange={setDesign}
            onOpenAiQuotes={() => setIsAiQuotesOpen(true)}
            onOpenAiCaptions={() => setIsAiCaptionsOpen(true)}
          />
        </div>

      </main>

      {/* MODALS & DRAWERS */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <AiQuoteGeneratorModal
        isOpen={isAiQuotesOpen}
        onClose={() => setIsAiQuotesOpen(false)}
        onApplyQuote={handleApplyQuote}
      />

      <AiCaptionModal
        isOpen={isAiCaptionsOpen}
        onClose={() => setIsAiCaptionsOpen(false)}
        postText={design.mainText}
      />

      <SavedPostsModal
        isOpen={isSavedPostsOpen}
        onClose={() => setIsSavedPostsOpen(false)}
        savedPosts={savedPosts}
        onLoadPost={(post) => setDesign(post)}
        onDeletePost={handleDeleteSavedPost}
      />

    </div>
  );
}
