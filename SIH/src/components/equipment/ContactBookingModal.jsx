import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  User,
  Sparkles,
  Send
} from 'lucide-react';
import { equipmentRentalService } from '../../services/equipmentRentalService';

export const ContactBookingModal = ({ equipment, farmerUser, isOpen, onClose, onEnquirySuccess }) => {
  if (!isOpen || !equipment) return null;

  const [farmerName, setFarmerName] = useState(farmerUser?.name || 'Murugan K.');
  const [farmerPhone, setFarmerPhone] = useState(farmerUser?.phone || '+91 98421 76540');
  const [farmLocation, setFarmLocation] = useState(
    farmerUser?.village ? `${farmerUser.village}, ${farmerUser.district}` : 'Perundurai Village, Erode'
  );
  const [requiredDate, setRequiredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('07:00 AM');
  const [estimatedDuration, setEstimatedDuration] = useState('4 Hours');
  const [workNotes, setWorkNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);

  const cleanOwnerPhone = equipment.ownerPhone ? equipment.ownerPhone.replace(/[\s+-]/g, '') : '';
  const priceDisplay = `₹${equipment.price?.toLocaleString('en-IN')} / ${equipment.priceUnit}`;

  // Pre-filled WhatsApp enquiry message
  const generateWhatsAppUrl = () => {
    const message = `Vanakkam / Hello ${equipment.ownerName}, I saw your listing on Farmogram AI for *${equipment.title}* (${priceDisplay}).
I need this equipment at my farm in *${farmLocation}* on *${requiredDate}* around *${preferredTime}* for approximately *${estimatedDuration}*.
Please let me know your availability and final arrangements.
- ${farmerName} (${farmerPhone})`;

    return `https://wa.me/${cleanOwnerPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const enquiry = equipmentRentalService.createEnquiry({
        equipmentId: equipment.id,
        equipmentTitle: equipment.title,
        equipmentCategory: equipment.category,
        ownerPhone: equipment.ownerPhone,
        ownerName: equipment.ownerName,
        farmerId: farmerUser?.id || 'usr_01',
        farmerName,
        farmerPhone,
        farmLocation,
        requiredDate,
        preferredTime,
        estimatedDuration,
        workNotes: workNotes || 'Standard agricultural field preparation & service requested.'
      });

      setIsSubmitting(false);
      setSubmittedEnquiry(enquiry);
      if (onEnquirySuccess) onEnquirySuccess(enquiry);
    } catch (err) {
      setIsSubmitting(false);
      alert('Unable to submit enquiry. Please try direct call or WhatsApp.');
    }
  };

  return (
    <div className="equipment-modal-backdrop" onClick={onClose}>
      <div className="equipment-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="equipment-modal-header">
          <div>
            <span className="badge badge-green" style={{ marginBottom: '4px' }}>
              🚜 Direct Agricultural Rental Contact
            </span>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
              {equipment.title}
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Owner: <strong>{equipment.ownerName}</strong> • {equipment.location?.village}, {equipment.location?.district}
            </span>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="equipment-modal-body">
          {/* Quick Direct Actions Toolbar */}
          <div className="direct-contact-action-bar">
            <a 
              href={`tel:${equipment.ownerPhone}`} 
              className="direct-action-btn call-action"
            >
              <Phone size={20} />
              <div>
                <strong>Call Owner Directly</strong>
                <span>{equipment.ownerPhone}</span>
              </div>
            </a>

            <a 
              href={generateWhatsAppUrl()} 
              target="_blank" 
              rel="noreferrer"
              className="direct-action-btn whatsapp-action"
            >
              <MessageSquare size={20} />
              <div>
                <strong>Chat on WhatsApp</strong>
                <span>Instant Pre-Filled Enquiry</span>
              </div>
            </a>
          </div>

          {/* Pricing & Service Specifications Summary Card */}
          <div className="equipment-specs-summary-box">
            <div className="spec-item">
              <span className="spec-label">Rental Rate</span>
              <strong className="spec-value highlight">{priceDisplay}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Min. Booking</span>
              <strong className="spec-value">{equipment.minBookingDuration || '2 Hours'}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Operator</span>
              <strong className="spec-value">
                {equipment.operatorCharges === 'INCLUDED' ? 'Included ✓' : `+₹${equipment.operatorFee}/hr`}
              </strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Transport Terms</span>
              <strong className="spec-value">
                {equipment.transportCharges === 'FREE_LOCAL' 
                  ? `Free < ${equipment.freeRadiusKm || 8} km` 
                  : `₹${equipment.transportFeePerKm || 25}/km`}
              </strong>
            </div>
          </div>

          {/* Success Banner if Enquiry Submitted */}
          {submittedEnquiry ? (
            <div className="enquiry-success-box">
              <CheckCircle2 size={36} color="#16a34a" />
              <h4>Booking Enquiry Dispatched Successfully!</h4>
              <p>
                Your request <strong>#{submittedEnquiry.id}</strong> has been forwarded to <strong>{equipment.ownerName}</strong>.
                The owner will call you back on <strong>{farmerPhone}</strong> to coordinate exact arrival timing, field suitability, and diesel arrangements.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <a href={generateWhatsAppUrl()} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  Send Follow-up WhatsApp ➔
                </a>
                <button onClick={onClose} className="btn btn-primary btn-sm">
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Structured Booking Enquiry Form */
            <form onSubmit={handleBookingSubmit} className="enquiry-form">
              <div className="form-section-title">
                <FileText size={16} color="#16a34a" />
                <span>Send In-App Booking Request</span>
              </div>

              <div className="enquiry-form-grid">
                <div>
                  <label>Your Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={farmerName} 
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="ai-settings-input"
                  />
                </div>

                <div>
                  <label>Your Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={farmerPhone} 
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="ai-settings-input"
                  />
                </div>

                <div className="full-width">
                  <label>Farm / Field Location for Service *</label>
                  <input 
                    type="text" 
                    required 
                    value={farmLocation} 
                    onChange={(e) => setFarmLocation(e.target.value)}
                    className="ai-settings-input"
                    placeholder="e.g. Perundurai Village, Survey Field #12, Near Temple"
                  />
                </div>

                <div>
                  <label>Required Service Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={requiredDate} 
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="ai-settings-input"
                  />
                </div>

                <div>
                  <label>Preferred Starting Time *</label>
                  <select 
                    value={preferredTime} 
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="ai-settings-select"
                  >
                    <option value="06:00 AM">06:00 AM (Early Morning)</option>
                    <option value="07:00 AM">07:00 AM (Morning Peak)</option>
                    <option value="08:30 AM">08:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Late Afternoon)</option>
                  </select>
                </div>

                <div className="full-width">
                  <label>Estimated Work Required / Duration *</label>
                  <select 
                    value={estimatedDuration} 
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="ai-settings-select"
                  >
                    <option value="2 Hours">2 Hours (Quick Plowing / Tilling)</option>
                    <option value="4 Hours">4 Hours (Half Day Field Preparation)</option>
                    <option value="8 Hours / Full Day">8 Hours / Full Day Service</option>
                    <option value="1 Acre">1 Acre (Harvester / Precision Seeding)</option>
                    <option value="2-3 Acres">2 to 3 Acres</option>
                    <option value="4+ Acres">4+ Acres Bulk Land Preparation</option>
                  </select>
                </div>

                <div className="full-width">
                  <label>Work Description & Crop Details (Optional)</label>
                  <textarea 
                    rows="2" 
                    value={workNotes} 
                    onChange={(e) => setWorkNotes(e.target.value)}
                    className="ai-settings-input"
                    placeholder="e.g. Hard clay soil; need deep rotavator pass for turmeric planting. Borewell water available on site."
                  />
                </div>
              </div>

              {/* Notice & Disclaimer */}
              <div className="direct-coordination-disclaimer">
                <AlertCircle size={18} color="#b45309" />
                <div style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: 1.45 }}>
                  <strong>Direct Farmer-Owner Coordination:</strong> Farmogram AI does not collect online payments. 
                  Final scheduling, hourly meter verification, diesel supply, and payment settlements are conducted directly between you and the machinery owner.
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary btn-lg" 
                style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={18} />
                {isSubmitting ? 'Sending Request...' : 'Send Booking Enquiry to Owner'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
