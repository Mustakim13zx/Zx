import React from 'react';
import { ModelCategory } from '../types';
import { Search, X } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ModelCategory;
  onSelectCategory: (cat: ModelCategory) => void;
  totalModelsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="relative overflow-hidden py-3 sm:py-5 border-b border-neutral-900 bg-gradient-to-b from-neutral-950 to-neutral-900/40">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Live Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 4K model videos, Miami, Malibu..."
              className="w-full pl-11 pr-11 py-2.5 sm:py-3 bg-neutral-900/90 border border-neutral-800 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl text-neutral-100 placeholder-neutral-500 text-xs sm:text-sm transition-all outline-none shadow-lg shadow-black/40"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 p-1 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
