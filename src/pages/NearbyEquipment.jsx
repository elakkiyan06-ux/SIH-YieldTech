import React, { useState, useEffect } from 'react';
import { 
  Tractor, 
  MapPin, 
  Navigation, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Layers, 
  Compass, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpDown,
  RefreshCw,
  Phone,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  equipmentRentalService, 
  equipmentEvents 
} from '../services/equipmentRentalService';
import { 
  EQUIPMENT_CATEGORIES, 
  TN_LOCATION_COORDINATES 
} from '../data/equipmentSeedData';
import { EquipmentCard } from '../components/equipment/EquipmentCard';
import { EquipmentMap } from '../components/equipment/EquipmentMap';
import { ContactBookingModal } from '../components/equipment/ContactBookingModal';
import { ReportListingModal } from '../components/equipment/ReportListingModal';
import './NearbyEquipment.css';

export const NearbyEquipment = () => {
  const { user } = useAuth();
  const { setActivePage } = useAppState();
  const { t } = useLanguage();

  // Active View Mode: 'list' | 'map'
  const [viewMode, setViewMode] = useState('list');

  // Farmer Location State
  const [farmerCoords, setFarmerCoords] = useState(() => {
    // Default from user profile or Perundurai
    return equipmentRentalService.getCoordinatesForLocation(user?.village || user?.district || 'Perundurai');
  });
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Erode');
  const [selectedTaluk, setSelectedTaluk] = useState(user?.village || 'Perundurai');
  const [customVillage, setCustomVillage] = useState(user?.village || 'Perundurai');
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'requesting' | 'acquired' | 'denied'
  const [gpsAccuracy, setGpsAccuracy] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRadius, setSelectedRadius] = useState(25); // 5 | 10 | 25 | 50 | 100
  const [pricingUnitFilter, setPricingUnitFilter] = useState('all'); // 'all' | 'hour' | 'acre' | 'day'
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('nearest'); // 'nearest' | 'price_low' | 'price_high' | 'rating'

  // Equipment Data & Modals
  const [equipmentList, setEquipmentList] = useState([]);
  const [activeContactEquipment, setActiveContactEquipment] = useState(null);
  const [activeReportEquipment, setActiveReportEquipment] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Query equipment listings based on current filters and location
  const refreshListings = () => {
    const results = equipmentRentalService.getListings({
      farmerCoords,
      radiusKm: selectedRadius,
      category: selectedCategory,
      pricingUnit: pricingUnitFilter,
      availableOnly,
      searchQuery,
      sortBy
    });
    setEquipmentList(results);
  };

  // Initial load and updates on filter/location change
  useEffect(() => {
    refreshListings();
  }, [farmerCoords, selectedRadius, selectedCategory, pricingUnitFilter, availableOnly, searchQuery, sortBy]);

  // Subscribe to real-time events (new equipment, availability toggle, reports)
  useEffect(() => {
    const unsub = equipmentEvents.subscribe('*', () => {
      refreshListings();
    });
    return unsub;
  }, [farmerCoords, selectedRadius, selectedCategory, pricingUnitFilter, availableOnly, searchQuery, sortBy]);

  // GPS Location Detection with HTML5 Geolocation API
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Math.round(pos.coords.latitude * 10000) / 10000,
          lng: Math.round(pos.coords.longitude * 10000) / 10000
        };
        setFarmerCoords(coords);
        setGpsAccuracy(Math.round(pos.coords.accuracy || 20));
        setGpsStatus('acquired');
        setCustomVillage(`GPS (${coords.lat}°N, ${coords.lng}°E)`);
        setToastMessage({
          type: 'success',
          text: `Farm GPS coordinates acquired (±${Math.round(pos.coords.accuracy || 20)}m). Feed updated!`
        });
      },
      (err) => {
        console.warn('GPS location error:', err);
        setGpsStatus('denied');
        setToastMessage({
          type: 'warning',
          text: 'GPS permission denied or timed out. Falling back to selected village/taluk.'
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Manual Location Selection Handler
  const handleTalukChange = (talukName) => {
    setSelectedTaluk(talukName);
    setCustomVillage(talukName);
    const coords = equipmentRentalService.getCoordinatesForLocation(talukName);
    setFarmerCoords(coords);
    setGpsStatus('idle');
  };

  // Available districts and taluks in Tamil Nadu
  const districts = ['Erode', 'Coimbatore', 'Tiruppur', 'Salem', 'Namakkal', 'Thanjavur', 'Madurai', 'Tiruchirappalli'];
  
  const taluksForDistrict = Object.entries(TN_LOCATION_COORDINATES)
    .filter(([_, data]) => data.district === selectedDistrict)
    .map(([taluk]) => taluk);

  return (
    <div className="nearby-equipment-page">
      {/* 1. HERO HEADER */}
      <div className="equipment-hero-banner">
        <div className="hero-text-content">
          <div className="hero-pill-badge">
            <Tractor size={16} />
            <span>{t('equipment_badge')}</span>
          </div>
          <h1 className="hero-main-title" style={{ color: '#ffffff' }}>
            {t('equipment_hero_title')}
          </h1>
          <p className="hero-subtext">
            {t('equipment_hero_sub')}
          </p>
        </div>

        <div className="hero-action-box">
          <button 
            onClick={() => setActivePage('list-equipment')}
            className="btn btn-primary list-equipment-cta"
          >
            <PlusCircle size={20} />
            <span>{t('list_equipment')}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className={`toast-notification-bar ${toastMessage.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} />
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="toast-close-btn">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. LOCATION BAR (GPS Detection + Manual Fallback) */}
      <div className="location-control-panel farm-card">
        <div className="location-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#16a34a" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
              {t('farm_search_location')}
            </h3>
          </div>

          {/* GPS Detector Button */}
          <button 
            onClick={handleDetectGPS}
            disabled={gpsStatus === 'requesting'}
            className={`gps-locate-btn ${gpsStatus === 'acquired' ? 'gps-active' : ''}`}
            title="Detect current farm location using device GPS"
          >
            <Navigation size={16} className={gpsStatus === 'requesting' ? 'spin-icon' : ''} />
            <span>
              {gpsStatus === 'requesting' ? t('gps_acquiring') :
               gpsStatus === 'acquired' ? `${t('gps_active')} (±${gpsAccuracy}m)` :
               t('detect_gps')}
            </span>
          </button>
        </div>

        <div className="location-selectors-row">
          <div className="selector-group">
            <label>{t('district')}</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                const firstTaluk = Object.keys(TN_LOCATION_COORDINATES).find(
                  k => TN_LOCATION_COORDINATES[k].district === e.target.value
                );
                if (firstTaluk) handleTalukChange(firstTaluk);
              }}
              className="ai-settings-select"
            >
              {districts.map(d => (
                <option key={d} value={d}>{t(d) || d}</option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <label>{t('taluk_hub')}</label>
            <select 
              value={selectedTaluk}
              onChange={(e) => handleTalukChange(e.target.value)}
              className="ai-settings-select"
            >
              {taluksForDistrict.map(t_item => (
                <option key={t_item} value={t_item}>{t_item}</option>
              ))}
            </select>
          </div>

          <div className="selector-group village-input-group">
            <label>{t('village_landmark')}</label>
            <input 
              type="text" 
              value={customVillage}
              onChange={(e) => setCustomVillage(e.target.value)}
              placeholder="e.g. Perundurai Village, Field #3"
              className="ai-settings-input"
            />
          </div>

          <div className="active-center-indicator">
            <span className="indicator-label">Center Point</span>
            <strong className="indicator-value">{customVillage || selectedTaluk}</strong>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & RADIUS CONTROLS */}
      <div className="equipment-filter-toolbar">
        {/* Search Input */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by equipment, brand (e.g. Mahindra, JCB, Kubota), model, or village..."
            className="equipment-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="search-clear-btn">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Distance Radius Pills */}
        <div className="radius-pill-selector">
          <span className="filter-inline-label">{t('radius')}:</span>
          {[5, 10, 25, 50, 100].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRadius(r)}
              className={`radius-chip ${selectedRadius === r ? 'active' : ''}`}
            >
              {r} km
            </button>
          ))}
          <button
            onClick={() => setSelectedRadius('all')}
            className={`radius-chip ${selectedRadius === 'all' ? 'active' : ''}`}
          >
            All TN
          </button>
        </div>

        {/* View Switcher: List vs Map */}
        <div className="view-mode-toggle-group">
          <button 
            onClick={() => setViewMode('list')}
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            title="List View"
          >
            <Layers size={18} />
            <span>{t('list_view')} ({equipmentList.length})</span>
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
            title="Interactive Map View"
          >
            <Compass size={18} />
            <span>{t('map_view')}</span>
          </button>
        </div>
      </div>

      {/* 4. CATEGORY HORIZONTAL SCROLLER */}
      <div className="category-scroll-container">
        {EQUIPMENT_CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-pill-btn ${isActive ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 5. SECONDARY FILTERS & SORTING ROW */}
      <div className="secondary-filters-bar">
        <div className="left-filter-group">
          {/* Pricing Unit Filter */}
          <div className="mini-filter">
            <span className="mini-label">{t('price_unit')}:</span>
            <select 
              value={pricingUnitFilter}
              onChange={(e) => setPricingUnitFilter(e.target.value)}
              className="mini-select"
            >
              <option value="all">All Units</option>
              <option value="hour">{t('per_hour')}</option>
              <option value="acre">{t('per_acre')}</option>
              <option value="day">{t('per_day')}</option>
            </select>
          </div>

          {/* Availability Filter Toggle */}
          <label className="available-toggle-label">
            <input 
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="available-checkbox"
            />
            <span>{t('available_only')}</span>
          </label>
        </div>

        {/* Sorting Dropdown */}
        <div className="sorting-group">
          <ArrowUpDown size={15} color="#64748b" />
          <span className="mini-label">{t('sort_by')}:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mini-select sort-select"
          >
            <option value="nearest">{t('sort_nearest')}</option>
            <option value="price_low">{t('sort_price_low')}</option>
            <option value="price_high">{t('sort_price_high')}</option>
            <option value="rating">{t('sort_rating')}</option>
          </select>
        </div>
      </div>

      {/* 6. MAIN FEED CONTENT (LIST OR MAP) */}
      {viewMode === 'map' ? (
        <EquipmentMap 
          equipmentList={equipmentList}
          farmerCoords={farmerCoords}
          farmerLocationName={customVillage || selectedTaluk}
          searchRadiusKm={selectedRadius}
          onContactClick={(eq) => setActiveContactEquipment(eq)}
        />
      ) : (
        <>
          {equipmentList.length > 0 ? (
            <div className="equipment-cards-grid">
              {equipmentList.map(item => (
                <EquipmentCard 
                  key={item.id}
                  equipment={item}
                  onContactClick={(eq) => setActiveContactEquipment(eq)}
                  onReportClick={(eq) => setActiveReportEquipment(eq)}
                  farmerLocationName={customVillage || selectedTaluk}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="equipment-empty-state farm-card">
              <div className="empty-icon-circle">
                <Tractor size={40} color="#94a3b8" />
              </div>
              <h3>No Equipment Found Within {selectedRadius} km</h3>
              <p>
                There are currently no matching agricultural machinery listed within {selectedRadius} km of <strong>{customVillage || selectedTaluk}</strong>.
              </p>
              <div className="empty-actions-row">
                <button 
                  onClick={() => setSelectedRadius(50)}
                  className="btn btn-primary"
                >
                  Expand Search Radius to 50 km ➔
                </button>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setAvailableOnly(false);
                    setSelectedRadius(100);
                  }}
                  className="btn btn-outline"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 7. CONTACT & BOOKING MODAL */}
      <ContactBookingModal 
        equipment={activeContactEquipment}
        farmerUser={user}
        isOpen={Boolean(activeContactEquipment)}
        onClose={() => setActiveContactEquipment(null)}
        onEnquirySuccess={(enq) => {
          setToastMessage({
            type: 'success',
            text: `Enquiry #${enq.id} submitted! Owner ${activeContactEquipment.ownerName} will call you back.`
          });
        }}
      />

      {/* 8. REPORT LISTING MODAL */}
      <ReportListingModal 
        equipment={activeReportEquipment}
        isOpen={Boolean(activeReportEquipment)}
        onClose={() => setActiveReportEquipment(null)}
        onReportSuccess={() => {
          setToastMessage({
            type: 'warning',
            text: 'Report submitted to Farmogram Admin Moderation queue.'
          });
        }}
      />
    </div>
  );
};
