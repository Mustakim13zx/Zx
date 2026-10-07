import React from 'react';
import { ModelCategory } from '../types';
import { AD_LINKS, triggerAdClick } from '../data/ads';
import { ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: ModelCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 text-neutral-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-display text-2xl font-black tracking-tight text-white">
              HOUZ
            </span>
            <p className="text-neutral-400 max-w-md leading-relaxed font-light">
              Curated archive of premier American fashion models, editorial portraits, and high-resolution 4K wallpapers from New York, Beverly Hills, Miami, and Malibu.
            </p>
            <div className="flex items-center gap-2 text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>High-Bandwidth CDN Nodes · 100% Virus-Free Verification</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-white mb-3 tracking-wide">
              Portfolio Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('glamour');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Glamour & Beverly Hills
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('beach');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Malibu & Miami Beach
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('editorial');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Vogue Studio Editorial
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('streetwear');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Manhattan Street Chic
                </button>
              </li>
            </ul>
          </div>

          {/* Partner & Sponsor Nodes */}
          <div>
            <h4 className="font-bold text-white mb-3 tracking-wide">
              Fast-Track Network
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={AD_LINKS.primary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber-400/90 hover:text-amber-300 transition-colors font-medium"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Speed Mirror Server #1</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={AD_LINKS.secondary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-rose-400/90 hover:text-rose-300 transition-colors font-medium"
                >
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cloud Node Pipeline #2</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2 text-[11px] text-neutral-500">
                Direct CDN mirrors with high-speed download gates.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500">
          <p>© {new Date().getFullYear()} HOUZ American Model Archive. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>4K UHD Master Vault</span>
            <span aria-hidden="true">·</span>
            <span>Ultra-HD Wallpapers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
