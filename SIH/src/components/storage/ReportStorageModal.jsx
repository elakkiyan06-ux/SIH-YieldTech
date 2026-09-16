import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { storageService } from '../../services/storageService';

export const ReportStorageModal = ({ facility, isOpen, onClose, onReportSuccess }) => {
  if (!isOpen || !facility) return null;

  const [reason, setReason] = useState('Incorrect or inflated storage tariff');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const reportReasons = [
    'Incorrect or inflated storage tariff / hidden loading fees',
    'Facility reports zero capacity despite online showing available',
    'Substandard temperature or humidity control (risk to produce)',
    'Facility address does not exist or wrong location pin',
    'Owner phone number unreachable or switched off',
    'Moisture testing disputes or unfair rejections'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      storageService.reportFacility({
        facilityId: facility.id,
        facilityName: facility.facilityName,
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
    <div className="storage-enquiry-backdrop" onClick={onClose}>
      <div className="storage-enquiry-dialog" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="storage-enquiry-header" style={{ borderBottomColor: '#fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} color="#dc2626" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#991b1b', fontWeight: 800 }}>
                Report Storage Listing
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {facility.facilityName} ({facility.ownerName})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="storage-enquiry-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="storage-enquiry-body">
          {isDone ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <CheckCircle2 size={44} color="#16a34a" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: '0 0 8px 0' }}>
                Report Submitted for Review
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: '0 0 18px 0' }}>
                Thank you for keeping Farmogram transparent. This listing has been flagged for agricultural inspection by the platform moderators.
              </p>
              <button 
                onClick={onClose}
                style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '8px' }}>
                  Select Reason *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reportReasons.map((r, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#1e293b', cursor: 'pointer', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: reason === r ? '1px solid #dc2626' : '1px solid #e2e8f0' }}>
                      <input 
                        type="radio" 
                        name="reportReason" 
                        checked={reason === r} 
                        onChange={() => setReason(r)}
                        style={{ accentColor: '#dc2626' }}
                      />
                      {r}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Additional Details / Evidence (Optional)
                </label>
                <textarea 
                  rows={3} 
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any specific details (e.g. quoted ₹12/day instead of ₹6, or gate closed upon arrival)..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={onClose}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Flag Listing'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
