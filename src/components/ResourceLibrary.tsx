import React, { useState } from 'react';
import { RESOURCES } from '../data';
import { Resource, UserProgress } from '../types';
import { Search, Download, Bookmark, BookmarkCheck, FileText, Video, Eye, Check } from 'lucide-react';

interface ResourceLibraryProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export default function ResourceLibrary({ progress, onUpdateProgress }: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const resourceTypes = ['All', 'Guide', 'Cheat Sheet', 'Video', 'Template'];

  const filteredResources = RESOURCES.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeType === 'All' || res.type === activeType;
    return matchesSearch && matchesType;
  });

  const handleBookmark = (resId: string) => {
    const isBookmarked = progress.savedResources.includes(resId);
    let updatedSaved = [...progress.savedResources];

    if (isBookmarked) {
      updatedSaved = updatedSaved.filter(id => id !== resId);
      onUpdateProgress({ savedResources: updatedSaved });
    } else {
      updatedSaved.push(resId);
      // Award 10 XP for bookmarking resources
      onUpdateProgress({
        savedResources: updatedSaved,
        xp: progress.xp + 10,
        level: Math.floor((progress.xp + 10) / 300) + 1
      });
    }
  };

  const handleDownloadSimulate = (resId: string) => {
    setDownloadingId(resId);
    setTimeout(() => {
      setDownloadingId(null);
      alert('Resource downloaded successfully to local storage! Check your downloads.');
    }, 1500);
  };

  return (
    <div id="resource-library-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">Curated Resource Library</h1>
          <p className="text-sm text-white/60 font-sans mt-1">
            Access blueprints, cheatsheets, configuration templates, and video lessons on-demand.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-primary transition-colors font-sans"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {resourceTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4.5 py-2 rounded-xl text-xs font-semibold tracking-wider font-display transition-all cursor-pointer ${
              activeType === type
                ? 'bg-brand-primary/20 border border-brand-primary/30 text-brand-secondary shadow-[0_0_15px_rgba(123,47,247,0.15)]'
                : 'bg-white/5 text-white/60 border border-white/5 hover:border-white/15'
            }`}
          >
            {type}s
          </button>
        ))}
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((res) => {
          const isSaved = progress.savedResources.includes(res.id);
          const isDownloading = downloadingId === res.id;

          return (
            <div
              key={res.id}
              className="bg-white/[0.03] rounded-3xl border border-white/10 p-6 shadow-2xl hover:border-brand-primary/40 hover:shadow-[0_20px_40px_rgba(123,47,247,0.12)] hover:scale-[1.01] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                    res.type === 'Cheat Sheet' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' :
                    res.type === 'Guide' ? 'bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]' :
                    res.type === 'Video' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' :
                    'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}>
                    {res.type === 'Video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    <span>{res.type}</span>
                  </span>
                  
                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleBookmark(res.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-brand-secondary transition-all cursor-pointer"
                    title={isSaved ? "Remove Bookmark" : "Bookmark Resource"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4.5 h-4.5 text-brand-secondary fill-current" />
                    ) : (
                      <Bookmark className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>

                <h3 className="font-display font-bold text-base text-white leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-white/45 font-mono mt-1">
                  {res.category} • {res.readingTime}
                </p>
                
                <p className="text-xs text-white/60 font-sans mt-3 leading-relaxed">
                  {res.description}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between gap-4">
                {res.type === 'Video' ? (
                  <a
                    href="#video-watch"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Simulated player launching! Let\'s prepare your full video view stream.');
                    }}
                    className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-display font-bold text-xs text-center transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-secondary animate-pulse" />
                    <span>Watch Lecture</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleDownloadSimulate(res.id)}
                    disabled={isDownloading}
                    className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-display font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {isDownloading ? (
                      <>
                        <Check className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-brand-secondary" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
