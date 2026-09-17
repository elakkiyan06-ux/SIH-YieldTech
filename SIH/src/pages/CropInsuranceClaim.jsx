import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Camera, 
  UploadCloud, 
  Phone, 
  Printer, 
  Trash2, 
  Eye, 
  Layers, 
  Info, 
  ArrowRight,
  ExternalLink,
  HelpCircle,
  PlusCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  cropClaimService, 
  claimEvents, 
  OFFICIAL_CLAIM_PROCEDURES 
} from '../services/cropClaimService';
import './CropInsuranceClaim.css';

const DAMAGE_CAUSES = [
  'Unseasonal Inundation & Severe Lodging',
  'Cyclone / High Wind Damage',
  'Flash Flood Submergence',
  'Severe Drought / Prolonged Dry Spell',
  'Hailstorm Physical Damage',
  'Pest Epidemic / Blast Disease Outbreak',
  'Post-Harvest Rain Damage (Cut Crop in Field)',
  'Landslide / Soil Erosion'
];

const COMMON_SYMPTOMS = [
  'Extensive crop lodging (flattening on muddy ground)',
  'Standing water submergence > 24 hours',
  'Panicle grain shedding & black discolouration',
  'Root zone rotting & anaerobic decay',
  'Severe leaf scorching / desiccation',
  'Immature flower or boll abscission',
  'Mold / fungal growth on standing pods'
];

export const CropInsuranceClaim = () => {
  const { user } = useAuth();
  const { setActivePage } = useAppState();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('dossiers'); // 'dossiers' | 'record' | 'checklist' | 'procedures'
  const [dossiers, setDossiers] = useState(() => cropClaimService.getDossiers());
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Form State for Recording New Claim Evidence
  const [cropName, setCropName] = useState(user?.primaryCrops?.[0] || 'Paddy (Kuruvai)');
  const [sowingDate, setSowingDate] = useState('2026-06-20');
  const [harvestDate, setHarvestDate] = useState('2026-10-15');
  const [village, setVillage] = useState(user?.village || 'Perundurai');
  const [taluk, setTaluk] = useState(user?.taluk || 'Perundurai');
  const [district, setDistrict] = useState(user?.district || 'Erode');
  const [surveyNumber, setSurveyNumber] = useState('Survey No. 154/2A, Patta 1980');
  const [totalArea, setTotalArea] = useState(user?.landArea || '4.0 Acres');
  const [affectedArea, setAffectedArea] = useState('3.0 Acres');
  const [affectedPercentage, setAffectedPercentage] = useState(75);
  const [damageDate, setDamageDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [damageCause, setDamageCause] = useState(DAMAGE_CAUSES[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([COMMON_SYMPTOMS[0], COMMON_SYMPTOMS[1]]);
  const [uploadedPhotos, setUploadedPhotos] = useState([
    {
      id: 'photo_demo_1',
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
      caption: 'Overview of inundated parcel with boundary landmark',
      timestamp: new Date().toLocaleString(),
      geoTagged: true
    }
  ]);
  const [customNotes, setCustomNotes] = useState('');
  const fileInputRef = useRef(null);

  // Listen to service updates
  useEffect(() => {
    const unsubCreated = claimEvents.subscribe('DOSSIER_CREATED', () => {
      setDossiers(cropClaimService.getDossiers());
    });
    const unsubUpdated = claimEvents.subscribe('DOSSIER_UPDATED', () => {
      setDossiers(cropClaimService.getDossiers());
    });
    const unsubDeleted = claimEvents.subscribe('DOSSIER_DELETED', () => {
      setDossiers(cropClaimService.getDossiers());
      setSelectedDossier(null);
    });

    return () => {
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
    };
  }, []);

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newPhoto = {
        id: `photo_${Date.now()}`,
        url: event.target.result,
        caption: `Evidence photo #${uploadedPhotos.length + 1} - ${village}`,
        timestamp: new Date().toLocaleString(),
        geoTagged: true
      };
      setUploadedPhotos(prev => [newPhoto, ...prev]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmitDossier = (e) => {
    e.preventDefault();

    const newDossier = cropClaimService.createDossier({
      farmerId: user?.id || 'FARMER-LOGGED-IN',
      farmerName: user?.name || 'Murugan P.',
      farmerPhone: user?.phone || '+91 98421 23456',
      farmerVillage: village,
      farmerTaluk: taluk,
      farmerDistrict: district,
      landSurveyNumber: surveyNumber,
      cropName,
      cultivationDates: {
        sowingDate,
        expectedHarvestDate: harvestDate
      },
      totalCultivatedArea: totalArea,
      affectedArea,
      affectedPercentage: Number(affectedPercentage),
      damageDate,
      damageCause,
      symptoms: selectedSymptoms,
      photos: uploadedPhotos,
      notes: customNotes
    });

    setSelectedDossier(newDossier);
    setActiveTab('dossiers');
    setIsSuccessModalOpen(true);
  };

  const handleChecklistToggle = (dossierId, key) => {
    cropClaimService.toggleChecklistItem(dossierId, key);
    if (selectedDossier && selectedDossier.id === dossierId) {
      setSelectedDossier(cropClaimService.getDossierById(dossierId));
    }
  };

  const activeDossier = selectedDossier || dossiers[0];
  const timelineEvents = activeDossier ? cropClaimService.calculateTimeline(activeDossier) : [];

  return (
    <div className="claim-page">
      {/* 1. URGENT 72-HOUR NOTICE BANNER */}
      <div className="claim-urgent-banner">
        <div className="claim-urgent-content">
          <div className="claim-urgent-icon">
            <Clock size={24} />
          </div>
          <div>
            <div className="claim-urgent-title">
              {t('mandatory_72h_notice')}
            </div>
            <p className="claim-urgent-desc">
              {t('claim_notice_desc')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="tel:14447" className="claim-helpline-chip">
            <Phone size={16} /> {t('call_toll_free_14447')}
          </a>
        </div>
      </div>

      {/* 2. HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-emerald">PMFBY Claim Assistance</span>
            <span className="badge badge-amber">{t('claim_hero_badge')}</span>
          </div>
          <h1 className="page-title" style={{ marginTop: '8px' }}>
            <ShieldAlert size={28} color="#16a34a" /> {t('claim_hero_title')}
          </h1>
          <p className="page-subtitle">
            {t('claim_hero_sub')}
          </p>
        </div>

        <button 
          onClick={() => {
            setSelectedDossier(null);
            setActiveTab('record');
          }}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <PlusCircle size={18} /> {t('record_new_claim')}
        </button>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="claim-nav-tabs">
        <button 
          onClick={() => setActiveTab('dossiers')} 
          className={`claim-tab-btn ${activeTab === 'dossiers' ? 'active' : ''}`}
        >
          <FileText size={18} /> {t('tab_claim_dossiers_title')} ({dossiers.length})
        </button>
        <button 
          onClick={() => setActiveTab('record')} 
          className={`claim-tab-btn ${activeTab === 'record' ? 'active' : ''}`}
        >
          <PlusCircle size={18} /> {t('tab_record_damage')}
        </button>
        <button 
          onClick={() => setActiveTab('checklist')} 
          className={`claim-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
        >
          <CheckCircle2 size={18} /> {t('tab_evidence_checklist')}
        </button>
        <button 
          onClick={() => setActiveTab('procedures')} 
          className={`claim-tab-btn ${activeTab === 'procedures' ? 'active' : ''}`}
        >
          <Info size={18} /> {t('tab_official_procedures')}
        </button>
      </div>

      {/* TAB 1: INCIDENT DOSSIERS & CHRONOLOGICAL TIMELINE */}
      {activeTab === 'dossiers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Left Column: Dossiers List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="claim-section-title">
              <Layers size={20} color="#15803d" /> Recorded Incidents
            </div>

            {dossiers.length === 0 ? (
              <div className="farm-card" style={{ padding: '32px', textAlign: 'center' }}>
                <AlertTriangle size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.05rem', color: '#1e293b' }}>No Damage Dossiers Recorded Yet</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                  If your crop suffered unseasonal rainfall, storm, or flood damage, create an incident dossier now to preserve photographic proof for survey officers.
                </p>
                <button 
                  onClick={() => setActiveTab('record')} 
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '16px' }}
                >
                  Record Damage Evidence Now
                </button>
              </div>
            ) : (
              dossiers.map(item => (
                <div 
                  key={item.id}
                  className={`farm-card ${activeDossier?.id === item.id ? 'active-border' : ''}`}
                  style={{ 
                    padding: '16px 20px', 
                    cursor: 'pointer',
                    borderLeft: activeDossier?.id === item.id ? '4px solid #16a34a' : '1px solid #e2e8f0',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setSelectedDossier(item)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div>
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                        {item.referenceNumber}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                        {item.cropName}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} /> {item.farmerVillage}, {item.farmerDistrict} • {item.landSurveyNumber}
                      </div>
                    </div>

                    <span className="badge badge-red" style={{ fontSize: '0.72rem' }}>
                      {item.affectedPercentage}% Damaged
                    </span>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>Incident: {new Date(item.damageDate).toLocaleDateString()}</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>
                      {item.photos?.length || 0} Photos Attached
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Detailed Dossier View & Printable Card */}
          {activeDossier && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="claim-section-title" style={{ margin: 0 }}>
                  <FileText size={20} color="#15803d" /> Incident Dossier Details
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => window.print()} 
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Print formal evidence dossier"
                  >
                    <Printer size={15} /> Print Dossier
                  </button>
                  <button 
                    onClick={() => cropClaimService.deleteDossier(activeDossier.id)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#fca5a5', color: '#dc2626' }}
                    title="Delete dossier"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Formal Dossier Card with Watermark */}
              <div className="dossier-card">
                <div className="dossier-watermark">
                  FARMER-REPORTED PRE-SURVEY EVIDENCE
                </div>

                <div className="dossier-header">
                  <div>
                    <span className="badge badge-emerald">Verified In-App Dossier</span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
                      Crop Loss Incident Dossier
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Generated under PMFBY & Disaster Relief Protocol • Ref: <strong>{activeDossier.referenceNumber}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Loss Severity</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#dc2626' }}>
                      {activeDossier.affectedPercentage}%
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {activeDossier.affectedArea} of {activeDossier.totalCultivatedArea}
                    </span>
                  </div>
                </div>

                {/* Farmer & Parcel Meta */}
                <div className="dossier-meta-grid">
                  <div className="dossier-meta-item">
                    <div className="dossier-meta-label">Farmer Name</div>
                    <div className="dossier-meta-value">{activeDossier.farmerName}</div>
                  </div>
                  <div className="dossier-meta-item">
                    <div className="dossier-meta-label">Land Parcel & Survey</div>
                    <div className="dossier-meta-value">{activeDossier.landSurveyNumber}</div>
                  </div>
                  <div className="dossier-meta-item">
                    <div className="dossier-meta-label">Location (Village / District)</div>
                    <div className="dossier-meta-value">{activeDossier.farmerVillage}, {activeDossier.farmerDistrict}</div>
                  </div>
                  <div className="dossier-meta-item">
                    <div className="dossier-meta-label">Crop & Variety</div>
                    <div className="dossier-meta-value">{activeDossier.cropName}</div>
                  </div>
                </div>

                {/* Damage Cause & Symptoms */}
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>
                    Reported Cause of Damage
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#c2410c', marginTop: '4px' }}>
                    {activeDossier.damageCause}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 700, marginBottom: '4px' }}>
                      Observed Physical Symptoms:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#7c2d12', lineHeight: 1.5 }}>
                      {activeDossier.symptoms?.map((sym, idx) => (
                        <li key={idx}>{sym}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Chronological Incident Timeline */}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📅 Chronological Incident Progression
                  </div>
                  <div className="timeline-container">
                    {timelineEvents.map((evt, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className={`timeline-dot ${evt.type}`} />
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="timeline-date">{evt.date}</span>
                            <span className={`badge badge-${evt.type === 'danger' ? 'red' : evt.type === 'warning' ? 'amber' : 'green'}`} style={{ fontSize: '0.65rem' }}>
                              {evt.badge}
                            </span>
                          </div>
                          <div className="timeline-event-title">{evt.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photographic Evidence Gallery */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📷 Photographic Evidence Attached ({activeDossier.photos?.length || 0})
                  </div>
                  <div className="damage-photos-grid">
                    {activeDossier.photos?.map((ph) => (
                      <div key={ph.id} className="damage-photo-item">
                        <img src={ph.url} alt={ph.caption} />
                        <span className="damage-photo-badge">
                          <MapPin size={10} /> Geotagged • {ph.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statutory Regulatory Disclaimer */}
                <div className="claim-disclaimer-box">
                  <strong>DISCLAIMER & REGULATORY NOTICE:</strong> This dossier represents farmer-reported observational evidence compiled using Farmogram AI for record preservation. It does NOT constitute official claim approval, an official insurance policy settlement, or a guaranteed compensation payout. Formal loss assessment and eligibility determinations are governed exclusively by authorized Joint Survey Committees under the Pradhan Mantri Fasal Bima Yojana (PMFBY) guidelines. Please ensure you have reported this incident to the National Crop Insurance Helpline (14447) or your local Agricultural Officer within 72 hours.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECORD NEW DAMAGE EVIDENCE FORM */}
      {activeTab === 'record' && (
        <div className="farm-card" style={{ padding: '28px', maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-emerald">Evidence Recording Wizard</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
              Document Crop Damage for Official Intimation
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Accurate records and clear photographs make field survey verification significantly faster when the insurance surveyor visits.
            </p>
          </div>

          <form onSubmit={handleSubmitDossier} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Crop & Parcel Identification */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '12px' }}>
                1. Crop & Land Parcel Identification
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label className="form-label">Affected Crop Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={cropName} 
                    onChange={e => setCropName(e.target.value)} 
                    required 
                    placeholder="e.g. Paddy (Kuruvai / CO 51), Turmeric"
                  />
                </div>
                <div>
                  <label className="form-label">Land Survey / Patta Number *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={surveyNumber} 
                    onChange={e => setSurveyNumber(e.target.value)} 
                    required 
                    placeholder="e.g. Survey No. 142/3B, Patta 2041"
                  />
                </div>
                <div>
                  <label className="form-label">Village / Habitation</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={village} 
                    onChange={e => setVillage(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">District</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={district} 
                    onChange={e => setDistrict(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Cultivation Dates & Area */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '12px' }}>
                2. Cultivation Dates & Affected Area
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label className="form-label">Sowing / Planting Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={sowingDate} 
                    onChange={e => setSowingDate(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Expected Harvest Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={harvestDate} 
                    onChange={e => setHarvestDate(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Total Sown Area</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={totalArea} 
                    onChange={e => setTotalArea(e.target.value)} 
                    required 
                    placeholder="e.g. 4.5 Acres"
                  />
                </div>
                <div>
                  <label className="form-label">Damaged / Affected Area</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={affectedArea} 
                    onChange={e => setAffectedArea(e.target.value)} 
                    required 
                    placeholder="e.g. 3.2 Acres"
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="form-label" style={{ margin: 0 }}>Estimated Crop Damage Severity (%)</span>
                    <strong style={{ color: affectedPercentage >= 70 ? '#dc2626' : '#ea580c' }}>{affectedPercentage}%</strong>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5" 
                    value={affectedPercentage} 
                    onChange={e => setAffectedPercentage(e.target.value)} 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Incident Timing & Cause */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '12px' }}>
                3. Incident Timing & Nature of Calamity
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label className="form-label">Date & Time of Incident *</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={damageDate} 
                    onChange={e => setDamageDate(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Primary Cause of Damage *</label>
                  <select 
                    className="form-select" 
                    value={damageCause} 
                    onChange={e => setDamageCause(e.target.value)}
                  >
                    {DAMAGE_CAUSES.map((cause, idx) => (
                      <option key={idx} value={cause}>{cause}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptoms Checklist */}
              <div style={{ marginTop: '16px' }}>
                <label className="form-label">Select Visible Damage Symptoms:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {COMMON_SYMPTOMS.map((sym, idx) => {
                    const isChecked = selectedSymptoms.includes(sym);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleSymptomToggle(sym)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: isChecked ? '1px solid #16a34a' : '1px solid #cbd5e1',
                          background: isChecked ? '#f0fdf4' : '#ffffff',
                          color: isChecked ? '#15803d' : '#475569',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {isChecked && <CheckCircle2 size={13} color="#16a34a" />}
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '12px' }}>
                4. Field Evidence Photographs
              </div>
              <div 
                className="photo-uploader-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={32} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                  Click to Upload Damage Photographs
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  Attach wide landscape shot showing field landmarks and close-ups of submerged/lodged crop
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="damage-photos-grid">
                  {uploadedPhotos.map((photo, i) => (
                    <div key={photo.id || i} className="damage-photo-item">
                      <img src={photo.url} alt={photo.caption} />
                      <span className="damage-photo-badge">
                        <MapPin size={10} /> {photo.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Notes */}
            <div>
              <label className="form-label">Additional Remarks / Local Officer Communication</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                value={customNotes} 
                onChange={e => setCustomNotes(e.target.value)} 
                placeholder="Mention if you informed the Village Administrative Officer (VAO), phoned 14447, or had localized cloudburst conditions..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                type="button" 
                onClick={() => setActiveTab('dossiers')} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <CheckCircle2 size={18} /> Save & Generate Incident Dossier
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: DOCUMENT CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="farm-card" style={{ padding: '28px', maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-emerald">Evidence Readiness Tracker</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
              Required Documents for Joint Loss Survey
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              When the Agriculture Department Officer and Insurance Company Surveyor arrive for the joint assessment, having these documents ready prevents claim delays.
            </p>
          </div>

          <div>
            {OFFICIAL_CLAIM_PROCEDURES.requiredDocuments.map(doc => {
              const isChecked = activeDossier?.checklist?.[doc.key] ?? false;
              return (
                <div 
                  key={doc.key}
                  className={`checklist-item ${isChecked ? 'checked' : ''}`}
                  onClick={() => {
                    if (activeDossier) {
                      handleChecklistToggle(activeDossier.id, doc.key);
                    }
                  }}
                >
                  <div className="checklist-label">
                    <div className="checklist-checkbox">
                      {isChecked && <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: 700 }}>
                        {doc.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: doc.required ? '#ea580c' : '#64748b', marginTop: '2px' }}>
                        {doc.required ? '★ Mandatory for PMFBY Claim Settlement' : 'Optional / Supplementary'}
                      </div>
                    </div>
                  </div>

                  <span className={`badge badge-${isChecked ? 'green' : 'gray'}`} style={{ fontSize: '0.72rem' }}>
                    {isChecked ? 'Ready ✓' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#166534' }}>
              Need official land records or sowing certificates?
            </div>
            <p style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '4px', lineHeight: 1.4 }}>
              Tamil Nadu farmers can download official Chitta/Patta copies online via the Tamil Nilam e-Services portal (eservices.tn.gov.in) or obtain an Adangal extract from the Village Administrative Officer (VAO).
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL PROCEDURES & HELPLINES */}
      {activeTab === 'procedures' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="farm-card" style={{ padding: '24px' }}>
            <div className="claim-section-title">
              <Info size={20} color="#15803d" /> Official PMFBY Claim Filing Protocol
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Official procedures as stipulated under the Operational Guidelines of Pradhan Mantri Fasal Bima Yojana (PMFBY), Ministry of Agriculture & Farmers Welfare, Govt of India.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {OFFICIAL_CLAIM_PROCEDURES.steps.map(s => (
                <div key={s.stepNumber} style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#16a34a', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.stepNumber}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                      {s.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Verification Hub */}
          <div className="farm-card" style={{ padding: '24px' }}>
            <div className="claim-section-title">
              <Phone size={20} color="#15803d" /> Official Government Portals & Helplines
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '14px' }}>
              <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid #fed7aa', background: '#fff7ed' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase' }}>
                  Toll-Free National Helpline
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#9a3412', marginTop: '4px' }}>
                  14447
                </div>
                <p style={{ fontSize: '0.78rem', color: '#9a3412', marginTop: '4px' }}>
                  National Crop Insurance Portal Helpline (24x7 Multi-lingual support).
                </p>
                <a href="tel:14447" className="btn btn-sm btn-primary" style={{ marginTop: '10px', background: '#ea580c', borderColor: '#ea580c' }}>
                  Dial 14447 Now
                </a>
              </div>

              <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                  Official Web Portal
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  pmfby.gov.in
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  Submit claim intimation directly and check insurance policy status online.
                </p>
                <a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" style={{ marginTop: '10px' }}>
                  Open PMFBY Portal <ExternalLink size={14} />
                </a>
              </div>

              <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                  Tamil Nadu Agri Dept
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  Uzhavan App & Extension Officers
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  Contact your local Assistant Director of Agriculture (ADA) or Village Extension Officer.
                </p>
                <button 
                  onClick={() => setActivePage('schemes')} 
                  className="btn btn-sm btn-outline" 
                  style={{ marginTop: '10px' }}
                >
                  View State Schemes <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
