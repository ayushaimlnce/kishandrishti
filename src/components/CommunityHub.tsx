import React, { useState, useEffect } from 'react';
import {
  Users,
  ThumbsUp,
  MessageSquare,
  Award,
  Sparkles,
  PlusCircle,
  Volume2,
  Clock,
  FlaskConical,
  CheckCircle,
} from 'lucide-react';
import { CommunityPost, LanguageCode } from '../types';
import { globalVoiceController } from '../utils/speech';

interface CommunityHubProps {
  currentLang: LanguageCode;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ currentLang }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeCrop, setActiveCrop] = useState<string>('All');
  const [showPostModal, setShowPostModal] = useState<boolean>(false);

  // New post form
  const [author, setAuthor] = useState<string>('');
  const [authorRole, setAuthorRole] = useState<string>('Progressive Farmer');
  const [region, setRegion] = useState<string>('');
  const [crop, setCrop] = useState<string>('Wheat');
  const [diseaseTitle, setDiseaseTitle] = useState<string>('');
  const [remedyDescription, setRemedyDescription] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [preparationTime, setPreparationTime] = useState<string>('2 Days');
  const [applicationFrequency, setApplicationFrequency] = useState<string>('Weekly');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community-posts');
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/community-posts/${id}/upvote`, { method: 'POST' });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
        );
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePlayAudio = (post: CommunityPost) => {
    const speech = `${post.diseaseTitle}. Shared by ${post.author}. ${post.remedyDescription}`;
    globalVoiceController.speak(speech, currentLang);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/community-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author || 'Farmer Friend',
          authorRole,
          region: region || 'India',
          crop,
          diseaseTitle,
          remedyDescription,
          ingredients: ingredients.split(',').map((s) => s.trim()),
          preparationTime,
          applicationFrequency,
        }),
      });

      if (res.ok) {
        setShowPostModal(false);
        fetchPosts();
        setDiseaseTitle('');
        setRemedyDescription('');
        setIngredients('');
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) => activeCrop === 'All' || p.crop.toLowerCase().includes(activeCrop.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-[#E9F2E7] text-[#2D5A27] border border-[#DDE4DC]">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B261C]">
              Farmer Community & Indigenous Organic Recipes
            </h1>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5C6B5A] font-medium">
            Time-tested natural formulations, zero-budget organic recipes, and peer-reviewed tips from fellow farmers.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Organic Recipe</span>
        </button>
      </div>

      {/* Crop Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {['All', 'Wheat', 'Chilli', 'Paddy', 'Cotton', 'Tomato', 'Potato'].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCrop(c)}
            className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-colors border ${
              activeCrop === c
                ? 'bg-[#2D5A27] text-white border-[#2D5A27] shadow-xs'
                : 'bg-white text-[#1B261C] border-[#E0E7DE] hover:bg-[#F0F4EF]'
            }`}
          >
            {c === 'All' ? 'All Crops' : c}
          </button>
        ))}
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-[#E0E7DE] rounded-3xl p-6 shadow-xs space-y-4 hover:border-[#2D5A27]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              {/* Author & KVK verification badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-[#1B261C]">{post.author}</span>
                    <span className="text-[11px] text-[#2D5A27] bg-[#E9F2E7] px-2.5 py-0.5 rounded-full border border-[#DDE4DC] font-bold">
                      {post.crop}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6B5A] font-medium mt-0.5">
                    {post.authorRole} • {post.region}
                  </p>
                </div>

                {post.verifiedByKVK && (
                  <span
                    className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9F2E7] text-[#2D5A27] border border-[#DDE4DC] shrink-0"
                    title="Verified by Krishi Vigyan Kendra agronomy guidelines"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" /> KVK Verified
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-lg font-black text-[#1B261C] leading-snug">
                {post.diseaseTitle}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5C6B5A] leading-relaxed font-medium">
                {post.remedyDescription}
              </p>

              {/* Ingredients Chips */}
              {post.ingredients && post.ingredients.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-[#2D5A27] uppercase tracking-wider block">
                    Key Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-[#F0F4EF] text-[#1B261C] text-[11px] border border-[#DDE4DC] font-medium"
                      >
                        🌾 {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prep & Frequency Metadata */}
              <div className="grid grid-cols-2 gap-2 bg-[#F0F4EF] p-3 rounded-2xl border border-[#DDE4DC] text-[11px] text-[#1B261C] font-semibold">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Prep: {post.preparationTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-[#2D5A27]" />
                  <span>Spray: {post.applicationFrequency}</span>
                </div>
              </div>
            </div>

            {/* Post Footer Actions */}
            <div className="pt-3.5 border-t border-[#E0E7DE] flex items-center justify-between text-xs">
              <button
                onClick={() => handleUpvote(post.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#1B261C] font-bold transition-colors border border-[#DDE4DC]"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#2D5A27]" />
                <span>{post.upvotes} Farmers Upvoted</span>
              </button>

              <button
                onClick={() => handlePlayAudio(post)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#2D5A27] font-bold transition-colors border border-[#DDE4DC]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Audio</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Recipe Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B261C]/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E0E7DE] rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-7 text-[#1B261C] animate-in fade-in zoom-in duration-150">
            <h2 className="text-xl font-black text-[#1B261C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2D5A27]" /> Share Indigenous Organic Recipe
            </h2>
            <p className="text-xs text-[#5C6B5A] mt-1 font-medium">
              Help millions of smallholder farmers with natural remedies that work in your region.
            </p>

            <form onSubmit={handleCreatePost} className="mt-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Sardar Gurpreet Singh"
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Crop</label>
                  <input
                    type="text"
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="e.g. Wheat / Paddy / Tomato"
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1B261C] mb-1">Recipe / Solution Title</label>
                <input
                  type="text"
                  required
                  value={diseaseTitle}
                  onChange={(e) => setDiseaseTitle(e.target.value)}
                  placeholder="e.g. Fermented Buttermilk & Neem Spray for Aphids"
                  className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B261C] mb-1">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. Sour Buttermilk (5L), Wood Ash (1kg), Water (100L)"
                  className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B261C] mb-1">
                  Preparation & Application Steps
                </label>
                <textarea
                  rows={3}
                  required
                  value={remedyDescription}
                  onChange={(e) => setRemedyDescription(e.target.value)}
                  placeholder="Describe step by step how to mix, ferment, dilute, and spray this formulation..."
                  className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] text-xs focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Preparation Time</label>
                  <input
                    type="text"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    placeholder="e.g. 5 Days Fermentation"
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Frequency</label>
                  <input
                    type="text"
                    value={applicationFrequency}
                    onChange={(e) => setApplicationFrequency(e.target.value)}
                    placeholder="e.g. Every 7 days"
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-[#E0E7DE]">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#5C6B5A] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold text-xs shadow-xs"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
