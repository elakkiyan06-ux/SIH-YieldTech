import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  Truck, 
  UserCheck, 
  Star, 
  MessageSquare, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CATEGORY_DEFAULT_IMAGES } from '../../data/equipmentSeedData';

export const EquipmentCard = ({ 
  equipment, 
  onContactClick, 
  onReportClick, 
  farmerLocationName = 'Your Farm' 
}) => {
  const [showPhone, setShowPhone] = useState(false);
  const [imgError, setImgError] = useState(false);

  const priceFormatted = `₹${equipment.price?.toLocaleString('en-IN')}`;
  const priceUnitDisplay = equipment.priceUnit === 'hour' ? '/ Hour' :
                           equipment.priceUnit === 'acre' ? '/ Acre' : '/ Day';

  const categoryFallback = (CATEGORY_DEFAULT_IMAGES && CATEGORY_DEFAULT_IMAGES[equipment.category]) 
    ? CATEGORY_DEFAULT_IMAGES[equipment.category] 
    : '/images/equipment/tractor_mahindra_rotavator.jpg';

  const displayImage = !imgError && equipment.images && equipment.images.length > 0 && equipment.images[0]
    ? equipment.images[0] 
    : categoryFallback;

  const isAvailable = equipment.status === 'AVAILABLE';

  // Mask phone for privacy: +91 98421 ••••2
  const maskedPhone = equipment.ownerPhone 
    ? equipment.ownerPhone.slice(0, 9) + '••••' + equipment.ownerPhone.slice(-2)
    : '+91 ••••••••••';

  return (
    <div className={`equipment-card ${!isAvailable ? 'equipment-busy' : ''}`}>
      {/* Equipment Image & Overlays */}
      <div className="equipment-card-media">
        <img 
          src={displayImage} 
          alt={equipment.title} 
          onError={() => setImgError(true)}
          className="equipment-img"
          loading="lazy"
        />
        
        {/* Availability Pill */}
        <div className={`availability-pill ${isAvailable ? 'available' : 'busy'}`}>
          <span className="pill-dot" />
          <span>{isAvailable ? 'Available for Work' : 'Currently Busy'}</span>
        </div>

        {/* Category Badge */}
        <div className="category-chip">
          {equipment.categoryLabel || equipment.category}
        </div>

        {/* Distance Badge */}
        {equipment.distanceKm != null && (
          <div className="distance-badge-overlay">
            <MapPin size={13} />
            <span>{equipment.distanceKm} km away</span>
          </div>
        )}
      </div>

      {/* Equipment Card Body */}
      <div className="equipment-card-body">
        {/* Price & Title Header */}
        <div className="card-top-row">
          <div className="equipment-price-block">
            <span className="price-number">{priceFormatted}</span>
            <span className="price-unit">{priceUnitDisplay}</span>
          </div>

          <div className="owner-rating-chip">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{equipment.ownerRating || 4.8}</span>
            <span className="reviews-count">({equipment.reviewsCount || 24})</span>
          </div>
        </div>

        <h3 className="equipment-title" title={equipment.title}>
          {equipment.title}
        </h3>

        {/* Brand, Model & Horsepower Subtitle */}
        <div className="equipment-subtitle">
          <span>{equipment.brand}</span>
          {equipment.horsepower > 0 && <span>• {equipment.horsepower} HP</span>}
          {equipment.year && <span>• {equipment.year} Model</span>}
        </div>

        {/* Location & Service Radius Info */}
        <div className="location-info-row">
          <div className="loc-text">
            <MapPin size={14} className="loc-icon" />
            <span>
              <strong>{equipment.location?.village || equipment.location?.taluk}</strong>, {equipment.location?.district}
            </span>
          </div>

          {/* Service Radius Indicator */}
          <div className={`service-zone-pill ${equipment.isServiceable ? 'in-zone' : 'out-zone'}`}>
            {equipment.isServiceable ? (
              <span>✓ In {equipment.serviceRadiusKm || 25}km Service Zone</span>
            ) : (
              <span>+Transport ({equipment.distanceKm}km &gt; {equipment.serviceRadiusKm}km)</span>
            )}
          </div>
        </div>

        {/* Specs & Operational Amenities Grid */}
        <div className="equipment-amenities-row">
          <div className="amenity-item" title="Minimum rental duration">
            <Clock size={13} />
            <span>Min: {equipment.minBookingDuration || '2 Hours'}</span>
          </div>

          <div className="amenity-item" title="Operator terms">
            <UserCheck size={13} />
            <span>{equipment.operatorCharges === 'INCLUDED' ? 'Operator Inc.' : `+₹${equipment.operatorFee}/hr`}</span>
          </div>

          <div className="amenity-item" title="Transportation details">
            <Truck size={13} />
            <span>
              {equipment.transportCharges === 'FREE_LOCAL' 
                ? `Free <${equipment.freeRadiusKm || 8}km` 
                : `₹${equipment.transportFeePerKm || 25}/km`}
            </span>
          </div>
        </div>

        {/* Description Excerpt */}
        {equipment.description && (
          <p className="equipment-desc-snippet">
            {equipment.description.length > 115 
              ? equipment.description.substring(0, 115) + '...' 
              : equipment.description}
          </p>
        )}

        {/* Owner & Contact Row */}
        <div className="owner-contact-preview-row">
          <div className="owner-meta">
            <div className="owner-avatar-circle">
              {equipment.ownerName ? equipment.ownerName.charAt(0) : 'O'}
            </div>
            <div>
              <div className="owner-name-group">
                <span className="owner-name">{equipment.ownerName}</span>
                {equipment.verifiedOwner && (
                  <ShieldCheck size={14} color="#16a34a" title="Verified Machinery Owner" />
                )}
              </div>
              <div className="owner-phone-text">
                {showPhone ? (
                  <a href={`tel:${equipment.ownerPhone}`} className="revealed-phone">
                    {equipment.ownerPhone}
                  </a>
                ) : (
                  <button 
                    onClick={() => setShowPhone(true)} 
                    className="mask-toggle-btn"
                    title="Click to reveal phone number"
                  >
                    <span>{maskedPhone}</span>
                    <span className="show-label">Show</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Report Flag */}
          <button 
            onClick={() => onReportClick && onReportClick(equipment)}
            className="report-flag-btn"
            title="Report incorrect price or unavailable equipment"
          >
            <AlertTriangle size={14} />
          </button>
        </div>

        {/* Primary Contact Action Button */}
        <div className="equipment-card-footer">
          <button 
            onClick={() => onContactClick && onContactClick(equipment)}
            className="btn btn-primary contact-owner-btn"
          >
            <Phone size={16} />
            <span>Contact Owner & Book</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
