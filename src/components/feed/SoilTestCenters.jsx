import React, { useState } from 'react';
import { MapPin, Phone, FlaskConical, Navigation, Clock, Mail, CheckCircle2, Star, Beaker } from 'lucide-react';
import { soilTestCentersDb } from '../../data/soilTestCentersDb';

export const SoilTestCenters = ({ userDistrict = 'Erode', userState = 'Tamil Nadu' }) => {
  const [selectedState, setSelectedState] = useState(userState);

  const uniqueStates = [...new Set(soilTestCentersDb.map(center => center.state))].sort();
  const stateOptions = ['All India', ...uniqueStates];

  let displayCenters = soilTestCentersDb;
  if (selectedState !== 'All India') {
    displayCenters = soilTestCentersDb.filter(center => center.state.toLowerCase() === selectedState.toLowerCase());
  }

  // Sort by district match if it's the user's state
  if (selectedState.toLowerCase() === userState.toLowerCase()) {
    displayCenters = [...displayCenters].sort((a, b) => {
        if (a.district.toLowerCase() === userDistrict.toLowerCase()) return -1;
        if (b.district.toLowerCase() === userDistrict.toLowerCase()) return 1;
        return 0;
    });
  }

  return (
    <div className="soil-test-centers-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="farm-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={24} />
              Find Certified Soil Testing Labs
            </h3>
            <p style={{ color: '#15803d', marginTop: '8px', fontSize: '0.95rem' }}>
              Regular soil testing helps optimize fertilizer usage, prevents nutrient deficiency, and improves crop yield. 
              {selectedState === 'All India' 
                ? ' Showing verified laboratories across India.' 
                : ` Showing verified laboratories in ${selectedState}.`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600 }}>Location:</span>
             <select 
               value={selectedState} 
               onChange={(e) => setSelectedState(e.target.value)}
               style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #86efac', backgroundColor: '#fff', color: '#166534', fontWeight: 600, outline: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
             >
               {stateOptions.map(state => (
                 <option key={state} value={state}>{state}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {displayCenters.map(center => (
          <div key={center.id} className="farm-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className={`badge ${center.type === 'Government' || center.type === 'Central Government' ? 'badge-green' : 'badge-blue'}`} style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {center.type} Lab
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>
                  {center.name}
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                <Star size={14} fill="#d97706" /> {center.rating}
              </div>
            </div>

            <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', flexGrow: 1 }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="#64748b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{center.address}, {center.city}, {center.district} - {center.pincode}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Clock size={16} color="#64748b" />
                <span>{center.workingHours}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={16} color="#64748b" />
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{center.phone}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Beaker size={14} /> Available Services:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {center.services.map((service, idx) => (
                  <span key={idx} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`, '_blank')}
                className="btn btn-primary" 
                style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}
              >
                <Navigation size={16} /> Get Directions
              </button>
              <a 
                href={`tel:${center.phone.replace(/[^0-9+]/g, '')}`} 
                className="btn btn-outline" 
                style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}
              >
                <Phone size={16} /> Call Now
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
