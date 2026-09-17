import React, { useState, useRef } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  Droplet, 
  Globe, 
  Edit3, 
  CheckCircle2, 
  Bookmark, 
  FileText, 
  HelpCircle,
  Sprout,
  Camera,
  Upload,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { useLanguage } from '../context/LanguageContext';
import { soilTypes, locations, cropsList } from '../data/mockData';
import { PostCard } from '../components/feed/PostCard';
import { Modal } from '../components/common/Modal';
import { cropClaimService } from '../services/cropClaimService';

export const FarmerProfile = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { posts, questions, setActivePage } = useAppState();

  const [activeTab, setActiveTab] = useState('farm-info');
  const myDossiers = cropClaimService.getDossiers();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editVillage, setEditVillage] = useState(user.village);
  const [editDistrict, setEditDistrict] = useState(user.district);
  const [editLandArea, setEditLandArea] = useState(user.landArea);
  const [editSoilType, setEditSoilType] = useState(user.soilType);
  const [editWaterSource, setEditWaterSource] = useState(user.waterSource);
  const [editLanguage, setEditLanguage] = useState(user.language);

  const getInitials = (name) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 360;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        updateProfile({ avatar: dataUrl });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    updateProfile({ avatar: null });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      village: editVillage,
      district: editDistrict,
      landArea: editLandArea,
      soilType: editSoilType,
      waterSource: editWaterSource,
      language: editLanguage
    });
    setIsEditModalOpen(false);
  };

  const myPosts = posts.filter(p => p.author.name === user.name);
  const savedPosts = posts.filter(p => p.isSaved);
  const myQuestions = questions.filter(q => q.farmer.name.includes(user.name.split(' ')[0]));

  return (
    <div className="profile-page">
      {/* Profile Identity Hero */}
      <div className="farm-card profile-hero-card" style={{ padding: '28px 32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar with Camera Button Overlay */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ 
                    width: '88px', 
                    height: '88px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    border: '3px solid #22c55e', 
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)' 
                  }} 
                />
              ) : (
                <div 
                  style={{ 
                    width: '88px', 
                    height: '88px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #16a34a, #15803d)', 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800,
                    border: '3px solid #22c55e', 
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }} 
                >
                  {getInitials(user.name)}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload or change profile picture"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: '#16a34a',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  transition: 'transform 0.2s, background-color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Camera size={16} />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImageUpload} 
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</h1>
                <span className="badge badge-green">{t('registered_farmer')}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.86rem', color: '#64748b', marginTop: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#16a34a" /> {user.village}, {t(user.district) || user.district}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> {user.phone}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="btn btn-outline"
          >
            <Edit3 size={16} /> {t('edit_profile_btn')}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="feed-tabs-bar" style={{ marginBottom: '20px' }}>
        <div className="feed-tabs-group">
          <button 
            onClick={() => setActiveTab('farm-info')} 
            className={`feed-tab-btn ${activeTab === 'farm-info' ? 'active' : ''}`}
          >
            🌾 {t('tab_farm_info')}
          </button>
          <button 
            onClick={() => setActiveTab('my-posts')} 
            className={`feed-tab-btn ${activeTab === 'my-posts' ? 'active' : ''}`}
          >
            📝 {t('tab_my_posts')} ({myPosts.length})
          </button>
          <button 
            onClick={() => setActiveTab('saved-posts')} 
            className={`feed-tab-btn ${activeTab === 'saved-posts' ? 'active' : ''}`}
          >
            🔖 {t('tab_saved_posts')} ({savedPosts.length})
          </button>
          <button 
            onClick={() => setActiveTab('my-questions')} 
            className={`feed-tab-btn ${activeTab === 'my-questions' ? 'active' : ''}`}
          >
            ❓ {t('tab_my_questions')} ({myQuestions.length})
          </button>
          <button 
            onClick={() => setActiveTab('recommendations')} 
            className={`feed-tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          >
            🌱 {t('tab_sowing_history')}
          </button>
          <button 
            onClick={() => setActiveTab('claim-dossiers')} 
            className={`feed-tab-btn ${activeTab === 'claim-dossiers' ? 'active' : ''}`}
          >
            🛡️ {t('tab_claim_dossiers')} ({myDossiers.length})
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="profile-tab-content">
        {/* Tab 1: Farm Information */}
        {activeTab === 'farm-info' && (
          <div className="grid-2" style={{ gap: '20px' }}>
            <div className="farm-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                {t('land_holding_soil')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('cultivable_size')}:</span>
                  <strong style={{ color: '#0f172a' }}>{user.landArea} {t('land_acres')}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('dominant_soil')}:</span>
                  <strong style={{ color: '#16a34a' }}>{t(user.soilType) || user.soilType}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('irrigation_sources')}:</span>
                  <strong style={{ color: '#0284c7' }}>{t(user.waterSource) || user.waterSource}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('village_block')}:</span>
                  <strong>{user.village}, {t(user.district) || user.district}</strong>
                </div>
              </div>
            </div>

            <div className="farm-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                {t('primary_crops')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
                These crops configure your personalized community feed recommendations and microclimate spray alerts:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.primaryCrops.map(crop => (
                  <span key={crop} className="badge badge-green" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                    🌱 {t(crop) || crop}
                  </span>
                ))}
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>SOIL TYPE GUIDANCE</span>
                <p style={{ fontSize: '0.84rem', color: '#334155', marginTop: '4px' }}>
                  Your registered <strong>{t(user.soilType) || user.soilType}</strong> provides favorable texture for sustainable multi-season crop cycles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Posts */}
        {activeTab === 'my-posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myPosts.length > 0 ? (
              myPosts.map(p => <PostCard key={p.id} post={p} onOpenComments={() => {}} />)
            ) : (
              <div className="farm-card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No published posts yet. Share your field experiments with the Farmogram community!
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Posts */}
        {activeTab === 'saved-posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {savedPosts.length > 0 ? (
              savedPosts.map(p => <PostCard key={p.id} post={p} onOpenComments={() => {}} />)
            ) : (
              <div className="farm-card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No saved posts. Bookmark informative agricultural posts from the feed to review later.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: My Questions */}
        {activeTab === 'my-questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myQuestions.length > 0 ? (
              myQuestions.map(q => (
                <div key={q.id} className="farm-card" style={{ padding: '20px' }}>
                  <span className="badge badge-green">{t(q.farmer.crop) || q.farmer.crop}</span>
                  <p style={{ fontWeight: 700, margin: '8px 0', color: '#0f172a' }}>"{q.question}"</p>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Submitted {q.timestamp} • {q.answersCount} answers</span>
                </div>
              ))
            ) : (
              <div className="farm-card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                You haven't asked any expert questions yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="farm-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              {t('tab_sowing_history')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>Groundnut (VRI 8 / Kadiri 6)</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Recommended June 2026 • Suitability: 96%</div>
                </div>
                <span className="badge badge-green">Adopted</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>Shivam F1 Hybrid Tomato</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Recommended March 2026 • Suitability: 92%</div>
                </div>
                <span className="badge badge-green">Harvested (28 Tonnes)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Claim Dossiers */}
        {activeTab === 'claim-dossiers' && (
          <div className="farm-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {t('tab_claim_dossiers_title')}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Pre-survey evidence packets generated for PMFBY 72-hour reporting
                </div>
              </div>
              <button 
                onClick={() => setActivePage('crop-insurance-claim')} 
                className="btn btn-primary btn-sm"
              >
                + {t('record_new_claim')}
              </button>
            </div>

            {myDossiers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                No crop loss dossiers recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myDossiers.map(dossier => (
                  <div key={dossier.id} style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>{dossier.referenceNumber}</span>
                        <strong style={{ color: '#0f172a' }}>{t(dossier.cropName) || dossier.cropName}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                        Cause: {dossier.damageCause} • Affected: {dossier.affectedArea} ({dossier.affectedPercentage}%) • {dossier.photos?.length || 0} Photos
                      </div>
                    </div>
                    <button 
                      onClick={() => setActivePage('crop-insurance-claim')} 
                      className="btn btn-outline btn-sm"
                    >
                      {t('download_dossier_pdf')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title={`✏️ ${t('edit_profile_btn')}`}
      >
        <form onSubmit={handleSaveProfile}>
          {/* Profile Picture Management in Modal */}
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ marginBottom: '10px', display: 'block', fontWeight: 700 }}>Profile Photo</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #22c55e' }} 
                />
              ) : (
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem' }}>
                  {getInitials(user.name)}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={14} /> {user.avatar ? 'Change Photo' : 'Upload Photo'}
                </button>
                {user.avatar && (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                    onClick={handleRemovePhoto}
                  >
                    <Trash2 size={12} /> Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('full_name')}</label>
            <input 
              type="text" 
              className="form-input" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              required 
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('village_landmark')}</label>
              <input 
                type="text" 
                className="form-input" 
                value={editVillage} 
                onChange={(e) => setEditVillage(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('district')}</label>
              <select 
                className="form-select" 
                value={editDistrict} 
                onChange={(e) => setEditDistrict(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{t(loc) || loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('land_acres')}</label>
              <input 
                type="number" 
                step="0.5" 
                className="form-input" 
                value={editLandArea} 
                onChange={(e) => setEditLandArea(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('soil_type')}</label>
              <select 
                className="form-select" 
                value={editSoilType} 
                onChange={(e) => setEditSoilType(e.target.value)}
              >
                {soilTypes.map(st => (
                  <option key={st.id} value={st.name}>{t(st.name) || st.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('irrigation_sources')}</label>
            <input 
              type="text" 
              className="form-input" 
              value={editWaterSource} 
              onChange={(e) => setEditWaterSource(e.target.value)} 
            />
          </div>

          <div className="modal-footer" style={{ margin: '18px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('save_changes')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
