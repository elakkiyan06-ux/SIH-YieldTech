import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, AlertTriangle, MoreVertical } from 'lucide-react';
import './Reels.css';

export const Reels = () => {
  // Array of Instagram Reels with mock user data to simulate native UI
  const [reelsData, setReelsData] = useState([
    {
      id: 'DYpPU_HFuYs',
      username: 'agri_tech_india',
      avatar: 'https://ui-avatars.com/api/?name=Agri+Tech&background=0D8ABC&color=fff',
      likes: 12400,
      isLiked: false,
      commentsList: [
        { user: 'farmer_raj', text: 'This irrigation technique saves so much water! Will definitely try it.', time: '2h' },
        { user: 'kisan_boy', text: 'Where can I buy these sensors?', time: '5h' },
        { user: 'agri_expert', text: 'Great explanation. Automation is the future.', time: '1d' }
      ]
    },
    {
      id: 'DaXovpYT6wN',
      username: 'pragathinaturalfarm',
      avatar: 'https://ui-avatars.com/api/?name=Pragathi&background=16A34A&color=fff',
      likes: 8932,
      isLiked: false,
      commentsList: [
        { user: 'green_fields', text: 'Organic farming yields are actually impressive if done right.', time: '1h' },
        { user: 'organic_life', text: 'What natural pesticides do you recommend for pests?', time: '3h' },
        { user: 'village_farmer', text: 'Very inspiring work! Keep it up.', time: '6h' }
      ]
    },
    {
      id: 'Da_9K8Dz7VD',
      username: 'kisan_smart_farming',
      avatar: 'https://ui-avatars.com/api/?name=Kisan&background=F59E0B&color=fff',
      likes: 45100,
      isLiked: false,
      commentsList: [
        { user: 'tractor_daily', text: 'That machinery is incredibly efficient.', time: '30m' },
        { user: 'farm_tech', text: 'Does the government provide subsidies for this equipment?', time: '2h' },
        { user: 'rural_innovator', text: 'I need this for my 5 acres. Please share contact details.', time: '4h' },
        { user: 'agri_student', text: 'Perfect demonstration of modern agricultural engineering!', time: '5h' }
      ]
    }
  ]);

  const [resetCounters, setResetCounters] = useState({});

  const [activeCommentsReelId, setActiveCommentsReelId] = useState(null);

  useEffect(() => {
    // Ensure Instagram embed script is loaded
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(script);
    } else {
      window.instgrm.Embeds.process();
    }

    // Set up an observer to detect when a video scrolls out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When a video drops below 20% visibility, reset it to stop the audio
          if (!entry.isIntersecting) {
            const reelId = entry.target.getAttribute('data-id');
            if (reelId) {
              setResetCounters(prev => ({
                ...prev,
                [reelId]: (prev[reelId] || 0) + 1
              }));
              // Also close comments if they scroll away
              setActiveCommentsReelId(null);
            }
          }
        });
      },
      { threshold: 0.2 } // Fire when visibility drops below 20%
    );

    // Observe all reel items
    const elements = document.querySelectorAll('.reel-item');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleLike = (id) => {
    setReelsData(prev => prev.map(reel => {
      if (reel.id === id) {
        return {
          ...reel,
          isLiked: !reel.isLiked,
          likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
        };
      }
      return reel;
    }));
  };

  const handleShare = async (id) => {
    const url = `https://www.instagram.com/reel/${id}/`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Farmogram Reel', url });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const formatLikes = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const activeReelData = reelsData.find(r => r.id === activeCommentsReelId);

  return (
    <div className="reels-container">
      {reelsData.map((reel, index) => (
        <div key={reel.id} className="reel-item" data-id={reel.id}>
          <div className="reel-iframe-wrapper">
            {/* Top black overlay to hide Instagram header */}
            <div className="reel-overlay-top"></div>
            
            <iframe 
              key={`${reel.id}-${resetCounters[reel.id] || 0}`}
              className="reel-iframe"
              src={`https://www.instagram.com/p/${reel.id}/embed/?theme=dark`}
              frameBorder="0"
              scrolling="no"
              allowTransparency="true"
              allowFullScreen={true}
              title={`Instagram Reel ${index + 1}`}
            />
            
            {/* Bottom black overlay to hide Instagram footer */}
            <div className="reel-overlay-bottom"></div>
            
            {/* Edge overlays to completely hide scrollbars and white lines */}
            <div className="reel-overlay-left"></div>
            <div className="reel-overlay-right"></div>

            {/* Custom Native-like UI Overlay */}
            <div className="custom-reel-ui">
              {/* Bottom Left User Info */}
              <div className="reel-user-info">
                <img src={reel.avatar} alt={reel.username} className="reel-avatar" />
                <span className="reel-username">{reel.username}</span>
                <button className="reel-follow-btn" onClick={(e) => {
                  e.target.innerText = e.target.innerText === 'Follow' ? 'Following' : 'Follow';
                  e.target.style.background = e.target.innerText === 'Following' ? 'rgba(255,255,255,0.2)' : 'transparent';
                }}>Follow</button>
              </div>

              {/* Vertical Action Bar (Right Side) */}
              <div className="reel-actions-vertical">
                <button 
                  className="reel-action-btn" 
                  onClick={() => handleLike(reel.id)}
                  style={{ color: reel.isLiked ? '#ef4444' : '#fff' }}
                >
                  <Heart size={28} fill={reel.isLiked ? '#ef4444' : 'transparent'} />
                  <span>{formatLikes(reel.likes)}</span>
                </button>
                <button className="reel-action-btn" onClick={() => setActiveCommentsReelId(reel.id)}>
                  <MessageCircle size={28} />
                  <span>{reel.commentsList.length}</span>
                </button>
                <button className="reel-action-btn" onClick={() => handleShare(reel.id)}>
                  <Send size={28} />
                  <span>Share</span>
                </button>
                <button className="reel-action-btn" onClick={() => alert('Report submitted to moderators for review.')}>
                  <AlertTriangle size={24} />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Simulated Comments Bottom Sheet */}
      <div className={`comments-bottom-sheet ${activeCommentsReelId ? 'open' : ''}`}>
        <div className="comments-header">
          <h3>Comments</h3>
          <button className="close-comments-btn" onClick={() => setActiveCommentsReelId(null)}>×</button>
        </div>
        <div className="comments-list">
          {activeReelData?.commentsList.map((comment, idx) => (
            <div key={idx} className="comment-item">
              <img src={`https://ui-avatars.com/api/?name=${comment.user}&background=random`} alt={comment.user} className="comment-avatar" />
              <div className="comment-content">
                <span className="comment-username">@{comment.user}</span>
                <p className="comment-text">{comment.text}</p>
                <span className="comment-time">{comment.time}</span>
              </div>
              <button className="comment-like-btn"><Heart size={14} /></button>
            </div>
          ))}
        </div>
        <div className="comment-input-area">
          <input type="text" placeholder="Add a comment..." className="comment-input" />
          <button className="comment-send-btn"><Send size={18} /></button>
        </div>
      </div>

    </div>
  );
};
