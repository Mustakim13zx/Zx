import React, { useEffect, useState, useRef } from 'react';
import { ModelPhoto } from '../types';
import {
  X,
  Download,
  Heart,
  Share2,
  MapPin,
  ExternalLink,
  Zap,
  Check,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { triggerAdClick } from '../data/ads';
import { getVideoUrl } from '../utils/videoStorage';

interface PhotoModalProps {
  photo: ModelPhoto | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDownload: (photo: ModelPhoto) => void;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  isFavorite,
  onToggleFavorite,
  onDownload,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [effectiveVideoUrl, setEffectiveVideoUrl] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Resolve persistent video URL from IndexedDB or remote URL
  useEffect(() => {
    let isMounted = true;
    if (!photo) return;

    if (photo.videoUrl && !photo.videoUrl.startsWith('blob:')) {
      setEffectiveVideoUrl(photo.videoUrl);
    } else {
      getVideoUrl(photo.id).then((storedUrl) => {
        if (isMounted) {
          if (storedUrl) {
            setEffectiveVideoUrl(storedUrl);
          } else {
            setEffectiveVideoUrl(photo.videoUrl || '');
          }
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [photo]);

  // CRITICAL FIX: Ensure video ALWAYS plays when opened large!
  useEffect(() => {
    if (videoRef.current && effectiveVideoUrl) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser autoplay restrictions: try muted autoplay so it ALWAYS starts playing!
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
  }, [effectiveVideoUrl, photo?.id]);

  if (!photo) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: photo.name,
        text: `Check out ${photo.name} - American Model 4K Video`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadClick = () => {
    triggerAdClick();
    onDownload({
      ...photo,
      videoUrl: effectiveVideoUrl || photo.videoUrl,
    });
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto animate-in fade-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors backdrop-blur-md cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Frame (Left) - Guaranteed to Play Fullscreen */}
        <div className="md:w-1/2 bg-neutral-950 flex items-center justify-center p-3 sm:p-6 relative select-none">
          <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
            {effectiveVideoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  key={`${photo.id}-${effectiveVideoUrl}`}
                  ref={videoRef}
                  src={effectiveVideoUrl}
                  poster={photo.imageUrl}
                  controls
                  autoPlay
                  playsInline
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />

                {/* Sound Quick Toggle Button */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-rose-600 text-white backdrop-blur-md transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
                </button>
              </div>
            ) : (
              <img
                src={photo.imageUrl}
                alt={photo.name}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>

        {/* Details Pane (Right) */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-800 bg-neutral-900/40">
          
          <div className="space-y-5">
            {/* Category & Location */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
              <span className="uppercase tracking-wider text-rose-400 font-bold">
                {photo.category}
              </span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span className="flex items-center gap-1 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{photo.location}</span>
              </span>
            </div>

            {/* Model Name & Bio */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display leading-tight">
                  {photo.name}
                </h2>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">
                  {photo.duration || '01:15'}
                </span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed font-light">
                Exclusive American fashion 4K video clip filmed in high-frame-rate HDR. Available for instant streaming and ultra-HD download.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-neutral-800/80 text-xs">
              <div>
                <span className="text-neutral-500 block">Video Format</span>
                <span className="text-neutral-200 font-mono font-medium">{photo.resolution}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Clip Duration</span>
                <span className="text-neutral-200 font-mono font-medium">{photo.duration || '01:15'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Total Plays</span>
                <span className="text-neutral-200 font-mono font-medium tabular-nums">
                  {photo.views.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Downloads</span>
                <span className="text-neutral-200 font-mono font-medium tabular-nums">
                  {photo.downloads.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sponsor Instant Access Banner */}
            <div
              onClick={() => triggerAdClick()}
              className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between cursor-pointer hover:bg-rose-500/15 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-rose-400" />
                <div>
                  <span className="text-xs font-bold text-rose-300 block">
                    Fast-Track 4K Video Node
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Click to unlock high-speed direct download pipeline
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <span className="text-xs text-neutral-500 font-medium">Keywords:</span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                {photo.tags.map((tag, idx) => (
                  <span key={idx}>
                    #{tag}
                    {idx < photo.tags.length - 1 && <span className="text-neutral-700 ml-2">·</span>}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-3">
            <button
              onClick={handleDownloadClick}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-neutral-950 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-neutral-950" />
              <span>Download 4K Video Clip (Free)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(photo.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isFavorite
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorite ? 'Saved in Vault' : 'Save to Favorites'}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-4 rounded-xl border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Share link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
