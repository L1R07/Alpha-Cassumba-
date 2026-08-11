import React, { useState } from 'react';
import { QUOTE_CATEGORIES } from '../data/presets';
import { X, Sparkles, Wand2, Check, RefreshCw, MessageSquareQuote } from 'lucide-react';

interface QuoteItem {
  quote: string;
  author: string;
  category?: string;
}

interface AiQuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyQuote: (quote: string, author: string) => void;
}

export const AiQuoteGeneratorModal: React.FC<AiQuoteGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('motivational');
  const [customTopic, setCustomTopic] = useState('');
  const [language, setLanguage] = useState<'pt' | 'es' | 'en'>('pt');
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteItem[]>([
    { quote: 'Sua única limitação é aquela que você estabelece na sua própria mente.', author: 'Napoleon Hill' },
    { quote: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
    { quote: 'Não tente ser uma pessoa de sucesso, mas sim uma pessoa de valor.', author: 'Albert Einstein' },
  ]);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerateQuotes = async () => {
    setLoading(true);
    setAppliedIndex(null);
    try {
      const res = await fetch('/api/gemini/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          customTopic,
          language,
          count: 4,
        }),
      });
      const data = await res.json();
      if (data.success && data.quotes && data.quotes.length > 0) {
        setQuotes(data.quotes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Gerador Inteligente de Frases IA</h3>
              <p className="text-xs text-slate-400">Crie citação impactante para seus posts com Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* Category Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Selecione a Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {QUOTE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                2. Tópico ou Palavra-Chave (Opcional)
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Ex: Foco no trabalho, hábito de leitura, resiliência..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                3. Idioma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="pt">Português (BR)</option>
                <option value="en">English (US)</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateQuotes}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Gerando Frases com IA...' : 'Gerar Novas Frases com IA'}</span>
          </button>

          {/* Generated Results List */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Frases Geradas ({quotes.length})
            </p>

            <div className="space-y-2.5">
              {quotes.map((q, idx) => {
                const isApplied = appliedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 pr-2">
                      <p className="text-sm text-slate-100 font-serif italic">"{q.quote}"</p>
                      <p className="text-xs text-amber-400 font-semibold">— {q.author}</p>
                    </div>

                    <button
                      onClick={() => {
                        onApplyQuote(q.quote, q.author);
                        setAppliedIndex(idx);
                      }}
                      className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isApplied
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      {isApplied ? <Check className="w-3.5 h-3.5" /> : <MessageSquareQuote className="w-3.5 h-3.5" />}
                      <span>{isApplied ? 'Aplicada!' : 'Usar no Post'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
