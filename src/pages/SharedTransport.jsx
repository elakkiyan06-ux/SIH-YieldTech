import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Navigation, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  RefreshCw, 
  X, 
  Share2, 
  FileText, 
  Layers, 
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { transportService, transportEvents, AGRI_MARKETS } from '../services/transportService';
import './SharedTransport.css';

export const SharedTransport = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Active sub-tab: 'dashboard' | 'create' | 'tracking' | 'driver-mode' | 'history'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Form State for creating a new transport request
  const [formData, setFormData] = useState({
    produceType: 'Hybrid Tomatoes',
    quantityKg: 800,
    pickupLocation: `${user?.district || 'Perundurai Village'}, Erode`,
    destinationMarketId: 'MKT-01',
    pickupDate: new Date().toISOString().split('T')[0],
    preferredTime: '08:00 AM',
    flexibleWindowMinutes: 30,
    vehicleTypePreference: 'Mini Truck (Tata Ace Gold)',
    maxBudget: 2200,
    allowSharing: true
  });

  // Active requests, matches, and shared bookings
  const [userRequest, setUserRequest] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMatches, setActiveMatches] = useState([]);
  const [currentMatchProposal, setCurrentMatchProposal] = useState(null);
  const [activeBooking, setActiveBooking] = useState(() => transportService.getBookings()[0] || null);
  const [matchCountdown, setMatchCountdown] = useState(180);
  const [notificationBanner, setNotificationBanner] = useState(null);

  // Real-time event listener subscription
  useEffect(() => {
    const unsubMatchFound = transportEvents.subscribe('TRANSPORT_REQUEST_CREATED', (evt) => {
      setNotificationBanner({
        type: 'info',
        title: 'New Transport Request Created',
        message: `Request #${evt.payload.id} for ${evt.payload.quantityKg} kg ${evt.payload.produceType} is now searching for pool matches.`
      });
    });

    const unsubBookingCreated = transportEvents.subscribe('SHARED_BOOKING_CREATED', (evt) => {
      setActiveBooking(evt.payload);
      setNotificationBanner({
        type: 'success',
        title: 'Shared Transport Confirmed! 🚜',
        message: `Booking #${evt.payload.id} locked. Driver ${evt.payload.driver.name} assigned.`
      });
    });

    const unsubTripUpdated = transportEvents.subscribe('TRIP_STATUS_UPDATED', (evt) => {
      setActiveBooking({ ...evt.payload.booking });
    });

    return () => {
      unsubMatchFound();
      unsubBookingCreated();
      unsubTripUpdated();
    };
  }, []);

  // Handle route transfer from "Where Should I Sell?"
  useEffect(() => {
    try {
      const raw = localStorage.getItem('farmogram_transfer_transport');
      if (raw) {
        const parsed = JSON.parse(raw);
        setFormData(prev => ({
          ...prev,
          produceType: parsed.crop || prev.produceType,
          quantityKg: parsed.quantityKg || prev.quantityKg,
          pickupLocation: parsed.farmLocation || prev.pickupLocation,
          maxBudget: parsed.estCost ? Math.round(parsed.estCost * 1.2) : prev.maxBudget
        }));
        setActiveTab('create');
        setNotificationBanner({
          type: 'info',
          title: `Route Imported: ${parsed.destinationName}`,
          message: `Transport details imported for ${parsed.crop} (${parsed.quantityKg} kg) to ${parsed.destinationName} (${parsed.district}).`
        });
        localStorage.removeItem('farmogram_transfer_transport');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Countdown timer for match proposal
  useEffect(() => {
    let interval = null;
    if (currentMatchProposal && matchCountdown > 0) {
      interval = setInterval(() => {
        setMatchCountdown(prev => prev - 1);
      }, 1000);
    } else if (matchCountdown === 0 && currentMatchProposal) {
      setCurrentMatchProposal(null);
      setNotificationBanner({
        type: 'warning',
        title: 'Match Offer Expired',
        message: 'The shared transport proposal expired. Continuing search for other nearby farmers.'
      });
    }
    return () => clearInterval(interval);
  }, [currentMatchProposal, matchCountdown]);

  // Handle Request Submission
  const handleCreateRequest = (e) => {
    e.preventDefault();
    const market = AGRI_MARKETS.find(m => m.id === formData.destinationMarketId);
    const created = transportService.createRequest({
      ...formData,
      farmerId: user?.id || 'CURRENT_USER',
      farmerName: user?.name || 'Velu (You)',
      farmerPhone: user?.phone || '+91 98421 99881',
      destinationMarketName: market ? market.name : 'Central Vegetable Market'
    });

    setUserRequest(created);
    setIsSearching(true);
    setActiveTab('dashboard');

    // Simulate real-time search radar and matching
    setTimeout(() => {
      const matches = transportService.findMatches(created);
      setActiveMatches(matches);
      setIsSearching(false);
      if (matches.length > 0) {
        setCurrentMatchProposal(matches[0]);
        setMatchCountdown(180);
      }
    }, 2200);
  };

  // Farmer Accepts the Match Proposal
  const handleAcceptMatch = async (match) => {
    try {
      const confirmedBooking = await transportService.confirmSharedBooking(match);
      setCurrentMatchProposal(null);
      setActiveBooking(confirmedBooking);
      setActiveTab('tracking');
    } catch (err) {
      alert(err.message || 'Unable to confirm booking');
    }
  };

  // Farmer Declines the Match Proposal
  const handleDeclineMatch = () => {
    setCurrentMatchProposal(null);
    setNotificationBanner({
      type: 'info',
      title: 'Match Declined',
      message: 'Searching for alternative transport requests...'
    });
  };

  // Simulate Trip Progress Steps
  const handleSimulateNextStep = () => {
    if (!activeBooking) return;
    const statusCycle = [
      'BOOKED',
      'DRIVER_ASSIGNED',
      'DRIVER_EN_ROUTE',
      'ARRIVED_PICKUP_1',
      'PICKUP_1_COMPLETED',
      'ARRIVED_PICKUP_2',
      'PICKUP_2_COMPLETED',
      'IN_TRANSIT',
      'ARRIVED_MARKET',
      'COMPLETED'
    ];
    const currentIndex = statusCycle.indexOf(activeBooking.status);
    if (currentIndex >= 0 && currentIndex < statusCycle.length - 1) {
      const nextStatus = statusCycle[currentIndex + 1];
      const updated = transportService.updateTripProgress(activeBooking.id, nextStatus);
      setActiveBooking({ ...updated });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BOOKED':
      case 'DRIVER_ASSIGNED':
        return { label: 'Driver Assigned', bg: '#dbeafe', color: '#1d4ed8' };
      case 'DRIVER_EN_ROUTE':
        return { label: 'Driver En Route', bg: '#fef3c7', color: '#b45309' };
      case 'PICKUP_1_COMPLETED':
        return { label: 'Pickup 1 Loaded (800 kg)', bg: '#fef3c7', color: '#b45309' };
      case 'PICKUP_2_COMPLETED':
        return { label: 'Pickup 2 Loaded (600 kg)', bg: '#fef3c7', color: '#b45309' };
      case 'IN_TRANSIT':
        return { label: 'In Transit to Mandi', bg: '#dcfce7', color: '#15803d' };
      case 'ARRIVED_MARKET':
        return { label: 'Arrived at Mandi Gate', bg: '#dcfce7', color: '#15803d' };
      case 'COMPLETED':
        return { label: 'Delivered & Settled', bg: '#f0fdf4', color: '#16a34a' };
      default:
        return { label: status, bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div className="transport-container">
      {/* 1. HERO BANNER */}
      <div className="transport-hero-card">
        <div>
          <h1 className="transport-hero-title" style={{ color: '#ffffff' }}>
            <Truck size={30} style={{ color: '#ffffff' }} /> Real-Time Shared Transport Hub
          </h1>
          <p className="transport-hero-subtitle">
            Share vehicle space with nearby farmers heading to the same mandi. 
            Reduce your transport costs by <strong>40% to 60%</strong> with automatic weight-based cost splitting.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('create')}
          className="btn btn-primary"
          style={{ background: '#ffffff', color: '#15803d', fontWeight: 700, padding: '12px 24px' }}
        >
          <PlusCircle size={20} /> Create Transport Request
        </button>
      </div>

      {/* Notification Banner */}
      {notificationBanner && (
        <div 
          className="farm-card" 
          style={{ 
            marginBottom: '20px', 
            padding: '14px 20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: notificationBanner.type === 'success' ? '#f0fdf4' : '#eff6ff',
            borderColor: notificationBanner.type === 'success' ? '#bbf7d0' : '#bfdbfe'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={20} color={notificationBanner.type === 'success' ? '#16a34a' : '#2563eb'} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0f172a' }}>{notificationBanner.title}</strong>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>{notificationBanner.message}</span>
            </div>
          </div>
          <button 
            onClick={() => setNotificationBanner(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* 2. STATS OVERVIEW */}
      <div className="transport-metrics-row">
        <div className="transport-metric-card">
          <div className="metric-icon-box" style={{ background: '#dcfce7', color: '#15803d' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="metric-number">₹18,450</div>
            <div className="metric-label">Total Community Pooling Savings</div>
          </div>
        </div>

        <div className="transport-metric-card">
          <div className="metric-icon-box" style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <Truck size={24} />
          </div>
          <div>
            <div className="metric-number">3 Verified</div>
            <div className="metric-label">Vehicles Standing By in Erode</div>
          </div>
        </div>

        <div className="transport-metric-card">
          <div className="metric-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="metric-number">2 Farmers</div>
            <div className="metric-label">In Current Shared Pool</div>
          </div>
        </div>

        <div className="transport-metric-card">
          <div className="metric-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="metric-number">100%</div>
            <div className="metric-label">Mandi Delivery Guarantee</div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="transport-tabs-bar">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`transport-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <Layers size={18} /> Pooling Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`transport-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
        >
          <PlusCircle size={18} /> Create Request
        </button>
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`transport-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
        >
          <Compass size={18} /> Live Trip & Route Tracking
        </button>
        <button 
          onClick={() => setActiveTab('driver-mode')}
          className={`transport-tab-btn ${activeTab === 'driver-mode' ? 'active' : ''}`}
        >
          <Navigation size={18} /> Driver Portal Mode
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Searching Radar State */}
          {isSearching && (
            <div className="radar-box">
              <div className="radar-circle-outer">
                <div className="radar-pulse-center">
                  <Truck size={28} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 8px 0' }}>
                Finding Compatible Nearby Farmers...
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
                Scanning for farmers heading to <strong>Central Vegetable Market</strong> around 08:00 AM. 
                Checking vehicle capacity and route efficiency...
              </p>
            </div>
          )}

          {/* Active Match Proposal Modal / Card */}
          {currentMatchProposal && (
            <div className="match-proposal-card">
              <div className="match-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#16a34a" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
                      🚜 Shared Transport Match Found!
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Compatible farmer found • Expires in: <strong>{Math.floor(matchCountdown / 60)}:{(matchCountdown % 60).toString().padStart(2, '0')}</strong>
                    </span>
                  </div>
                </div>

                <div className="match-score-pill">
                  <Sparkles size={16} /> Compatibility: {currentMatchProposal.compatibilityScore}%
                </div>
              </div>

              {/* Match Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>CO-FARMER</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginTop: '2px' }}>
                    {currentMatchProposal.matchedFarmer.farmerName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                    📦 {currentMatchProposal.matchedFarmer.quantityKg} kg {currentMatchProposal.matchedFarmer.produceType}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', marginTop: '4px' }}>
                    📍 Pickup: {currentMatchProposal.pickupDistanceKm} km from your farm
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>VEHICLE ALLOCATION</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginTop: '2px' }}>
                    {currentMatchProposal.vehicle.vehicleType}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                    Combined Load: <strong>{currentMatchProposal.combinedQuantity} kg</strong> / {currentMatchProposal.vehicleCapacity} kg
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#2563eb', marginTop: '4px' }}>
                    Driver: {currentMatchProposal.vehicle.driverName} ({currentMatchProposal.vehicle.driverRating}★)
                  </div>
                </div>
              </div>

              {/* Transparent Cost Breakdown Table */}
              <h4 style={{ fontSize: '0.95rem', color: '#1e293b', marginBottom: '8px' }}>
                💰 Transparent Weight-Based Cost Splitting
              </h4>
              <table className="cost-split-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Produce Weight</th>
                    <th>Solo Vehicle Cost</th>
                    <th>Your Shared Share</th>
                    <th>Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>You (Farmer A)</strong></td>
                    <td>{currentMatchProposal.requestA.quantityKg} kg</td>
                    <td>₹{currentMatchProposal.totalVehicleCost}</td>
                    <td style={{ fontWeight: 800, color: '#15803d' }}>₹{currentMatchProposal.userShare}</td>
                    <td><span className="saving-badge-highlight">Save ₹{currentMatchProposal.userSavings} (43%)</span></td>
                  </tr>
                  <tr>
                    <td><strong>{currentMatchProposal.matchedFarmer.farmerName} (Farmer B)</strong></td>
                    <td>{currentMatchProposal.matchedFarmer.quantityKg} kg</td>
                    <td>₹{currentMatchProposal.totalVehicleCost}</td>
                    <td style={{ fontWeight: 800, color: '#15803d' }}>₹{currentMatchProposal.otherFarmerShare}</td>
                    <td><span className="saving-badge-highlight">Save ₹{currentMatchProposal.otherFarmerSavings} (57%)</span></td>
                  </tr>
                </tbody>
              </table>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  onClick={handleDeclineMatch}
                  className="btn btn-outline"
                >
                  Decline
                </button>
                <button 
                  onClick={() => handleAcceptMatch(currentMatchProposal)}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontWeight: 700 }}
                >
                  <CheckCircle2 size={18} /> Accept Shared Transport
                </button>
              </div>
            </div>
          )}

          {/* Active Shared Booking Status Card */}
          {activeBooking && (
            <div className="farm-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>ACTIVE SHARED TRIP</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>#{activeBooking.id}</span>
                  </div>
                  <h3 style={{ margin: '4px 0', fontSize: '1.3rem', color: '#0f172a' }}>
                    {activeBooking.destinationMarket}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Scheduled Departure: <strong>{activeBooking.pickupTime}, {activeBooking.pickupDate}</strong>
                  </span>
                </div>

                <div style={{ 
                  background: getStatusBadge(activeBooking.status).bg, 
                  color: getStatusBadge(activeBooking.status).color,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {getStatusBadge(activeBooking.status).label}
                </div>
              </div>

              {/* Vehicle Capacity Bar */}
              <div className="capacity-gauge-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>Vehicle Capacity Utilization</span>
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>
                    {activeBooking.usedCapacity} kg / {activeBooking.totalCapacity} kg (70% full)
                  </span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill" style={{ width: `${(activeBooking.usedCapacity / activeBooking.totalCapacity) * 100}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                  <span>{activeBooking.vehicleName} ({activeBooking.vehicleReg})</span>
                  <span>{activeBooking.remainingCapacity} kg capacity remaining</span>
                </div>
              </div>

              {/* Co-Farmers Sharing this Trip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '20px 0' }}>
                {activeBooking.participants.map(part => (
                  <div key={part.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{part.farmerName}</strong>
                      <span className="badge badge-green">Confirmed ✓</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
                      Load: <strong>{part.quantityKg} kg {part.produceType}</strong>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                      📍 {part.pickupLocation}
                    </div>
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Cost Share:</span>
                      <strong style={{ color: '#15803d', fontSize: '1rem' }}>₹{part.costShare}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button 
                  onClick={() => setActiveTab('tracking')}
                  className="btn btn-primary"
                >
                  <Navigation size={18} /> Open Live Route Tracker
                </button>
                <a 
                  href={`tel:${activeBooking.driver.phone}`}
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Phone size={16} /> Call Driver ({activeBooking.driver.name})
                </a>
              </div>
            </div>
          )}

          {/* Past Transport Pooling History */}
          <div className="farm-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 16px 0' }}>
              📜 Recent Transport Pooling History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>Erode Central Market • 750 kg Turmeric</strong>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Completed on 02 Sept 2026 • Shared with Selvam M.</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#15803d' }}>Paid ₹1,120</strong>
                  <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>Saved ₹880 (44%)</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>Perundurai Mandi • 500 kg Onions</strong>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Completed on 26 Aug 2026 • Shared with K. Ramasamy</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#15803d' }}>Paid ₹750</strong>
                  <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>Saved ₹650 (46%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE TRANSPORT REQUEST FORM */}
      {activeTab === 'create' && (
        <div className="farm-card" style={{ padding: '28px', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            🌾 Create Shared Transport Request
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            Submit your produce details. Our real-time matching engine will immediately find compatible farmers heading to the same market.
          </p>

          <form onSubmit={handleCreateRequest}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Agricultural Produce Type *
                </label>
                <input 
                  type="text"
                  required
                  value={formData.produceType}
                  onChange={(e) => setFormData({ ...formData, produceType: e.target.value })}
                  className="ai-settings-input"
                  placeholder="e.g. Tomatoes, Onions, Turmeric"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Total Produce Quantity (kg) *
                </label>
                <input 
                  type="number"
                  required
                  min="50"
                  max="3000"
                  value={formData.quantityKg}
                  onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                  className="ai-settings-input"
                  placeholder="e.g. 800"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Pickup Farm / Village Location *
                </label>
                <input 
                  type="text"
                  required
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="ai-settings-input"
                  placeholder="e.g. Perundurai Village, Erode"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Destination Mandi / Market *
                </label>
                <select 
                  value={formData.destinationMarketId}
                  onChange={(e) => setFormData({ ...formData, destinationMarketId: e.target.value })}
                  className="ai-settings-select"
                >
                  {AGRI_MARKETS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Preferred Pickup Date *
                </label>
                <input 
                  type="date"
                  required
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="ai-settings-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Preferred Pickup Time *
                </label>
                <input 
                  type="text"
                  required
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="ai-settings-input"
                  placeholder="08:00 AM"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Flexible Time Window
                </label>
                <select 
                  value={formData.flexibleWindowMinutes}
                  onChange={(e) => setFormData({ ...formData, flexibleWindowMinutes: e.target.value })}
                  className="ai-settings-select"
                >
                  <option value={15}>± 15 Minutes</option>
                  <option value={30}>± 30 Minutes (Recommended)</option>
                  <option value={45}>± 45 Minutes (Maximum Pooling Chance)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Preferred Vehicle Class
                </label>
                <select 
                  value={formData.vehicleTypePreference}
                  onChange={(e) => setFormData({ ...formData, vehicleTypePreference: e.target.value })}
                  className="ai-settings-select"
                >
                  <option value="Mini Truck (Tata Ace Gold)">Mini Truck (Tata Ace - Up to 2,000 kg)</option>
                  <option value="Pickup Truck (Mahindra Bolero Maxi)">Pickup Truck (Bolero Maxi - Up to 2,500 kg)</option>
                  <option value="Medium Truck (Eicher Pro 2049)">Medium Truck (Eicher Pro - Up to 4,000 kg)</option>
                </select>
              </div>
            </div>

            {/* Sharing Opt-in Toggle */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input 
                type="checkbox"
                id="shareToggle"
                checked={formData.allowSharing}
                onChange={(e) => setFormData({ ...formData, allowSharing: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#16a34a' }}
              />
              <label htmlFor="shareToggle" style={{ cursor: 'pointer', margin: 0 }}>
                <strong style={{ display: 'block', color: '#15803d', fontSize: '0.95rem' }}>
                  Opt-In to Shared Transport Pooling (Save 40%–60%)
                </strong>
                <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Allow our real-time matching engine to pair your shipment with another farmer heading to the same market.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}
            >
              <Truck size={20} /> Submit & Search Compatible Farmers
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LIVE ROUTE & GPS TRACKING VIEW */}
      {activeTab === 'tracking' && activeBooking && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Real-Time Route & Stops Timeline */}
          <div className="farm-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                  🗺️ Shared Route Plan: Pickup 1 ➔ Pickup 2 ➔ Mandi
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Vehicle: <strong>{activeBooking.vehicleName}</strong> • Driver: <strong>{activeBooking.driver.name}</strong>
                </span>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                Live GPS Active 🛰️
              </span>
            </div>

            {/* Visual Steps */}
            <div className="route-timeline-container">
              {activeBooking.route.map((step, idx) => (
                <div key={idx} className="route-step-row">
                  {idx < activeBooking.route.length - 1 && <div className="route-step-line" />}
                  <div className={`route-step-icon ${step.completed ? 'active' : ''}`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <div className="route-step-content">
                    <h5>{step.title}</h5>
                    <p>{step.farmer} • {step.qty} • Expected: <strong>{step.time}</strong></p>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Real-Time Driver Location Status */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={20} color="#15803d" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>CURRENT DRIVER STATUS</span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                  {activeBooking.driverLocation.address}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ETA TO DESTINATION</span>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem' }}>~28 Mins</div>
              </div>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="simulation-bar">
              <div>
                <strong style={{ display: 'block', color: '#1e40af', fontSize: '0.9rem' }}>
                  ⚡ Real-Time Trip Progress Simulator
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
                  Step through driver arrival, loading, transit, and delivery events in real time.
                </span>
              </div>
              <button 
                onClick={handleSimulateNextStep}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 16px' }}
              >
                Simulate Next Driver Action ➔
              </button>
            </div>
          </div>

          {/* Driver Profile Card */}
          <div className="farm-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700 }}>
                {activeBooking.driver.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                  {activeBooking.driver.name} <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>★ {activeBooking.driver.rating}</span>
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                  Vehicle: <strong>{activeBooking.vehicleReg}</strong> ({activeBooking.vehicleName})
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '2px' }}>
                  {activeBooking.driver.trips} verified mandi trips completed
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={`tel:${activeBooking.driver.phone}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} /> Call Driver
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DRIVER PORTAL MODE VIEW */}
      {activeTab === 'driver-mode' && (
        <div className="farm-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} color="#0284c7" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                🚜 Driver Trip Dispatch Interface
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Logged in as Driver: <strong>Murugan K. (Tata Ace TN 33 BM 4921)</strong>
              </span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge badge-amber">New Shared Trip Opportunity</span>
              <strong style={{ color: '#15803d', fontSize: '1.2rem' }}>Fare: ₹2,000</strong>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0f172a' }}>
              Shared Mandi Delivery: 2 Farmers (1,400 kg Total)
            </h4>
            <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              • <strong>Stop 1:</strong> Perundurai Village (Velu - 800 kg Tomatoes)<br />
              • <strong>Stop 2:</strong> Kunnathur Road (Ravi Kumar - 600 kg Onions)<br />
              • <strong>Final Drop:</strong> Erode Central Mandi (38 km total route)
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                onClick={() => {
                  alert('Trip accepted! Farmers have been notified instantly via real-time events.');
                  setActiveTab('tracking');
                }}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontWeight: 700 }}
              >
                <CheckCircle2 size={18} /> Accept Trip (₹2,000 Guaranteed)
              </button>
              <button 
                onClick={() => alert('Trip declined')}
                className="btn btn-outline"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
