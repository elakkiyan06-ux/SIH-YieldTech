import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { equipmentRentalService } from '../../services/equipmentRentalService';

export const ReportListingModal = ({ equipment, isOpen, onClose, onReportSuccess }) => {
  if (!isOpen || !equipment) return null;

  const [reason, setReason] = useState('Incorrect or inflated rental price');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const reportReasons = [
    'Incorrect or inflated rental price quoted on phone',
    'Equipment owner unavailable or unreachable',
    'Equipment defective / not in operational condition',
    'Owner refuses service without valid agricultural reason',
    'Suspected fraudulent or duplicate listing',
    'Wrong location or inflated service radius'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      equipmentRentalService.reportListing({
        listingId: equipment.id,
        reason,
        details: details || 'Reported by farmer community member for verification.'
      });
      setIsSubmitting(false);
      setIsDone(true);
      if (onReportSuccess) onReportSuccess();
    } catch (err) {
      setIsSubmitting(false);
      alert('Unable to submit report.');
    }
  };

  return (
    <div className="equipment-modal-backdrop" onClick={onClose}>
      <div className="equipment-modal-dialog" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="equipment-modal-header" style={{ borderBottomColor: '#fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} color="#dc2626" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#991b1b', fontWeight: 700 }}>
                Report Machinery Listing
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {equipment.title} ({equipment.ownerName})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="equipment-modal-body">
          {isDone ? (
            <div className="enquiry-success-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <CheckCircle2 size={36} color="#16a34a" />
              <h4>Report Submitted to Farmogram Oversight</h4>
              <p>
                Thank you for protecting our farming community. This listing has been flagged and submitted to the SIH Agricultural Moderation queue for review.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm" style={{ marginTop: '14px' }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Select Reason for Reporting *
                </label>
                <select 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  className="ai-settings-select"
                >
                  {reportReasons.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Additional Notes or Verification Details
                </label>
                <textarea 
                  rows="3" 
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)}
                  className="ai-settings-input"
                  placeholder="Provide any additional context (e.g. called owner on 15 Sept, was quoted ₹1,500 instead of listed ₹850)."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-sm"
                  style={{ background: '#dc2626', color: '#fff', fontWeight: 700, padding: '10px 20px' }}
                >
                  <AlertTriangle size={16} />
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
