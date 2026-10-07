import React, { useState, useEffect } from 'react';
import { ModelPhoto } from '../types';
import { AD_LINKS, triggerAdClick } from '../data/ads';
import {
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

interface DownloadModalProps {
  photo: ModelPhoto | null;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  const [selectedResolution, setSelectedResolution] = useState<'4k' | '2k' | 'raw'>('4k');
  const [countdown, setCountdown] = useState<number>(5);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [clickedSponsor, setClickedSponsor] = useState<boolean>(false);

  useEffect(() => {
    setCountdown(5);
    setIsUnlocked(false);
    setClickedSponsor(false);
    setIsDownloading(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsUnlocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [photo]);

  const triggerActualDownload = async () => {
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = photo.imageUrl;
      const cleanName = photo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      link.download = `HOUZ-${cleanName}-${selectedResolution.toUpperCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      window.open(photo.imageUrl, '_blank');
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1200);
    }
  };

  const handleSponsorClick = (url: string) => {
    setClickedSponsor(true);
    setIsUnlocked(true);
    setCountdown(0);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      triggerActualDownload();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-white text-base sm:text-lg">
              Ultra-HD Download Gate
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Selected photo card summary */}
          <div className="flex items-center gap-4 p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl">
            <img
              src={photo.imageUrl}
              alt={photo.name}
              className="w-16 h-20 object-cover rounded-lg shrink-0 border border-neutral-800"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-white text-base truncate">
                {photo.name}
              </h4>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                {photo.location}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-400/90 mt-1 font-mono">
                <span>{photo.resolution}</span>
                <span>·</span>
                <span>Original Master</span>
              </div>
            </div>
          </div>

          {/* Resolution Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Select Download Resolution:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedResolution('4k')}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                  selectedResolution === '4k'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span className="font-bold text-white">4K UHD Master</span>
                <span className="text-[10px] text-amber-400 font-mono mt-0.5">3840 × 5120</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedResolution('2k')}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                  selectedResolution === '2k'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span className="font-bold text-white">2K Retina</span>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">1920 × 2560</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedResolution('raw')}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                  selectedResolution === 'raw'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span className="font-bold text-white">RAW Asset</span>
                <span className="text-[10px] text-emerald-400 font-mono mt-0.5">100% Quality</span>
              </button>
            </div>
          </div>

          {/* SPONSOR CPM SECTION */}
          <div className="p-4 bg-gradient-to-b from-amber-500/5 to-neutral-950 border border-amber-500/30 rounded-xl space-y-3">
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-neutral-200 font-semibold">
                  Sponsor Mirror Access
                </span>
              </div>
              {!isUnlocked ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Unlocking in {countdown}s</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready to Download</span>
                </div>
              )}
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-400 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${isUnlocked ? 100 : ((5 - countdown) / 5) * 100}%` }}
              />
            </div>

            <p className="text-[12px] text-neutral-400 leading-relaxed">
              Click any sponsor server below to instantly unlock maximum high-bandwidth downloading:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSponsorClick(AD_LINKS.primary)}
                className="group relative flex flex-col p-3 rounded-lg border border-amber-500/40 bg-neutral-900/90 hover:bg-neutral-850 hover:border-amber-400 transition-all text-left shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Speed-Server #1
                  </span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-amber-400" />
                </div>
                <span className="text-[11px] text-neutral-300">
                  Instant High-Speed Direct Access Link
                </span>
                <span className="mt-2 text-[10px] font-bold text-emerald-400">
                  ⚡ Click to Unlock & Download
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSponsorClick(AD_LINKS.secondary)}
                className="group relative flex flex-col p-3 rounded-lg border border-amber-500/40 bg-neutral-900/90 hover:bg-neutral-850 hover:border-amber-400 transition-all text-left shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-rose-400" />
                    Cloud Mirror #2
                  </span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-rose-400" />
                </div>
                <span className="text-[11px] text-neutral-300">
                  High-Bandwidth Mirror Server Gateway
                </span>
                <span className="mt-2 text-[10px] font-bold text-emerald-400">
                  ⚡ Click to Unlock & Download
                </span>
              </button>
            </div>

            {clickedSponsor && (
              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  Sponsor server accessed! 4K wallpaper transfer started.
                </span>
              </div>
            )}
          </div>

          {/* Direct Download Button */}
          <button
            onClick={triggerActualDownload}
            disabled={!isUnlocked || isDownloading}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isUnlocked
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {isDownloading ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-neutral-950" />
                <span>Downloading 4K Wallpaper...</span>
              </>
            ) : isUnlocked ? (
              <>
                <Download className="w-4 h-4 text-neutral-950" />
                <span>Download Now ({selectedResolution.toUpperCase()} · Free)</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-neutral-500 animate-spin" />
                <span>Preparing High-Speed Server ({countdown}s)...</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-800/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Virus-Free & Safe</span>
            </span>
            <span>Personal Wallpaper License</span>
          </div>

        </div>
      </div>
    </div>
  );
};
