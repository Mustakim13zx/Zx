import React from 'react';
import { ModelCategory } from '../types';
import { Heart, Lock, ExternalLink } from 'lucide-react';
import { triggerAdClick } from '../data/ads';

interface NavbarProps {
  selectedCategory: ModelCategory;
  onSelectCategory: (cat: ModelCategory) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  favoritesCount,
  onOpenFavorites,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2"
          >
            <span className="font-display text-2xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
              HOUZ
            </span>
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors hover:text-white ${
              selectedCategory === 'all'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1'
                : 'text-neutral-400'
            }`}
          >
            All Models
          </button>
          <button
            onClick={() => onSelectCategory('glamour')}
            className={`transition-colors hover:text-white ${
              selectedCategory === 'glamour'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1'
                : 'text-neutral-400'
            }`}
          >
            Glamour & Luxury
          </button>
          <button
            onClick={() => onSelectCategory('beach')}
            className={`transition-colors hover:text-white ${
              selectedCategory === 'beach'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1'
                : 'text-neutral-400'
            }`}
          >
            Beach & Sunset
          </button>
          <button
            onClick={() => onSelectCategory('editorial')}
            className={`transition-colors hover:text-white ${
              selectedCategory === 'editorial'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1'
                : 'text-neutral-400'
            }`}
          >
            Editorial & Vogue
          </button>
          <button
            onClick={() => onSelectCategory('streetwear')}
            className={`transition-colors hover:text-white ${
              selectedCategory === 'streetwear'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1'
                : 'text-neutral-400'
            }`}
          >
            New York Streetwear
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Admin Panel Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Admin Login & Photo Upload"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Quick Sponsor Server Access */}
          <button
            onClick={() => triggerAdClick()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg shadow-sm transition-all"
            title="Access High-Speed Server"
          >
            <span>VIP Mirror</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-neutral-700 transition-colors"
            title="Saved Wallpapers"
          >
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-neutral-950 bg-amber-400 rounded-full tabular-nums">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
