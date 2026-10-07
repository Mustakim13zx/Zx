import React, { useState, useMemo, useEffect } from 'react';
import { ModelCategory, ModelPhoto } from './types';
import { AMERICAN_MODELS } from './data/photos';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PhotoCard } from './components/PhotoCard';
import { PhotoModal } from './components/PhotoModal';
import { DownloadModal } from './components/DownloadModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { SponsoredBanner } from './components/SponsoredBanner';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import {
  Sparkles,
  LayoutGrid,
  SearchX,
  Zap,
  Flame,
  Sun,
  Camera,
  Shirt,
  Lock,
  Plus,
} from 'lucide-react';
import { triggerAdClick } from './data/ads';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'downloads' | 'views'>('popular');

  // Admin Modal State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Gallery Videos (Initialized with all 100 American models with 4K video clips)
  const [photos, setPhotos] = useState<ModelPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('houz_gallery_videos_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading saved gallery videos:', e);
    }
    return AMERICAN_MODELS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('houz_gallery_videos_v1', JSON.stringify(photos));
    } catch (e) {
      console.warn('Could not save videos to localStorage', e);
    }
  }, [photos]);

  // Admin actions: Add, Delete, Clear All, Restore
  const handleAddPhoto = (newPhoto: ModelPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setFavoriteIds((prev) => prev.filter((fid) => fid !== id));
  };

  const handleClearAllPhotos = () => {
    setPhotos([]);
    setFavoriteIds([]);
  };

  const handleRestoreDefaults = () => {
    setPhotos(AMERICAN_MODELS);
  };

  // Modals & Drawers
  const [activePhotoModal, setActivePhotoModal] = useState<ModelPhoto | null>(null);
  const [activeDownloadModal, setActiveDownloadModal] = useState<ModelPhoto | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('houz_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('houz_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered & Sorted Photos (ALL 100 PHOTOS DISPLAYED DIRECTLY)
  const filteredPhotos = useMemo(() => {
    return photos.filter((model) => {
      // Category filter
      if (selectedCategory !== 'all' && model.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = model.name.toLowerCase().includes(q);
        const matchesLoc = model.location.toLowerCase().includes(q);
        const matchesTag = model.tags.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesLoc || matchesTag;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.likes - a.likes;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'views') return b.views - a.views;
      return 0;
    });
  }, [photos, selectedCategory, searchQuery, sortBy]);

  const favoritesList = useMemo(() => {
    return photos.filter((model) => favoriteIds.includes(model.id));
  }, [photos, favoriteIds]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* 1. Header Navigation */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        totalModelsCount={photos.length}
      />

      {/* 3. Main Gallery Container */}
      <main className="flex-1 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full pt-3 sm:pt-5">
        
        {/* Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
          
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All 100 Hot Models</span>
            </button>

            <button
              onClick={() => setSelectedCategory('beach')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'beach'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Beach & Bikini Hot</span>
            </button>

            <button
              onClick={() => setSelectedCategory('glamour')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'glamour'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-300" />
              <span>Poolside & Glamour</span>
            </button>

            <button
              onClick={() => setSelectedCategory('editorial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'editorial'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-cyan-300" />
              <span>Vogue Editorial</span>
            </button>

            <button
              onClick={() => setSelectedCategory('streetwear')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'streetwear'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-emerald-300" />
              <span>NYC Streetwear</span>
            </button>
          </div>

          {/* Sort Filter & Quick Admin Trigger */}
          <div className="flex items-center gap-3 text-xs text-neutral-400 self-end md:self-auto">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-rose-400 hover:text-rose-300 font-semibold border border-neutral-800 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Manage</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 py-1.5 px-3 rounded-lg text-xs outline-none focus:border-rose-400 cursor-pointer"
              >
                <option value="popular">Most Liked</option>
                <option value="downloads">Most Downloaded</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

        </div>

        {/* Gallery Info Bar: Explaining All 100 Photos Live */}
        <div className="flex items-center justify-between py-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>
              Showing all <strong className="text-white font-bold tabular-nums">{filteredPhotos.length}</strong> of{' '}
              <strong className="text-white font-bold tabular-nums">{photos.length}</strong> American Model Portfolios
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-400 font-medium">Click any photo to open sponsor mirror & unlock 4K download</span>
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-rose-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Photography Grid: Strictly 3 items per row on all screen sizes */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 lg:gap-8 auto-rows-max">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavorite={favoriteIds.includes(photo.id)}
                onToggleFavorite={toggleFavorite}
                onOpenLightbox={(item) => setActivePhotoModal(item)}
                onDownload={(item) => setActiveDownloadModal(item)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20 my-8">
            <SearchX className="w-12 h-12 text-neutral-600 mb-3" />
            <h3 className="text-base font-semibold text-neutral-200">
              No photographs in gallery
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-4">
              All previous photos were deleted, or no matches found. Use the Admin panel to upload new photos or restore defaults.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Open Admin to Upload</span>
              </button>
              <button
                onClick={handleRestoreDefaults}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
              >
                Restore 100 Hot Models
              </button>
            </div>
          </div>
        )}

        {/* Sponsored Banner linking to user ad URLs */}
        <SponsoredBanner />

      </main>

      {/* 4. Footer */}
      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

      {/* 5. Lightbox Modal */}
      {activePhotoModal && (
        <PhotoModal
          photo={activePhotoModal}
          isFavorite={favoriteIds.includes(activePhotoModal.id)}
          onToggleFavorite={toggleFavorite}
          onDownload={(item) => {
            setActivePhotoModal(null);
            setActiveDownloadModal(item);
          }}
          onClose={() => setActivePhotoModal(null)}
        />
      )}

      {/* 6. Download Modal with Sponsor Mirror */}
      {activeDownloadModal && (
        <DownloadModal
          photo={activeDownloadModal}
          onClose={() => setActiveDownloadModal(null)}
        />
      )}

      {/* 7. Favorites Slide-Over Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoritesList}
        onRemoveFavorite={toggleFavorite}
        onOpenLightbox={(item) => {
          setIsFavoritesOpen(false);
          setActivePhotoModal(item);
        }}
        onDownload={(item) => {
          setIsFavoritesOpen(false);
          setActiveDownloadModal(item);
        }}
      />

      {/* 8. Admin Control Portal (Demands password 556677zx*Z on every open) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        allPhotos={photos}
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
        onClearAllPhotos={handleClearAllPhotos}
        onRestoreDefaults={handleRestoreDefaults}
      />

    </div>
  );
}
