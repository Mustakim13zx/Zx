import React, { useState, useEffect, useRef } from 'react';
import { ModelCategory, ModelPhoto } from '../types';
import {
  Lock,
  Upload,
  Video as VideoIcon,
  Film,
  Trash2,
  CheckCircle2,
  X,
  Plus,
  AlertCircle,
  RefreshCw,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AD_LINKS } from '../data/ads';
import { saveVideoFile, deleteVideoFile, clearAllVideoFiles } from '../utils/videoStorage';

const ADMIN_PASSWORD = '556677zx*Z';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPhotos: ModelPhoto[];
  onAddPhoto: (photo: ModelPhoto) => void;
  onDeletePhoto: (id: string) => void;
  onClearAllPhotos: () => void;
  onRestoreDefaults: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  allPhotos,
  onAddPhoto,
  onDeletePhoto,
  onClearAllPhotos,
  onRestoreDefaults,
}) => {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Video Upload Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ModelCategory>('glamour');
  const [location, setLocation] = useState('Miami Beach, Florida, USA');
  const [resolution, setResolution] = useState('4K UHD (60FPS HDR)');
  const [duration, setDuration] = useState('01:15');
  const [tagsInput, setTagsInput] = useState('American, 4K Video, Bikini, Glamour');
  
  // Video Source: Either local file or URL
  const [videoSourceType, setVideoSourceType] = useState<'file' | 'url'>('file');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoPosterUrl, setVideoPosterUrl] = useState<string>('');
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);

  // Status notice
  const [actionNotice, setActionNotice] = useState<string>('');
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'upload' | 'manage'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setPasswordInput('');
      setAuthError(false);
      setConfirmClearAll(false);
      setActionNotice('');
      setFormError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleCloseAndLock = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError(false);
    onClose();
  };

  // Handle Local Video File Selection
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setFormError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setFormError('');
    setSelectedVideoFile(file);
    setIsProcessingVideo(true);

    try {
      const objectUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(objectUrl);

      // Create a temporary video element to extract video duration & thumbnail snapshot
      const tempVideo = document.createElement('video');
      tempVideo.src = objectUrl;
      tempVideo.crossOrigin = 'anonymous';
      tempVideo.muted = true;
      tempVideo.currentTime = 1;

      tempVideo.onloadedmetadata = () => {
        const totalSecs = Math.floor(tempVideo.duration) || 60;
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const formattedDuration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        setDuration(formattedDuration);
      };

      tempVideo.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = tempVideo.videoWidth || 640;
          canvas.height = tempVideo.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const posterData = canvas.toDataURL('image/jpeg', 0.85);
            setVideoPosterUrl(posterData);
          }
        } catch {
          // If frame capture is restricted, fallback is gracefully handled
        }
        setIsProcessingVideo(false);
      };

      tempVideo.onerror = () => {
        setIsProcessingVideo(false);
      };
    } catch {
      setFormError('Failed to read video file.');
      setIsProcessingVideo(false);
    }
  };

  // Handle Direct Video URL
  const handleApplyVideoUrl = () => {
    if (!videoUrlInput.trim()) {
      setFormError('Please enter a valid video link.');
      return;
    }
    setFormError('');
    setSelectedVideoFile(null);
    setVideoPreviewUrl(videoUrlInput.trim());
  };

  // Submit Video Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Model name is required.');
      return;
    }

    const newId = `model-vid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let finalVideo = videoSourceType === 'file' ? videoPreviewUrl : videoUrlInput.trim();

    // Persist file into IndexedDB so it never dies when another video is uploaded
    if (videoSourceType === 'file' && selectedVideoFile) {
      try {
        finalVideo = await saveVideoFile(newId, selectedVideoFile);
      } catch (err) {
        console.warn('IndexedDB save fallback:', err);
      }
    }

    if (!finalVideo) {
      setFormError('Please upload a video file or enter a video URL.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const fallbackPoster =
      videoPosterUrl ||
      'https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=800';

    const newModelVideo: ModelPhoto = {
      id: newId,
      name: name.trim(),
      category,
      imageUrl: fallbackPoster,
      videoUrl: finalVideo,
      duration: duration.trim() || '01:00',
      aspectRatio: '3:4',
      resolution: resolution.trim() || '4K UHD (60FPS HDR)',
      location: location.trim() || 'United States',
      views: Math.floor(Math.random() * 8000) + 2000,
      downloads: Math.floor(Math.random() * 3000) + 800,
      likes: Math.floor(Math.random() * 1200) + 300,
      tags: tags.length > 0 ? tags : ['Model', '4K Video', 'American'],
    };

    onAddPhoto(newModelVideo);
    setUploadSuccess(true);
    setName('');
    setSelectedVideoFile(null);
    setVideoPreviewUrl('');
    setVideoPosterUrl('');
    setVideoUrlInput('');
    setFormError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const handleDeleteItem = (id: string, itemName: string) => {
    deleteVideoFile(id).catch(() => {});
    onDeletePhoto(id);
    setActionNotice(`Deleted "${itemName}" video from gallery.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleExecuteClearAll = () => {
    clearAllVideoFiles().catch(() => {});
    onClearAllPhotos();
    setConfirmClearAll(false);
    setActionNotice('All previous videos have been completely removed from gallery.');
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseAndLock();
      }}
    >
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>HOUZ Video Admin Portal</span>
                {isAuthenticated && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                    AUTHORIZED
                  </span>
                )}
              </h3>
            </div>
          </div>
          <button
            onClick={handleCloseAndLock}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close & Lock"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* PASSWORD INPUT GATE (Requires 556677zx*Z on every open) */
            <form onSubmit={handleLogin} className="max-w-md mx-auto py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white">Administrator Access</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Enter your secret security password to upload 4K model video clips or delete videos.
              </p>

              <div className="space-y-2 text-left pt-3">
                <label className="block text-xs font-semibold text-neutral-300">
                  Admin Password:
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl text-neutral-100 text-sm outline-none transition-all"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Incorrect password. Please try again.</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-neutral-950 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                Log In to Admin
              </button>
            </form>
          ) : (
            /* AUTHENTICATED DASHBOARD: VIDEO UPLOAD & MANAGEMENT */
            <div className="space-y-6">
              
              {/* Notification Banner */}
              {actionNotice && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center justify-between">
                  <span>{actionNotice}</span>
                  <button onClick={() => setActionNotice('')} className="text-neutral-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Navigation Tabs inside Admin */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminTab('upload')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      adminTab === 'upload'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white bg-neutral-900'
                    }`}
                  >
                    <VideoIcon className="w-3.5 h-3.5" />
                    <span>+ Upload Video Clip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('manage')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      adminTab === 'manage'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white bg-neutral-900'
                    }`}
                  >
                    <span>Manage & Delete Videos</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-200 text-[10px] font-mono">
                      {allPhotos.length}
                    </span>
                  </button>
                </div>

                <button
                  onClick={handleCloseAndLock}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Lock & Exit
                </button>
              </div>

              {/* TAB 1: UPLOAD VIDEO CLIP (REPLACES OLD PIC UPLOAD) */}
              {adminTab === 'upload' && (
                <form onSubmit={handleUploadSubmit} className="space-y-4 p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Film className="w-4 h-4 text-rose-400" />
                      <span>Upload New 4K Model Video Clip</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Instant Video Publish
                    </span>
                  </div>

                  {uploadSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Video published successfully! Visitors can now play it and trigger your ad links.</span>
                    </div>
                  )}

                  {formError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Video Source Switcher */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-400">Video Source:</span>
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('file')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        videoSourceType === 'file'
                          ? 'bg-rose-500 text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      📁 Upload File (MP4/WebM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('url')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        videoSourceType === 'url'
                          ? 'bg-rose-500 text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      🔗 Enter Video URL
                    </button>
                  </div>

                  {/* File Upload Box */}
                  {videoSourceType === 'file' ? (
                    <div className="space-y-2 text-xs">
                      <label className="w-full cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 hover:border-rose-400/60 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 transition-all text-center">
                        <VideoIcon className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
                        <span className="font-semibold text-white text-sm">Click to Select 4K Video from Device</span>
                        <span className="text-[11px] text-neutral-500 mt-1">Supports MP4, WebM, MOV video clips</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                          onChange={handleVideoFileChange}
                          className="hidden"
                        />
                      </label>
                      {isProcessingVideo && (
                        <p className="text-xs text-amber-400 flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating video frame preview and duration...</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-neutral-300">Direct Video Link (MP4 / WebM / Stream URL)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                          placeholder="https://example.com/video-clip.mp4"
                          className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-rose-400 rounded-xl text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleApplyVideoUrl}
                          className="px-4 py-2.5 bg-rose-500 text-white rounded-xl font-bold cursor-pointer"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Video Live Player Preview */}
                  {videoPreviewUrl && (
                    <div className="p-3 bg-neutral-900/90 border border-rose-500/40 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-rose-400 flex items-center gap-1">
                          <Play className="w-3 h-3 fill-rose-400" />
                          <span>Live Video Preview</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreviewUrl('');
                            setVideoPosterUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-neutral-400 hover:text-red-400 text-xs cursor-pointer"
                        >
                          Remove Video ✕
                        </button>
                      </div>

                      <div className="w-full max-h-48 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="max-h-48 w-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Metadata Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Model Name */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">Model Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alexis Vance"
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-rose-400 rounded-xl text-white outline-none"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ModelCategory)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-rose-400 rounded-xl text-white outline-none cursor-pointer"
                      >
                        <option value="glamour">Poolside & Glamour</option>
                        <option value="beach">Beach & Bikini</option>
                        <option value="editorial">Vogue Editorial</option>
                        <option value="streetwear">NYC Streetwear</option>
                        <option value="lifestyle">Lifestyle</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Malibu Beach, California, USA"
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-rose-400 rounded-xl text-white outline-none"
                      />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">Video Duration (MM:SS)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="e.g. 01:25"
                          className="w-full px-3.5 py-2.5 pl-8 bg-neutral-900 border border-neutral-800 focus:border-rose-400 rounded-xl text-white outline-none font-mono"
                        />
                        <Clock className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* Resolution */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">Video Quality</label>
                      <input
                        type="text"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="4K UHD (60FPS HDR)"
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-rose-400 rounded-xl text-white outline-none font-mono"
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. Bikini, 4K Clip, Hot, Miami"
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-rose-400 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-neutral-950 shadow-lg shadow-rose-500/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-neutral-950" />
                    <span>Publish 4K Video Clip to Live Gallery</span>
                  </button>
                </form>
              )}

              {/* TAB 2: MANAGE & DELETE EXISTING VIDEOS */}
              {adminTab === 'manage' && (
                <div className="space-y-4 p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                        <span>All Gallery 4K Video Clips ({allPhotos.length})</span>
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Click "Delete" on any video to remove it immediately from the live gallery.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!confirmClearAll ? (
                        <button
                          type="button"
                          onClick={() => setConfirmClearAll(true)}
                          disabled={allPhotos.length === 0}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete All Videos</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500 p-1 rounded-lg">
                          <span className="text-[11px] text-rose-200 px-1 font-semibold">Delete all?</span>
                          <button
                            type="button"
                            onClick={handleExecuteClearAll}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded cursor-pointer"
                          >
                            YES, Delete All
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearAll(false)}
                            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onRestoreDefaults();
                          setActionNotice('100 Default 4K video clips restored to gallery.');
                          setTimeout(() => setActionNotice(''), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Restore initial 100 video clips"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restore 100 Defaults</span>
                      </button>
                    </div>
                  </div>

                  {allPhotos.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500">
                      <Film className="w-10 h-10 mx-auto mb-2 opacity-50 text-neutral-600" />
                      <p className="text-sm font-semibold text-neutral-300">All videos have been deleted.</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Use the "+ Upload Video Clip" tab to upload your MP4 videos.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                      {allPhotos.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[10px] font-mono text-neutral-500 w-4 text-center">
                              {index + 1}
                            </span>
                            <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 border border-neutral-800 bg-neutral-950">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Play className="w-3.5 h-3.5 fill-white text-white" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white block truncate">{item.name}</span>
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-mono text-[9px] font-bold">
                                  {item.duration || '01:00'}
                                </span>
                              </div>
                              <span className="text-neutral-400 text-[11px] block truncate">{item.location}</span>
                              <span className="text-amber-400 font-mono text-[10px] uppercase font-semibold">
                                {item.category} · {item.resolution}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-rose-600 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
                              title="Delete video"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Connected Ad Link Verification */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-1">
                <span className="font-semibold text-neutral-300 block">Connected Monetization Ad Links:</span>
                <div className="text-[11px] font-mono text-neutral-400 space-y-1 break-all">
                  <div className="flex items-center gap-1.5 text-amber-400/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Link 1: {AD_LINKS.primary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Link 2: {AD_LINKS.secondary}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
