import React from 'react';
import { ModelPhoto } from '../types';
import { X, Heart, Download, Trash2 } from 'lucide-react';
import { triggerAdClick } from '../data/ads';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: ModelPhoto[];
  onRemoveFavorite: (id: string) => void;
  onOpenLightbox: (photo: ModelPhoto) => void;
  onDownload: (photo: ModelPhoto) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onOpenLightbox,
  onDownload,
}) => {
  if (!isOpen) return null;

  const handleDownload = (photo: ModelPhoto) => {
    triggerAdClick();
    onDownload(photo);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h3 className="font-semibold text-white text-base">
              Saved Models Vault
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <Heart className="w-12 h-12 text-neutral-700 mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-neutral-300">
                No models saved yet
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Click the heart icon on any model card to bookmark it for quick access and 4K downloads.
              </p>
            </div>
          ) : (
            favorites.map((photo) => (
              <div
                key={photo.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 group hover:border-neutral-700 transition-colors"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.name}
                  className="w-16 h-20 object-cover rounded-lg shrink-0 cursor-pointer"
                  onClick={() => onOpenLightbox(photo)}
                  referrerPolicy="no-referrer"
                />

                <div className="min-w-0 flex-1">
                  <h4
                    onClick={() => onOpenLightbox(photo)}
                    className="font-bold text-white text-sm truncate cursor-pointer hover:text-amber-400"
                  >
                    {photo.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {photo.location}
                  </p>
                  <span className="text-[10px] text-amber-400 font-mono block mt-1">
                    {photo.resolution}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(photo)}
                    className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
                    title="Download 4K"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(photo.id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-900/40">
            <button
              onClick={() => {
                if (favorites.length > 0) handleDownload(favorites[0]);
              }}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download First Model (4K)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
