import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronRight, 
  ArrowLeft, 
  X, 
  Phone, 
  Flame, 
  Waves, 
  ShieldCheck, 
  HeartPulse, 
  Compass, 
  Volume2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { sosEmergencyService, sosEvents } from '../../services/sosEmergencyService';
import './SOSModal.css';

// Dynamic multi-language SOS Types & Categories
const getSOSTypes = (t) => [
  {
    id: 'ELEPHANT',
    name: t('sos_elephant_name'),
    emoji: '🐘',
    tagline: t('sos_elephant_tag'),
    severity: 'HIGH',
    color: '#d97706',
    bg: '#fef3c7'
  },
  {
    id: 'WILD_BOAR',
    name: t('sos_wild_boar_name'),
    emoji: '🐗',
    tagline: t('sos_wild_boar_tag'),
    severity: 'MEDIUM',
    color: '#b45309',
    bg: '#ffedd5'
  },
  {
    id: 'MONKEY',
    name: t('sos_monkey_name'),
    emoji: '🐒',
    tagline: t('sos_monkey_tag'),
    severity: 'LOW',
    color: '#ca8a04',
    bg: '#fef9c3'
  },
  {
    id: 'LEOPARD',
    name: t('sos_leopard_name'),
    emoji: '🐆',
    tagline: t('sos_leopard_tag'),
    severity: 'CRITICAL',
    color: '#dc2626',
    bg: '#fee2e2'
  },
  {
    id: 'BEAR',
    name: t('sos_bear_name'),
    emoji: '🐻',
    tagline: t('sos_bear_tag'),
    severity: 'HIGH',
    color: '#9a3412',
    bg: '#ffedd5'
  },
  {
    id: 'SNAKE',
    name: t('sos_snake_name'),
    emoji: '🐍',
    tagline: t('sos_snake_tag'),
    severity: 'HIGH',
    color: '#15803d',
    bg: '#dcfce7'
  },
  {
    id: 'OTHER_WILDLIFE',
    name: t('sos_other_wildlife_name'),
    emoji: '🦌',
    tagline: t('sos_other_wildlife_tag'),
    severity: 'MEDIUM',
    color: '#0369a1',
    bg: '#e0f2fe'
  },
  {
    id: 'OTHER_SOS',
    name: t('sos_other_sos_name'),
    emoji: '🚨',
    tagline: t('sos_other_sos_tag'),
    severity: 'HIGH',
    color: '#e11d48',
    bg: '#ffe4e6'
  }
];

const getOtherCategories = (t) => [
  { id: 'FIRE', name: t('sos_other_fire'), emoji: '🔥', desc: t('sos_other_fire_desc') },
  { id: 'FLOOD', name: t('sos_other_flood'), emoji: '🌊', desc: t('sos_other_flood_desc') },
  { id: 'THEFT', name: t('sos_other_theft'), emoji: '🛡️', desc: t('sos_other_theft_desc') },
  { id: 'LIVESTOCK_EMERGENCY', name: t('sos_other_livestock'), emoji: '🐄', desc: t('sos_other_livestock_desc') },
  { id: 'HUMAN_SAFETY', name: t('sos_other_human'), emoji: '⚠️', desc: t('sos_other_human_desc') },
  { id: 'STORM', name: t('sos_other_storm'), emoji: '🌪️', desc: t('sos_other_storm_desc') }
];

const getLocalizedSafetyGuidance = (typeId, t) => {
  switch (typeId) {
    case 'ELEPHANT': return t('sos_safety_elephant');
    case 'WILD_BOAR': return t('sos_safety_boar');
    case 'LEOPARD': return t('sos_safety_leopard');
    case 'BEAR': return t('sos_safety_bear');
    case 'SNAKE': return t('sos_safety_snake');
    case 'FIRE': return t('sos_safety_fire');
    default: return t('sos_safety_default');
  }
};

export const SOSModal = ({ isOpen, onClose, onOpenHistory }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const sosTypes = getSOSTypes(t);
  const otherCategories = getOtherCategories(t);

  // Steps: 'TYPE_SELECT' | 'OTHER_SELECT' | 'LOCATION_CONFIRM' | 'VOICE_CHOICE' | 'VOICE_RECORD' | 'NO_VOICE_FORM' | 'SUBMITTED'
  const [step, setStep] = useState('TYPE_SELECT');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedOtherCat, setSelectedOtherCat] = useState(null);

  // Location State
  const [location, setLocation] = useState({
    village: `${user?.district || 'Perundurai'} Agri Zone`,
    taluk: 'Perundurai',
    district: user?.district || 'Erode',
    state: 'Tamil Nadu',
    latitude: 11.2854,
    longitude: 77.5812,
    accuracy: 6.8,
    isManualEditing: false
  });

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioElementRef = useRef(null);

  // Structured No-Voice Options
  const [structuredData, setStructuredData] = useState({
    isDangerImmediate: false,
    isAnimalPresent: true,
    hasCropDamage: false,
    cropDamaged: user?.primaryCrops?.[0] || 'Tomatoes',
    description: ''
  });

  // Submitted Incident
  const [submittedIncident, setSubmittedIncident] = useState(null);

  // Acquire Live GPS coordinates when modal opens or moves to location step
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(prev => ({
            ...prev,
            latitude: Number(pos.coords.latitude.toFixed(5)),
            longitude: Number(pos.coords.longitude.toFixed(5)),
            accuracy: Math.round(pos.coords.accuracy) || 8
          }));
        },
        () => {
          // Fallback to default GPS coordinates
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isOpen]);

  // Clean up audio playback on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [audioUrl]);

  // Real-time updates subscription for submitted incident
  useEffect(() => {
    const unsub = sosEvents.subscribe('SOS_STATUS_UPDATED', (evt) => {
      if (submittedIncident && evt.payload.incidentId === submittedIncident.id) {
        setSubmittedIncident({ ...evt.payload.incident });
      }
    });
    return unsub;
  }, [submittedIncident]);

  if (!isOpen) return null;

  // Handle Selection of Primary Animal Card
  const handleSelectType = (typeObj) => {
    setSelectedType(typeObj);
    if (typeObj.id === 'OTHER_SOS') {
      setStep('OTHER_SELECT');
    } else {
      setStep('LOCATION_CONFIRM');
    }
  };

  // Handle Selection of "Other SOS" Subcategory
  const handleSelectOtherCat = (cat) => {
    setSelectedOtherCat(cat);
    setStep('LOCATION_CONFIRM');
  };

  // Start Real Microphone Recording using Web MediaRecorder API
  const startVoiceRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        // Stop audio tracks
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission not granted or unsupported:', err);
      // Simulate recorded audio note for sandbox environments
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
  };

  // Stop Recording
  const stopVoiceRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (!audioUrl) {
      // Fallback: Create simulated audio note
      const fallbackUrl = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      setAudioUrl(fallbackUrl);
    }
  };

  // Play / Pause Recorded Audio
  const togglePlayRecordedAudio = () => {
    if (!audioElementRef.current && audioUrl) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setIsPlayingRecorded(false);
    }

    if (audioElementRef.current) {
      if (isPlayingRecorded) {
        audioElementRef.current.pause();
        setIsPlayingRecorded(false);
      } else {
        audioElementRef.current.play();
        setIsPlayingRecorded(true);
      }
    }
  };

  // Reset and Re-record Audio
  const handleRerecord = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlayingRecorded(false);
    setRecordingDuration(0);
    startVoiceRecording();
  };

  // Submit Final SOS Incident (Voice or No-Voice)
  const handleSubmitSOS = (hasVoice = false) => {
    const sosCategory = selectedOtherCat ? selectedOtherCat.id : selectedType.id;
    const sosLabel = selectedOtherCat 
      ? selectedOtherCat.name 
      : `${selectedType.emoji} ${selectedType.name}`;

    const incident = sosEmergencyService.createSOSIncident({
      farmerId: user?.id || 'CURRENT_USER',
      farmerName: user?.name || 'Farmer',
      farmerPhone: user?.phone || '+91 98421 99881',
      sosType: selectedType.id,
      animalType: selectedType.id === 'OTHER_SOS' ? null : selectedType.id,
      animalLabel: sosLabel,
      isDangerImmediate: structuredData.isDangerImmediate,
      isAnimalPresent: structuredData.isAnimalPresent,
      hasCropDamage: structuredData.hasCropDamage,
      cropDamaged: structuredData.cropDamaged,
      latitude: location.latitude,
      longitude: location.longitude,
      gpsAccuracyMeters: location.accuracy,
      village: location.village,
      taluk: location.taluk,
      district: location.district,
      state: location.state,
      description: structuredData.description,
      voiceBlobUrl: hasVoice ? audioUrl : null,
      voiceAudioBlob: hasVoice ? audioBlob : null,
      voiceDurationSeconds: hasVoice ? recordingDuration : 0
    });

    setSubmittedIncident(incident);
    setStep('SUBMITTED');
  };

  return (
    <div className="sos-modal-overlay">
      <div className="sos-modal-container">
        
        {/* Modal Header */}
        <div className="sos-modal-header">
          <div className="sos-header-title-box">
            <div className="sos-alarm-pulse">
              <AlertTriangle size={20} color="#ffffff" />
            </div>
            <div>
              <h2>{t('sos_modal_title')}</h2>
              <p>{t('sos_modal_sub')}</p>
            </div>
          </div>
          <button className="sos-close-btn" onClick={onClose} title="Close SOS Window">
            <X size={20} />
          </button>
        </div>

        <div className="sos-modal-body">
          
          {/* STEP 1: SOS TYPE SELECTION */}
          {step === 'TYPE_SELECT' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 6px 0' }}>
                {t('sos_step1_title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                {t('sos_step1_desc')}
              </p>

              <div className="sos-animal-grid">
                {sosTypes.map(type => (
                  <div 
                    key={type.id}
                    className="sos-animal-card"
                    onClick={() => handleSelectType(type)}
                  >
                    <span className="animal-emoji-box">{type.emoji}</span>
                    <span className="animal-title">{type.name}</span>
                    <span className="animal-desc">{type.tagline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1B: OTHER SOS SUBCATEGORIES */}
          {step === 'OTHER_SELECT' && (
            <div>
              <button 
                onClick={() => setStep('TYPE_SELECT')}
                className="btn btn-sm btn-outline"
                style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> {t('sos_back_animal')}
              </button>

              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 6px 0' }}>
                {t('sos_select_other_title')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                {t('sos_select_other_desc')}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {otherCategories.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => handleSelectOtherCat(cat)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = '#fff5f5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
                  >
                    <span style={{ fontSize: '2rem' }}>{cat.emoji}</span>
                    <div>
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.95rem' }}>{cat.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{cat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION CONFIRMATION */}
          {step === 'LOCATION_CONFIRM' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '2.4rem' }}>{selectedType?.emoji || '🚨'}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
                    {selectedType?.name} {t('sos_incident_detected')}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                    {t('sos_step_verifying')}
                  </span>
                </div>
              </div>

              {/* Location Card */}
              <div className="location-preview-card">
                <div className="location-icon-pin">
                  <MapPin size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', color: '#0f172a', fontSize: '1rem' }}>
                    {t('sos_live_gps')}
                  </strong>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                    {location.village}, {location.taluk}, {location.district}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    GPS: <strong>{location.latitude}°N, {location.longitude}°E</strong> (±{location.accuracy}m accuracy)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
                    {t('sos_jurisdiction')}
                  </div>
                </div>
              </div>

              {/* Primary Authority Preview */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>
                  {t('sos_resp_authority')}
                </span>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem', marginTop: '2px' }}>
                  Sathyamangalam Tiger Reserve (STR) Rapid Response Team (RRT)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                  {t('sos_authority_desc')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setStep('TYPE_SELECT')}
                  className="btn btn-outline"
                >
                  {t('sos_change_type')}
                </button>
                <button 
                  onClick={() => setStep('VOICE_CHOICE')}
                  className="btn btn-primary"
                  style={{ background: '#dc2626', borderColor: '#dc2626', padding: '10px 24px', fontWeight: 700 }}
                >
                  {t('sos_confirm_location')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOICE — SPEAK OR CONTINUE WITHOUT VOICE */}
          {step === 'VOICE_CHOICE' && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0' }}>
                {t('sos_voice_choice_title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px auto' }}>
                {t('sos_voice_choice_desc')}
              </p>

              <div className="voice-choice-grid">
                {/* Option A: Speak */}
                <div 
                  className="voice-choice-btn primary-voice"
                  onClick={() => {
                    setStep('VOICE_RECORD');
                    startVoiceRecording();
                  }}
                >
                  <div className="voice-icon-circle" style={{ background: '#dc2626' }}>
                    <Mic size={28} />
                  </div>
                  <span className="voice-choice-title">{t('sos_speak_title')}</span>
                  <span className="voice-choice-sub">
                    {t('sos_speak_desc')}
                  </span>
                </div>

                {/* Option B: Continue Without Voice */}
                <div 
                  className="voice-choice-btn"
                  onClick={() => setStep('NO_VOICE_FORM')}
                >
                  <div className="voice-icon-circle" style={{ background: '#2563eb' }}>
                    <Send size={24} />
                  </div>
                  <span className="voice-choice-title">{t('sos_no_voice_title')}</span>
                  <span className="voice-choice-sub">
                    {t('sos_no_voice_desc')}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setStep('LOCATION_CONFIRM')}
                className="btn btn-sm btn-outline"
                style={{ marginTop: '10px' }}
              >
                <ArrowLeft size={16} /> {t('back')}
              </button>
            </div>
          )}

          {/* STEP 4A: VOICE RECORDING SCREEN */}
          {step === 'VOICE_RECORD' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 6px 0', textAlign: 'center' }}>
                {t('sos_tell_happened')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', marginBottom: '20px' }}>
                {t('sos_tell_happened_desc')}
              </p>

              <div className="audio-recorder-box">
                {!audioUrl ? (
                  <>
                    <button 
                      className={`record-pulse-btn ${isRecording ? 'recording' : ''}`}
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    >
                      {isRecording ? <Square size={28} /> : <Mic size={32} />}
                    </button>
                    <div className="recording-timer">
                      00:{(recordingDuration).toString().padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: isRecording ? '#dc2626' : '#64748b', fontWeight: 600 }}>
                      {isRecording ? t('sos_recording_stop') : t('sos_tap_record')}
                    </span>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#15803d', marginBottom: '12px' }}>
                      {t('sos_rec_captured')} ({recordingDuration}s)
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                      <button 
                        onClick={togglePlayRecordedAudio}
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        {isPlayingRecorded ? <Square size={16} /> : <Play size={16} />}
                        {isPlayingRecorded ? t('sos_pause_playback') : t('sos_listen_voice')}
                      </button>
                      <button 
                        onClick={handleRerecord}
                        className="btn btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        <RotateCcw size={16} /> {t('sos_rerecord')}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {t('sos_voice_guarantee')}
                    </p>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button 
                  onClick={() => setStep('VOICE_CHOICE')}
                  className="btn btn-outline"
                >
                  <ArrowLeft size={16} /> {t('back')}
                </button>
                <button 
                  onClick={() => handleSubmitSOS(true)}
                  disabled={!audioUrl}
                  className="btn btn-primary"
                  style={{ background: '#dc2626', borderColor: '#dc2626', padding: '10px 24px', fontWeight: 700 }}
                >
                  <Send size={18} /> {t('sos_send_with_voice')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4B: NO-VOICE QUICK STRUCTURED FORM */}
          {step === 'NO_VOICE_FORM' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 6px 0' }}>
                {t('sos_assessment_title')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '18px' }}>
                {t('sos_assessment_desc')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={structuredData.isDangerImmediate}
                    onChange={(e) => setStructuredData({ ...structuredData, isDangerImmediate: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: '#dc2626' }}
                  />
                  <div>
                    <strong style={{ color: '#dc2626', fontSize: '0.95rem' }}>{t('sos_danger_immediate')}</strong>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>{t('sos_danger_immediate_sub')}</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={structuredData.isAnimalPresent}
                    onChange={(e) => setStructuredData({ ...structuredData, isAnimalPresent: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: '#dc2626' }}
                  />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{t('sos_animal_present')}</strong>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>{t('sos_animal_present_sub')}</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={structuredData.hasCropDamage}
                    onChange={(e) => setStructuredData({ ...structuredData, hasCropDamage: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: '#dc2626' }}
                  />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{t('sos_damage_ongoing')}</strong>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>{t('sos_damage_ongoing_sub')}</span>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep('VOICE_CHOICE')} className="btn btn-outline">
                  <ArrowLeft size={16} /> {t('back')}
                </button>
                <button 
                  onClick={() => handleSubmitSOS(false)} 
                  className="btn btn-primary"
                  style={{ background: '#dc2626', borderColor: '#dc2626', padding: '10px 24px', fontWeight: 700 }}
                >
                  <Send size={18} /> {t('sos_send_now')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUBMITTED CONFIRMATION & REAL-TIME DISPATCH */}
          {step === 'SUBMITTED' && submittedIncident && (
            <div>
              <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 4px 0' }}>
                  {t('sos_sent_success')}
                </h3>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {t('sos_incident_ref')} <strong>#{submittedIncident.id}</strong>
                </span>
              </div>

              {/* Status Summary Pill Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('sos_type_col')}</span>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.95rem' }}>{submittedIncident.animalLabel}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('sos_gps_col')}</span>
                    <strong style={{ display: 'block', color: '#15803d', fontSize: '0.95rem' }}>{t('sos_transmitted')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('sos_voice_col')}</span>
                    <strong style={{ display: 'block', color: submittedIncident.hasVoiceNote ? '#15803d' : '#64748b', fontSize: '0.95rem' }}>
                      {submittedIncident.hasVoiceNote ? t('sos_delivered') : t('sos_no_voice')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('sos_status_col')}</span>
                    <strong style={{ display: 'block', color: '#dc2626', fontSize: '0.95rem' }}>{submittedIncident.status}</strong>
                  </div>
                </div>
              </div>

              {/* Real-Time Live Status Timeline */}
              <div className="sos-timeline-box">
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', marginBottom: '12px' }}>
                  {t('sos_realtime_status')}
                </strong>
                {submittedIncident.timeline.map((item, idx) => (
                  <div key={idx} className="sos-step-row">
                    <div className={`sos-step-dot ${item.completed ? 'active' : ''}`} />
                    <div style={{ flex: 1, fontSize: '0.85rem', color: item.completed ? '#0f172a' : '#94a3b8', fontWeight: item.completed ? 600 : 400 }}>
                      {item.label}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: item.completed ? '#16a34a' : '#94a3b8' }}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Official Safety Guidance */}
              <div className="safety-guidance-banner">
                <strong style={{ display: 'block', marginBottom: '4px' }}>{t('sos_safety_instructions')}</strong>
                {getLocalizedSafetyGuidance(selectedType?.id, t)}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <a 
                  href={`tel:${submittedIncident.assignedAuthority.officialPhone}`}
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Phone size={16} /> {t('sos_call_authority_btn')} ({submittedIncident.assignedAuthority.officialPhone})
                </a>
                <button 
                  onClick={onClose}
                  className="btn btn-primary"
                >
                  {t('sos_done_close')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
