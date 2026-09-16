import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Play, 
  Square, 
  CheckCircle2, 
  Users, 
  Navigation, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Search, 
  Compass, 
  ShieldCheck, 
  Flame, 
  Radio, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { sosEmergencyService, sosEvents, VERIFIED_AUTHORITIES } from '../services/sosEmergencyService';
import './OfficerDashboard.css';

export const OfficerDashboard = () => {
  const [incidents, setIncidents] = useState(() => sosEmergencyService.getIncidents());
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'authorities'
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioElementRef = useRef(null);

  // Subscribe to real-time events from farmers submitting SOS
  useEffect(() => {
    const unsub = sosEvents.subscribe('*', () => {
      setIncidents([...sosEmergencyService.getIncidents()]);
    });
    return unsub;
  }, []);

  // Play / Stop original voice note
  const handleToggleVoice = (incident) => {
    if (playingAudioId === incident.id) {
      audioElementRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioElementRef.current) audioElementRef.current.pause();

      if (incident.voiceBlobUrl) {
        audioElementRef.current = new Audio(incident.voiceBlobUrl);
      } else {
        // Fallback simulation: Audio notification tone
        audioElementRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      }

      audioElementRef.current.onended = () => setPlayingAudioId(null);
      audioElementRef.current.play();
      setPlayingAudioId(incident.id);
    }
  };

  // Officer Actions
  const handleAcknowledge = (id) => {
    sosEmergencyService.updateIncidentStatus(id, 'OFFICER_ACKNOWLEDGED', {
      officerNote: 'Duty Officer acknowledged receipt. RRT alerted.'
    });
    setIncidents([...sosEmergencyService.getIncidents()]);
  };

  const handleAssignTeam = (id) => {
    sosEmergencyService.updateIncidentStatus(id, 'TEAM_ASSIGNED', {
      assignedOfficer: {
        name: 'R. Soundararajan (Forest Range Officer)',
        team: 'Hasanur Rapid Response Team (RRT) Unit #1',
        phone: '+91 94431 88201',
        vehicle: 'Forest Patrol 4x4 (TN 33 G 4410)'
      }
    });
    setIncidents([...sosEmergencyService.getIncidents()]);
  };

  const handleResponding = (id) => {
    sosEmergencyService.updateIncidentStatus(id, 'RESPONDING');
    setIncidents([...sosEmergencyService.getIncidents()]);
  };

  const handleResolve = (id) => {
    sosEmergencyService.updateIncidentStatus(id, 'RESOLVED');
    setIncidents([...sosEmergencyService.getIncidents()]);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return { label: 'CRITICAL THREAT', color: '#dc2626', bg: '#fee2e2' };
      case 'HIGH':
        return { label: 'HIGH PRIORITY', color: '#ea580c', bg: '#ffedd5' };
      case 'MEDIUM':
        return { label: 'MEDIUM', color: '#ca8a04', bg: '#fef9c3' };
      default:
        return { label: 'LOW', color: '#16a34a', bg: '#dcfce7' };
    }
  };

  return (
    <div className="officer-dashboard-container">
      {/* Hero Header */}
      <div className="officer-hero-banner">
        <div>
          <h1 className="officer-hero-title">
            <Radio size={26} color="#ef4444" /> Wildlife Conflict & Forest Emergency Control Room
          </h1>
          <p className="officer-hero-sub">
            Tamil Nadu Forest Department • Sathyamangalam & Erode Division Live Dispatch Console
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="officer-live-indicator">
            <span className="officer-live-dot" />
            <span>DISPATCH ONLINE 24/7</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="transport-tabs-bar" style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('incidents')}
          className={`transport-tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
        >
          🚨 Active SOS Emergency Feeds ({incidents.filter(i => i.status !== 'RESOLVED').length})
        </button>
        <button 
          onClick={() => setActiveTab('authorities')}
          className={`transport-tab-btn ${activeTab === 'authorities' ? 'active' : ''}`}
        >
          🏛️ Verified Authority Directory ({VERIFIED_AUTHORITIES.length})
        </button>
      </div>

      {/* TAB 1: INCIDENTS FEED */}
      {activeTab === 'incidents' && (
        <div className="officer-incidents-list">
          {incidents.map((incident) => {
            const sevBadge = getSeverityBadge(incident.severity);
            const isResolved = incident.status === 'RESOLVED';

            return (
              <div 
                key={incident.id} 
                className={`officer-incident-card ${incident.severity.toLowerCase()} ${isResolved ? 'opacity-75' : ''}`}
              >
                {/* Header */}
                <div className="officer-incident-header">
                  <div className="incident-title-row">
                    <div className="incident-emoji-box">
                      {incident.sosType === 'ELEPHANT' ? '🐘' :
                       incident.sosType === 'WILD_BOAR' ? '🐗' :
                       incident.sosType === 'MONKEY' ? '🐒' :
                       incident.sosType === 'LEOPARD' ? '🐆' :
                       incident.sosType === 'BEAR' ? '🐻' :
                       incident.sosType === 'SNAKE' ? '🐍' :
                       incident.sosType === 'FIRE' ? '🔥' : '🚨'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
                          {incident.animalLabel} Incident #{incident.id}
                        </h3>
                        <span 
                          style={{ 
                            background: sevBadge.bg, 
                            color: sevBadge.color, 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            padding: '3px 8px', 
                            borderRadius: '6px' 
                          }}
                        >
                          {sevBadge.label}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Reported by <strong>{incident.farmerName}</strong> ({incident.farmerPhone}) • {new Date(incident.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                      Status: {incident.status}
                    </span>
                  </div>
                </div>

                {/* Location & Jurisdiction Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>📍 FARM LOCATION</span>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginTop: '2px' }}>
                      {incident.village}, {incident.taluk}, {incident.district}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      GPS: {incident.latitude}°N, {incident.longitude}°E (±{incident.gpsAccuracyMeters}m)
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>🏛️ ASSIGNED FOREST RANGE</span>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginTop: '2px' }}>
                      {incident.forestDivision}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600, marginTop: '2px' }}>
                      Primary: {incident.assignedAuthority.name}
                    </div>
                  </div>
                </div>

                {/* ORIGINAL FARMER VOICE NOTE PLAYER */}
                {incident.hasVoiceNote ? (
                  <div className="officer-audio-player-box">
                    <div className="audio-label-group">
                      <Volume2 size={20} color="#15803d" />
                      <div>
                        <strong style={{ display: 'block', color: '#15803d', fontSize: '0.9rem' }}>
                          🎤 Original Farmer Voice Note ({incident.voiceDurationSeconds || 16}s)
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                          Unaltered natural language recording sent from farm site.
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggleVoice(incident)}
                      className="audio-play-trigger-btn"
                    >
                      {playingAudioId === incident.id ? <Square size={16} /> : <Play size={16} />}
                      {playingAudioId === incident.id ? 'Pause Voice' : 'Play Original Audio'}
                    </button>
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', margin: '14px 0', fontSize: '0.82rem', color: '#64748b' }}>
                    ℹ️ Farmer selected: <strong>Continue Without Voice</strong> (Structured text incident).
                  </div>
                )}

                {/* Incident Description / Structured notes */}
                {incident.description && (
                  <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', padding: '12px 16px', margin: '14px 0', fontSize: '0.88rem', color: '#854d0e' }}>
                    <strong>Farmer Report:</strong> "{incident.description}"
                  </div>
                )}

                {/* Structured Assessment Tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0' }}>
                  {incident.isDangerImmediate && (
                    <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontWeight: 700 }}>
                      ⚠️ Human Threat Immediate
                    </span>
                  )}
                  {incident.isAnimalPresent && (
                    <span className="badge badge-green">
                      Animal Currently Present
                    </span>
                  )}
                  {incident.hasCropDamage && (
                    <span className="badge badge-amber">
                      Crop Damage: {incident.cropDamaged || 'Active'}
                    </span>
                  )}
                </div>

                {/* Officer Action Toolbar */}
                <div className="officer-action-toolbar">
                  {incident.status === 'SENT' && (
                    <button 
                      onClick={() => handleAcknowledge(incident.id)}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#2563eb', borderColor: '#2563eb' }}
                    >
                      <CheckCircle2 size={16} /> Acknowledge Alert
                    </button>
                  )}

                  {incident.status === 'OFFICER_ACKNOWLEDGED' && (
                    <button 
                      onClick={() => handleAssignTeam(incident.id)}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#16a34a' }}
                    >
                      <Users size={16} /> Assign Rapid Response Team (RRT)
                    </button>
                  )}

                  {incident.status === 'TEAM_ASSIGNED' && (
                    <button 
                      onClick={() => handleResponding(incident.id)}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#fff' }}
                    >
                      <Navigation size={16} /> Mark Vehicle Responding (En Route)
                    </button>
                  )}

                  {!isResolved && (
                    <button 
                      onClick={() => handleResolve(incident.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#16a34a', borderColor: '#16a34a' }}
                    >
                      <CheckCircle2 size={16} /> Mark Incident Resolved
                    </button>
                  )}

                  <a 
                    href={`tel:${incident.farmerPhone}`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Phone size={14} /> Call Farmer ({incident.farmerPhone})
                  </a>

                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${incident.latitude},${incident.longitude}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Navigation size={14} /> GPS Navigation
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: VERIFIED AUTHORITIES DIRECTORY */}
      {activeTab === 'authorities' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {VERIFIED_AUTHORITIES.map(auth => (
            <div key={auth.id} className="farm-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{auth.authorityType}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Verified: {auth.verifiedDate}</span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#0f172a' }}>{auth.name}</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>{auth.department}</p>

              <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
                • <strong>District:</strong> {auth.district}, {auth.state}<br />
                • <strong>Covered Ranges:</strong> {auth.ranges.join(', ')}<br />
                • <strong>Direct Emergency Phone:</strong> <a href={`tel:${auth.officialPhone}`} style={{ color: '#dc2626', fontWeight: 700 }}>{auth.officialPhone}</a><br />
                • <strong>Toll-Free Helpline:</strong> {auth.tollFreeEmergency}
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Source: {auth.sourceUrl}</span>
                <a href={auth.sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Verify <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
