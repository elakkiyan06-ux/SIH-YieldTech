import React, { useState } from 'react';
import { 
  Droplet, 
  Clock, 
  Calendar, 
  CloudSun, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Waves
} from 'lucide-react';
import { cropsList, soilTypes, irrigationScheduleMock } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const IrrigationRecommendation = () => {
  const { t } = useLanguage();
  const [crop, setCrop] = useState('');
  const [soilType, setSoilType] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [waterSource, setWaterSource] = useState('');

  const [schedule, setSchedule] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!crop || !soilType || !growthStage || !weatherCondition) return;
    const result = irrigationScheduleMock.getRecommendation(crop, soilType, growthStage, weatherCondition);
    setSchedule(result);
  };

  return (
    <div className="irrigation-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <Droplet size={28} color="#0284c7" /> {t('irrigation_title') || t('irrigation')}
        </h1>
        <p className="page-subtitle">
          {t('irrigation_sub') || t('irrigation_desc')}
        </p>
      </div>

      <div className="advisor-layout-grid">
        {/* Left Inputs Form */}
        <div className="farm-card">
          <h2 className="card-section-title">{t('field_moisture_params')}</h2>
          <p className="card-section-subtitle">{t('crop_stage_water_setup')}</p>

          <form onSubmit={handleCalculate} style={{ marginTop: '16px' }}>
            {/* 1. Crop Selection */}
            <div className="form-group">
              <label className="form-label">{t('crop_cultivated')}</label>
              <select className="form-select" value={crop} onChange={(e) => setCrop(e.target.value)} required>
                <option value="" disabled>{t('select_crop')}</option>
                {cropsList.map(c => (
                  <option key={c} value={c}>{t(c) || c}</option>
                ))}
              </select>
            </div>

            {/* 2. Soil Type */}
            <div className="form-group">
              <label className="form-label">{t('soil_type')}</label>
              <select className="form-select" value={soilType} onChange={(e) => setSoilType(e.target.value)} required>
                <option value="" disabled>{t('select_soil')}</option>
                {soilTypes.map(st => (
                  <option key={st.id} value={st.name}>{t(st.name) || st.name}</option>
                ))}
              </select>
            </div>

            {/* 3. Crop Growth Stage */}
            <div className="form-group">
              <label className="form-label">{t('crop_phenology_stage')}</label>
              <select className="form-select" value={growthStage} onChange={(e) => setGrowthStage(e.target.value)} required>
                <option value="" disabled>{t('select_growth_stage')}</option>
                <option value="Germination / Nursery (0-15 Days)">Germination / Nursery (0-15 Days)</option>
                <option value="Early Vegetative (16-35 Days)">Early Vegetative (16-35 Days)</option>
                <option value="Flowering / Pegging (36-60 Days)">Flowering / Pegging (36-60 Days)</option>
                <option value="Pod Development / Fruit Bulking (61-90 Days)">Pod Development / Fruit Bulking (61-90 Days)</option>
                <option value="Maturity & Pre-Harvest (90+ Days)">Maturity & Pre-Harvest (90+ Days)</option>
              </select>
            </div>

            {/* 4. Weather Context */}
            <div className="form-group">
              <label className="form-label">{t('weather_outlook')}</label>
              <select className="form-select" value={weatherCondition} onChange={(e) => setWeatherCondition(e.target.value)} required>
                <option value="" disabled>{t('select_weather_outlook')}</option>
                <option value="Rain expected tomorrow (35mm)">Rain expected tomorrow (35-45mm)</option>
                <option value="Dry & Sunny (No rain)">Dry & Sunny (No rain for 5 days)</option>
                <option value="High Humidity & Mild Clouds">High Humidity & Mild Clouds</option>
              </select>
            </div>

            {/* 5. Irrigation System */}
            <div className="form-group">
              <label className="form-label">{t('irrigation_system')}</label>
              <select className="form-select" value={waterSource} onChange={(e) => setWaterSource(e.target.value)} required>
                <option value="" disabled>{t('select_irrigation_system')}</option>
                <option value="Borewell with Inline Drip">Inline Drip Irrigation (2.4 LPH emitters)</option>
                <option value="Micro-Sprinkler System">Micro-Sprinkler System</option>
                <option value="Ridge & Furrow Surface Method">Ridge & Furrow Surface Method</option>
                <option value="Canal Basin Flooding">Canal Basin Flooding</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px' }}>
              💧 {t('calculate_schedule')}
            </button>
          </form>
        </div>

        {/* Right Output Dashboard */}
        <div className="irrigation-result-column">
          {!schedule ? (
            <div className="farm-card" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', border: '2px dashed #cbd5e1', background: '#f8fafc' }}>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '50%', padding: '20px', marginBottom: '20px' }}>
                <Waves size={40} color="#64748b" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '10px' }}>{t('ready_to_calculate')}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '320px', lineHeight: 1.5 }}>
                {t('ready_to_calculate_sub')}
              </p>
            </div>
          ) : (
            <div className="farm-card recommendation-card" style={{ borderTopColor: '#0284c7' }}>
            {/* Top Stat Ribbon */}
            <div className="rec-header-row">
              <div>
                <span className="badge badge-blue">{t('precision_hydrology')}</span>
                <div className="rec-crop-label" style={{ marginTop: '6px' }}>{t('recommended_irrigation')}</div>
                <h2 className="rec-crop-name" style={{ color: '#0369a1' }}>
                  {schedule.waterRequirement}
                </h2>
              </div>

              <div className="rec-match-pill" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
                <Clock size={24} color="#0284c7" style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0369a1' }}>{schedule.duration}</div>
                <div className="match-label" style={{ color: '#0284c7' }}>{t('cycle_duration')}</div>
              </div>
            </div>

            {/* Next Scheduled Irrigation Banner */}
            <div className="sowing-window-strip" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
              <div className="sowing-icon-wrap" style={{ color: '#0284c7' }}>
                <Calendar size={22} color="#0284c7" />
              </div>
              <div>
                <div className="sowing-title" style={{ color: '#0369a1' }}>{t('next_scheduled_irrigation')}</div>
                <div className="sowing-dates" style={{ color: '#0f172a' }}>{schedule.nextIrrigation}</div>
              </div>
            </div>

            {/* Agronomic Rationale */}
            <div className="rec-rationale-section">
              <h3 className="rationale-heading">
                <Info size={18} color="#0284c7" /> {t('scientific_rationale')}
              </h3>
              <p style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginTop: '8px' }}>
                {schedule.rationale}
              </p>
            </div>

            {/* 7-Day Water Management Plan */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '10px' }}>
                📅 {t('action_plan_7day')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {schedule.next7DayPlan.map((plan, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '10px 14px', 
                      background: idx === 0 ? '#eff6ff' : '#ffffff', 
                      border: idx === 0 ? '1.5px solid #bfdbfe' : '1px solid #e2e8f0', 
                      borderRadius: '8px', 
                      fontSize: '0.84rem' 
                    }}
                  >
                    <strong style={{ minWidth: '90px', color: '#1e293b' }}>{plan.day}:</strong>
                    <span style={{ color: '#475569' }}>{plan.action}</span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
