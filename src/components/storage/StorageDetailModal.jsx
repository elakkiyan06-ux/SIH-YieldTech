import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calculator, 
  ShieldCheck, 
  Thermometer, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Layers, 
  ExternalLink,
  AlertTriangle,
  Snowflake,
  Warehouse,
  Building,
  Package,
  Check
} from 'lucide-react';
import { getStorageImageUrl } from '../../data/storageSeedData';
import './StorageDetailModal.css';

export const StorageDetailModal = ({ 
  facility, 
  onClose, 
  onEnquire, 
  onReport 
}) => {
  if (!facility) return null;

  // --- Interactive Cost Calculator State ---
  const [calcQuantity, setCalcQuantity] = useState(10);
  const [calcUnit, setCalcUnit] = useState('tonne'); // 'tonne' | 'bag'
  const [calcDays, setCalcDays] = useState(7);
  const [calcStartDate, setCalcStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [includeHandling, setIncludeHandling] = useState(true);

  // Pricing calculations
  const dailyRatePerTonne = Number(facility.price) || 5;
  const dailyRatePerBag = Number(facility.bagPrice) || (dailyRatePerTonne * 0.25);
  const loadingFeePerTonne = Number(facility.additionalCharges?.loadingUnloading) || 35;
  const handlingFeePerTonne = Number(facility.additionalCharges?.handlingFee) || 15;

  const effectiveDailyRate = calcUnit === 'tonne' ? dailyRatePerTonne : dailyRatePerBag;
  const baseStorageCost = Math.round(Number(calcQuantity) * effectiveDailyRate * Number(calcDays));
  
  const equivalentTonnes = calcUnit === 'tonne' ? Number(calcQuantity) : (Number(calcQuantity) / 20);
  const handlingCost = includeHandling 
    ? Math.round(equivalentTonnes * (loadingFeePerTonne + handlingFeePerTonne))
    : 0;

  const totalEstimatedCost = baseStorageCost + handlingCost;

  // Google Maps navigation link
  const mapsUrl = facility.location?.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${facility.location.coordinates.lat},${facility.location.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.facilityName + ' ' + facility.location?.district)}`;

  // Direct WhatsApp pre-fill message
  const whatsappText = encodeURIComponent(
    `Hello ${facility.ownerName},\n\nI found your storage facility "${facility.facilityName}" on Farmogram AI.\n\n` +
    `I am interested in storing:\n` +
    `• Produce: ${facility.supportedCrops?.[0] || 'Agricultural Produce'}\n` +
    `• Quantity: ${calcQuantity} ${calcUnit === 'tonne' ? 'Tonnes' : 'Bags'}\n` +
    `• Duration: ${calcDays} days (Starting ${calcStartDate})\n` +
    `• Estimated Tariff: ~₹${totalEstimatedCost}\n\n` +
    `Could you please confirm current space availability and intake procedure? Thank you!`
  );

  const cleanPhone = facility.ownerWhatsapp 
    ? facility.ownerWhatsapp.replace(/[^0-9]/g, '') 
    : facility.ownerPhone?.replace(/[^0-9]/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappText}`;

  return (
    <div className="storage-modal-overlay" onClick={onClose}>
      <div className="storage-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="storage-modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Hero Banner */}
        <div className="storage-modal-hero">
          <img 
            src={getStorageImageUrl(facility.images?.[0] || 'images/storage/cold_storage_facility.jpg')} 
            alt={facility.facilityName}
            className="storage-modal-hero-img"
          />
          <div className="storage-modal-hero-overlay">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className={`storage-type-badge ${facility.storageType}`} style={{ position: 'static' }}>
                {facility.storageTypeLabel}
              </span>
              {facility.verifiedOwner && (
                <span style={{ background: '#15803d', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Verified Partner
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>{facility.facilityName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', opacity: 0.9, marginTop: '4px' }}>
              <MapPin size={14} /> {facility.location?.address || `${facility.location?.village}, ${facility.location?.district}`}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="storage-modal-body">
          {/* Key Metrics Grid */}
          <div className="storage-metrics-grid">
            <div className="storage-metric-card">
              <div className="storage-metric-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <Warehouse size={22} />
              </div>
              <div>
                <span className="storage-metric-val">{facility.availableCapacity} MT</span>
                <span className="storage-metric-lbl">Available Space (of {facility.totalCapacity} MT)</span>
              </div>
            </div>

            <div className="storage-metric-card">
              <div className="storage-metric-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                <Calculator size={22} />
              </div>
              <div>
                <span className="storage-metric-val">₹{facility.price}</span>
                <span className="storage-metric-lbl">Base Tariff ({facility.priceUnitLabel || 'per Tonne / Day'})</span>
              </div>
            </div>

            <div className="storage-metric-card">
              <div className="storage-metric-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Clock size={22} />
              </div>
              <div>
                <span className="storage-metric-val">{facility.minStorageDurationDays} Days</span>
                <span className="storage-metric-lbl">Minimum Storage Duration</span>
              </div>
            </div>

            <div className="storage-metric-card">
              <div className="storage-metric-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Thermometer size={22} />
              </div>
              <div>
                <span className="storage-metric-val">
                  {facility.temperatureRange ? `${facility.temperatureRange.min}°C - ${facility.temperatureRange.max}°C` : 'Ambient'}
                </span>
                <span className="storage-metric-lbl">Temperature Control</span>
              </div>
            </div>
          </div>

          {/* Location & Navigation Link */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Full Physical Address</div>
              <div style={{ color: '#475569', fontSize: '0.85rem', marginTop: '3px' }}>
                {facility.location?.address}, {facility.location?.village}, {facility.location?.taluk}, {facility.location?.district} - {facility.location?.pincode}
              </div>
              {facility.distanceKm != null && (
                <div style={{ color: '#16a34a', fontSize: '0.82rem', fontWeight: 600, marginTop: '4px' }}>
                  📍 {facility.distanceKm} km from your currently selected farm location
                </div>
              )}
            </div>
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ background: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <ExternalLink size={15} /> Directions on Map
            </a>
          </div>

          {/* INTERACTIVE STORAGE COST CALCULATOR */}
          <div className="storage-calc-container">
            <div className="storage-calc-header">
              <Calculator size={22} color="#15803d" />
              <div>
                <h3>Interactive Storage Expense Calculator</h3>
                <span style={{ fontSize: '0.8rem', color: '#166534' }}>
                  Estimate your post-harvest holding cost based on registered owner rates
                </span>
              </div>
            </div>

            <div className="storage-calc-inputs-row">
              <div className="storage-calc-input-group">
                <label>Produce Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max={facility.availableCapacity || 5000}
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                />
              </div>

              <div className="storage-calc-input-group">
                <label>Billing Unit</label>
                <select value={calcUnit} onChange={(e) => setCalcUnit(e.target.value)}>
                  <option value="tonne">Metric Tonnes (₹{dailyRatePerTonne}/MT/day)</option>
                  <option value="bag">Standard Bags 50kg (₹{dailyRatePerBag}/bag/day)</option>
                </select>
              </div>

              <div className="storage-calc-input-group">
                <label>Storage Duration (Days)</label>
                <input 
                  type="number" 
                  min={facility.minStorageDurationDays || 1} 
                  max="365"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="storage-calc-input-group">
                <label>Intake Start Date</label>
                <input 
                  type="date" 
                  value={calcStartDate}
                  onChange={(e) => setCalcStartDate(e.target.value)}
                />
              </div>
            </div>

            {/* Handling fee toggle */}
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="includeHandling" 
                checked={includeHandling} 
                onChange={(e) => setIncludeHandling(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#16a34a' }}
              />
              <label htmlFor="includeHandling" style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600, cursor: 'pointer' }}>
                Include Loading & Handling charges (₹{loadingFeePerTonne + handlingFeePerTonne}/MT one-time)
              </label>
            </div>

            {/* Result Breakdown Card */}
            <div className="storage-calc-result-panel">
              <div className="storage-calc-line">
                <span>Base Storage Charge ({calcQuantity} {calcUnit === 'tonne' ? 'MT' : 'Bags'} × ₹{effectiveDailyRate}/day × {calcDays} days):</span>
                <strong>₹{baseStorageCost.toLocaleString('en-IN')}</strong>
              </div>

              {includeHandling && (
                <div className="storage-calc-line">
                  <span>Loading, Unloading & Weighbridge Handling ({equivalentTonnes.toFixed(1)} MT):</span>
                  <strong>₹{handlingCost.toLocaleString('en-IN')}</strong>
                </div>
              )}

              <div className="storage-calc-line">
                <span>Power & Refrigeration Backup:</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>Included Free</span>
              </div>

              <div className="storage-calc-total-line">
                <div>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Estimated Total Cost</span>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>For {calcDays} days storage</span>
                </div>
                <div className="storage-calc-total-amount">
                  ₹{totalEstimatedCost.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="storage-calc-disclaimer">
                ℹ️ <strong>Calculation Note:</strong> {calcQuantity} {calcUnit === 'tonne' ? 'Tonnes' : 'Bags'} × ₹{effectiveDailyRate}/day × {calcDays} days = ₹{baseStorageCost}. Final pricing, weighbridge slip tare weight, and receipt to be settled directly with facility owner upon arrival.
              </div>
            </div>
          </div>

          {/* Supported Crops & Products */}
          <div>
            <div className="storage-section-title">
              🌾 Supported Agricultural Produce & Crops
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {facility.supportedCrops?.map((crop, i) => (
                <span key={i} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Storage Conditions & Rules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Snowflake size={16} color="#0284c7" /> Storage Environment Specs
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                {facility.storageConditions}
              </p>
              {facility.humidityPercentage && (
                <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#0369a1', fontWeight: 600 }}>
                  Relative Humidity: {facility.humidityPercentage}
                </div>
              )}
            </div>

            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
              <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} color="#d97706" /> Facility Rules & Requirements
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#78350f', lineHeight: 1.5 }}>
                {facility.storageRules || 'Moisture test mandatory at gate. Please bring bags in clean undamaged condition.'}
              </p>
            </div>
          </div>

          {/* Available Amenities & Equipment */}
          <div>
            <div className="storage-section-title">
              🏗️ Facility Amenities & Infrastructure
            </div>
            <div className="storage-amenities-list">
              {facility.amenities?.map((amenity, i) => (
                <div key={i} className="storage-amenity-item">
                  <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Info & Operating Hours */}
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>FACILITY OPERATOR</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{facility.ownerName}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                Operational Hours: {facility.operatingHours?.start || '06:00 AM'} – {facility.operatingHours?.end || '08:00 PM'} (All 7 Days)
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>CONTACT NUMBER</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#15803d' }}>{facility.ownerPhone}</div>
            </div>
          </div>
        </div>

        {/* Footer Direct Contact Actions */}
        <div className="storage-modal-footer">
          <button 
            className="storage-btn-report-link"
            onClick={() => onReport(facility)}
          >
            <AlertTriangle size={14} /> Report incorrect price or false capacity
          </button>

          <div className="storage-footer-contact-btns">
            <a 
              href={`tel:${facility.ownerPhone}`} 
              className="storage-btn-call-large"
              style={{ textDecoration: 'none' }}
            >
              <Phone size={18} /> Call Owner
            </a>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="storage-btn-whatsapp-large"
              style={{ textDecoration: 'none' }}
            >
              <MessageSquare size={18} /> WhatsApp Enquiry
            </a>

            <button 
              className="storage-btn-enquire-large"
              onClick={() => onEnquire({
                ...facility,
                calcQuantity,
                calcUnit,
                calcDays,
                calcStartDate,
                totalEstimatedCost
              })}
            >
              Enquire About Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
