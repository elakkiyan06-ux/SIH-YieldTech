import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  MoreVertical, 
  Tag, 
  Check,
  AlertTriangle,
  X,
  Maximize2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const PostCard = ({ post, onOpenComments }) => {
  const { toggleLike, toggleSave, reportPost } = useAppState();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const mediaList = post.images && post.images.length > 0
    ? post.images
    : (post.image ? [{ url: post.image, caption: post.crop }] : []);

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    const reason = prompt('Reason for reporting this post to Farmogram moderators:', 'Inaccurate agricultural practice');
    if (reason) {
      reportPost(post.id, reason);
    }
  };

  return (
    <article className="farm-card post-card">
      {/* Post Author Header */}
      <div className="post-header">
        <div className="post-author-info">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="post-author-avatar"
          />
          <div>
            <div className="author-name-row">
              <span className="author-name">{post.author.name}</span>
              {post.author.verified && (
                <span className="verified-expert-tag" title="Verified Agricultural Scientist / Expert">
                  <ShieldCheck size={14} /> Expert
                </span>
              )}
            </div>
            <div className="post-meta-sub">
              <span className="post-location">
                <MapPin size={11} /> {post.author.location}
              </span>
              <span className="meta-dot">•</span>
              <span className="post-timestamp">{post.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Crop & Category Badges */}
        <div className="post-badges-right">
          <span className="badge badge-green">{post.crop}</span>
          {post.category && (
            <span className="badge badge-amber">{post.category}</span>
          )}

          <div style={{ position: 'relative' }}>
            <button 
              className="post-menu-btn" 
              onClick={() => setShowMenu(!showMenu)}
              title="More actions"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="post-dropdown-menu">
                <button onClick={handleReport} className="dropdown-item text-danger">
                  <AlertTriangle size={14} /> Report Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Title & Content */}
      <div className="post-content-area">
        {post.title && <h3 className="post-title">{post.title}</h3>}
        <p className="post-body-text">{post.content}</p>
      </div>

      {/* Post Media Gallery - 2 to 3 images in portrait / short-video format */}
      {mediaList.length > 0 && (
        <div className="post-media-gallery" style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          margin: '14px 0',
          alignItems: 'center'
        }}>
          {mediaList.map((item, idx) => {
            const imgUrl = typeof item === 'string' ? item : item.url;
            const caption = typeof item === 'object' && item.caption ? item.caption : `${post.crop} • Photo ${idx + 1}`;
            return (
              <div 
                key={idx}
                className="post-image-container post-reel-format"
                onClick={() => setSelectedImage({ url: imgUrl, caption })}
                style={{
                  width: '160px',
                  minWidth: '140px',
                  maxWidth: '170px',
                  aspectRatio: '9/14',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#0f172a',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                title="Click to view photo in high resolution"
              >
                <img 
                  src={imgUrl} 
                  alt={caption} 
                  className="post-image" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.82) 100%)' }} />
                
                {/* Top Corner Index Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  right: '8px', 
                  background: 'rgba(0,0,0,0.65)', 
                  color: '#fff', 
                  fontSize: '0.65rem', 
                  padding: '2px 7px', 
                  borderRadius: '9999px', 
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)'
                }}>
                  {idx + 1} / {mediaList.length}
                </div>

                {/* Bottom Crop & Caption */}
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', color: '#fff' }}>
                  <div style={{ fontSize: '0.68rem', opacity: 0.85, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {post.crop}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {caption}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* High-Resolution Photo Lightbox Preview */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '85vw',
              maxHeight: '85vh',
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              title="Close"
            >
              <X size={20} />
            </button>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.caption} 
              style={{ maxHeight: '72vh', maxWidth: '100%', objectFit: 'contain', display: 'block', backgroundColor: '#000' }}
            />
            <div style={{ padding: '14px 18px', background: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedImage.caption}</span>
                <span style={{ marginLeft: '12px', fontSize: '0.82rem', color: '#94a3b8' }}>{post.title}</span>
              </div>
              <span className="badge badge-green">{post.crop}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags-row">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="post-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactions Bar */}
      <div className="post-actions-bar">
        <button 
          onClick={() => toggleLike(post.id)}
          className={`action-btn ${post.isLiked ? 'liked' : ''}`}
          title={post.isLiked ? 'Unlike' : 'Like post'}
        >
          <Heart size={18} fill={post.isLiked ? '#ef4444' : 'none'} color={post.isLiked ? '#ef4444' : 'currentColor'} />
          <span>{post.likes}</span>
        </button>

        <button 
          onClick={() => onOpenComments(post)}
          className="action-btn"
          title="Join farmer discussion"
        >
          <MessageCircle size={18} />
          <span>{post.commentsCount || 0} Comments</span>
        </button>

        <button 
          onClick={() => toggleSave(post.id)}
          className={`action-btn ${post.isSaved ? 'saved' : ''}`}
          title={post.isSaved ? 'Remove from saved' : 'Save for offline/later'}
        >
          <Bookmark size={18} fill={post.isSaved ? '#16a34a' : 'none'} color={post.isSaved ? '#16a34a' : 'currentColor'} />
          <span>{post.isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button 
          onClick={handleShare}
          className="action-btn share-btn"
          title="Share agricultural knowledge"
        >
          {copied ? <Check size={18} color="#16a34a" /> : <Share2 size={18} />}
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>
    </article>
  );
};
