import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Snowflake, 
  Warehouse, 
  Building, 
  Package, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  MessageSquare,
  Thermometer,
  ShieldCheck,
  Star
} from 'lucide-react';
import { getStorageImageUrl } from '../../data/storageSeedData';
import './StorageCard.css';

export const StorageCard = ({ 
  facility, 
  onSelectFacility, 
  onEnquire, 
  onCallOwner 
}) => {
  const [imgError, setImgError] = useState(false);

  // Type Icon Mapper
  const getTypeIcon = (type) => {
    switch (type) {
      case 'cold_storage':
        return <Snowflake size={14} />;
      case 'grain_godown':
        return <Warehouse size={14} />;
      case 'warehouse':
        return <Building size={14} />;
      case 'packhouse':
        return <Package size={14} />;
      case 'grain_silo':
        return <Layers size={14} />;
      default:
        return <Warehouse size={14} />;
    }
  };

  const isAvailable = facility.status === 'AVAILABLE' && (facility.availableCapacity || 0) > 0;
  const capacityPercent = facility.totalCapacity 
    ? Math.min(100, Math.round(((facility.availableCapacity || 0) / facility.totalCapacity) * 100))
    : 0;

  // Fallback image based on type
  const getFallbackImage = (type) => {
    switch (type) {
      case 'cold_storage':
        return getStorageImageUrl('images/storage/cold_storage_facility.jpg');
      case 'grain_godown':
        return getStorageImageUrl('images/storage/grain_godown_warehouse.jpg');
      case 'packhouse':
        return getStorageImageUrl('images/storage/modern_packhouse_facility.jpg');
      case 'grain_silo':
        return getStorageImageUrl('images/storage/grain_silo_facility.jpg');
      default:
        return getStorageImageUrl('images/storage/cold_storage_facility.jpg');
    }
  };

  const displayImage = (!imgError && facility.images && facility.images[0])
    ? getStorageImageUrl(facility.images[0])
    : getFallbackImage(facility.storageType);

  return (
    <div className={`storage-card ${!isAvailable ? 'storage-full' : ''}`}>
      {/* Media Header */}
      <div className="storage-card-media">
        <img 
          src={displayImage} 
          alt={facility.facilityName}
          onError={() => setImgError(true)}
          className="storage-card-img"
          loading="lazy"
        />

        {/* Storage Type Badge */}
        <div className={`storage-type-badge ${facility.storageType}`}>
          {getTypeIcon(facility.storageType)}
          <span>{facility.storageTypeLabel}</span>
        </div>

        {/* Distance Badge */}
        {facility.distanceKm != null && (
          <div className="storage-distance-badge">
            <MapPin size={13} color="#16a34a" />
            <span>{facility.distanceKm} km away</span>
          </div>
        )}

        {/* Availability Pill */}
        <div className={`storage-status-pill ${isAvailable ? 'available' : 'full'}`}>
          {isAvailable ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          <span>{isAvailable ? `${facility.availableCapacity} MT Space` : 'Full / Occupied'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="storage-card-body">
        {/* Title & Price */}
        <div className="storage-card-title-row">
          <div>
            <h3 className="storage-facility-title">{facility.facilityName}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Owner: {facility.ownerName}
              </span>
              {facility.verifiedOwner && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700 }}>
                  <ShieldCheck size={13} /> Verified
                </span>
              )}
            </div>
          </div>
          <div className="storage-price-badge">
            <span className="storage-price-amount">₹{facility.price}</span>
            <span className="storage-price-unit">{facility.priceUnit === 'tonne_day' ? '/ Tonne / Day' : facility.priceUnitLabel || '/ Day'}</span>
          </div>
        </div>

        {/* Location Row */}
        <div className="storage-location-row">
          <MapPin size={14} color="#64748b" style={{ flexShrink: 0 }} />
          <span>{facility.location?.village || facility.location?.taluk}, {facility.location?.district} (PIN: {facility.location?.pincode})</span>
        </div>

        {/* Capacity Visual Progress */}
        <div className="storage-capacity-block">
          <div className="storage-capacity-header">
            <span>Capacity Utilization</span>
            <span>
              <strong className="storage-cap-available">{facility.availableCapacity} MT</strong>
              <span className="storage-cap-total"> / {facility.totalCapacity} MT</span>
            </span>
          </div>
          <div className="storage-progress-bar-bg">
            <div 
              className="storage-progress-bar-fill" 
              style={{ width: `${capacityPercent}%`, background: capacityPercent < 20 ? '#ef4444' : capacityPercent < 50 ? '#f59e0b' : 'linear-gradient(90deg, #16a34a, #22c55e)' }} 
            />
          </div>
        </div>

        {/* Conditions & Temperature */}
        <div className="storage-conditions-chip">
          {facility.temperatureRange ? (
            <>
              <Thermometer size={14} color="#0284c7" />
              <span>{facility.temperatureRange.min}°C to {facility.temperatureRange.max}°C ({facility.humidityPercentage || 'Controlled RH'})</span>
            </>
          ) : (
            <>
              <Warehouse size={14} color="#0284c7" />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {facility.storageConditions}
              </span>
            </>
          )}
        </div>

        {/* Supported Crops */}
        {facility.supportedCrops && facility.supportedCrops.length > 0 && (
          <div className="storage-crops-list">
            {facility.supportedCrops.slice(0, 4).map((crop, idx) => (
              <span key={idx} className="storage-crop-tag">
                🌾 {crop}
              </span>
            ))}
            {facility.supportedCrops.length > 4 && (
              <span className="storage-crop-tag" style={{ background: '#e2e8f0' }}>
                +{facility.supportedCrops.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Actions Footer */}
        <div className="storage-card-actions">
          <button 
            className="storage-btn-details"
            onClick={() => onSelectFacility(facility)}
            title="View details and calculate storage cost"
          >
            <Calculator size={15} /> Calculate & Details
          </button>

          <button 
            className="storage-btn-call"
            onClick={() => onCallOwner(facility)}
            title={`Call ${facility.ownerPhone}`}
          >
            <Phone size={15} />
          </button>

          <button 
            className="storage-btn-enquire"
            onClick={() => onEnquire(facility)}
            title="Send WhatsApp or In-App storage enquiry"
          >
            <MessageSquare size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
