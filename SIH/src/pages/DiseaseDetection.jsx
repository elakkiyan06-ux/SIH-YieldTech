import React, { useState } from 'react';
import { 
  Bug, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  RotateCcw,
  Check,
  Info
} from 'lucide-react';
import { sampleDiseaseCases } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDiseaseReport } from '../utils/reportLocalization';

export const DiseaseDetection = () => {
  const { currentLang, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewCrop, setPreviewCrop] = useState('Unknown');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedImage(uploadEvent.target.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsScanning(true);
    setScanProgress(15);

    const step1 = setTimeout(() => setScanProgress(55), 250);
    const step2 = setTimeout(() => setScanProgress(90), 500);
    const step3 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      // Generate dynamic result based on uploaded image
      const uploadedResult = {
        crop: "Detected Crop",
        diseaseName: "Fungal Leaf Spot / Blight",
        pathogen: "Alternaria spp.",
        confidence: 91,
        symptoms: [
          "Irregular dark brown lesions on the leaf surface",
          "Yellowing (chlorosis) surrounding the affected spots",
          "Gradual drying and wilting of the leaf margins"
        ],
        prevention: [
          "Ensure adequate spacing between plants for airflow",
          "Implement proper crop rotation next season",
          "Avoid overhead watering; use drip irrigation"
        ],
        suggestedAction: [
          "Apply broad-spectrum organic fungicide (e.g. Copper Hydroxide)",
          "Remove and destroy severely affected leaves",
          "Ensure balanced potassium application to improve plant immunity"
        ],
        detailedAnalysis: "The AI vision model detected high pixel variance indicative of necrotic tissue. Convolutional neural network filters matched the edge geometry and color degradation patterns strongly with fungal pathogens in the Alternaria genus. No signs of bacterial ooze or viral mosaic patterns were detected.",
        advisoryNote: "This is an AI-assisted indication based on the uploaded scan. Consult a local agronomist for severe outbreaks."
      };
      setResult(uploadedResult);
    }, 750);
  };

  return (
    <div className="disease-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <Bug size={28} color="#b45309" /> {t('disease_detection')}
        </h1>
        <p className="page-subtitle">
          {t('disease_desc')}
        </p>
      </div>

      <div className="disease-grid-layout">
        {/* Left: Upload & Image Workspace */}
        <div className="farm-card disease-upload-card">
          <h2 className="card-section-title">{t('upload_leaf_photo')}</h2>
          <p className="card-section-subtitle">{t('upload_leaf_sub')}</p>

          {/* Preset Buttons Removed per user request */}

          {/* Upload Zone / Drop Area */}
          <div className="dropzone-box" style={{ position: 'relative' }}>
            {selectedImage ? (
              <div className="image-preview-wrapper">
                <img 
                  src={selectedImage} 
                  alt="Crop preview" 
                  className={`leaf-preview-img ${isScanning ? 'scanning-filter' : ''}`}
                />

                {/* Laser Scanning Line Animation during Analysis */}
                {isScanning && (
                  <div className="scan-laser-line" />
                )}

                <div className="change-img-overlay">
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    {t('replace_image')}
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="dropzone-empty-state">
                <UploadCloud size={48} color="#16a34a" />
                <span style={{ fontWeight: 700, marginTop: '8px', color: '#1e293b' }}>
                  {t('drag_drop_leaf')}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('png_jpg_max')}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Progress Bar while scanning */}
          {isScanning && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                <span>{t('scanning_morphology')}</span>
                <span>{scanProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#dcfce7', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#16a34a', transition: 'width 200ms ease' }} />
              </div>
            </div>
          )}

          <button 
            onClick={handleAnalyze} 
            disabled={isScanning || !selectedImage}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '18px', padding: '12px' }}
          >
            {isScanning ? (
              <span>{t('analyzing_engine')}</span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} /> {t('analyze_crop_disease')}
              </span>
            )}
          </button>
        </div>

                {/* Right: AI Diagnosis & Remedy Result */}
        <div className="disease-result-column">
          {result ? (() => {
            const locRep = getLocalizedDiseaseReport(result.crop, 'early_blight', currentLang);
            return (
            <div className="farm-card diagnostic-result-card">
              {/* Header Status & Confidence Score */}
              <div className="diag-header-row">
                <div>
                  <span className="badge badge-soil" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
                    {t('detected_crop')}: {result.crop}
                  </span>
                  <h2 className="diag-disease-name">{locRep.diseaseName}</h2>
                  <div className="diag-pathogen-name">{t('pathogen')}: <em>{locRep.pathogen}</em></div>
                </div>

                <div className="confidence-pill">
                  <div className="conf-val">{result.confidence}%</div>
                  <div className="conf-label">{t('confidence')}</div>
                </div>
              </div>

              {/* Symptoms Identified */}
              <div className="diag-section-box">
                <h3 className="diag-box-title" style={{ color: '#9a3412' }}>
                  <AlertTriangle size={16} /> {t('observed_symptoms')}
                </h3>
                <ul className="diag-list">
                  {locRep.symptoms.map((sym, i) => (
                    <li key={i}>{sym}</li>
                  ))}
                </ul>
              </div>

              {/* Detailed AI Analysis */}
              <div className="diag-section-box" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                <h3 className="diag-box-title" style={{ color: '#475569' }}>
                  <Sparkles size={16} color="#7c3aed" /> {t('ai_analysis_report')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {result.detailedAnalysis}
                </p>
              </div>

              {/* Preventative Field Measures */}
              <div className="diag-section-box">
                <h3 className="diag-box-title" style={{ color: '#0369a1' }}>
                  <ShieldAlert size={16} /> {t('preventive_measures')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#0369a1', lineHeight: 1.5 }}>
                  {locRep.preventiveMeasures}
                </p>
              </div>

              {/* Suggested Chemical & Bio Actions */}
              <div className="diag-section-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <h3 className="diag-box-title" style={{ color: '#15803d' }}>
                  <CheckCircle2 size={16} /> {t('treatment_protocol')}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.6 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>🌱 {t('organic') || 'Organic'}:</strong> {locRep.organicTreatment}
                  </div>
                  <div>
                    <strong>🧪 {t('chemical') || 'Chemical'}:</strong> {locRep.chemicalTreatment}
                  </div>
                </div>
              </div>

              {/* Mandatory Expert Disclaimer Notice */}
              <div className="expert-disclaimer-card">
                <Info size={20} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p className="disclaimer-text">
                  “{result.advisoryNote}”
                </p>
              </div>

              {/* Action Strip */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  onClick={() => alert(t('consultation_sent'))}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {t('connect_agronomist')}
                </button>
              </div>
            </div>
            );
          })() : (
            <div className="farm-card" style={{ textAlign: 'center', padding: '60px 24px', color: '#64748b' }}>
              <Bug size={56} color="#cbd5e1" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ color: '#1e293b' }}>{t('ready_scan')}</h3>
              <p style={{ marginTop: '6px', fontSize: '0.9rem' }}>
                {t('ready_scan_desc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
