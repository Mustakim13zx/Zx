import React, { useState, useEffect, useRef } from 'react';
import { ModelPhoto } from '../types';
import { Download, Heart, MapPin, Play } from 'lucide-react';
import { triggerAdClick } from '../data/ads';
import { getVideoUrl } from '../utils/videoStorage';

interface PhotoCardProps {
  photo: ModelPhoto;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenLightbox: (photo: ModelPhoto) => void;
  onDownload: (photo: ModelPhoto) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  isFavorite,
  onToggleFavorite,
  onOpenLightbox,
  onDownload,
}) => {
  const [imageError, setImageError] = useState(false);
  const [effectiveVideoUrl, setEffectiveVideoUrl] = useState<string>(photo.videoUrl || '');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restore persistent video URL from IndexedDB if uploaded locally
  useEffect(() => {
    let isMounted = true;
    if (photo.videoUrl && !photo.videoUrl.startsWith('blob:')) {
      setEffectiveVideoUrl(photo.videoUrl);
    } else {
      getVideoUrl(photo.id).then((url) => {
        if (isMounted) {
          if (url) {
            setEffectiveVideoUrl(url);
          } else if (photo.videoUrl) {
            setEffectiveVideoUrl(photo.videoUrl);
          }
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [photo.id, photo.videoUrl]);

  // Ensure card video plays continuously in loop on screen
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [effectiveVideoUrl]);

  // When clicking on the photo / play button: opens the sponsor ad link AND opens the photo viewer
  const handlePhotoClick = () => {
    // Open the advertisement in a new tab
    triggerAdClick();
    // Open the lightbox viewer with effective video URL
    onOpenLightbox({
      ...photo,
      videoUrl: effectiveVideoUrl || photo.videoUrl,
    });
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open the advertisement in a new tab
    triggerAdClick();
    // Open the download modal
    onDownload({
      ...photo,
      videoUrl: effectiveVideoUrl || photo.videoUrl,
    });
  };

  return (
    <div className="group relative bg-neutral-900/60 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-rose-500/60 transition-all duration-300 flex flex-col shadow-xl shadow-black/40">
      
      {/* Visual Video Slot: PLAYS CONTINUOUSLY ON SCREEN FOR THE USER */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-950 cursor-pointer select-none"
        onClick={handlePhotoClick}
      >
        {effectiveVideoUrl ? (
          <video
            ref={videoRef}
            src={effectiveVideoUrl}
            poster={photo.imageUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => {
              // If video fails, try loading poster image
              setImageError(true);
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : !imageError ? (
          <img
            src={photo.imageUrl}
            alt={photo.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-400">
            <Play className="w-8 h-8 text-rose-500 mb-1 opacity-70" />
            <span className="text-[11px] font-medium text-neutral-300">{photo.name}</span>
          </div>
        )}

        {/* Video Player Style Overlay: Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative group/play flex items-center justify-center">
            {/* Subtle animated pulsating ring */}
            <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-rose-500/25 animate-ping opacity-60 pointer-events-none" />
            
            {/* Main Play Icon Circle */}
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/60 backdrop-blur-md border-2 border-white/90 group-hover:border-rose-400 group-hover:bg-rose-600/80 shadow-2xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110">
              <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-white translate-x-0.5 text-white transition-transform duration-200" />
            </div>
          </div>
        </div>

        {/* Gradient Scrim for video aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 group-hover:from-black/90 transition-all duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-neutral-950/85 backdrop-blur-md border border-rose-500/40 text-[9px] sm:text-[11px] font-mono text-rose-400 font-semibold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>4K VIDEO</span>
            {photo.duration && (
              <span className="text-neutral-200 font-bold ml-0.5 hidden xs:inline">{photo.duration}</span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(photo.id);
            }}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                : 'bg-neutral-950/70 text-neutral-300 hover:text-white border border-neutral-800/80 hover:bg-neutral-900'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Save Model'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Floating Bottom Hover Bar */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-20 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 text-white text-[10px] sm:text-xs font-semibold group-hover:border-rose-500/60 transition-colors truncate">
            <Play className="w-3 h-3 fill-rose-400 text-rose-400 shrink-0" />
            <span className="truncate">Play 4K</span>
          </div>

          <button
            type="button"
            onClick={handleDownloadClick}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-neutral-950 text-[10px] sm:text-xs font-bold shadow-md active:scale-95 transition-all shrink-0"
            title="Download in 4K"
          >
            <Download className="w-3 h-3 text-neutral-950" />
            <span>4K DL</span>
          </button>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400 mb-1">
            <span className="capitalize font-semibold text-rose-400 truncate">{photo.category}</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span className="truncate flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-neutral-500 inline shrink-0" />
              <span className="truncate">{photo.location.split(',')[0]}</span>
            </span>
          </div>

          <h3
            onClick={handlePhotoClick}
            className="font-bold text-white text-xs sm:text-base hover:text-rose-400 transition-colors cursor-pointer line-clamp-1 flex items-center justify-between"
          >
            <span className="truncate">{photo.name}</span>
            <span className="text-[10px] font-mono text-neutral-500 font-normal hidden sm:inline">USA</span>
          </h3>
        </div>

        {/* Bottom Metrics Footer */}
        <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-neutral-800/80 flex items-center justify-between text-[9px] sm:text-[11px] text-neutral-500 font-mono">
          <span className="text-neutral-400 truncate">{photo.resolution.split(' ')[0]}</span>
          <span className="tabular-nums text-neutral-400 font-medium flex items-center gap-1">
            <Download className="w-2.5 h-2.5 text-rose-400" />
            <span>{photo.downloads.toLocaleString()}</span>
          </span>
        </div>
      </div>

    </div>
  );
};
