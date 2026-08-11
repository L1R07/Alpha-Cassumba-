import React, { useState } from 'react';
import { PostDesignState, FontFamily, BackgroundStyle } from '../types';
import { STOCK_BACKGROUNDS } from '../data/presets';
import { 
  Type, 
  Palette, 
  Building2, 
  Sparkles, 
  Wand2, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sun, 
  Droplet, 
  Image as ImageIcon, 
  RefreshCw,
  Copy,
  Check,
  Zap
} from 'lucide-react';

interface ControlPanelProps {
  design: PostDesignState;
  onChange: (updated: PostDesignState) => void;
  onOpenAiQuotes: () => void;
  onOpenAiCaptions: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  design,
  onChange,
  onOpenAiQuotes,
  onOpenAiCaptions,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'bg' | 'brand' | 'ai'>('text');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [isRephrasing, setIsRephrasing] = useState(false);
  const [rephraseResults, setRephraseResults] = useState<{ tone: string; rephrased: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fonts: FontFamily[] = [
    'Playfair Display',
    'Plus Jakarta Sans',
    'Montserrat',
    'Cinzel',
    'Caveat',
    'Cormorant Garamond',
    'Poppins',
    'Syne',
    'Space Grotesk',
    'Pacifico'
  ];

  const updateField = <K extends keyof PostDesignState>(key: K, value: PostDesignState[K]) => {
    onChange({ ...design, [key]: value });
  };

  const updateBranding = <K extends keyof PostDesignState['branding']>(
    key: K,
    value: PostDesignState['branding'][K]
  ) => {
    onChange({
      ...design,
      branding: {
        ...design.branding,
        [key]: value,
      },
    });
  };

  // AI Magic Theme Generator Handler
  const handleAiMagicTheme = async () => {
    if (!design.mainText) return;
    setIsGeneratingTheme(true);
    try {
      const res = await fetch('/api/gemini/generate-design-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: design.mainText }),
      });
      const data = await res.json();
      if (data.success && data.theme) {
        onChange({
          ...design,
          bgType: 'gradient',
          bgColor1: data.theme.bgColor1 || '#0f172a',
          bgColor2: data.theme.bgColor2 || '#3b82f6',
          fontColor: data.theme.textColor || '#ffffff',
          authorColor: data.theme.accentColor || '#f59e0b',
          quoteIconColor: data.theme.accentColor || '#f59e0b',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  // AI Rephrase Handler
  const handleRephraseText = async () => {
    if (!design.mainText) return;
    setIsRephrasing(true);
    try {
      const res = await fetch('/api/gemini/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: design.mainText, language: 'pt' }),
      });
      const data = await res.json();
      if (data.success && data.variations) {
        setRephraseResults(data.variations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRephrasing(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      
      {/* Studio Control Tabs Header */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'text'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Texto</span>
        </button>

        <button
          onClick={() => setActiveTab('bg')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bg'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Fundo</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'brand'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Marca</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md'
              : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-900'
          }`}
        >
          <Wand2 className="w-4 h-4 animate-pulse text-indigo-300" />
          <span>IA Studio</span>
        </button>
      </div>

      {/* Studio Control Body */}
      <div className="p-4 sm:p-5 overflow-y-auto max-h-[580px] space-y-5 custom-scrollbar">
        
        {/* TAB 1: TEXT & QUOTE CONTROLS */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            
            {/* Main Text Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Texto Principal / Frase
                </label>
                <button
                  onClick={handleRephraseText}
                  disabled={isRephrasing}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isRephrasing ? 'Melhorando...' : 'Melhorar com IA'}</span>
                </button>
              </div>
              <textarea
                value={design.mainText}
                onChange={(e) => updateField('mainText', e.target.value)}
                rows={3}
                placeholder="Escreva sua frase marcante aqui..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
              />
            </div>

            {/* Author Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Autor / Fonte
              </label>
              <input
                type="text"
                value={design.authorText}
                onChange={(e) => updateField('authorText', e.target.value)}
                placeholder="Ex: Marcus Aurelius ou Pensamento do Dia"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Typography Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fonte Principal</label>
                <select
                  value={design.fontFamily}
                  onChange={(e) => updateField('fontFamily', e.target.value as FontFamily)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fonte do Autor</label>
                <select
                  value={design.authorFontFamily}
                  onChange={(e) => updateField('authorFontFamily', e.target.value as FontFamily)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font Colors & Sizes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cor do Texto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.fontColor}
                    onChange={(e) => updateField('fontColor', e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={design.fontColor}
                    onChange={(e) => updateField('fontColor', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cor do Autor</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.authorColor}
                    onChange={(e) => updateField('authorColor', e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={design.authorColor}
                    onChange={(e) => updateField('authorColor', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Font Size & Alignment */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Tamanho da Fonte</span>
                  <span className="font-bold text-indigo-400">{design.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={56}
                  value={design.fontSize}
                  onChange={(e) => updateField('fontSize', Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Formatting Controls */}
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                
                {/* Bold & Italic */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateField('isBold', !design.isBold)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                      design.isBold ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => updateField('isItalic', !design.isItalic)}
                    className={`p-1.5 rounded-lg text-xs transition-all ${
                      design.isItalic ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1 border-x border-slate-800 px-2">
                  <button
                    onClick={() => updateField('textAlign', 'left')}
                    className={`p-1.5 rounded-lg transition-all ${
                      design.textAlign === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => updateField('textAlign', 'center')}
                    className={`p-1.5 rounded-lg transition-all ${
                      design.textAlign === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => updateField('textAlign', 'right')}
                    className={`p-1.5 rounded-lg transition-all ${
                      design.textAlign === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Shadow Toggle */}
                <button
                  onClick={() => updateField('hasTextShadow', !design.hasTextShadow)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    design.hasTextShadow ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sombra
                </button>

              </div>
            </div>

            {/* Quote Mark Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Ícone de Aspas</label>
              <input
                type="checkbox"
                checked={design.showQuoteIcon}
                onChange={(e) => updateField('showQuoteIcon', e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </div>

          </div>
        )}

        {/* TAB 2: BACKGROUND CONTROLS */}
        {activeTab === 'bg' && (
          <div className="space-y-4">
            
            {/* AI Magic Theme Generator Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/40 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Gerador de Tema Mágico IA</span>
                </p>
                <p className="text-[11px] text-slate-300">Combina cores e fontes com a sua frase</p>
              </div>
              <button
                onClick={handleAiMagicTheme}
                disabled={isGeneratingTheme}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-md hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isGeneratingTheme ? 'Criando...' : 'Aplicar Tema'}
              </button>
            </div>

            {/* Background Type Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Estilo do Fundo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateField('bgType', 'gradient')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    design.bgType === 'gradient'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Degradê
                </button>

                <button
                  onClick={() => updateField('bgType', 'solid')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    design.bgType === 'solid'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Cor Sólida
                </button>

                <button
                  onClick={() => updateField('bgType', 'image')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    design.bgType === 'image'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Fotografia
                </button>
              </div>
            </div>

            {/* Gradient Options */}
            {design.bgType === 'gradient' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Cor Inicial</label>
                    <input
                      type="color"
                      value={design.bgColor1}
                      onChange={(e) => updateField('bgColor1', e.target.value)}
                      className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer p-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Cor Final</label>
                    <input
                      type="color"
                      value={design.bgColor2}
                      onChange={(e) => updateField('bgColor2', e.target.value)}
                      className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer p-1"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Ângulo do Degradê</span>
                    <span className="font-bold text-indigo-400">{design.bgAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={design.bgAngle}
                    onChange={(e) => updateField('bgAngle', Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Solid Color */}
            {design.bgType === 'solid' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Escolher Cor de Fundo</label>
                <input
                  type="color"
                  value={design.bgColor1}
                  onChange={(e) => updateField('bgColor1', e.target.value)}
                  className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer p-1"
                />
              </div>
            )}

            {/* Stock Photography */}
            {design.bgType === 'image' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400">
                  Fotografias Artísticas
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {STOCK_BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => updateField('bgImage', bg.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        design.bgImage === bg.url ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Custom Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">URL da Imagem Personalizada</label>
                  <input
                    type="text"
                    value={design.bgImage || ''}
                    onChange={(e) => updateField('bgImage', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Image Filters */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Desfoque (Blur)</span>
                      <span className="font-bold text-indigo-400">{design.bgBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      value={design.bgBlur}
                      onChange={(e) => updateField('bgBlur', Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Escurecer Fundo (Overlay)</span>
                      <span className="font-bold text-indigo-400">{design.bgOverlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={90}
                      value={design.bgOverlayOpacity}
                      onChange={(e) => updateField('bgOverlayOpacity', Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: BRANDING & WATERMARK */}
        {activeTab === 'brand' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-200">Exibir Minha Marca no Post</p>
                <p className="text-[11px] text-slate-400">Adiciona rodapé de marca profissional</p>
              </div>
              <input
                type="checkbox"
                checked={design.branding.enabled}
                onChange={(e) => updateBranding('enabled', e.target.checked)}
                className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
              />
            </div>

            {design.branding.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nome da Empresa / Marca</label>
                  <input
                    type="text"
                    value={design.branding.brandName}
                    onChange={(e) => updateBranding('brandName', e.target.value)}
                    placeholder="Ex: Dudo Studio"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">@ Instagram / Handle</label>
                    <input
                      type="text"
                      value={design.branding.handle}
                      onChange={(e) => updateBranding('handle', e.target.value)}
                      placeholder="@minhamarca"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp / Telefone</label>
                    <input
                      type="text"
                      value={design.branding.phone}
                      onChange={(e) => updateBranding('phone', e.target.value)}
                      placeholder="(11) 99999-8888"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Website / Link</label>
                  <input
                    type="text"
                    value={design.branding.website}
                    onChange={(e) => updateBranding('website', e.target.value)}
                    placeholder="www.minhamarca.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Posição do Rodapé</label>
                  <select
                    value={design.branding.position}
                    onChange={(e) => updateBranding('position', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="bottom-center">Inferior Centralizado</option>
                    <option value="bottom-left">Inferior Esquerda</option>
                    <option value="bottom-right">Inferior Direita</option>
                    <option value="top-center">Topo Centralizado</option>
                  </select>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: AI STUDIO CREATOR */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            
            {/* AI Generator Shortcuts */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onOpenAiQuotes}
                className="p-4 rounded-xl bg-gradient-to-tr from-indigo-950 to-purple-900 border border-indigo-700/60 hover:border-indigo-500 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-all">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white">Criador de Frases IA</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">Gere lotes de frases por categoria ou tema</p>
              </button>

              <button
                onClick={onOpenAiCaptions}
                className="p-4 rounded-xl bg-gradient-to-tr from-purple-950 to-pink-900 border border-purple-700/60 hover:border-purple-500 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-all">
                  <Type className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white">Legendas & Hashtags</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">Gere textos prontos para publicar no Insta</p>
              </button>
            </div>

            {/* AI Text Rephraser Results */}
            {rephraseResults.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <p className="text-xs font-bold text-indigo-300">Sugestões de Reescrever com IA:</p>
                {rephraseResults.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{r.tone}</span>
                      <button
                        onClick={() => {
                          updateField('mainText', r.rephrased);
                          setCopiedIndex(i);
                          setTimeout(() => setCopiedIndex(null), 1500);
                        }}
                        className="text-[10px] text-indigo-400 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === i ? 'Aplicado!' : 'Usar no Post'}</span>
                      </button>
                    </div>
                    <p className="text-slate-200 font-sans italic">"{r.rephrased}"</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
