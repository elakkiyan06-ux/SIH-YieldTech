import React, { useState, useEffect } from 'react';
import { 
  Warehouse, 
  MapPin, 
  Navigation, 
  Search, 
  Filter, 
  Layers, 
  Compass, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpDown, 
  RefreshCw, 
  X,
  Snowflake,
  Building,
  Package,
  Boxes
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  storageService, 
  StorageEventBus 
} from '../services/storageService';
import { TN_STORAGE_COORDINATES } from '../data/storageSeedData';
import { StorageCard } from '../components/storage/StorageCard';
import { StorageMap } from '../components/storage/StorageMap';
import { StorageDetailModal } from '../components/storage/StorageDetailModal';
import { StorageEnquiryModal } from '../components/storage/StorageEnquiryModal';
import { ReportStorageModal } from '../components/storage/ReportStorageModal';
import './NearbyStorage.css';

export const NearbyStorage = () => {
  const { user } = useAuth();
  const { setActivePage } = useAppState();
  const { t } = useLanguage();

  // Active View Mode: 'list' | 'map'
  const [viewMode, setViewMode] = useState('list');

  // Farmer Location State
  const [farmerCoords, setFarmerCoords] = useState(() => {
    return storageService.getCoordinatesForLocation(user?.village || user?.district || 'Perundurai');
  });
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Erode');
  const [selectedTaluk, setSelectedTaluk] = useState(user?.village || 'Perundurai');
  const [farmerLocationDisplay, setFarmerLocationDisplay] = useState(user?.village || 'Perundurai');
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'requesting' | 'acquired' | 'denied'
  const [gpsAccuracy, setGpsAccuracy] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'cold_storage' | 'warehouse' | 'packhouse' | 'silo'
  const [selectedRadius, setSelectedRadius] = useState(25); // 5 | 10 | 25 | 50 | 100
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [minCapacity, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState('nearest'); // 'nearest' | 'capacity_high' | 'price_low' | 'rating'

  // Facilities and Modals
  const [facilities, setFacilities] = useState([]);
  const [activeDetailFacility, setActiveDetailFacility] = useState(null);
  const [activeEnquiryFacility, setActiveEnquiryFacility] = useState(null);
  const [activeReportFacility, setActiveReportFacility] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load and filter listings
  const loadFacilities = () => {
    const results = storageService.getFacilities({
      farmerCoords,
      radiusKm: selectedRadius,
      storageType: selectedType,
      crop: selectedCrop,
      minCapacity: Number(minCapacity),
      searchQuery,
      sortBy
    });
    setFacilities(results);
  };

  useEffect(() => {
    loadFacilities();
  }, [farmerCoords, selectedRadius, selectedType, selectedCrop, minCapacity, searchQuery, sortBy]);

  // Real-time synchronization with StorageEventBus
  useEffect(() => {
    const unsub = StorageEventBus.subscribe('*', () => {
      loadFacilities();
    });
    return unsub;
  }, [farmerCoords, selectedRadius, selectedType, selectedCrop, minCapacity, searchQuery, sortBy]);

  // GPS Detection Handler
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
        setGpsAccuracy(Math.round(pos.coords.accuracy || 15));
        setGpsStatus('acquired');
        setFarmerLocationDisplay(`GPS Farm (${coords.lat}°N, ${coords.lng}°E)`);
        setToastMessage({
          type: 'success',
          text: `Farm GPS coordinates acquired (±${Math.round(pos.coords.accuracy || 15)}m). Facilities sorted by real distance!`
        });
      },
      (err) => {
        console.warn('GPS location error:', err);
        setGpsStatus('denied');
        setToastMessage({
          type: 'warning',
          text: 'GPS permission denied or unavailable. Using selected district/taluk location.'
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Location Selector Handler
  const handleTalukChange = (talukName) => {
    setSelectedTaluk(talukName);
    setFarmerLocationDisplay(talukName);
    const coords = storageService.getCoordinatesForLocation(talukName);
    setFarmerCoords(coords);
    setGpsStatus('idle');
  };

  // Handle PIN code lookup
  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (!pincodeQuery.trim()) return;
    const pin = pincodeQuery.trim();
    const match = Object.entries(TN_STORAGE_COORDINATES).find(
      ([_, data]) => data.pincode === pin
    );
    if (match) {
      const [name, data] = match;
      setSelectedDistrict(data.district);
      setSelectedTaluk(name);
      setFarmerLocationDisplay(`${name} (${pin})`);
      setFarmerCoords({ lat: data.lat, lng: data.lng });
      setToastMessage({
        type: 'success',
        text: `PIN ${pin} matched: ${name}, ${data.district}`
      });
    } else {
      setToastMessage({
        type: 'warning',
        text: `PIN ${pin} located in Tamil Nadu agro-corridor. Defaulting search to closest hub.`
      });
    }
  };

  // Available districts and crops
  const districts = ['Erode', 'Coimbatore', 'Tiruppur', 'Salem', 'Dindigul', 'Thanjavur', 'Namakkal', 'Madurai'];
  const taluksForDistrict = Object.entries(TN_STORAGE_COORDINATES)
    .filter(([_, data]) => data.district === selectedDistrict)
    .map(([taluk]) => taluk);

  const availableCrops = [
    'Turmeric', 'Paddy / Rice', 'Tomatoes', 'Onions', 'Potatoes', 
    'Chillies', 'Maize', 'Millets', 'Banana', 'Coconut', 'Vegetables', 'Fruits'
  ];

  return (
    <div className="nearby-storage-page">
      {/* 1. HERO BANNER */}
      <div className="storage-hero-banner">
        <div className="storage-hero-text">
          <div className="storage-hero-badge">
            <Warehouse size={16} />
            <span>Post-Harvest Agricultural Storage Network</span>
          </div>
          <h1 className="storage-hero-title">
            Nearby Cold Storage, Godowns & Warehouses
          </h1>
          <p className="storage-hero-subtext">
            Protect your harvested produce from distress selling and post-harvest spoilage. Find verified godowns, cold storages, packhouses, and silos within your agricultural belt. Compare live holding capacity and transparent tariffs.
          </p>
        </div>

        <div>
          <button 
            onClick={() => setActivePage('list-storage')}
            className="storage-list-cta"
          >
            <PlusCircle size={20} />
            <span>List Your Storage Facility</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`storage-toast-bar ${toastMessage.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} />
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. LOCATION BAR (GPS + Village / Taluk / District / PIN) */}
      <div className="storage-location-panel">
        <div className="storage-location-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="#059669" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                Your Farm Search Location: <span style={{ color: '#059669' }}>{farmerLocationDisplay}</span>
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Storage facilities are filtered and ranked based on direct haulage distance from this point.
              </span>
            </div>
          </div>

          <button 
            onClick={handleDetectGPS}
            disabled={gpsStatus === 'requesting'}
            className={`storage-gps-btn ${gpsStatus === 'acquired' ? 'gps-active' : ''}`}
          >
            <Navigation size={16} />
            <span>
              {gpsStatus === 'requesting' ? 'Acquiring Farm GPS...' :
               gpsStatus === 'acquired' ? `GPS Active (±${gpsAccuracy}m)` :
               'Detect My Farm GPS'}
            </span>
          </button>
        </div>

        <div className="storage-selectors-grid">
          <div className="storage-selector-group">
            <label>District</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                const firstTaluk = Object.keys(TN_STORAGE_COORDINATES).find(
                  k => TN_STORAGE_COORDINATES[k].district === e.target.value
                );
                if (firstTaluk) handleTalukChange(firstTaluk);
              }}
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="storage-selector-group">
            <label>Taluk / Agro Hub</label>
            <select 
              value={selectedTaluk}
              onChange={(e) => handleTalukChange(e.target.value)}
            >
              {taluksForDistrict.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="storage-selector-group">
            <label>Search by PIN Code</label>
            <form onSubmit={handlePincodeSubmit} style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text" 
                maxLength="6"
                placeholder="e.g. 638052"
                value={pincodeQuery}
                onChange={(e) => setPincodeQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                type="submit"
                style={{ background: '#0d9488', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Go
              </button>
            </form>
          </div>

          <div className="storage-selector-group">
            <label>Search Radius</label>
            <select 
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value={5}>Within 5 km (Immediate)</option>
              <option value={10}>Within 10 km</option>
              <option value={25}>Within 25 km (Recommended)</option>
              <option value={50}>Within 50 km (District Wide)</option>
              <option value={100}>Within 100 km (Regional)</option>
              <option value="all">All Available Facilities</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR (Search, Storage Type, Produce Filter, View Switcher) */}
      <div className="storage-toolbar">
        <div className="storage-toolbar-top">
          <div className="storage-search-box">
            <Search size={18} className="storage-search-icon" />
            <input 
              type="text" 
              placeholder="Search storage by name, village, crop (e.g. Turmeric, Cold Storage, Erode)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="storage-view-toggle">
            <button 
              className={`storage-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <Boxes size={16} />
              <span>List View</span>
            </button>
            <button 
              className={`storage-view-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <MapPin size={16} />
              <span>Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Storage Type Pills */}
        <div className="storage-filter-pills-row">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginRight: '4px' }}>
            Facility:
          </span>
          {[
            { id: 'all', label: 'All Storage Types' },
            { id: 'cold_storage', label: '❄️ Cold Storage' },
            { id: 'warehouse', label: '🏢 Godown / Warehouse' },
            { id: 'packhouse', label: '📦 Packhouse' },
            { id: 'silo', label: '🏗️ Grain Silo' }
          ].map(type => (
            <button 
              key={type.id}
              className={`storage-filter-pill ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Produce & Capacity Row */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Crop Produce:
            </span>
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <option value="all">All Crops Supported</option>
              {availableCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Min Available Space:
            </span>
            <select 
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <option value={0}>Any Capacity</option>
              <option value={10}>≥ 10 Metric Tonnes</option>
              <option value={50}>≥ 50 Metric Tonnes</option>
              <option value={100}>≥ 100 Metric Tonnes</option>
              <option value={500}>≥ 500 Metric Tonnes</option>
            </select>
          </div>
        </div>

        {/* Results Meta & Sort Bar */}
        <div className="storage-results-meta">
          <div className="storage-results-count">
            Found <strong>{facilities.length}</strong> Storage Facilities
            {selectedRadius !== 'all' ? ` within ${selectedRadius} km` : ''}
          </div>

          <div className="storage-sort-wrap">
            <ArrowUpDown size={15} />
            <span>Sort By:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="nearest">Haulage Distance (Nearest First)</option>
              <option value="capacity_high">Available Space (High to Low)</option>
              <option value="price_low">Tariff (Lowest Daily Rate First)</option>
              <option value="rating">Rating (Highest Customer Feedback)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. CONTENT VIEW (List vs Map) */}
      {viewMode === 'map' ? (
        <StorageMap 
          facilities={facilities}
          farmerCoords={farmerCoords}
          farmerLocationName={farmerLocationDisplay}
          searchRadiusKm={selectedRadius}
          onSelectFacility={(fac) => setActiveDetailFacility(fac)}
          onEnquireFacility={(fac) => setActiveEnquiryFacility(fac)}
        />
      ) : (
        <>
          {facilities.length === 0 ? (
            <div className="storage-empty-state">
              <div className="storage-empty-icon">
                <Warehouse size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: '0 0 8px 0' }}>
                No Storage Facilities Found Within {selectedRadius} km
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                Try expanding your search radius to 50 km or 100 km, or switch storage type filter to "All".
              </p>
              <button 
                onClick={() => {
                  setSelectedRadius(50);
                  setSelectedType('all');
                  setSelectedCrop('all');
                  setMinCapacity(0);
                  setSearchQuery('');
                }}
                style={{ background: '#0d9488', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Expand Search to 50 km & Reset Filters
              </button>
            </div>
          ) : (
            <div className="storage-grid-feed">
              {facilities.map(facility => (
                <StorageCard 
                  key={facility.id}
                  facility={facility}
                  onSelect={(fac) => setActiveDetailFacility(fac)}
                  onEnquire={(fac) => setActiveEnquiryFacility(fac)}
                  onReport={(fac) => setActiveReportFacility(fac)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* 5. MODALS */}
      {/* Detailed Specifications & Cost Calculator Modal */}
      {activeDetailFacility && (
        <StorageDetailModal 
          facility={activeDetailFacility}
          onClose={() => setActiveDetailFacility(null)}
          onEnquire={(facWithCalc) => {
            setActiveDetailFacility(null);
            setActiveEnquiryFacility(facWithCalc);
          }}
          onReport={(fac) => {
            setActiveDetailFacility(null);
            setActiveReportFacility(fac);
          }}
        />
      )}

      {/* Booking Enquiry Modal */}
      {activeEnquiryFacility && (
        <StorageEnquiryModal 
          facility={activeEnquiryFacility}
          isOpen={!!activeEnquiryFacility}
          onClose={() => setActiveEnquiryFacility(null)}
          onEnquirySuccess={(enquiry) => {
            setToastMessage({
              type: 'success',
              text: `Enquiry reference ${enquiry.id} submitted! Storage owner notified.`
            });
          }}
        />
      )}

      {/* Report Facility Modal */}
      {activeReportFacility && (
        <ReportStorageModal 
          facility={activeReportFacility}
          isOpen={!!activeReportFacility}
          onClose={() => setActiveReportFacility(null)}
          onReportSuccess={() => {
            setToastMessage({
              type: 'warning',
              text: 'Listing reported. Agricultural inspection team will audit the facility.'
            });
          }}
        />
      )}
    </div>
  );
};
