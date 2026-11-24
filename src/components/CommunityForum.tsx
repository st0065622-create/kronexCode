import React, { useState } from 'react';
import { FORUM_POSTS } from '../data';
import { ForumPost, ForumComment, UserProgress } from '../types';
import { 
  MessageSquare, Heart, Pin, Plus, Search, ArrowLeft, Send, 
  User, ShieldCheck, HelpCircle, Flame, Award, Terminal 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityForumProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export default function CommunityForum({ progress, onUpdateProgress }: CommunityForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Create Post Form States
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'General' | 'Python' | 'Prompt Engineering' | 'UI/UX Design' | 'Job Hunt' | 'Showcase'>('General');

  // Comment reply state
  const [commentContent, setCommentContent] = useState('');

  const categories = ['All', 'General', 'Python', 'Prompt Engineering', 'UI/UX Design', 'Job Hunt', 'Showcase'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedPost = posts.find(p => p.id === selectedPostId);

  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked,
          likes: hasLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `custom-post-${Date.now()}`,
      author: 'Kronex Explorer (You)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      title: newTitle,
      content: newContent,
      category: newCategory,
      likes: 1,
      hasLiked: true,
      createdAt: 'Just now',
      replies: []
    };

    setPosts([newPost, ...posts]);
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');

    // Award XP for posting on forum
    onUpdateProgress({
      xp: progress.xp + 25,
      level: Math.floor((progress.xp + 25) / 300) + 1
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !selectedPostId) return;

    const newComment: ForumComment = {
      id: `comment-${Date.now()}`,
      author: 'Kronex Explorer (You)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      content: commentContent,
      createdAt: 'Just now',
      likes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPostId) {
        return {
          ...p,
          replies: [...p.replies, newComment]
        };
      }
      return p;
    }));

    setCommentContent('');

    // Award XP for contributing to discussion
    onUpdateProgress({
      xp: progress.xp + 15,
      level: Math.floor((progress.xp + 15) / 300) + 1
    });
  };

  return (
    <div id="community-discussion-panel" className="max-w-5xl mx-auto px-4 py-10 text-white">
      
      {/* HEADER ROW */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white flex items-center space-x-2">
            <Flame className="text-brand-secondary w-8 h-8 animate-pulse" />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Community Discussion Forums</span>
          </h1>
          <p className="text-sm text-white/60 font-sans mt-1">
            Connect with other modern explorers, ask questions, exchange code hacks, and collaborate.
          </p>
        </div>

        {!selectedPostId && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 rounded-xl font-display font-bold text-xs shining-btn text-white transition-all shadow-xl shadow-brand-primary/20 flex items-center space-x-1.5 self-start cursor-pointer border border-white/10"
          >
            <Plus className="w-4 h-4" />
            <span>Create Topic (+25 XP)</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEWING SINGLE POST THREAD */}
        {selectedPostId && selectedPost ? (
          <motion.div
            key="thread"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedPostId(null)}
              className="flex items-center space-x-1.5 text-xs font-bold text-brand-secondary hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all discussions</span>
            </button>

            {/* Root Post Card */}
            <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <img src={selectedPost.avatar} alt={selectedPost.author} className="w-10 h-10 rounded-full border border-white/10" />
                <div>
                  <span className="block text-sm font-bold text-white">{selectedPost.author}</span>
                  <span className="block text-[10px] font-mono text-white/45">{selectedPost.createdAt} • Category: {selectedPost.category}</span>
                </div>
              </div>

              <h2 className="font-display font-black text-xl text-white mb-4">
                {selectedPost.title}
              </h2>

              <p className="text-sm text-white/70 font-sans leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center space-x-6 text-xs font-semibold text-white/55">
                <button 
                  onClick={() => handleLikePost(selectedPost.id)}
                  className={`flex items-center space-x-1.5 hover:text-brand-secondary transition-colors cursor-pointer ${selectedPost.hasLiked ? 'text-brand-secondary' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${selectedPost.hasLiked ? 'fill-current text-brand-secondary' : ''}`} />
                  <span>{selectedPost.likes} Likes</span>
                </button>
                <div className="flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{selectedPost.replies.length} replies</span>
                </div>
              </div>
            </div>

            {/* Comments/Replies list */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-white/80 px-2">Discussion Replies</h3>
              
              {selectedPost.replies.map((reply) => (
                <div key={reply.id} className="bg-white/[0.02] backdrop-blur rounded-2xl border border-white/5 p-5 shadow-2xl flex items-start space-x-4">
                  <img src={reply.avatar} alt={reply.author} className="w-9 h-9 rounded-full mt-0.5 border border-white/5" />
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{reply.author}</span>
                      {reply.isMentor && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-brand-primary/20 border border-brand-primary/30 text-brand-secondary text-[9px] font-bold font-mono">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Kronex Coach</span>
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-white/40">{reply.createdAt}</span>
                    </div>
                    <p className="text-xs font-sans text-white/75 leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post comment reply form */}
            <form onSubmit={handleAddComment} className="bg-white/[0.03] rounded-2xl border border-white/10 p-4 flex gap-4 shadow-2xl">
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a constructive comment or answer..."
                className="flex-grow bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                className="p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
                title="Send reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        ) : isCreating ? (
          
          /* CREATING NEW POST TOPIC */
          <motion.div
            key="create-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <button
              onClick={() => setIsCreating(false)}
              className="flex items-center space-x-1.5 text-xs font-bold text-brand-secondary hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel new topic</span>
            </button>

            <form onSubmit={handleCreatePost} className="bg-white/[0.03] rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
              <h2 className="font-display font-bold text-lg text-white">Launch New Discussion Topic</h2>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/45 uppercase tracking-wider font-mono">Discussion Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Demystifying neural network cost functions with real metrics"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-white/30 outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-white/45 uppercase tracking-wider font-mono">Channel Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#0b1120] text-xs text-white outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="General">General Questions</option>
                    <option value="Python">Python AI Path</option>
                    <option value="Prompt Engineering">Prompt Engineering</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Job Hunt">Job Hunt & Career</option>
                    <option value="Showcase">Project Showcase</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/45 uppercase tracking-wider font-mono">Topic Content / Details</label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Elaborate on your idea, paste sample prompts, or request reviews from our expert mentors..."
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-white/30 outline-none focus:border-brand-primary resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-display font-bold text-xs text-white shining-btn hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-white/10"
              >
                Publish New Topic (+25 XP)
              </button>
            </form>
          </motion.div>
        ) : (
          
          /* GENERAL DISCUSSIONS FEED LIST */
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-2 border-y border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider font-display transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-brand-primary/20 border border-brand-primary/30 text-brand-secondary'
                        : 'bg-transparent text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white focus:outline-none focus:border-brand-primary placeholder-white/30 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.03] rounded-3xl border border-white/10 shadow-2xl">
                  <HelpCircle className="w-10 h-10 text-white/30 mx-auto opacity-50" />
                  <p className="text-sm font-bold text-white mt-2">No discussions found</p>
                  <p className="text-xs text-white/50 font-sans">Be the first to create a topic in this channel!</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className="bg-white/[0.03] rounded-3xl border border-white/10 p-6 shadow-2xl hover:border-brand-primary/40 hover:shadow-[0_20px_40px_rgba(123,47,247,0.15)] hover:scale-[1.005] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Post top metadata */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-white/5" />
                          <div>
                            <span className="block text-xs font-bold text-white">{post.author}</span>
                            <span className="block text-[9px] font-mono text-white/45">{post.createdAt}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {post.isPinned && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-brand-accent/20 border border-brand-accent/30 text-brand-accent-secondary text-[9px] font-bold font-mono">
                              <Pin className="w-3 h-3 fill-current" />
                              <span>PINNED</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-secondary text-[9px] font-bold font-mono">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display font-black text-base text-white leading-tight hover:text-brand-secondary transition-colors mb-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-white/60 font-sans line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Likes & replies bar */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-4 text-[11px] font-bold text-white/45">
                      <button
                        onClick={(e) => handleLikePost(post.id, e)}
                        className={`flex items-center space-x-1 hover:text-brand-secondary transition-colors cursor-pointer ${post.hasLiked ? 'text-brand-secondary font-bold' : ''}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-current text-brand-secondary' : ''}`} />
                        <span>{post.likes} Likes</span>
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.replies.length} Replies</span>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
