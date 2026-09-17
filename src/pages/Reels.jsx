import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreVertical, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ShieldCheck, 
  AlertTriangle, 
  Upload, 
  Search, 
  X, 
  Copy, 
  Check, 
  Send, 
  MapPin, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  UserCheck, 
  UserPlus, 
  Film,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  reelsService, 
  reelsEvents, 
  REEL_CATEGORIES, 
  REPORT_REASONS 
} from '../services/reelsService';
import './Reels.css';

export const Reels = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Feed State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'personalized' | 'saved' | 'my'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reels, setReels] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  // Modals & Drawers
  const [commentDrawerReel, setCommentDrawerReel] = useState(null);
  const [shareModalReel, setShareModalReel] = useState(null);
  const [moreOptionsReel, setMoreOptionsReel] = useState(null);
  const [reportModalReel, setReportModalReel] = useState(null);
  const [creatorProfileModal, setCreatorProfileModal] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [safetyNoticeModal, setSafetyNoticeModal] = useState(null);

  // Interaction Feedback
  const [heartBurstReelId, setHeartBurstReelId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Feed scrolling reference
  const feedContainerRef = useRef(null);
  const videoRefs = useRef(new Map());

  // Show Toast Helper
  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Fetch Reels
  const loadReels = useCallback(() => {
    const list = reelsService.getReels({
      category: selectedCategory,
      search: searchQuery,
      tab: activeTab,
      farmerProfile: user,
      currentUserId: user?.id || 'farmer-me'
    });
    setReels(list);
  }, [selectedCategory, searchQuery, activeTab, user]);

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  // Subscribe to service events
  useEffect(() => {
    const unsub = reelsEvents.subscribe('*', () => {
      loadReels();
    });
    return unsub;
  }, [loadReels]);

  // Handle Autoplay & Pause with IntersectionObserver
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const reelId = entry.target.getAttribute('data-reel-id');
          const videoEl = videoRefs.current.get(reelId);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = reels.findIndex(r => r.id === reelId);
            if (idx !== -1) setActiveReelIndex(idx);

            if (videoEl) {
              videoEl.play().catch(() => {});
            }
          } else {
            if (videoEl) {
              videoEl.pause();
            }
          }
        });
      },
      {
        root: container,
        threshold: [0.2, 0.5, 0.8]
      }
    );

    const items = container.querySelectorAll('.reel-video-card-container');
    items.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [reels]);

  // Mute / Unmute Toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = nextMuted;
    });
    showToast(nextMuted ? (t('audio_muted') || 'Audio Muted') : (t('audio_unmuted') || 'Audio Unmuted'));
  };

  // Like Toggle
  const handleLike = (reelId) => {
    const isNowLiked = reelsService.toggleLike(reelId);
    if (isNowLiked) {
      setHeartBurstReelId(reelId);
      setTimeout(() => setHeartBurstReelId(null), 900);
    }
    loadReels();
  };

  // Double-tap on video to like
  const handleVideoDoubleTap = (reelId) => {
    const reel = reels.find(r => r.id === reelId);
    if (reel && !reel.isLiked) {
      reelsService.toggleLike(reelId);
      loadReels();
    }
    setHeartBurstReelId(reelId);
    setTimeout(() => setHeartBurstReelId(null), 900);
  };

  // Save / Bookmark Toggle
  const handleSave = (reelId) => {
    const isNowSaved = reelsService.toggleSave(reelId);
    showToast(isNowSaved ? (t('reel_saved_toast') || 'Reel saved to your bookmarks') : (t('reel_removed_toast') || 'Reel removed from saved'));
    loadReels();
  };

  // Keyboard navigation & Smooth Step Scroll
  const scrollFeedTo = (index) => {
    if (index < 0 || index >= reels.length) return;
    const container = feedContainerRef.current;
    if (!container) return;
    const targetCard = container.querySelector(`[data-index="${index}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="farmogram-reels-page">
      {/* 1. Ultra-Compact Top Bar: Header, Feed Tabs, Search & Categories */}
      <div className="reels-compact-top-section">
        {/* Row 1: Title & Upload Button */}
        <div className="reels-header-row">
          <div className="reels-title-inline-group">
            <h1 className="reels-main-title">🌾 {t('reels') || 'Reels'}</h1>
            <span className="reels-header-separator">•</span>
            <span className="reels-main-subtitle">
              {t('reels_subtitle') || 'Learn, share and discover useful farming knowledge.'}
            </span>
          </div>

          <button 
            className="btn btn-primary reels-upload-btn-compact"
            onClick={() => setIsUploadOpen(true)}
          >
            <Upload size={14} />
            <span>{t('upload_reel') || '+ Upload Reel'}</span>
          </button>
        </div>

        {/* Row 2: Feed Filter Tabs + Inline Search Bar */}
        <div className="reels-toolbar-row">
          <div className="reels-feed-tabs-compact">
            <button 
              className={`reels-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              🌾 {t('all_reels') || 'All Reels'}
            </button>
            <button 
              className={`reels-tab-pill ${activeTab === 'personalized' ? 'active' : ''}`}
              onClick={() => setActiveTab('personalized')}
            >
              🎯 {t('for_you') || 'For You'}
            </button>
            <button 
              className={`reels-tab-pill ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              🔖 {t('saved_reels') || 'Saved'}
            </button>
            <button 
              className={`reels-tab-pill ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
            >
              👤 {t('my_uploads') || 'My Uploads'}
            </button>
          </div>

          <div className="reels-search-box-compact">
            <Search size={14} className="search-icon-compact" />
            <input 
              type="text" 
              placeholder={t('search_farming_reels') || 'Search farming reels…'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="reels-search-input-compact"
            />
            {searchQuery && (
              <button className="search-clear-btn-compact" onClick={() => setSearchQuery('')}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Category Filter Pills (Compact Horizontal Scroll) */}
        <div className="reels-categories-strip">
          {REEL_CATEGORIES.map(cat => {
            const rawLabel = t(cat.key) || cat.label;
            const hasLeadingEmoji = /^\p{Extended_Pictographic}/u.test(rawLabel.trim());
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`reels-cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {!hasLeadingEmoji && cat.icon && <span className="cat-chip-icon">{cat.icon}</span>}
                <span>{rawLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Focused Main Reel Viewport Area (Vertically Centered) */}
      <div className="reels-feed-layout">
        {/* The Scroll-Snap Vertical Feed Container */}
        <div className="reels-vertical-scroll-container" ref={feedContainerRef}>
          {reels.length === 0 ? (
            <div className="reels-empty-feed-card">
              <div className="empty-icon-bubble">🌾</div>
              <h3>{t('no_reels_found') || 'No Farming Reels Found'}</h3>
              <p>
                {activeTab === 'saved' 
                  ? (t('no_saved_reels_msg') || 'You have not bookmarked any farming reels yet. Click the bookmark icon on any reel to save it for quick reference.')
                  : activeTab === 'my'
                  ? (t('no_my_reels_msg') || 'You have not uploaded any reels yet. Share your agricultural techniques with fellow farmers!')
                  : (t('no_reels_match_filters') || 'No reels match the selected category or search keyword. Try clearing filters.')}
              </p>
              {activeTab === 'my' ? (
                <button className="btn btn-primary btn-sm" onClick={() => setIsUploadOpen(true)}>
                  <Upload size={14} /> {t('upload_first_reel') || 'Upload Your First Reel'}
                </button>
              ) : (
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setActiveTab('all'); }}
                >
                  {t('reset_filters') || 'Reset Filters'}
                </button>
              )}
            </div>
          ) : (
            reels.map((reel, idx) => (
              <ReelItemCard 
                key={reel.id}
                reel={reel}
                index={idx}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                videoRef={(el) => {
                  if (el) videoRefs.current.set(reel.id, el);
                  else videoRefs.current.delete(reel.id);
                }}
                onLike={() => handleLike(reel.id)}
                onDoubleTap={() => handleVideoDoubleTap(reel.id)}
                hasHeartBurst={heartBurstReelId === reel.id}
                onSave={() => handleSave(reel.id)}
                onOpenComments={() => setCommentDrawerReel(reel)}
                onOpenShare={() => setShareModalReel(reel)}
                onOpenMore={() => setMoreOptionsReel(reel)}
                onOpenCreator={() => setCreatorProfileModal(reel.creator)}
                onOpenSafetyNotice={(notice) => setSafetyNoticeModal({ title: reel.title, notice })}
                t={t}
              />
            ))
          )}
        </div>

        {/* Desktop Step Navigation Rail (Side-aligned, Vertically Centered) */}
        {reels.length > 0 && (
          <div className="reels-desktop-side-stepper">
            <button 
              className="stepper-arrow-btn" 
              onClick={() => scrollFeedTo(activeReelIndex - 1)}
              disabled={activeReelIndex === 0}
              title="Previous Reel"
              aria-label="Previous Reel"
            >
              <ChevronUp size={16} />
            </button>
            <div className="stepper-index-chip">
              <strong>{activeReelIndex + 1}</strong>/{reels.length}
            </div>
            <button 
              className="stepper-arrow-btn" 
              onClick={() => scrollFeedTo(activeReelIndex + 1)}
              disabled={activeReelIndex >= reels.length - 1}
              title="Next Reel"
              aria-label="Next Reel"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="reels-toast-bubble">
          <Check size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Comment Drawer Modal */}
      {commentDrawerReel && (
        <CommentDrawer 
          reel={commentDrawerReel}
          currentUser={user}
          onClose={() => setCommentDrawerReel(null)}
          onAddComment={(text) => {
            reelsService.addComment(commentDrawerReel.id, text, user);
            const updated = reelsService.getReelById(commentDrawerReel.id);
            if (updated) setCommentDrawerReel(updated);
            loadReels();
          }}
          onLikeComment={(commentId) => {
            reelsService.likeComment(commentDrawerReel.id, commentId);
            const updated = reelsService.getReelById(commentDrawerReel.id);
            if (updated) setCommentDrawerReel(updated);
            loadReels();
          }}
          t={t}
        />
      )}

      {/* 4. Share Sheet Modal */}
      {shareModalReel && (
        <ShareModal 
          reel={shareModalReel}
          onClose={() => setShareModalReel(null)}
          onCopyLink={() => {
            const url = `${window.location.origin}/?reel=${shareModalReel.id}`;
            navigator.clipboard.writeText(url);
            showToast(t('reel_link_copied') || 'Reel link copied');
            reelsService.incrementShare(shareModalReel.id);
            setShareModalReel(null);
          }}
          onShareCommunity={() => {
            showToast(t('shared_to_community') || 'Reel shared to Farmogram Community Hub');
            reelsService.incrementShare(shareModalReel.id);
            setShareModalReel(null);
          }}
          t={t}
        />
      )}

      {/* 5. More Options Modal */}
      {moreOptionsReel && (
        <MoreOptionsModal 
          reel={moreOptionsReel}
          onClose={() => setMoreOptionsReel(null)}
          onSave={() => {
            handleSave(moreOptionsReel.id);
            setMoreOptionsReel(null);
          }}
          onShare={() => {
            const r = moreOptionsReel;
            setMoreOptionsReel(null);
            setShareModalReel(r);
          }}
          onReport={() => {
            const r = moreOptionsReel;
            setMoreOptionsReel(null);
            setReportModalReel(r);
          }}
          onCopyLink={() => {
            const url = `${window.location.origin}/?reel=${moreOptionsReel.id}`;
            navigator.clipboard.writeText(url);
            showToast(t('reel_link_copied') || 'Reel link copied');
            setMoreOptionsReel(null);
          }}
          onViewCreator={() => {
            const c = moreOptionsReel.creator;
            setMoreOptionsReel(null);
            setCreatorProfileModal(c);
          }}
          onHideReel={() => {
            setReels(prev => prev.filter(r => r.id !== moreOptionsReel.id));
            showToast(t('reel_hidden') || 'Reel hidden from your feed');
            setMoreOptionsReel(null);
          }}
          t={t}
        />
      )}

      {/* 6. Report Modal */}
      {reportModalReel && (
        <ReportModal 
          reel={reportModalReel}
          onClose={() => setReportModalReel(null)}
          onSubmitReport={(reasonId, details) => {
            reelsService.reportReel(reportModalReel.id, reasonId, details, user?.name || 'Farmer Contributor');
            showToast(t('report_submitted_toast') || 'Report submitted to agricultural moderators for review');
            setReportModalReel(null);
          }}
          t={t}
        />
      )}

      {/* 7. Creator Profile Modal */}
      {creatorProfileModal && (
        <CreatorProfileModal 
          creator={creatorProfileModal}
          allReels={reelsService.getAllRawReels()}
          onClose={() => setCreatorProfileModal(null)}
          t={t}
        />
      )}

      {/* 8. Safety & Agronomy Advisory Modal */}
      {safetyNoticeModal && (
        <SafetyNoticeModal 
          data={safetyNoticeModal}
          onClose={() => setSafetyNoticeModal(null)}
          t={t}
        />
      )}

      {/* 9. Upload Reel Modal */}
      {isUploadOpen && (
        <UploadReelModal 
          currentUser={user}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={() => {
            setIsUploadOpen(false);
            showToast(t('reel_published_toast') || 'Farming reel published successfully!');
            setActiveTab('my');
            loadReels();
          }}
          t={t}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// INDIVIDUAL REEL VIDEO CARD COMPONENT
// -------------------------------------------------------------
const ReelItemCard = ({
  reel,
  index,
  isMuted,
  onToggleMute,
  videoRef,
  onLike,
  onDoubleTap,
  hasHeartBurst,
  onSave,
  onOpenComments,
  onOpenShare,
  onOpenMore,
  onOpenCreator,
  onOpenSafetyNotice,
  t
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFollowing, setIsFollowing] = useState(() => reelsService.isFollowingCreator(reel.creator?.id));
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const internalVideoRef = useRef(null);
  const lastTapRef = useRef(0);

  const togglePlay = () => {
    if (!internalVideoRef.current) return;
    if (isPlaying) {
      internalVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      internalVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTapArea = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      onDoubleTap();
    } else {
      togglePlay();
    }
    lastTapRef.current = now;
  };

  const handleFollowToggle = (e) => {
    e.stopPropagation();
    const nextState = reelsService.toggleFollowCreator(reel.creator?.id);
    setIsFollowing(nextState);
  };

  return (
    <div 
      className="reel-video-card-container" 
      data-reel-id={reel.id} 
      data-index={index}
    >
      <div className="reel-card-inner">
        {/* Actual Video Viewport */}
        <div className="reel-media-box" onClick={handleTapArea}>
          <video
            ref={(el) => {
              internalVideoRef.current = el;
              videoRef(el);
            }}
            src={reel.videoUrl}
            poster={reel.poster}
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
            className="reel-html5-video"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Floating Heart Burst Animation on Double Click */}
          {hasHeartBurst && (
            <div className="reel-heart-burst">
              <Heart size={80} fill="#ef4444" color="#ef4444" />
            </div>
          )}

          {/* Play/Pause state indicator */}
          {!isPlaying && (
            <div className="reel-paused-indicator">
              <Play size={38} fill="#ffffff" color="#ffffff" />
            </div>
          )}

          {/* Top Edge Bar */}
          <div className="reel-top-overlay-bar">
            <div className="reel-top-left-tags">
              <span className="reel-crop-category-badge">
                {reel.categoryLabel || reel.category}
              </span>
              {reel.safetyNotice && (
                <button 
                  className="reel-safety-advisory-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSafetyNotice(reel.safetyNotice);
                  }}
                  title="Agronomy Safety Advisory"
                >
                  <AlertTriangle size={12} />
                  <span>{t('safety_notice') || 'Advisory'}</span>
                </button>
              )}
            </div>

            {/* Mute / Unmute Button */}
            <button 
              className="reel-audio-mute-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>

          {/* Vertical Action Bar (Right Side) — Distinct Units with Proper Breathing Room */}
          <div className="reel-right-action-rail" onClick={(e) => e.stopPropagation()}>
            {/* Like Unit */}
            <div className="reel-action-unit">
              <button 
                className={`reel-action-circle-btn ${reel.isLiked ? 'active-liked' : ''}`}
                onClick={onLike}
                title={reel.isLiked ? (t('unlike') || 'Unlike') : (t('like') || 'Like')}
                aria-label="Like"
              >
                <Heart 
                  size={24} 
                  fill={reel.isLiked ? '#ef4444' : 'none'} 
                  color={reel.isLiked ? '#ef4444' : '#ffffff'} 
                />
              </button>
              <span className="reel-action-unit-label">
                {reel.likesCount >= 1000 ? `${(reel.likesCount / 1000).toFixed(1)}k` : reel.likesCount}
              </span>
            </div>

            {/* Comments Unit */}
            <div className="reel-action-unit">
              <button 
                className="reel-action-circle-btn" 
                onClick={onOpenComments}
                title={t('comments') || 'Comments'}
                aria-label="Comments"
              >
                <MessageCircle size={24} color="#ffffff" />
              </button>
              <span className="reel-action-unit-label">
                {reel.commentsCount || reel.comments?.length || 0}
              </span>
            </div>

            {/* Save / Bookmark Unit */}
            <div className="reel-action-unit">
              <button 
                className={`reel-action-circle-btn ${reel.isSaved ? 'active-saved' : ''}`} 
                onClick={onSave}
                title={reel.isSaved ? (t('remove_saved') || 'Saved') : (t('save_reel') || 'Save Reel')}
                aria-label="Save"
              >
                <Bookmark 
                  size={24} 
                  fill={reel.isSaved ? '#16a34a' : 'none'} 
                  color={reel.isSaved ? '#16a34a' : '#ffffff'} 
                />
              </button>
              <span className="reel-action-unit-label">
                {reel.isSaved ? (t('saved') || 'Saved') : (t('save') || 'Save')}
              </span>
            </div>

            {/* Share Unit */}
            <div className="reel-action-unit">
              <button 
                className="reel-action-circle-btn" 
                onClick={onOpenShare}
                title={t('share_reel') || 'Share Reel'}
                aria-label="Share"
              >
                <Share2 size={23} color="#ffffff" />
              </button>
              <span className="reel-action-unit-label">
                {reel.sharesCount || 0}
              </span>
            </div>

            {/* More Options Unit */}
            <div className="reel-action-unit">
              <button 
                className="reel-action-circle-btn" 
                onClick={onOpenMore}
                title={t('more_options') || 'More Options'}
                aria-label="More Options"
              >
                <MoreVertical size={22} color="#ffffff" />
              </button>
            </div>
          </div>

          {/* Bottom Information Overlay (Clean Hierarchy & Ample Margin from Action Rail) */}
          <div className="reel-bottom-info-overlay" onClick={(e) => e.stopPropagation()}>
            {/* 1. Creator Row */}
            <div className="reel-creator-header-row">
              <div className="creator-profile-click-target" onClick={onOpenCreator}>
                <img 
                  src={reel.creator?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
                  alt={reel.creator?.name} 
                  className="creator-avatar-circle"
                />
                <div className="creator-name-verified-group">
                  <div className="creator-primary-name">
                    <span>{reel.creator?.name}</span>
                    {reel.creator?.verified && (
                      <ShieldCheck size={15} color="#38bdf8" className="verified-shield-icon" />
                    )}
                  </div>
                  <span className="creator-handle-sub">{reel.creator?.handle}</span>
                </div>
              </div>

              {/* Follow Button */}
              <button 
                className={`creator-follow-chip ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={12} />
                    <span>{t('following') || 'Following'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={12} />
                    <span>{t('follow') || 'Follow'}</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Location & Crop Tag */}
            <div className="reel-location-crop-line">
              <span className="meta-pin-text">
                <MapPin size={11} /> {reel.location}
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-crop-highlight">
                🌾 {reel.crop}
              </span>
            </div>

            {/* 3. Reel Title */}
            <h3 className="reel-title-heading">{reel.title}</h3>

            {/* 4. Description & Caption (Controlled 2-line clamp with expand) */}
            <p className={`reel-caption-paragraph ${isCaptionExpanded ? 'expanded' : ''}`}>
              {reel.caption}
              {reel.caption?.length > 90 && (
                <button 
                  className="caption-expand-toggle"
                  onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                >
                  {isCaptionExpanded ? ' less' : ' ...more'}
                </button>
              )}
            </p>

            {/* 5. Hashtags */}
            <div className="reel-hashtags-row">
              {reel.hashtags?.slice(0, 4).map((tag, i) => (
                <span key={i} className="reel-hashtag-chip">{tag}</span>
              ))}
            </div>

            {/* 6. Audio Track */}
            <div className="reel-audio-source-strip">
              <span className="music-note-icon">🎵</span>
              <span className="audio-marquee-text">{reel.audioTrack}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// COMMENT DRAWER MODAL
// -------------------------------------------------------------
const CommentDrawer = ({ reel, currentUser, onClose, onAddComment, onLikeComment, t }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-comment-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header-row">
          <div className="drawer-title-group">
            <h3>{t('comments') || 'Comments'}</h3>
            <span className="comments-count-pill">{reel.comments?.length || 0}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-comments-scroll-area">
          {!reel.comments || reel.comments.length === 0 ? (
            <div className="drawer-empty-comments">
              <MessageSquare size={32} color="#94a3b8" />
              <p>{t('no_comments_yet') || 'No farmer comments yet. Start the agrarian conversation!'}</p>
            </div>
          ) : (
            reel.comments.map(c => (
              <div key={c.id} className="comment-thread-item">
                <img src={c.avatar} alt={c.userName} className="comment-user-avatar" />
                <div className="comment-body">
                  <div className="comment-user-row">
                    <span className="comment-user-name">{c.userName}</span>
                    <span className="comment-timestamp">{c.time}</span>
                  </div>
                  <p className="comment-text-content">{c.text}</p>
                </div>
                <button 
                  className="comment-like-action-btn"
                  onClick={() => onLikeComment(c.id)}
                  title="Like comment"
                >
                  <Heart size={14} />
                  {c.likes > 0 && <span className="comment-like-count">{c.likes}</span>}
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="drawer-comment-input-form">
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
            alt="My Profile" 
            className="input-user-avatar"
          />
          <input 
            type="text" 
            placeholder={t('write_farming_comment') || 'Write a farming comment… (Tamil/English)'}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="drawer-text-input"
          />
          <button 
            type="submit" 
            disabled={!commentText.trim()}
            className="drawer-send-btn"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SHARE MODAL
// -------------------------------------------------------------
const ShareModal = ({ reel, onClose, onCopyLink, onShareCommunity, t }) => {
  const shareUrl = `${window.location.origin}/?reel=${reel.id}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🌾 Watch "${reel.title}" on Farmogram AI Reels:\n${shareUrl}\n\nShared via Farmogram Agriculture Community.`
  )}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: `🌾 Check out this farming reel: ${reel.title}`,
          url: shareUrl
        });
        onClose();
      } catch (err) {}
    } else {
      onCopyLink();
    }
  };

  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-modal-box share-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3>{t('share_reel') || 'Share Farming Reel'}</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="share-reel-preview-mini">
          <img src={reel.poster} alt={reel.title} className="share-mini-thumb" />
          <div className="share-mini-info">
            <h4>{reel.title}</h4>
            <p>👨🌾 {reel.creator?.name} • 📍 {reel.location}</p>
          </div>
        </div>

        <div className="share-options-grid">
          <button className="share-tile-btn" onClick={onCopyLink}>
            <div className="tile-icon-circle blue">
              <Copy size={18} />
            </div>
            <span>{t('copy_link') || 'Copy Link'}</span>
          </button>

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="share-tile-btn"
            onClick={onClose}
          >
            <div className="tile-icon-circle green">
              <ExternalLink size={18} />
            </div>
            <span>WhatsApp</span>
          </a>

          <button className="share-tile-btn" onClick={onShareCommunity}>
            <div className="tile-icon-circle emerald">
              <Sparkles size={18} />
            </div>
            <span>{t('community') || 'Community Hub'}</span>
          </button>

          {navigator.share && (
            <button className="share-tile-btn" onClick={handleNativeShare}>
              <div className="tile-icon-circle amber">
                <Share2 size={18} />
              </div>
              <span>{t('more') || 'Device Share'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MORE OPTIONS MODAL (THREE-DOT)
// -------------------------------------------------------------
const MoreOptionsModal = ({ 
  reel, 
  onClose, 
  onSave, 
  onShare, 
  onReport, 
  onCopyLink, 
  onViewCreator, 
  onHideReel, 
  t 
}) => {
  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-modal-box more-options-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3>{t('reel_options') || 'Reel Options'}</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="more-options-list">
          <button className="more-option-item" onClick={onSave}>
            <Bookmark size={17} />
            <span>{reel.isSaved ? (t('remove_saved') || 'Remove from Saved') : (t('save_reel') || 'Save Reel')}</span>
          </button>

          <button className="more-option-item" onClick={onShare}>
            <Share2 size={17} />
            <span>{t('share') || 'Share'}</span>
          </button>

          <button className="more-option-item" onClick={onCopyLink}>
            <Copy size={17} />
            <span>{t('copy_link') || 'Copy Link'}</span>
          </button>

          <button className="more-option-item" onClick={onViewCreator}>
            <UserCheck size={17} />
            <span>{t('view_creator_profile') || 'View Creator Profile'}</span>
          </button>

          <button className="more-option-item" onClick={onHideReel}>
            <Eye size={17} />
            <span>{t('hide_reel') || 'Not Interested / Hide Reel'}</span>
          </button>

          <button className="more-option-item text-danger" onClick={onReport}>
            <AlertTriangle size={17} />
            <span>{t('report_reel') || 'Report Misleading / Inappropriate Content'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// REPORT REEL MODAL
// -------------------------------------------------------------
const ReportModal = ({ reel, onClose, onSubmitReport, t }) => {
  const [selectedReason, setSelectedReason] = useState('misleading');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReport(selectedReason, details);
  };

  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-modal-box report-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div className="report-modal-title">
            <AlertTriangle size={20} color="#dc2626" />
            <h3>{t('report_agricultural_content') || 'Report Agricultural Content'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <p className="report-explainer">
          {t('report_explainer') || 'Farmogram takes agricultural safety seriously. Reports regarding unverified pesticide formulas, spurious claims, or misleading recommendations are escalated immediately to our panel of verified agronomists.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="report-reasons-group">
            {REPORT_REASONS.map(r => (
              <label key={r.id} className="report-reason-radio-label">
                <input 
                  type="radio" 
                  name="reportReason"
                  value={r.id}
                  checked={selectedReason === r.id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                <span className="radio-custom-label">{t(r.key) || r.label}</span>
              </label>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: '14px' }}>
            <label className="form-label">{t('additional_details') || 'Additional Details (Optional):'}</label>
            <textarea 
              rows={2}
              placeholder={t('report_details_placeholder') || 'Describe the misleading claim, dosage error, or concern…'}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="modal-footer-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" className="btn btn-danger btn-sm">
              {t('submit_report') || 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// CREATOR PROFILE MODAL
// -------------------------------------------------------------
const CreatorProfileModal = ({ creator, allReels, onClose, t }) => {
  const [isFollowing, setIsFollowing] = useState(() => reelsService.isFollowingCreator(creator.id));
  const creatorReels = allReels.filter(r => r.creator?.id === creator.id || r.creator?.handle === creator.handle);

  const toggleFollow = () => {
    const nextState = reelsService.toggleFollowCreator(creator.id);
    setIsFollowing(nextState);
  };

  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-modal-box creator-profile-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3>{t('creator_profile') || 'Farmer Profile'}</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="creator-profile-card">
          <div className="creator-profile-avatar-row">
            <img src={creator.avatar} alt={creator.name} className="creator-modal-avatar" />
            <div className="creator-modal-meta">
              <h3 className="creator-modal-fullname">
                {creator.name}
                {creator.verified && <ShieldCheck size={16} color="#38bdf8" />}
              </h3>
              <span className="creator-modal-role-badge">
                {creator.verified ? (t('verified_expert') || '✓ Verified Agricultural Expert') : (creator.role || 'Farmer Creator')}
              </span>
              <p className="creator-modal-location"><MapPin size={12} /> {creator.location}</p>
            </div>
          </div>

          <p className="creator-modal-bio">{creator.bio}</p>

          <div className="creator-modal-stats-bar">
            <div className="stat-col">
              <strong>{creatorReels.length}</strong>
              <span>{t('reels') || 'Reels'}</span>
            </div>
            <div className="stat-col">
              <strong>{creator.followersCount || 1240}</strong>
              <span>{t('followers') || 'Followers'}</span>
            </div>
            <div className="stat-action-col">
              <button 
                className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                onClick={toggleFollow}
              >
                {isFollowing ? (t('following') || 'Following') : (t('follow') || 'Follow')}
              </button>
            </div>
          </div>

          <div className="creator-published-reels-header">
            <h4>{t('reels_by_creator') || 'Farming Videos by this Creator'}</h4>
          </div>

          <div className="creator-reels-grid">
            {creatorReels.map(cr => (
              <div key={cr.id} className="creator-reel-grid-item">
                <img src={cr.poster} alt={cr.title} />
                <span className="mini-views-chip"><Eye size={10} /> {cr.viewsCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// AGRONOMY SAFETY ADVISORY MODAL
// -------------------------------------------------------------
const SafetyNoticeModal = ({ data, onClose, t }) => {
  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-modal-box safety-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h3 style={{ color: '#b45309' }}>{t('safety_notice') || 'Agronomic Advisory'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="safety-modal-body">
          <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '8px' }}>{data.title}</h4>
          <div className="safety-alert-callout">
            <p>{data.notice}</p>
          </div>
          <p className="safety-disclaimer-footnote">
            {t('kvk_disclaimer') || 'Notice: Farmer-contributed methods are shared for educational purposes. Consult your local KVK or agricultural officer before large-scale dosage alterations.'}
          </p>
        </div>

        <div className="modal-footer-actions">
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            {t('understood') || 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// UPLOAD REEL MODAL
// -------------------------------------------------------------
const UploadReelModal = ({ currentUser, onClose, onUploadSuccess, t }) => {
  const [step, setStep] = useState(1);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('crop_tips');
  const [crop, setCrop] = useState('');
  const [hashtags, setHashtags] = useState('#FarmTips #AgriInnovator');
  const [location, setLocation] = useState(currentUser?.location || 'Tamil Nadu, India');
  const [language, setLanguage] = useState('ta');
  const [safetyNotice, setSafetyNotice] = useState('');
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1592417817098-8f3d6ef23984?w=800');

  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    setErrorMsg('');
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setErrorMsg(t('invalid_video_format') || 'Please select a valid MP4 or WebM video file.');
      return;
    }

    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg(t('file_too_large') || 'Video file size must be under 50 MB.');
      return;
    }

    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
    setStep(2);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handlePublish = () => {
    if (!title.trim()) {
      setErrorMsg(t('title_required') || 'Reel title is required.');
      return;
    }

    setIsUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newReel = reelsService.uploadReel({
            title,
            caption,
            category,
            crop: crop || 'General Agriculture',
            hashtags,
            location,
            language,
            videoUrl: videoPreviewUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-plants-growing-in-the-soil-41599-large.mp4',
            poster: posterUrl,
            safetyNotice: safetyNotice.trim() || null
          }, currentUser);
          setIsUploading(false);
          onUploadSuccess(newReel);
        }, 400);
      }
    }, 120);
  };

  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-modal-box upload-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={20} color="#16a34a" />
            <h3>{t('upload_farming_reel') || 'Upload Agricultural Reel'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Step Indicator */}
        <div className="upload-step-indicator">
          <div className={`step-badge ${step >= 1 ? 'active' : ''}`}>1. {t('choose_video') || 'Video'}</div>
          <div className="step-line" />
          <div className={`step-badge ${step >= 2 ? 'active' : ''}`}>2. {t('details') || 'Details'}</div>
          <div className="step-line" />
          <div className={`step-badge ${step >= 3 ? 'active' : ''}`}>3. {t('preview') || 'Preview'}</div>
        </div>

        {errorMsg && (
          <div className="upload-error-banner">
            <AlertTriangle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Video File Selection */}
        {step === 1 && (
          <div 
            className="video-drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            <div className="drop-icon-bubble">
              <Upload size={30} color="#16a34a" />
            </div>
            <h4>{t('drag_drop_video') || 'Drag and drop your farming video here'}</h4>
            <p>{t('supports_mp4_webm') || 'Supports MP4, WebM (up to 50MB). Vertical 9:16 aspect ratio recommended.'}</p>
            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
              {t('browse_files') || 'Browse Files'}
            </button>
          </div>
        )}

        {/* STEP 2: Agricultural Metadata */}
        {step === 2 && (
          <div className="upload-form-grid">
            <div className="upload-form-left">
              <div className="form-group">
                <label className="form-label">{t('reel_title') || 'Reel Title *'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Best technique to save water in tomato farming" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('caption') || 'Agronomic Description & Caption'}</label>
                <textarea 
                  rows={2} 
                  className="form-textarea" 
                  placeholder="Explain the technique, fertilizer dosage, or machinery settings used..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t('category') || 'Category'}</label>
                  <select 
                    className="form-select" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {REEL_CATEGORIES.filter(c => c.id !== 'all').map(c => {
                      const rawLabel = t(c.key) || c.label;
                      const hasLeadingEmoji = /^\p{Extended_Pictographic}/u.test(rawLabel.trim());
                      return (
                        <option key={c.id} value={c.id}>
                          {hasLeadingEmoji ? rawLabel : `${c.icon} ${rawLabel}`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t('primary_crop') || 'Primary Crop'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Tomato, Paddy"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t('location') || 'Field Location'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Erode, Tamil Nadu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{t('language') || 'Audio Language'}</label>
                  <select 
                    className="form-select" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    <option value="ml">Malayalam (മലയാളം)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('hashtags') || 'Hashtags'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="#WaterSaving #Tomato #AgriTech"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('safety_advisory_label') || 'Agronomy Safety Advisory (if chemicals shown):'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Wear protective mask; adhere to 2ml/L concentration only."
                  value={safetyNotice}
                  onChange={(e) => setSafetyNotice(e.target.value)}
                />
              </div>
            </div>

            <div className="upload-form-right">
              <label className="form-label">{t('video_preview') || 'Video Preview'}</label>
              <div className="mini-video-preview-box">
                {videoPreviewUrl && (
                  <video src={videoPreviewUrl} controls className="preview-video-element" />
                )}
              </div>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                style={{ width: '100%', marginTop: '6px' }}
                onClick={() => setStep(1)}
              >
                {t('change_video') || 'Change Video'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Preview */}
        {step === 3 && (
          <div className="upload-step-preview">
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '10px' }}>
              {t('preview_explainer') || 'Here is how your agricultural reel will appear in the public Farmogram feed:'}
            </p>
            <div className="simulated-feed-preview-card">
              <div className="simulated-header">
                <span className="badge badge-green">{category}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {location}</span>
              </div>
              <h4 style={{ fontSize: '0.9rem', margin: '4px 0', color: '#fff' }}>{title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0 0 6px 0' }}>{caption}</p>
              <span style={{ fontSize: '0.76rem', color: '#86efac', fontWeight: 600 }}>🌾 {crop}</span>
              <div className="simulated-hashtags">{hashtags}</div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="upload-progress-box">
            <div className="progress-header">
              <span>{t('publishing_reel') || 'Publishing Agricultural Reel…'}</span>
              <strong>{uploadProgress}%</strong>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="modal-footer-actions">
          {step > 1 && !isUploading && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStep(step - 1)}>
              {t('back') || 'Back'}
            </button>
          )}
          {step === 2 && (
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => {
                if (!title.trim()) {
                  setErrorMsg('Please enter a reel title.');
                  return;
                }
                setStep(3);
              }}
            >
              {t('preview_reel') || 'Preview Reel'}
            </button>
          )}
          {step >= 2 && !isUploading && (
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePublish}>
              <Upload size={14} /> {t('publish_reel') || 'Publish Reel'}
            </button>
          )}
          {step === 1 && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              {t('cancel') || 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
