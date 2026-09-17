import React, { useState, useEffect } from 'react';
import { 
  Warehouse, 
  Building, 
  Package, 
  Snowflake, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Layers, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Thermometer, 
  Camera, 
  Calendar,
  Save,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { storageService, StorageEventBus } from '../services/storageService';
import { TN_STORAGE_COORDINATES, getStorageImageUrl } from '../data/storageSeedData';
import './ListStorage.css';

export const ListStorage = () => {
  const { user } = useAuth();
  const { setActivePage } = useAppState();

  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'my_facilities' | 'enquiries'
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [facilityName, setFacilityName] = useState('');
  const [storageType, setStorageType] = useState('cold_storage');
  const [totalCapacity, setTotalCapacity] = useState(500);
  const [availableCapacity, setAvailableCapacity] = useState(300);
  const [price, setPrice] = useState(6);
  const [bagPrice, setBagPrice] = useState(1.5);
  const [minStorageDurationDays, setMinStorageDurationDays] = useState(7);
  
  // Location
  const [district, setDistrict] = useState(user?.district || 'Erode');
  const [taluk, setTaluk] = useState(user?.village || 'Perundurai');
  const [village, setVillage] = useState(user?.village || 'Perundurai');
  const [pincode, setPincode] = useState('638052');
  const [address, setAddress] = useState('NH-544 Agro Industrial Park, SIPCOT Area');

  // Specs & Climate
  const [tempMin, setTempMin] = useState(2);
  const [tempMax, setTempMax] = useState(8);
  const [humidity, setHumidity] = useState('85% - 90%');
  const [storageConditions, setStorageConditions] = useState(
    'Precision multi-chamber temperature control with automated humidity regulation and ethylene scrubbing.'
  );
  const [storageRules, setStorageRules] = useState(
    'Produce must pass gate moisture and quality inspection. Stacking strictly on fumigated pallets.'
  );

  // Owner & Operations
  const [ownerName, setOwnerName] = useState(user?.name || 'K. Sengottaiyan');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '+91 94432 88123');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState(user?.phone || '+91 94432 88123');
  const [operatingStart, setOperatingStart] = useState('06:00 AM');
  const [operatingEnd, setOperatingEnd] = useState('08:00 PM');

  // Photo
  const [selectedImage, setSelectedImage] = useState('images/storage/cold_storage_facility.jpg');

  // Multi-select: Supported Crops
  const allCrops = [
    'Turmeric', 'Paddy / Rice', 'Tomatoes', 'Onions', 'Potatoes', 
    'Chillies', 'Maize', 'Millets', 'Banana', 'Coconut', 'Vegetables', 'Fruits'
  ];
  const [supportedCrops, setSupportedCrops] = useState(['Turmeric', 'Paddy / Rice', 'Tomatoes']);

  // Multi-select: Amenities
  const allAmenities = [
    '24/7 Security & Guard Watch',
    'CCTV Surveillance Network',
    'Heavy Backup Power Generator',
    'Fire Safety & Hydrant System',
    'Certified Moisture & Quality Testing',
    'Loading & Unloading Labor Team',
    'Certified 60-Tonne Weighbridge',
    'Comprehensive Goods Transit Insurance',
    'Scientific Pest Control & Fumigation',
    'Forklift & Hydraulic Pallet Stacking'
  ];
  const [amenities, setAmenities] = useState([
    '24/7 Security & Guard Watch',
    'CCTV Surveillance Network',
    'Heavy Backup Power Generator',
    'Certified Moisture & Quality Testing',
    'Loading & Unloading Labor Team',
    'Certified 60-Tonne Weighbridge'
  ]);

  // Management State
  const [myFacilities, setMyFacilities] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [editingCapacity, setEditingCapacity] = useState({});

  const refreshData = () => {
    const facs = storageService.getFacilities({ radiusKm: 'all' });
    setMyFacilities(facs);
    setEnquiries(storageService.getEnquiries());
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  useEffect(() => {
    const unsub = StorageEventBus.subscribe('*', () => {
      refreshData();
    });
    return unsub;
  }, []);

  const toggleCrop = (crop) => {
    setSupportedCrops(prev => 
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const toggleAmenity = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Preset photo gallery options
  const imagePresets = [
    { src: 'images/storage/cold_storage_facility.jpg', label: 'Cold Storage (Refrigerated Chambers)' },
    { src: 'images/storage/grain_godown_warehouse.jpg', label: 'Warehouse / Grain Godown' },
    { src: 'images/storage/modern_packhouse_facility.jpg', label: 'Packhouse (Grading & Stacking)' },
    { src: 'images/storage/grain_silo_facility.jpg', label: 'Modern Grain Silo Towers' }
  ];

  const handleSubmitRegistration = (e) => {
    e.preventDefault();

    if (supportedCrops.length === 0) {
      alert('Please select at least one supported agricultural produce or crop.');
      return;
    }

    const coords = storageService.getCoordinatesForLocation(taluk);

    const newFacility = storageService.createFacility({
      facilityName,
      storageType,
      totalCapacity: Number(totalCapacity),
      availableCapacity: Number(availableCapacity),
      price: Number(price),
      bagPrice: Number(bagPrice),
      minStorageDurationDays: Number(minStorageDurationDays),
      location: {
        district,
        taluk,
        village,
        pincode,
        address,
        coordinates: coords
      },
      temperatureRange: storageType === 'cold_storage' ? { min: Number(tempMin), max: Number(tempMax) } : null,
      humidityPercentage: storageType === 'cold_storage' ? humidity : null,
      storageConditions,
      storageRules,
      supportedCrops,
      amenities,
      images: [selectedImage],
      ownerName,
      ownerPhone,
      ownerWhatsapp,
      operatingHours: {
        start: operatingStart,
        end: operatingEnd
      }
    });

    setToastMessage({
      type: 'success',
      text: `Facility "${newFacility.facilityName}" has been successfully published! Farmers in your radius can now discover it.`
    });

    setActiveTab('my_facilities');
  };

  const handleUpdateCapacity = (facId) => {
    const newCap = editingCapacity[facId];
    if (newCap != null) {
      storageService.updateFacility(facId, { availableCapacity: Number(newCap) });
      setToastMessage({
        type: 'success',
        text: `Capacity updated to ${newCap} MT successfully!`
      });
      refreshData();
    }
  };

  const handleToggleStatus = (fac) => {
    const nextStatus = fac.status === 'ACTIVE' ? 'FULL' : 'ACTIVE';
    storageService.updateFacility(fac.id, { status: nextStatus });
    refreshData();
  };

  const handleDeleteFacility = (facId) => {
    if (window.confirm('Are you sure you want to remove this storage facility listing?')) {
      storageService.deleteFacility(facId);
      refreshData();
    }
  };

  return (
    <div className="list-storage-page">
      {/* 1. HERO BANNER */}
      <div className="list-storage-hero-banner">
        <div>
          <h1 className="list-storage-hero-title">
            List Your Storage Facility
          </h1>
          <p className="list-storage-hero-subtitle">
            Connect directly with thousands of farmers seeking cold storage, godowns, and warehouses. Fill your facility, maximize revenue, and eliminate idle storage space.
          </p>
        </div>

        <button 
          onClick={() => setActivePage('nearby-storage')}
          style={{ background: '#ffffff', color: '#0f766e', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <span>Find Nearby Storage</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 20px', color: '#166534', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* 2. TABS BAR */}
      <div className="storage-owner-tabs-bar">
        <button 
          className={`storage-owner-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          <PlusCircle size={17} />
          <span>{t('list_storage')}</span>
        </button>

        <button 
          className={`storage-owner-tab-btn ${activeTab === 'my_facilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('my_facilities')}
        >
          <Warehouse size={17} />
          <span>{t('my_listings')} ({myFacilities.length})</span>
        </button>

        <button 
          className={`storage-owner-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          <MessageSquare size={17} />
          <span>{t('received_enquiries')} ({enquiries.length})</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'register' && (
        <div className="storage-form-card">
          <form className="storage-owner-form" onSubmit={handleSubmitRegistration}>
            {/* Section 1: Facility Basics */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                <Warehouse size={20} color="#0d9488" />
                <span>1. Facility Profile & Category</span>
              </div>
              <div className="storage-form-section-sub">
                Enter your official facility trade name and primary infrastructure type.
              </div>

              <div className="storage-form-grid-2">
                <div className="storage-input-field">
                  <label>Facility / Business Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Kongu Cold Storage & Agro Logistics"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                  />
                </div>

                <div className="storage-input-field">
                  <label>Storage Infrastructure Type *</label>
                  <select 
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value)}
                  >
                    <option value="cold_storage">❄️ Cold Storage (Multi-Chamber Refrigerated)</option>
                    <option value="warehouse">🏢 Warehouse / Covered Grain Godown</option>
                    <option value="packhouse">📦 Packhouse (Cleaning, Grading, Ripening)</option>
                    <option value="silo">🏗️ Modern Grain Silo (Metal Vertical Bins)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Storage Capacity & Pricing */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                <Layers size={20} color="#0d9488" />
                <span>2. Storage Capacity & Pricing Structure</span>
              </div>
              <div className="storage-form-section-sub">
                Specify available space and rental tariffs per Metric Tonne (MT) or per 50kg bag.
              </div>

              <div className="storage-form-grid-2">
                <div className="storage-input-field">
                  <label>Total Facility Capacity (Metric Tonnes) *</label>
                  <input 
                    type="number" 
                    min="10" 
                    required 
                    value={totalCapacity}
                    onChange={(e) => setTotalCapacity(e.target.value)}
                  />
                </div>

                <div className="storage-input-field">
                  <label>Currently Available Capacity (Metric Tonnes) *</label>
                  <input 
                    type="number" 
                    min="0" 
                    max={totalCapacity}
                    required 
                    value={availableCapacity}
                    onChange={(e) => setAvailableCapacity(e.target.value)}
                  />
                </div>
              </div>

              <div className="storage-form-grid-3">
                <div className="storage-input-field">
                  <label>Tariff: Per Metric Tonne / Day (₹) *</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="1" 
                    required 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="storage-input-field">
                  <label>Tariff: Per 50kg Bag / Day (₹) *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.5" 
                    required 
                    value={bagPrice}
                    onChange={(e) => setBagPrice(e.target.value)}
                  />
                </div>

                <div className="storage-input-field">
                  <label>Minimum Duration (Days) *</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="180" 
                    required 
                    value={minStorageDurationDays}
                    onChange={(e) => setMinStorageDurationDays(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Location & Agro-Belt */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                <MapPin size={20} color="#0d9488" />
                <span>3. Physical Address & Location Coordinates</span>
              </div>
              <div className="storage-form-section-sub">
                Allows nearby farmers to accurately measure haulage distance and get GPS road directions.
              </div>

              <div className="storage-form-grid-3">
                <div className="storage-input-field">
                  <label>District *</label>
                  <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                    {['Erode', 'Coimbatore', 'Tiruppur', 'Salem', 'Dindigul', 'Thanjavur', 'Namakkal', 'Madurai'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="storage-input-field">
                  <label>Taluk / Agro Hub *</label>
                  <input 
                    type="text" 
                    required 
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    placeholder="e.g. Perundurai"
                  />
                </div>

                <div className="storage-input-field">
                  <label>PIN Code *</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    required 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="638052"
                  />
                </div>
              </div>

              <div className="storage-input-field">
                <label>Street Address / Landmark *</label>
                <input 
                  type="text" 
                  required 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. SF No 245/2, Near SIPCOT Gate 2, Perundurai Bypass"
                />
              </div>
            </div>

            {/* Section 4: Storage Environment & Rules */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                <Thermometer size={20} color="#0d9488" />
                <span>4. Environmental Controls & Quality Specs</span>
              </div>
              <div className="storage-form-section-sub">
                Specify temperature control, humidity parameters, and intake requirements.
              </div>

              {storageType === 'cold_storage' && (
                <div className="storage-form-grid-3">
                  <div className="storage-input-field">
                    <label>Min Temp (°C)</label>
                    <input 
                      type="number" 
                      value={tempMin} 
                      onChange={(e) => setTempMin(e.target.value)} 
                    />
                  </div>

                  <div className="storage-input-field">
                    <label>Max Temp (°C)</label>
                    <input 
                      type="number" 
                      value={tempMax} 
                      onChange={(e) => setTempMax(e.target.value)} 
                    />
                  </div>

                  <div className="storage-input-field">
                    <label>Target Humidity</label>
                    <input 
                      type="text" 
                      value={humidity} 
                      onChange={(e) => setHumidity(e.target.value)} 
                      placeholder="e.g. 85% - 90%"
                    />
                  </div>
                </div>
              )}

              <div className="storage-form-grid-2">
                <div className="storage-input-field">
                  <label>Storage Environment Description</label>
                  <textarea 
                    rows={2}
                    value={storageConditions}
                    onChange={(e) => setStorageConditions(e.target.value)}
                  />
                </div>

                <div className="storage-input-field">
                  <label>Facility Rules & Intake Requirements</label>
                  <textarea 
                    rows={2}
                    value={storageRules}
                    onChange={(e) => setStorageRules(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Supported Crops */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                🌾 <span>5. Supported Agricultural Crops & Produce</span>
              </div>
              <div className="storage-form-section-sub">
                Select all commodities your facility is equipped to store without cross-contamination.
              </div>

              <div className="storage-crops-checkbox-grid">
                {allCrops.map(crop => {
                  const isSelected = supportedCrops.includes(crop);
                  return (
                    <label 
                      key={crop} 
                      className={`storage-crop-checkbox-label ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleCrop(crop)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        style={{ accentColor: '#0d9488' }}
                      />
                      <span>{crop}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Amenities Checklist */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                <ShieldCheck size={20} color="#0d9488" />
                <span>6. Available Amenities & Safety Infrastructure</span>
              </div>
              <div className="storage-form-section-sub">
                Highlight amenities that build trust with farmers and commercial traders.
              </div>

              <div className="storage-amenities-checkbox-grid">
                {allAmenities.map(amenity => {
                  const isSelected = amenities.includes(amenity);
                  return (
                    <label 
                      key={amenity} 
                      className={`storage-amenity-checkbox-label ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        style={{ accentColor: '#0d9488' }}
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 7: Facility Photographs */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                <Camera size={20} color="#0d9488" />
                <span>7. Facility Photographs</span>
              </div>
              <div className="storage-form-section-sub">
                Choose a verified, authentic photograph corresponding strictly to your facility category.
              </div>

              <div className="storage-images-selector-grid">
                {imagePresets.map(preset => (
                  <div 
                    key={preset.src}
                    className={`storage-image-choice ${selectedImage === preset.src ? 'selected' : ''}`}
                    onClick={() => setSelectedImage(preset.src)}
                  >
                    <img src={getStorageImageUrl(preset.src)} alt={preset.label} />
                    <div className="storage-image-choice-label">
                      {preset.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 8: Contact Information */}
            <div className="storage-form-section">
              <div className="storage-form-section-title">
                <Phone size={20} color="#0d9488" />
                <span>8. Direct Owner / Manager Contact Information</span>
              </div>
              <div className="storage-form-section-sub">
                Farmers will use these details to contact you directly via phone and WhatsApp.
              </div>

              <div className="storage-form-grid-3">
                <div className="storage-input-field">
                  <label>Operator / Owner Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </div>

                <div className="storage-input-field">
                  <label>Contact Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                  />
                </div>

                <div className="storage-input-field">
                  <label>WhatsApp Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={ownerWhatsapp}
                    onChange={(e) => setOwnerWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              <div className="storage-form-grid-2">
                <div className="storage-input-field">
                  <label>Daily Operating Opening Time</label>
                  <input 
                    type="text" 
                    value={operatingStart} 
                    onChange={(e) => setOperatingStart(e.target.value)} 
                    placeholder="06:00 AM"
                  />
                </div>

                <div className="storage-input-field">
                  <label>Daily Operating Closing Time</label>
                  <input 
                    type="text" 
                    value={operatingEnd} 
                    onChange={(e) => setOperatingEnd(e.target.value)} 
                    placeholder="08:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', paddingTop: '10px' }}>
              <button 
                type="submit" 
                style={{ background: '#0d9488', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)' }}
              >
                <PlusCircle size={20} />
                <span>Publish Storage Facility Listing</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. MY FACILITIES TAB */}
      {activeTab === 'my_facilities' && (
        <div>
          {myFacilities.map(fac => (
            <div key={fac.id} className="storage-management-card">
              <div className="storage-management-info">
                <img 
                  src={getStorageImageUrl(fac.images?.[0] || 'images/storage/cold_storage_facility.jpg')} 
                  alt={fac.facilityName} 
                  className="storage-management-thumb"
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`storage-type-badge ${fac.storageType}`} style={{ position: 'static' }}>
                      {fac.storageTypeLabel}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: fac.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: fac.status === 'ACTIVE' ? '#166534' : '#991b1b' }}>
                      {fac.status === 'ACTIVE' ? 'Accepting Bookings' : 'Full / Closed'}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                    {fac.facilityName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>
                    📍 {fac.location?.village}, {fac.location?.district} • Tariff: ₹{fac.price} / MT / day
                  </div>
                </div>
              </div>

              {/* Live Capacity Editor */}
              <div className="storage-management-actions">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Available:</span>
                  <input 
                    type="number" 
                    defaultValue={fac.availableCapacity}
                    onChange={(e) => setEditingCapacity({ ...editingCapacity, [fac.id]: e.target.value })}
                    style={{ width: '65px', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {fac.totalCapacity} MT</span>
                  <button 
                    onClick={() => handleUpdateCapacity(fac.id)}
                    style={{ background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer' }}
                    title="Save live capacity"
                  >
                    <Save size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => handleToggleStatus(fac)}
                  style={{ background: fac.status === 'ACTIVE' ? '#fef3c7' : '#dcfce7', color: fac.status === 'ACTIVE' ? '#92400e' : '#166534', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {fac.status === 'ACTIVE' ? 'Mark as Full' : 'Mark Available'}
                </button>

                <button 
                  onClick={() => handleDeleteFacility(fac.id)}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' }}
                  title="Remove facility"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. RECEIVED ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="storage-enquiries-feed">
          {enquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <MessageSquare size={32} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>No Enquiries Received Yet</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>When farmers submit reservation requests for your storage space, they will show up here.</p>
            </div>
          ) : (
            enquiries.map(enq => (
              <div key={enq.id} className="storage-enquiry-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' }}>
                      {enq.facilityName}
                    </span>
                    <span style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '6px', color: '#64748b' }}>
                      Ref: {enq.id}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>
                    {enq.farmerName} • {enq.produceName} ({enq.quantity} {enq.unit}s)
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    Intake Date: <strong>{enq.intakeDate}</strong> ({enq.durationDays} days) • Estimated: <strong style={{ color: '#15803d' }}>₹{enq.estimatedCost?.toLocaleString('en-IN')}</strong>
                  </div>
                  {enq.notes && (
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
                      "{enq.notes}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a 
                    href={`tel:${enq.farmerPhone}`}
                    style={{ background: '#f1f5f9', color: '#0f172a', textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Phone size={15} /> Call Farmer
                  </a>
                  <a 
                    href={`https://wa.me/${enq.farmerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.farmerName}, regarding your storage enquiry ${enq.id} for ${enq.produceName} at ${enq.facilityName}...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#25D366', color: '#ffffff', textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MessageSquare size={15} /> WhatsApp
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
