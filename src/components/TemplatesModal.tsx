import React from 'react';
import { TEMPLATE_PRESETS, QUOTE_CATEGORIES } from '../data/presets';
import { PostDesignState, TemplatePreset } from '../types';
import { X, Layout, Sparkles, Check } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplatePreset) => void;
  currentTemplateId?: string;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplateId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Galeria de Modelos & Design Presets</h3>
              <p className="text-xs text-slate-400">Escolha um estilo pronto e personalize em segundos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATE_PRESETS.map((t) => {
              const isSelected = currentTemplateId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTemplate(t);
                    onClose();
                  }}
                  className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/40 shadow-xl'
                      : 'border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-950'
                  }`}
                >
                  {/* Preview Canvas Box */}
                  <div
                    className={`w-full aspect-square rounded-xl p-4 flex flex-col justify-between text-center shadow-inner mb-3 transition-transform group-hover:scale-[1.02] bg-gradient-to-br ${t.previewGradient}`}
                  >
                    <div className="flex justify-center">
                      <span className="text-[10px] font-extrabold tracking-widest text-white/80 uppercase px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-xs font-serif text-white line-clamp-3 font-semibold px-2">
                      "{t.design.mainText}"
                    </p>
                    <p className="text-[10px] text-amber-300/90 font-medium">{t.design.authorText}</p>
                  </div>

                  {/* Template Title & Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
                        {t.name}
                      </h4>
                    </div>
                    {isSelected ? (
                      <span className="p-1 rounded-full bg-indigo-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-indigo-400 group-hover:underline">
                        Usar
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
