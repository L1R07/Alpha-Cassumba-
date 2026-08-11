import React from 'react';
import { PostDesignState } from '../types';
import { X, Bookmark, Trash2, ExternalLink, Calendar } from 'lucide-react';

interface SavedPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPosts: PostDesignState[];
  onLoadPost: (post: PostDesignState) => void;
  onDeletePost: (id: string) => void;
}

export const SavedPostsModal: React.FC<SavedPostsModalProps> = ({
  isOpen,
  onClose,
  savedPosts,
  onLoadPost,
  onDeletePost,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Minhas Criações Salvas</h3>
              <p className="text-xs text-slate-400">Sua biblioteca pessoal de frases e posts criados</p>
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
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {savedPosts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-300">Nenhum post salvo ainda</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Crie um design incrível no editor e clique no ícone de salvar para guardar em sua galeria!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition-all flex flex-col justify-between"
                >
                  {/* Card Preview Box */}
                  <div
                    className="w-full aspect-square rounded-xl p-3 flex flex-col justify-between text-center mb-3 shadow-inner"
                    style={{
                      background: post.bgType === 'solid'
                        ? post.bgColor1
                        : `linear-gradient(${post.bgAngle || 135}deg, ${post.bgColor1}, ${post.bgColor2})`,
                    }}
                  >
                    <p
                      className="text-xs font-semibold line-clamp-4 my-auto"
                      style={{ color: post.fontColor || '#ffffff', fontFamily: post.fontFamily }}
                    >
                      "{post.mainText}"
                    </p>
                    <p className="text-[10px] opacity-80" style={{ color: post.authorColor || '#f59e0b' }}>
                      {post.authorText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        onLoadPost(post);
                        onClose();
                      }}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
