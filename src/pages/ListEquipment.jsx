import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  Tractor, 
  Wrench, 
  MapPin, 
  Phone, 
  DollarSign, 
  Clock, 
  Truck, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Trash2, 
  Edit3, 
  Eye, 
  MessageSquare, 
  Navigation,
  Image as ImageIcon,
  UploadCloud,
  Upload,
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
  EQUIPMENT_PHOTO_PRESETS,
  TN_LOCATION_COORDINATES 
} from '../data/equipmentSeedData';
import './ListEquipment.css';

export const ListEquipment = () => {
  const { user } = useAuth();
  const { setActivePage } = useAppState();
  const { t } = useLanguage();

  // Active Tab: 'register' | 'my-listings' | 'enquiries'
  const [activeTab, setActiveTab] = useState('register');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'tractor',
    brand: 'Mahindra',
    model: '575 DI Sarpanch',
    horsepower: 45,
    year: 2023,
    images: [EQUIPMENT_PHOTO_PRESETS[0].url],
    customImageUrl: '',
    price: 850,
    priceUnit: 'hour', // 'hour' | 'acre' | 'day'
    minBookingDuration: '2 Hours',
    operatorCharges: 'INCLUDED', // 'INCLUDED' | 'EXTRA'
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL', // 'FREE_LOCAL' | 'PER_KM' | 'FIXED'
    freeRadiusKm: 8,
    transportFeePerKm: 25,
    transportFee: 500,
    district: user?.district || 'Erode',
    taluk: user?.village || 'Perundurai',
    village: user?.village || 'Perundurai Rural',
    address: 'Near Main Road Agro Service Yard',
    serviceRadiusKm: 25,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    startTime: '06:00 AM',
    endTime: '07:30 PM',
    status: 'AVAILABLE',
    description: 'Well-maintained machinery with expert driver. Ready for field preparation, ridge making, rotavator tilling, and harvest support.',
    ownerName: user?.name || 'Murugan K.',
    ownerPhone: user?.phone || '+91 98421 76540'
  });

  const [myListings, setMyListings] = useState([]);
  const [receivedEnquiries, setReceivedEnquiries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Device Photo Upload State & Reference
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle files selected from local device
  const handleDeviceImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    readAndAddFiles(files);
  };

  const handleDropFiles = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    readAndAddFiles(files);
  };

  const readAndAddFiles = (files) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) {
      setToast({ text: 'Please select valid image files (PNG, JPG, JPEG, WEBP)', type: 'error' });
      return;
    }

    let loadedCount = 0;
    const newUrls = [];

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newUrls.push(event.target.result);
        loadedCount++;
        if (loadedCount === imageFiles.length) {
          setFormData(prev => {
            const isDefault = prev.images.length === 1 && prev.images[0] === EQUIPMENT_PHOTO_PRESETS[0].url;
            return {
              ...prev,
              images: isDefault ? newUrls : [...prev.images, ...newUrls]
            };
          });
          setToast({ text: `Successfully uploaded ${imageFiles.length} photo(s) from your device!`, type: 'success' });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered.length > 0 ? filtered : [EQUIPMENT_PHOTO_PRESETS[0].url]
      };
    });
  };

  const handlePresetClick = (presetUrl) => {
    setFormData(prev => {
      const exists = prev.images.includes(presetUrl);
      if (exists) {
        if (prev.images.length === 1) return prev;
        return { ...prev, images: prev.images.filter(u => u !== presetUrl) };
      } else {
        return { ...prev, images: [presetUrl, ...prev.images] };
      }
    });
  };

  const handleAddCustomUrl = () => {
    if (!formData.customImageUrl || !formData.customImageUrl.trim()) return;
    const url = formData.customImageUrl.trim();
    setFormData(prev => ({
      ...prev,
      images: [url, ...prev.images],
      customImageUrl: ''
    }));
    setToast({ text: 'Custom image URL added to listing photos!', type: 'success' });
  };

  // Load Owner's listings and received enquiries
  const loadOwnerData = () => {
    const phone = user?.phone || '+91 98421 76540';
    const listings = equipmentRentalService.getOwnerListings(phone);
    setMyListings(listings);

    const enquiries = equipmentRentalService.getEnquiriesForOwner(phone);
    setReceivedEnquiries(enquiries);
  };

  useEffect(() => {
    loadOwnerData();
  }, [user]);

  // Subscribe to real-time events
  useEffect(() => {
    const unsub = equipmentEvents.subscribe('*', () => {
      loadOwnerData();
    });
    return unsub;
  }, [user]);

  // Handle Form Submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedCatObj = EQUIPMENT_CATEGORIES.find(c => c.id === formData.category);
    const categoryLabel = selectedCatObj ? selectedCatObj.name.split(' ')[0] : 'Machinery';

    // Prepare image array
    let images = [...formData.images];
    if (formData.customImageUrl && formData.customImageUrl.trim() !== '') {
      images = [formData.customImageUrl.trim(), ...images];
    }

    const payload = {
      ownerId: user?.id || 'usr_01',
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      ownerRating: 4.9,
      reviewsCount: 1,
      verifiedOwner: true,
      title: formData.title || `${formData.brand} ${formData.model} (${categoryLabel})`,
      category: formData.category,
      categoryLabel,
      brand: formData.brand,
      model: formData.model,
      horsepower: Number(formData.horsepower) || 0,
      year: Number(formData.year) || 2023,
      images,
      price: Number(formData.price),
      priceUnit: formData.priceUnit,
      minBookingDuration: formData.minBookingDuration,
      operatorCharges: formData.operatorCharges,
      operatorFee: Number(formData.operatorFee) || 0,
      transportCharges: formData.transportCharges,
      freeRadiusKm: Number(formData.freeRadiusKm) || 8,
      transportFeePerKm: Number(formData.transportFeePerKm) || 25,
      transportFee: Number(formData.transportFee) || 500,
      location: {
        village: formData.village,
        taluk: formData.taluk,
        district: formData.district,
        state: 'Tamil Nadu',
        address: formData.address,
        coordinates: equipmentRentalService.getCoordinatesForLocation(formData.taluk || formData.district)
      },
      serviceRadiusKm: Number(formData.serviceRadiusKm) || 25,
      availableDays: formData.workingDays,
      workingHours: { start: formData.startTime, end: formData.endTime },
      status: formData.status,
      description: formData.description
    };

    if (editingId) {
      equipmentRentalService.updateListing(editingId, payload);
      setToast({ type: 'success', text: 'Equipment listing updated successfully!' });
      setEditingId(null);
    } else {
      equipmentRentalService.createListing(payload);
      setToast({ type: 'success', text: 'New equipment registered and listed live for nearby farmers!' });
    }

    // Reset Title and Switch to My Listings
    setFormData(prev => ({ ...prev, title: '' }));
    loadOwnerData();
    setActiveTab('my-listings');
  };

  // Toggle Availability
  const handleToggleStatus = (id) => {
    equipmentRentalService.toggleAvailability(id);
    loadOwnerData();
  };

  // Delete Listing
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this equipment listing?')) {
      equipmentRentalService.deleteListing(id);
      loadOwnerData();
      setToast({ type: 'info', text: 'Equipment listing removed.' });
    }
  };

  // Edit Listing
  const handleEdit = (eq) => {
    setEditingId(eq.id);
    setFormData({
      title: eq.title,
      category: eq.category,
      brand: eq.brand,
      model: eq.model,
      horsepower: eq.horsepower,
      year: eq.year,
      images: eq.images || [],
      customImageUrl: '',
      price: eq.price,
      priceUnit: eq.priceUnit,
      minBookingDuration: eq.minBookingDuration,
      operatorCharges: eq.operatorCharges,
      operatorFee: eq.operatorFee || 0,
      transportCharges: eq.transportCharges,
      freeRadiusKm: eq.freeRadiusKm || 8,
      transportFeePerKm: eq.transportFeePerKm || 25,
      transportFee: eq.transportFee || 500,
      district: eq.location?.district || 'Erode',
      taluk: eq.location?.taluk || 'Perundurai',
      village: eq.location?.village || '',
      address: eq.location?.address || '',
      serviceRadiusKm: eq.serviceRadiusKm || 25,
      workingDays: eq.availableDays || [],
      startTime: eq.workingHours?.start || '06:00 AM',
      endTime: eq.workingHours?.end || '07:30 PM',
      status: eq.status,
      description: eq.description,
      ownerName: eq.ownerName,
      ownerPhone: eq.ownerPhone
    });
    setActiveTab('register');
  };

  // Update Enquiry Status
  const handleEnquiryAction = (id, newStatus) => {
    equipmentRentalService.updateEnquiryStatus(id, newStatus);
    loadOwnerData();
    setToast({ type: 'success', text: `Enquiry marked as ${newStatus}` });
  };

  const districts = ['Erode', 'Coimbatore', 'Tiruppur', 'Salem', 'Namakkal', 'Thanjavur', 'Madurai', 'Tiruchirappalli'];
  const taluksForDistrict = Object.entries(TN_LOCATION_COORDINATES)
    .filter(([_, data]) => data.district === formData.district)
    .map(([taluk]) => taluk);

  return (
    <div className="list-equipment-page">
      {/* 1. HERO BANNER */}
      <div className="list-hero-banner">
        <div>
          <span className="hero-pill-badge">
            <Wrench size={15} />
            <span>Equipment Owner Portal</span>
          </span>
          <h1 className="list-hero-title" style={{ color: '#ffffff' }}>
            {editingId ? 'Edit Equipment Listing' : 'List Your Agricultural Machinery'}
          </h1>
          <p className="list-hero-subtitle">
            Register your tractors, JCBs, harvesters, rotavators, and implements. 
            Receive direct booking enquiries from farmers within your service radius with transparent terms.
          </p>
        </div>

        <button 
          onClick={() => setActivePage('equipment')}
          className="btn btn-outline"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: '#ffffff', fontWeight: 700 }}
        >
          View Farmer Discovery Feed ➔
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification-bar success" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="toast-close-btn">✕</button>
        </div>
      )}

      {/* 2. OWNER NAVIGATION TABS */}
      <div className="owner-tabs-bar">
        <button 
          onClick={() => { setEditingId(null); setActiveTab('register'); }}
          className={`owner-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>{editingId ? 'Edit Listing Form' : 'Register Equipment'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('my-listings')}
          className={`owner-tab-btn ${activeTab === 'my-listings' ? 'active' : ''}`}
        >
          <Layers size={18} />
          <span>My Listings ({myListings.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('enquiries')}
          className={`owner-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>Received Enquiries ({receivedEnquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: REGISTRATION / EDIT FORM */}
      {activeTab === 'register' && (
        <div className="farm-card form-container-card">
          <form onSubmit={handleSubmit} className="owner-equipment-form">
            
            {/* Section 1: Owner Profile & Contact */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-step-num">1</span>
                <span>Owner & Contact Information</span>
              </h3>
              <div className="form-grid-2">
                <div>
                  <label>Owner Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="ai-settings-input"
                    placeholder="e.g. Senthil Velan"
                  />
                </div>

                <div>
                  <label>Mobile Number for Direct Calls *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    className="ai-settings-input"
                    placeholder="+91 98421 88712"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Equipment Identity & Specifications */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-step-num">2</span>
                <span>Equipment Details & Specifications</span>
              </h3>

              <div className="form-grid-2">
                <div className="full-width">
                  <label>Listing Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="ai-settings-input"
                    placeholder="e.g. Mahindra 575 DI (45 HP) with 42-Blade Rotavator & MB Plough"
                  />
                </div>

                <div>
                  <label>Equipment Category *</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="ai-settings-select"
                  >
                    <option value="tractor">Tractor (35-65 HP)</option>
                    <option value="jcb">JCB & Earthmover Backhoe Loader</option>
                    <option value="harvester">Combine Paddy Harvester</option>
                    <option value="rotavator">Rotavator & Rotary Tiller</option>
                    <option value="cultivator">Cultivator & Ripper</option>
                    <option value="seed_drill">Seed Drill & Planter</option>
                    <option value="plough">Plough (MB & Disc)</option>
                    <option value="water_tanker">Water Tanker & Mist Sprayer</option>
                    <option value="power_tiller">Power Tiller (Walk-behind)</option>
                    <option value="drone">Agri Sprayer Drone</option>
                  </select>
                </div>

                <div>
                  <label>Brand / Manufacturer *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="ai-settings-input"
                    placeholder="e.g. Mahindra, John Deere, JCB, Kubota, Swaraj"
                  />
                </div>

                <div>
                  <label>Model Name / Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="ai-settings-input"
                    placeholder="e.g. 575 DI, 5310 4WD, 3DX Super"
                  />
                </div>

                <div className="form-grid-2" style={{ gridColumn: 'span 1' }}>
                  <div>
                    <label>Horsepower (HP)</label>
                    <input 
                      type="number" 
                      value={formData.horsepower}
                      onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                      className="ai-settings-input"
                      placeholder="e.g. 45"
                    />
                  </div>
                  <div>
                    <label>Mfg Year</label>
                    <input 
                      type="number" 
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="ai-settings-input"
                      placeholder="e.g. 2023"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Selector, Device Upload & Presets */}
              <div style={{ marginTop: '20px' }} className="image-upload-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                    Equipment Photographs *
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {formData.images.length} photo(s) selected
                  </span>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Upload clear photos directly from your device (camera/gallery/computer) or select verified machinery presets.
                </p>

                {/* 1. Device File Upload Zone */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  multiple 
                  onChange={handleDeviceImageUpload} 
                  style={{ display: 'none' }} 
                />

                <div 
                  className={`device-upload-dropzone ${isDragging ? 'dragging' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDropFiles}
                  title="Click to browse photos on your device"
                >
                  <div className="dropzone-icon-box">
                    <UploadCloud size={28} />
                  </div>
                  <div className="dropzone-title">
                    Upload Photos from This Device
                  </div>
                  <div className="dropzone-subtitle">
                    Click to select from your device storage or drag & drop files here (JPG, PNG, WEBP)
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ marginTop: '8px', padding: '6px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload size={14} />
                    <span>Browse Files on Device</span>
                  </button>
                </div>

                {/* 2. Active Attached Images Gallery Strip */}
                {formData.images && formData.images.length > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Selected Machinery Photos (First photo is Primary Cover)
                    </label>
                    <div className="active-images-gallery">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="uploaded-image-preview-card">
                          <img src={imgUrl} alt={`Selected ${idx + 1}`} />
                          {idx === 0 ? (
                            <span className="primary-photo-badge">Cover Photo</span>
                          ) : (
                            <button
                              type="button"
                              className="make-primary-btn"
                              onClick={() => {
                                const reordered = [imgUrl, ...formData.images.filter((_, i) => i !== idx)];
                                setFormData({ ...formData, images: reordered });
                              }}
                              title="Set as Cover Photo"
                            >
                              Set Cover
                            </button>
                          )}
                          <button 
                            type="button" 
                            className="remove-photo-btn"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove Photo"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Preset Library Photos */}
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#475569', marginBottom: '8px' }}>
                    Or Pick from Verified Machine Presets
                  </label>
                  <div className="photo-presets-grid">
                    {EQUIPMENT_PHOTO_PRESETS.map((preset, idx) => {
                      const isSelected = formData.images.includes(preset.url);
                      return (
                        <div 
                          key={idx}
                          onClick={() => handlePresetClick(preset.url)}
                          className={`preset-thumb-card ${isSelected ? 'selected' : ''}`}
                          title={`Click to ${isSelected ? 'remove' : 'add'} ${preset.title}`}
                        >
                          <img src={preset.url} alt={preset.title} />
                          <span>{preset.title}</span>
                          {isSelected && (
                            <span className="preset-check-badge">✓ Selected</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Custom URL Input */}
                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                    Or Add Image via Web Link (Optional)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="url" 
                      value={formData.customImageUrl}
                      onChange={(e) => setFormData({ ...formData, customImageUrl: e.target.value })}
                      className="ai-settings-input"
                      placeholder="Paste image web address (https://...)"
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="btn btn-outline"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                    >
                      Add Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Pricing, Units & Amenities */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-step-num">3</span>
                <span>Rental Rates & Service Terms</span>
              </h3>

              <div className="form-grid-3">
                <div>
                  <label>Rental Price (₹) *</label>
                  <input 
                    type="number" 
                    required 
                    min="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="ai-settings-input"
                    placeholder="e.g. 850"
                  />
                </div>

                <div>
                  <label>Pricing Unit *</label>
                  <select 
                    value={formData.priceUnit}
                    onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                    className="ai-settings-select"
                  >
                    <option value="hour">Per Hour (₹/hr)</option>
                    <option value="acre">Per Acre (₹/acre)</option>
                    <option value="day">Per Day (₹/day)</option>
                  </select>
                </div>

                <div>
                  <label>Minimum Booking</label>
                  <select 
                    value={formData.minBookingDuration}
                    onChange={(e) => setFormData({ ...formData, minBookingDuration: e.target.value })}
                    className="ai-settings-select"
                  >
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours (Standard)</option>
                    <option value="3 Hours">3 Hours</option>
                    <option value="1 Acre">1 Acre</option>
                    <option value="1 Day">1 Day</option>
                  </select>
                </div>

                <div>
                  <label>Operator Fee Terms</label>
                  <select 
                    value={formData.operatorCharges}
                    onChange={(e) => setFormData({ ...formData, operatorCharges: e.target.value })}
                    className="ai-settings-select"
                  >
                    <option value="INCLUDED">Operator Included in Rate ✓</option>
                    <option value="EXTRA">Operator Charged Separately</option>
                  </select>
                </div>

                {formData.operatorCharges === 'EXTRA' && (
                  <div>
                    <label>Operator Fee (₹/hr)</label>
                    <input 
                      type="number" 
                      value={formData.operatorFee}
                      onChange={(e) => setFormData({ ...formData, operatorFee: e.target.value })}
                      className="ai-settings-input"
                      placeholder="150"
                    />
                  </div>
                )}

                <div>
                  <label>Transportation Terms</label>
                  <select 
                    value={formData.transportCharges}
                    onChange={(e) => setFormData({ ...formData, transportCharges: e.target.value })}
                    className="ai-settings-select"
                  >
                    <option value="FREE_LOCAL">Free Local Delivery (Within Radius)</option>
                    <option value="PER_KM">Per Km Beyond Base Distance</option>
                    <option value="FIXED">Fixed Transport Fee</option>
                  </select>
                </div>

                {formData.transportCharges === 'FREE_LOCAL' && (
                  <div>
                    <label>Free Delivery Radius (km)</label>
                    <input 
                      type="number" 
                      value={formData.freeRadiusKm}
                      onChange={(e) => setFormData({ ...formData, freeRadiusKm: e.target.value })}
                      className="ai-settings-input"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Location & Service Radius */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-step-num">4</span>
                <span>Base Location & Service Radius</span>
              </h3>

              <div className="form-grid-3">
                <div>
                  <label>District *</label>
                  <select 
                    value={formData.district}
                    onChange={(e) => {
                      setFormData({ ...formData, district: e.target.value });
                      const firstTaluk = Object.keys(TN_LOCATION_COORDINATES).find(
                        k => TN_LOCATION_COORDINATES[k].district === e.target.value
                      );
                      if (firstTaluk) setFormData(prev => ({ ...prev, taluk: firstTaluk }));
                    }}
                    className="ai-settings-select"
                  >
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Taluk / Town *</label>
                  <select 
                    value={formData.taluk}
                    onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                    className="ai-settings-select"
                  >
                    {taluksForDistrict.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Service Radius (km) *</label>
                  <select 
                    value={formData.serviceRadiusKm}
                    onChange={(e) => setFormData({ ...formData, serviceRadiusKm: e.target.value })}
                    className="ai-settings-select"
                  >
                    <option value={10}>Up to 10 km (Local Village Cluster)</option>
                    <option value={20}>Up to 20 km</option>
                    <option value={25}>Up to 25 km (Recommended)</option>
                    <option value={35}>Up to 35 km</option>
                    <option value={50}>Up to 50 km (Broad Agro-Belt)</option>
                    <option value={75}>Up to 75 km (Combine Harvester range)</option>
                  </select>
                </div>

                <div className="full-width">
                  <label>Village, Street & Landmark *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="ai-settings-input"
                    placeholder="e.g. Perundurai Bypass Road, Near Tractor Works"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Availability & Description */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-step-num">5</span>
                <span>Availability & Agronomic Description</span>
              </h3>

              <div className="form-grid-2">
                <div>
                  <label>Current Availability Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="ai-settings-select"
                  >
                    <option value="AVAILABLE">Available for Work Now ✓</option>
                    <option value="BUSY">Currently Busy / Booked</option>
                    <option value="MAINTENANCE">Under Maintenance / Service</option>
                  </select>
                </div>

                <div className="form-grid-2" style={{ gridColumn: 'span 1' }}>
                  <div>
                    <label>Daily Start Time</label>
                    <input 
                      type="text" 
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="ai-settings-input"
                      placeholder="06:00 AM"
                    />
                  </div>
                  <div>
                    <label>Daily End Time</label>
                    <input 
                      type="text" 
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="ai-settings-input"
                      placeholder="07:30 PM"
                    />
                  </div>
                </div>

                <div className="full-width">
                  <label>Detailed Description & Attachments Included</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="ai-settings-input"
                    placeholder="Describe attachments provided (e.g. 9-tyne cultivator, cage wheels, rotavator), suitable soil types, diesel terms, and experience..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-submit-row">
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setActiveTab('my-listings'); }}
                  className="btn btn-outline"
                >
                  Cancel Edit
                </button>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                style={{ padding: '14px 36px', fontWeight: 800 }}
              >
                <CheckCircle2 size={20} />
                <span>{editingId ? 'Save Changes & Update Listing' : 'Publish Equipment Listing Live'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MY LISTINGS DASHBOARD */}
      {activeTab === 'my-listings' && (
        <div className="my-listings-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
              Your Registered Agricultural Fleet ({myListings.length})
            </h3>
            <button 
              onClick={() => { setEditingId(null); setActiveTab('register'); }}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={16} /> Register Another Machine
            </button>
          </div>

          {myListings.length > 0 ? (
            <div className="my-listings-grid">
              {myListings.map(item => {
                const isAvail = item.status === 'AVAILABLE';
                return (
                  <div key={item.id} className="my-listing-card farm-card">
                    <div className="my-listing-media">
                      <img 
                        src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800'} 
                        alt={item.title} 
                      />
                      <span className={`my-status-badge ${isAvail ? 'available' : 'busy'}`}>
                        {isAvail ? 'Available' : 'Busy'}
                      </span>
                    </div>

                    <div className="my-listing-content">
                      <h4 className="my-listing-title">{item.title}</h4>
                      <div className="my-listing-rates">
                        <strong>₹{item.price?.toLocaleString('en-IN')} / {item.priceUnit}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          • {item.serviceRadiusKm} km radius
                        </span>
                      </div>

                      <div className="my-listing-loc">
                        <MapPin size={13} />
                        <span>{item.location?.village}, {item.location?.district}</span>
                      </div>

                      <div className="my-listing-actions">
                        <button 
                          onClick={() => handleToggleStatus(item.id)}
                          className={`btn btn-sm ${isAvail ? 'btn-outline' : 'btn-primary'}`}
                          title="Toggle Available / Busy"
                        >
                          {isAvail ? 'Mark as Busy' : 'Mark as Available'}
                        </button>

                        <button 
                          onClick={() => handleEdit(item)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Listing"
                        >
                          <Edit3 size={15} /> Edit
                        </button>

                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-sm delete-btn"
                          title="Delete Listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="farm-card" style={{ textAlign: 'center', padding: '40px' }}>
              <Tractor size={48} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <h4>No machinery registered under your profile yet.</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                Start offering rental services to nearby farmers in your district!
              </p>
              <button onClick={() => setActiveTab('register')} className="btn btn-primary">
                <PlusCircle size={18} /> Register Your First Machine
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECEIVED BOOKING ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="enquiries-container">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#0f172a' }}>
            Farmer Booking Enquiries & Requests ({receivedEnquiries.length})
          </h3>

          {receivedEnquiries.length > 0 ? (
            <div className="enquiries-list">
              {receivedEnquiries.map(enq => (
                <div key={enq.id} className="enquiry-card farm-card">
                  <div className="enquiry-header">
                    <div>
                      <span className="badge badge-green" style={{ marginBottom: '4px' }}>
                        Enquiry #{enq.id}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                        {enq.equipmentTitle}
                      </h4>
                      <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                        Requested by: <strong>{enq.farmerName}</strong> • {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className={`enquiry-status-pill ${enq.status.toLowerCase()}`}>
                      Status: {enq.status}
                    </span>
                  </div>

                  {/* Enquiry Details Grid */}
                  <div className="enquiry-details-grid">
                    <div className="enquiry-detail-box">
                      <span className="detail-label">Service Date & Time</span>
                      <strong className="detail-val">{enq.requiredDate} ({enq.preferredTime})</strong>
                    </div>
                    <div className="enquiry-detail-box">
                      <span className="detail-label">Estimated Work</span>
                      <strong className="detail-val">{enq.estimatedDuration}</strong>
                    </div>
                    <div className="enquiry-detail-box">
                      <span className="detail-label">Farm Location</span>
                      <strong className="detail-val">{enq.farmLocation}</strong>
                    </div>
                    <div className="enquiry-detail-box">
                      <span className="detail-label">Farmer Contact</span>
                      <strong className="detail-val">{enq.farmerPhone}</strong>
                    </div>
                  </div>

                  {enq.workNotes && (
                    <div className="enquiry-notes-box">
                      <strong>Farmer Note:</strong> "{enq.workNotes}"
                    </div>
                  )}

                  {/* Owner Action Buttons */}
                  <div className="enquiry-action-row">
                    <a 
                      href={`tel:${enq.farmerPhone}`} 
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Phone size={15} /> Call Farmer ({enq.farmerPhone})
                    </a>

                    <a 
                      href={`https://wa.me/${enq.farmerPhone.replace(/[\s+-]/g, '')}?text=${encodeURIComponent(`Vanakkam ${enq.farmerName}, I received your enquiry #${enq.id} on Farmogram for ${enq.equipmentTitle}. Let's finalize arrival timing.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#047857', borderColor: '#6ee7b7' }}
                    >
                      <MessageSquare size={15} /> Reply via WhatsApp
                    </a>

                    {enq.status === 'PENDING' && (
                      <button 
                        onClick={() => handleEnquiryAction(enq.id, 'ACCEPTED')}
                        className="btn btn-secondary btn-sm"
                      >
                        Accept Request ✓
                      </button>
                    )}

                    {enq.status === 'ACCEPTED' && (
                      <button 
                        onClick={() => handleEnquiryAction(enq.id, 'COMPLETED')}
                        className="btn btn-secondary btn-sm"
                      >
                        Mark Completed ✓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="farm-card" style={{ textAlign: 'center', padding: '40px' }}>
              <MessageSquare size={44} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <h4>No booking enquiries received yet.</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                When farmers search and request services near your village, their requests will appear here instantly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
