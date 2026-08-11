import React, { useState } from 'react';
import { GeneratedCaption } from '../types';
import { X, Type, Sparkles, Copy, Check, Hash, Instagram, Share2 } from 'lucide-react';

interface AiCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  postText: string;
}

export const AiCaptionModal: React.FC<AiCaptionModalProps> = ({
  isOpen,
  onClose,
  postText,
}) => {
  const [platform, setPlatform] = useState('Instagram');
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<GeneratedCaption[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerateCaptions = async () => {
    if (!postText) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postText,
          platform,
          language: 'pt',
        }),
      });
      const data = await res.json();
      if (data.success && data.captions) {
        setCaptions(data.captions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, hashtags: string[], index: number) => {
    const fullContent = `${text}\n\n${hashtags.map(h => `#${h.replace(/^#/, '')}`).join(' ')}`;
    navigator.clipboard.writeText(fullContent);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Gerador de Legendas & Hashtags Virais</h3>
              <p className="text-xs text-slate-400">Crie textos envolventes e hashtags estratégicas com IA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* Post preview box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Frase Base:</p>
            <p className="text-xs text-slate-200 italic font-serif">"{postText}"</p>
          </div>

          {/* Platform selection & generate */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400">Rede Social:</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="X/Twitter">X / Twitter</option>
              </select>
            </div>

            <button
              onClick={handleGenerateCaptions}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Criando Legendas...' : 'Gerar Legendas e Tags'}</span>
            </button>
          </div>

          {/* Generated Captions */}
          {captions.length > 0 && (
            <div className="space-y-4 pt-3 border-t border-slate-800">
              {captions.map((cap, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                      Estilo: {cap.style}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cap.text, cap.hashtags, idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        copiedIdx === idx
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIdx === idx ? 'Copiado!' : 'Copiar Tudo'}</span>
                    </button>
                  </div>

                  {/* Caption Body */}
                  <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                    {cap.text}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {cap.hashtags.map((h, hIdx) => (
                      <span key={hIdx} className="text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        #{h.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
