import React from 'react';
import { AD_LINKS, triggerAdClick } from '../data/ads';
import { Zap, ExternalLink, ShieldCheck } from 'lucide-react';

export const SponsoredBanner: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 font-mono">
                  SPONSORED SPEED NETWORK
                </span>
                <span className="text-neutral-600">·</span>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified Direct Pipeline
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Ultra High-Bandwidth Cloud Mirrors for Instant 4K Wallpapers
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 font-light">
                Click any server node to initiate high-speed uncompressed photo transfer with zero queues.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
            <a
              href={AD_LINKS.primary}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-md shadow-amber-500/15"
            >
              <span>VIP Speed-Server #1</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={AD_LINKS.secondary}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 hover:text-white text-neutral-300 transition-colors"
            >
              <span>Mirror Node #2</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
