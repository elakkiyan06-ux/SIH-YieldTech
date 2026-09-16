import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Warehouse 
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import './StorageEnquiryModal.css';

export const StorageEnquiryModal = ({ 
  facility, 
  isOpen, 
  onClose, 
  onEnquirySuccess 
}) => {
  if (!isOpen || !facility) return null;

  const [farmerName, setFarmerName] = useState('Murugan K.');
  const [farmerPhone, setFarmerPhone] = useState('+91 98421 76540');
  const [farmerLocation, setFarmerLocation] = useState('Perundurai, Erode');
  const [produceName, setProduceName] = useState(
    facility.supportedCrops?.[0] || 'Turmeric (Finger)'
  );
  const [quantity, setQuantity] = useState(facility.calcQuantity || 10);
  const [unit, setUnit] = useState(facility.calcUnit || 'tonne');
  const [durationDays, setDurationDays] = useState(facility.calcDays || 14);
  const [intakeDate, setIntakeDate] = useState(
    facility.calcStartDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);

  // Rate calculations
  const dailyRate = unit === 'tonne' 
    ? (Number(facility.price) || 5) 
    : (Number(facility.bagPrice) || 1.5);
  const estimatedCost = facility.totalEstimatedCost 
    ? facility.totalEstimatedCost 
    : Math.round(Number(quantity) * dailyRate * Number(durationDays));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const enquiry = storageService.submitEnquiry({
        facilityId: facility.id,
        facilityName: facility.facilityName,
        storageType: facility.storageType,
        ownerName: facility.ownerName,
        ownerPhone: facility.ownerPhone,
        farmerName,
        farmerPhone,
        farmerLocation,
        produceName,
        quantity: Number(quantity),
        unit,
        intakeDate,
        durationDays: Number(durationDays),
        estimatedCost,
        notes: notes || 'Standard agricultural storage intake request.'
      });

      setIsSubmitting(false);
      setSubmittedEnquiry(enquiry);
      if (onEnquirySuccess) onEnquirySuccess(enquiry);
    } catch (err) {
      setIsSubmitting(false);
      alert('Unable to submit enquiry. Please try contacting the owner directly.');
    }
  };

  // WhatsApp formatted link
  const cleanPhone = facility.ownerWhatsapp 
    ? facility.ownerWhatsapp.replace(/[^0-9]/g, '') 
    : facility.ownerPhone?.replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Vanakkam / Hello ${facility.ownerName},\n\n` +
    `I have sent a storage booking request for *${facility.facilityName}*:\n` +
    `• Produce: ${produceName}\n` +
    `• Quantity: ${quantity} ${unit === 'tonne' ? 'Metric Tonnes' : 'Bags'}\n` +
    `• Intake Date: ${intakeDate}\n` +
    `• Duration: ${durationDays} Days\n` +
    `• Estimated Tariff: ~₹${estimatedCost}\n` +
    `• Farmer Name: ${farmerName} (${farmerPhone}, ${farmerLocation})\n\n` +
    `Please confirm slot availability at your earliest convenience.`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="storage-enquiry-backdrop" onClick={onClose}>
      <div className="storage-enquiry-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="storage-enquiry-header">
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.05em' }}>
              Direct Facility Booking Enquiry
            </span>
            <h3 style={{ margin: '3px 0 0 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
              {facility.facilityName}
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Owner: <strong>{facility.ownerName}</strong> • {facility.location?.village}, {facility.location?.district}
            </span>
          </div>
          <button className="storage-enquiry-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="storage-enquiry-body">
          {submittedEnquiry ? (
            <div className="storage-enquiry-success">
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={36} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 800, margin: '0 0 8px 0' }}>
                Storage Enquiry Submitted!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                Your booking request has been sent to <strong>{facility.ownerName}</strong>. You can also send the details immediately via WhatsApp for faster confirmation.
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', maxWidth: '440px', margin: '0 auto 24px auto', textAlign: 'left', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Reference ID:</span>
                  <strong style={{ color: '#0f172a' }}>{submittedEnquiry.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Produce & Qty:</span>
                  <strong style={{ color: '#0f172a' }}>{submittedEnquiry.produceName} ({submittedEnquiry.quantity} {submittedEnquiry.unit}s)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Intake Date:</span>
                  <strong style={{ color: '#0f172a' }}>{submittedEnquiry.intakeDate} ({submittedEnquiry.durationDays} days)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Estimated Bill:</span>
                  <strong style={{ color: '#15803d', fontSize: '1.05rem' }}>₹{submittedEnquiry.estimatedCost?.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ background: '#25D366', color: '#ffffff', textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <MessageSquare size={18} /> Notify via WhatsApp
                </a>
                <button 
                  onClick={onClose}
                  style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="storage-enquiry-recap">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                      Current Tariff Rate
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d' }}>
                      ₹{facility.price} / Tonne / Day
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                      Available Storage
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      {facility.availableCapacity} MT
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="storage-form-row">
                <div className="storage-form-group">
                  <label>Your Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={farmerName} 
                    onChange={(e) => setFarmerName(e.target.value)} 
                    placeholder="Enter full name"
                  />
                </div>

                <div className="storage-form-group">
                  <label>Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={farmerPhone} 
                    onChange={(e) => setFarmerPhone(e.target.value)} 
                    placeholder="+91 98421..."
                  />
                </div>
              </div>

              <div className="storage-form-group">
                <label>Farm Village & District *</label>
                <input 
                  type="text" 
                  required 
                  value={farmerLocation} 
                  onChange={(e) => setFarmerLocation(e.target.value)} 
                  placeholder="e.g. Perundurai Village, Erode"
                />
              </div>

              {/* Crop & Quantity */}
              <div className="storage-form-row">
                <div className="storage-form-group">
                  <label>Crop / Agricultural Produce *</label>
                  <input 
                    type="text" 
                    required 
                    value={produceName} 
                    onChange={(e) => setProduceName(e.target.value)} 
                    placeholder="e.g. Paddy, Turmeric, Tomatoes"
                  />
                </div>

                <div className="storage-form-group">
                  <label>Quantity to Store *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="number" 
                      min="1" 
                      required 
                      value={quantity} 
                      onChange={(e) => setQuantity(e.target.value)} 
                      style={{ flex: 2 }}
                    />
                    <select 
                      value={unit} 
                      onChange={(e) => setUnit(e.target.value)}
                      style={{ flex: 3 }}
                    >
                      <option value="tonne">Tonnes (MT)</option>
                      <option value="bag">Bags (50 kg)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates & Duration */}
              <div className="storage-form-row">
                <div className="storage-form-group">
                  <label>Intake Arrival Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={intakeDate} 
                    onChange={(e) => setIntakeDate(e.target.value)} 
                  />
                </div>

                <div className="storage-form-group">
                  <label>Duration (Days) *</label>
                  <input 
                    type="number" 
                    min={facility.minStorageDurationDays || 1} 
                    max="365" 
                    required 
                    value={durationDays} 
                    onChange={(e) => setDurationDays(e.target.value)} 
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="storage-form-group">
                <label>Special Instructions or Crop Quality Notes (Optional)</label>
                <textarea 
                  rows={2} 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Moisture level is ~11%, require weighbridge slip and pallet stacking assistance."
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={onClose}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)' }}
                >
                  <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Send Storage Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
