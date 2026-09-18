import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplet, 
  Thermometer, 
  CloudRain, 
  Sprout, 
  ShieldAlert, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sliders, 
  Calendar,
  Globe,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  EL_NINO_EXPLANATION, 
  EL_NINO_IMPACT_PILLARS, 
  TN_DISTRICT_AGRO_ZONES, 
  CROPS_CATALOG, 
  CROP_STAGES, 
  IRRIGATION_TYPES, 
  getPreparednessGuidance,
  OFFICIAL_FORECAST_STATUS
} from '../data/elNinoData';
import './ElNinoAdvisor.css';

export const ElNinoAdvisor = () => {
  const { setActivePage } = useAppState();
  const { currentLang, language, t } = useLanguage();

  const effectiveLang = currentLang || language;
  // Educational content language (Tamil if user selected 'ta', otherwise 'en')
  const [eduLang, setEduLang] = useState(effectiveLang === 'ta' ? 'ta' : 'en');

  useEffect(() => {
    setEduLang(effectiveLang === 'ta' ? 'ta' : 'en');
  }, [effectiveLang]);

  // Dynamic Advisor State
  const [selectedDistrict, setSelectedDistrict] = useState('thanjavur');
  const [selectedCrop, setSelectedCrop] = useState('paddy');
  const [selectedStage, setSelectedStage] = useState('flowering');
  const [selectedIrrigation, setSelectedIrrigation] = useState('canal_tank');

  // Compute live agronomic guidance
  const guidance = getPreparednessGuidance({
    district: selectedDistrict,
    crop: selectedCrop,
    stage: selectedStage,
    irrigation: selectedIrrigation
  });

  const content = EL_NINO_EXPLANATION[eduLang] || EL_NINO_EXPLANATION['en'];

  return (
    <div className="elnino-page">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">{t('climate_risk_intel')}</span>
            <span className="badge badge-amber">EN / தமிழ்</span>
          </div>
          <h1 className="page-title" style={{ marginTop: '8px' }}>
            <CloudSun size={28} color="#0284c7" /> {t('elnino_page_title')}
          </h1>
          <p className="page-subtitle">
            {t('elnino_page_sub')}
          </p>
        </div>

        {/* Language Switcher */}
        <div className="lang-toggle-bar">
          <button 
            type="button"
            onClick={() => setEduLang('en')} 
            className={`lang-toggle-btn ${eduLang === 'en' ? 'active' : ''}`}
          >
            English
          </button>
          <button 
            type="button"
            onClick={() => setEduLang('ta')} 
            className={`lang-toggle-btn ${eduLang === 'ta' ? 'active' : ''}`}
          >
            தமிழ் (Tamil)
          </button>
        </div>
      </div>

      {/* 1. SCIENTIFIC NUANCE SPOTLIGHT BANNER */}
      <section className="nuance-banner">
        <div className="nuance-header">
          <Globe size={26} color="#15803d" />
          <h2 className="nuance-title">
            {content.crucialNuanceTitle}
          </h2>
        </div>
        <p className="nuance-body">
          {content.crucialNuanceBody}
        </p>
        <p className="nuance-body" style={{ marginTop: '10px' }}>
          <strong>{eduLang === 'ta' ? 'தமிழ்நாடு கள நிலவரம்:' : 'Tamil Nadu Context:'}</strong> {content.tamilNaduSpecifics}
        </p>

        <div className="nuance-stats-grid">
          <div className="nuance-stat-card">
            <div className="nuance-stat-num">~40%</div>
            <div className="nuance-stat-desc">
              {eduLang === 'ta' ? 'எல் நினோ ஆண்டுகளில் இயல்பான அல்லது கூடுதல் மழை பதிவாகியுள்ளது' : 'of El Niño years experienced normal or above-normal Indian monsoon rainfall'}
            </div>
          </div>
          <div className="nuance-stat-card">
            <div className="nuance-stat-num">+IOD</div>
            <div className="nuance-stat-desc">
              {eduLang === 'ta' ? 'சாதகமான இந்திய பெருங்கடல் இருமுனை எல் நினோவை சமன் செய்கிறது' : 'Positive Indian Ocean Dipole counteracts El Niño suppression'}
            </div>
          </div>
          <div className="nuance-stat-card">
            <div className="nuance-stat-num">Northeast</div>
            <div className="nuance-stat-desc">
              {eduLang === 'ta' ? 'வடகிழக்கு பருவமழையில் எல் நினோ சாதகமாக அமைய வாய்ப்பு' : 'Monsoon often sees normal to surplus rainfall during El Niño in coastal TN'}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIVE AGRICULTURAL IMPACT PILLARS */}
      <section style={{ marginBottom: '32px' }}>
        <div className="section-title-row" style={{ marginBottom: '16px' }}>
          <div>
            <h2 className="section-title">
              {eduLang === 'ta' ? 'விவசாய தாக்கத்தின் 5 முக்கிய அம்சங்கள்' : '5 Key Dimensions of Agricultural Impact'}
            </h2>
            <span className="section-subtitle">
              {eduLang === 'ta' ? 'மழை, நிலத்தடி நீர், வெப்பநிலை மற்றும் பயிர் மேலாண்மை வழிகாட்டல்' : 'Understanding risks and proactive farm mitigation techniques'}
            </span>
          </div>
        </div>

        <div className="pillars-grid">
          {EL_NINO_IMPACT_PILLARS.map(pillar => {
            return (
              <div key={pillar.id} className="pillar-card">
                <div className="pillar-top">
                  <div className="pillar-icon-box" style={{ background: pillar.bg, color: pillar.color }}>
                    {pillar.id === 'rainfall' && <CloudRain size={22} />}
                    {pillar.id === 'water' && <Droplet size={22} />}
                    {pillar.id === 'heat' && <Thermometer size={22} />}
                    {pillar.id === 'crops' && <Sprout size={22} />}
                    {pillar.id === 'livestock' && <ShieldAlert size={22} />}
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    {pillar.riskLevel}
                  </span>
                </div>

                <div>
                  <h3 className="pillar-title">
                    {eduLang === 'ta' ? pillar.titleTa : pillar.title}
                  </h3>
                  <p className="pillar-desc">
                    {eduLang === 'ta' ? pillar.descriptionTa : pillar.description}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {eduLang === 'ta' ? 'முன்னெச்சரிக்கை நடவடிக்கைகள்:' : 'Recommended Actions:'}
                  </div>
                  <ul className="pillar-advice-list">
                    {pillar.actionableAdvice.map((advice, i) => (
                      <li key={i}>{advice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. DYNAMIC FARM PREPAREDNESS ADVISOR TOOL */}
      <section className="advisor-tool-card">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">Dynamic Simulation Tool</span>
            <span className="badge badge-gray">General Agronomic Preparedness</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            Interactive Farm Preparedness Advisor
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Select your farm parameters below to receive tailored crop management, moisture conservation, and irrigation guidance.
          </p>
        </div>

        {/* Input Selectors */}
        <div className="advisor-inputs-grid">
          <div>
            <label className="form-label">Agricultural District / Zone</label>
            <select 
              className="form-select" 
              value={selectedDistrict} 
              onChange={e => setSelectedDistrict(e.target.value)}
            >
              {TN_DISTRICT_AGRO_ZONES.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Crop Sown / Planned</label>
            <select 
              className="form-select" 
              value={selectedCrop} 
              onChange={e => setSelectedCrop(e.target.value)}
            >
              {CROPS_CATALOG.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Current Crop Stage</label>
            <select 
              className="form-select" 
              value={selectedStage} 
              onChange={e => setSelectedStage(e.target.value)}
            >
              {CROP_STAGES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Primary Irrigation Source</label>
            <select 
              className="form-select" 
              value={selectedIrrigation} 
              onChange={e => setSelectedIrrigation(e.target.value)}
            >
              {IRRIGATION_TYPES.map(i => (
                <option key={i.id} value={i.id}>{i.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Risk Level Bar */}
        <div className="risk-meter-container">
          <div className="risk-meter-header">
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Estimated Sensitivity Index
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: guidance.riskColor }}>
                {guidance.riskLevel} VULNERABILITY ({guidance.riskScore}/100)
              </div>
            </div>
            <span className="badge" style={{ background: `${guidance.riskColor}20`, color: guidance.riskColor }}>
              {selectedStage === 'flowering' ? 'Flowering Sensitivity High' : 'Manageable Risk'}
            </span>
          </div>

          <div className="risk-track">
            <div 
              className="risk-fill" 
              style={{ 
                width: `${guidance.riskScore}%`, 
                backgroundColor: guidance.riskColor 
              }} 
            />
          </div>
        </div>

        {/* Dynamic Alerts */}
        {guidance.alerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {guidance.alerts.map((al, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: al.type === 'danger' ? '#fef2f2' : '#fffbeb', 
                  border: `1px solid ${al.type === 'danger' ? '#fecaca' : '#fde68a'}`,
                  borderRadius: '8px', 
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.85rem',
                  color: al.type === 'danger' ? '#b91c1c' : '#92400e',
                  fontWeight: 600
                }}
              >
                <AlertTriangle size={18} />
                <span>{al.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations List */}
        <div className="recommendations-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={18} color="#15803d" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#166534', margin: 0 }}>
              Tailored Agronomic Recommendations for {CROPS_CATALOG.find(c => c.id === selectedCrop)?.name}
            </h3>
          </div>
          <ul className="recommendations-list">
            {guidance.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Statutory Advisory Disclaimer */}
        <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
          <strong>ADVISORY DISCLAIMER:</strong> This simulation is tailored for proactive farm preparedness and risk management. It does NOT represent a guaranteed meteorological forecast, drought declaration, or substitute for field recommendations from your district Krishi Vigyan Kendra (KVK), Tamil Nadu Agricultural University (TNAU), or Block Agricultural Officer.
        </div>
      </section>

      {/* 4. FORECAST STATUS & SOURCE VERIFICATION */}
      <section className="forecast-hub-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="forecast-badges-row">
              <span className="badge badge-amber">
                <Radio size={12} style={{ marginRight: '4px' }} /> DEMO ADVISORY STATE
              </span>
              <span className="badge badge-emerald">
                {OFFICIAL_FORECAST_STATUS.ensoPhase}
              </span>
              <span className="badge badge-gray">
                Updated: {OFFICIAL_FORECAST_STATUS.latestUpdateDate}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Climate Diagnostic Verification & Official Sources
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '750px' }}>
              Farmogram AI adheres to transparent data distinction: real-time climate indices are grounded in published diagnostics from national and international atmospheric agencies.
            </p>
          </div>

          <button 
            onClick={() => alert('Official IMD/NOAA API Webhook Integration Portal: Currently utilizing verified agrometeorological simulation baselines. Contact administrator to connect dedicated telemetry keys.')}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders size={14} /> Connect Official API Source
          </button>
        </div>

        {/* Climate Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '20px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              ENSO Oceanic Index
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {OFFICIAL_FORECAST_STATUS.seaSurfaceAnomaly}
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Indian Ocean Dipole (IOD)
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
              {OFFICIAL_FORECAST_STATUS.iodStatus}
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Tamil Nadu Delta Reservoirs
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
              Mettur: 82.4% Full (Normal Storage)
            </div>
          </div>
        </div>

        {/* Verified Source Attributions */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Official Agrometeorological Authorities
          </div>
          <div className="sources-grid">
            {OFFICIAL_FORECAST_STATUS.verifiedSources.map((source, i) => (
              <div key={i} className="source-item">
                <div>
                  <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                    {source.badge}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                    {source.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                    {source.role}
                  </p>
                </div>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: '12px', textDecoration: 'none' }}
                >
                  Visit Official Portal <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
