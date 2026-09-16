import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  Video, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Activity,
  ArrowRight,
  Tractor,
  Wrench,
  Phone,
  Trash2,
  MapPin,
  Search,
  Check,
  Ban
} from 'lucide-react';
import { adminMetrics } from '../data/mockData';
import { equipmentRentalService, equipmentEvents } from '../services/equipmentRentalService';

export const AdminDashboard = () => {
  const [reports, setReports] = useState(adminMetrics.reportsList);
  const [experts, setExperts] = useState(adminMetrics.pendingExperts);
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'experts' | 'equipment' | 'system'

  // Equipment Fleet Management State
  const [equipmentFleet, setEquipmentFleet] = useState(() => equipmentRentalService.getAllRawListings());
  const [equipmentReports, setEquipmentReports] = useState(() => equipmentRentalService.getReports());
  const [equipmentStats, setEquipmentStats] = useState(() => equipmentRentalService.getAdminStats());
  const [equipmentSearch, setEquipmentSearch] = useState('');

  const refreshEquipmentData = () => {
    setEquipmentFleet(equipmentRentalService.getAllRawListings());
    setEquipmentReports(equipmentRentalService.getReports());
    setEquipmentStats(equipmentRentalService.getAdminStats());
  };

  useEffect(() => {
    const unsub = equipmentEvents.subscribe('*', () => {
      refreshEquipmentData();
    });
    return unsub;
  }, []);

  const handleDismissReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    alert('Report dismissed as harmless agricultural discourse.');
  };

  const handleRemoveContent = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    alert('Content flagged and removed from public Farmogram feed.');
  };

  const handleApproveExpert = (id, name) => {
    setExperts(prev => prev.filter(e => e.id !== id));
    alert(`Agronomist credentials verified. Verified Expert Badge awarded to ${name}!`);
  };

  // Equipment Moderation Actions
  const handleDismissEquipmentReport = (reportId) => {
    equipmentRentalService.dismissReport(reportId);
    refreshEquipmentData();
    alert('Report dismissed. Equipment listing verified as compliant.');
  };

  const handleRemoveEquipmentListing = (listingId, reportId) => {
    equipmentRentalService.removeListingByAdmin(listingId, reportId);
    refreshEquipmentData();
    alert('Equipment listing removed from public marketplace for compliance violation.');
  };

  const handleToggleEquipmentStatus = (id) => {
    equipmentRentalService.toggleAvailability(id);
    refreshEquipmentData();
  };

  // Filtered Equipment Fleet
  const filteredFleet = equipmentFleet.filter(item => {
    if (!equipmentSearch) return true;
    const q = equipmentSearch.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.ownerName?.toLowerCase().includes(q) ||
      item.location?.district?.toLowerCase().includes(q) ||
      item.categoryLabel?.toLowerCase().includes(q)
    );
  });

  const pendingEqReports = equipmentReports.filter(r => r.status === 'PENDING_REVIEW');

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <ShieldAlert size={28} color="#dc2626" /> Farmogram AI — SIH Administrative Oversight
        </h1>
        <p className="page-subtitle">
          Platform governance portal for content moderation, agricultural machinery compliance, and agronomist verification.
        </p>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="farm-card" style={{ padding: '18px 20px', borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Farmers</span>
            <Users size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            {adminMetrics.totalFarmers}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
            {adminMetrics.newFarmersToday} new registrations today
          </span>
        </div>

        <div className="farm-card" style={{ padding: '18px 20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Rental Machinery Fleet</span>
            <Tractor size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            {equipmentStats.totalListings} Units
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Across {equipmentStats.uniqueOwners} verified owners
          </span>
        </div>

        <div className="farm-card" style={{ padding: '18px 20px', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Equipment Enquiries</span>
            <FileText size={18} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            {equipmentStats.totalEnquiries}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700 }}>Direct farmer-owner bookings</span>
        </div>

        <div className="farm-card" style={{ padding: '18px 20px', borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pending Moderation</span>
            <AlertTriangle size={18} color="#dc2626" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            {reports.length + pendingEqReports.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>
            {pendingEqReports.length} machinery flags pending
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="feed-tabs-bar" style={{ marginBottom: '20px' }}>
        <div className="feed-tabs-group">
          <button 
            onClick={() => setActiveTab('moderation')} 
            className={`feed-tab-btn ${activeTab === 'moderation' ? 'active' : ''}`}
          >
            🚨 Post Moderation ({reports.length})
          </button>
          <button 
            onClick={() => setActiveTab('equipment')} 
            className={`feed-tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
          >
            🚜 Equipment Rental Moderation ({pendingEqReports.length})
          </button>
          <button 
            onClick={() => setActiveTab('experts')} 
            className={`feed-tab-btn ${activeTab === 'experts' ? 'active' : ''}`}
          >
            🎓 Expert Verification ({experts.length})
          </button>
          <button 
            onClick={() => setActiveTab('system')} 
            className={`feed-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          >
            ⚙️ System Metrics & Infrastructure
          </button>
        </div>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="farm-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Flagged Community Posts Awaiting Agronomic Review
          </h3>

          {reports.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reports.map(rep => (
                <div 
                  key={rep.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    background: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.98rem', color: '#991b1b' }}>"{rep.postTitle}"</strong>
                      <span className="badge badge-red">{rep.status}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: '4px' }}>
                      Author: <strong>{rep.author}</strong> • Reason: <em>{rep.reason}</em> • Reported: {rep.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleDismissReport(rep.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      <CheckCircle2 size={14} /> Dismiss Report
                    </button>
                    <button 
                      onClick={() => handleRemoveContent(rep.id)}
                      className="btn btn-sm"
                      style={{ background: '#dc2626', color: '#fff' }}
                    >
                      <XCircle size={14} /> Remove Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px', color: '#16a34a' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 8px auto' }} />
              <h4>All reported posts have been resolved! Community feed is compliant.</h4>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Equipment Rental Moderation */}
      {activeTab === 'equipment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section A: Reported Machinery Queue */}
          <div className="farm-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                  🚨 Flagged Machinery Listings Queue ({pendingEqReports.length})
                </h3>
                <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Farmer community reports regarding inflated prices, unavailability, or misleading specifications.
                </span>
              </div>
            </div>

            {pendingEqReports.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingEqReports.map(rep => (
                  <div 
                    key={rep.id}
                    style={{
                      background: '#fef2f2',
                      border: '1.5px solid #fecaca',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-red">Report #{rep.id}</span>
                        <strong style={{ fontSize: '1rem', color: '#991b1b' }}>{rep.listingTitle}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#7f1d1d', marginTop: '6px', lineHeight: 1.5 }}>
                        • <strong>Reason:</strong> {rep.reason}<br />
                        • <strong>Details:</strong> "{rep.details}"<br />
                        • <strong>Owner:</strong> {rep.ownerName} ({rep.ownerPhone}) • Reported by: {rep.reportedBy}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <a 
                        href={`tel:${rep.ownerPhone}`}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={14} /> Call Owner
                      </a>

                      <button 
                        onClick={() => handleDismissEquipmentReport(rep.id)}
                        className="btn btn-secondary btn-sm"
                      >
                        <CheckCircle2 size={14} /> Dismiss Flag
                      </button>

                      <button 
                        onClick={() => handleRemoveEquipmentListing(rep.listingId, rep.id)}
                        className="btn btn-sm"
                        style={{ background: '#dc2626', color: '#ffffff', fontWeight: 700 }}
                      >
                        <Trash2 size={14} /> Remove Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 6px auto' }} />
                <strong style={{ color: '#15803d', display: 'block' }}>Zero Flagged Machinery Listings</strong>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  All agricultural equipment registered by owners is in good standing with positive farmer feedback.
                </span>
              </div>
            )}
          </div>

          {/* Section B: Full Registered Machinery Fleet Directory */}
          <div className="farm-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                  🚜 Active Agricultural Fleet Directory ({filteredFleet.length})
                </h3>
                <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Manage registered tractors, harvesters, JCBs, and implements across Tamil Nadu agro-corridors.
                </span>
              </div>

              {/* Search Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px' }}>
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  value={equipmentSearch}
                  onChange={(e) => setEquipmentSearch(e.target.value)}
                  placeholder="Filter machinery or owner..."
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '10px 14px' }}>Equipment Title</th>
                    <th style={{ padding: '10px 14px' }}>Category</th>
                    <th style={{ padding: '10px 14px' }}>Owner & Contact</th>
                    <th style={{ padding: '10px 14px' }}>Location</th>
                    <th style={{ padding: '10px 14px' }}>Rental Rate</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFleet.map(eq => {
                    const isAvail = eq.status === 'AVAILABLE';
                    return (
                      <tr key={eq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: '#0f172a', display: 'block' }}>{eq.title}</strong>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>ID: {eq.id}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                            {eq.categoryLabel || eq.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div>{eq.ownerName}</div>
                          <a href={`tel:${eq.ownerPhone}`} style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                            {eq.ownerPhone}
                          </a>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569' }}>
                          {eq.location?.village}, {eq.location?.district}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: '#15803d' }}>₹{eq.price}/{eq.priceUnit}</strong>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button 
                            onClick={() => handleToggleEquipmentStatus(eq.id)}
                            style={{
                              background: isAvail ? '#dcfce7' : '#f1f5f9',
                              color: isAvail ? '#15803d' : '#64748b',
                              border: 'none',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title="Click to toggle status"
                          >
                            {isAvail ? 'Available ✓' : 'Busy'}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove ${eq.title}?`)) {
                                handleRemoveEquipmentListing(eq.id);
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Delete equipment listing"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Expert Verification */}
      {activeTab === 'experts' && (
        <div className="farm-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Agronomist & Scientist Verification Applications
          </h3>

          {experts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {experts.map(exp => (
                <div 
                  key={exp.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    background: '#f0fdf4', 
                    border: '1px solid #bbf7d0', 
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '1.02rem', color: '#14532d' }}>{exp.name}</strong>
                      <span className="badge badge-green">Candidate</span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#166534', marginTop: '4px' }}>
                      Specialization: <strong>{exp.specialization}</strong> • Credentials: {exp.degree}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px' }}>
                      Institutional Verification: <code>{exp.docProof}</code>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApproveExpert(exp.id, exp.name)}
                    className="btn btn-primary btn-sm"
                  >
                    <ShieldCheck size={14} /> Award Verified Badge
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px', color: '#16a34a' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 8px auto' }} />
              <h4>All agronomist verification requests are up to date!</h4>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: System Health */}
      {activeTab === 'system' && (
        <div className="grid-2" style={{ gap: '20px' }}>
          <div className="farm-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Platform Uptime & Telemetry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Availability Uptime:</span>
                <strong>{adminMetrics.systemUptime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Equipment Rental Engine:</span>
                <strong style={{ color: '#16a34a' }}>Online & Synchronized ({equipmentStats.totalListings} Units)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Mandi APMC Scraper:</span>
                <strong style={{ color: '#16a34a' }}>Synchronized (10 mins ago)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Weather Microclimate API:</span>
                <strong style={{ color: '#16a34a' }}>Active (Coimbatore station)</strong>
              </div>
            </div>
          </div>

          <div className="farm-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>SIH Prototype Architecture</h3>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
              Farmogram AI integrates real-time decision support with an agricultural machinery sharing and pooling economy. Equipment distance calculations use high-precision Haversine calculations over Tamil Nadu agricultural centers, helping smallholders minimize machinery downtime and rental expenses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
