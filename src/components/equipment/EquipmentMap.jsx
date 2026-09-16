import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

export const EquipmentMap = ({ 
  equipmentList = [], 
  farmerCoords = { lat: 11.2782, lng: 77.5854 }, 
  farmerLocationName = 'Your Farm (Perundurai)', 
  searchRadiusKm = 25,
  onContactClick 
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const circleLayerRef = useRef(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix standard Leaflet default icon paths in Vite
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [farmerCoords.lat, farmerCoords.lng],
        zoom: searchRadiusKm <= 10 ? 12 : searchRadiusKm <= 25 ? 11 : 9,
        scrollWheelZoom: true,
      });

      // Add high-resolution OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Farmogram AI',
        maxZoom: 18,
      }).addTo(map);

      // Create Layer Group for equipment markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersLayer;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Radius Circle when equipmentList, farmerCoords, or searchRadiusKm changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Recenter map smoothly if coordinates change
    map.setView([farmerCoords.lat, farmerCoords.lng], searchRadiusKm <= 10 ? 12 : searchRadiusKm <= 25 ? 11 : 9);

    // 1. Remove previous radius circle and draw new one
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
      circleLayerRef.current = null;
    }

    if (searchRadiusKm && searchRadiusKm !== 'all') {
      const radiusMeters = Number(searchRadiusKm) * 1000;
      const circle = L.circle([farmerCoords.lat, farmerCoords.lng], {
        color: '#16a34a',
        fillColor: '#86efac',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '6, 8'
      }).addTo(map);
      circleLayerRef.current = circle;
    }

    // 2. Clear previous equipment markers
    if (markersLayerGroupRef.current) {
      markersLayerGroupRef.current.clearLayers();
    }

    // 3. Farmer Farm Marker (Green Radar Beacon)
    const farmerIcon = L.divIcon({
      className: 'farmer-leaflet-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(22, 163, 74, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #15803d; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 13px;">
            🌾
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const farmerMarker = L.marker([farmerCoords.lat, farmerCoords.lng], { icon: farmerIcon });
    farmerMarker.bindPopup(`
      <div style="padding: 4px; font-family: sans-serif;">
        <strong style="color: #15803d; font-size: 13px;">📍 ${farmerLocationName}</strong>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Current selected search center point.</p>
      </div>
    `);
    markersLayerGroupRef.current.addLayer(farmerMarker);

    // 4. Equipment Provider Markers
    equipmentList.forEach((eq) => {
      const lat = eq.location?.coordinates?.lat;
      const lng = eq.location?.coordinates?.lng;
      if (!lat || !lng) return;

      const categoryEmoji = 
        eq.category === 'tractor' ? '🚜' :
        eq.category === 'jcb' ? '🏗️' :
        eq.category === 'harvester' ? '🌾' :
        eq.category === 'rotavator' ? '⚙️' :
        eq.category === 'water_tanker' ? '💧' :
        eq.category === 'drone' ? '🚁' : '🛠️';

      const isAvailable = eq.status === 'AVAILABLE';
      const markerBg = isAvailable ? '#16a34a' : '#94a3b8';

      const eqIcon = L.divIcon({
        className: 'equipment-leaflet-pin',
        html: `
          <div style="
            display: flex; 
            align-items: center; 
            gap: 4px; 
            background: #ffffff; 
            border: 2px solid ${markerBg}; 
            border-radius: 20px; 
            padding: 3px 8px; 
            box-shadow: 0 3px 8px rgba(0,0,0,0.22);
            font-family: sans-serif;
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
            white-space: nowrap;
          ">
            <span>${categoryEmoji}</span>
            <span>₹${eq.price}/${eq.priceUnit}</span>
          </div>
        `,
        iconSize: [85, 30],
        iconAnchor: [42, 15]
      });

      const marker = L.marker([lat, lng], { icon: eqIcon });

      // Custom Popup HTML
      const popupHtml = `
        <div style="min-width: 220px; max-width: 260px; font-family: sans-serif; padding: 2px;">
          <div style="font-size: 10px; font-weight: 700; color: #16a34a; text-transform: uppercase;">
            ${eq.categoryLabel || eq.category} • ${eq.distanceKm} km away
          </div>
          <h4 style="margin: 4px 0 6px 0; font-size: 13px; color: #0f172a; line-height: 1.3;">
            ${eq.title}
          </h4>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            Owner: <strong>${eq.ownerName}</strong> (${eq.location?.village})
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px;">
            <strong style="color: #15803d; font-size: 14px;">₹${eq.price?.toLocaleString('en-IN')} / ${eq.priceUnit}</strong>
            <span style="font-size: 10px; color: ${isAvailable ? '#16a34a' : '#64748b'}; font-weight: 700;">
              ${isAvailable ? 'Available Now' : 'Busy'}
            </span>
          </div>
          <button 
            id="map-contact-btn-${eq.id}" 
            style="
              width: 100%; 
              background: #16a34a; 
              color: #ffffff; 
              border: none; 
              padding: 6px 12px; 
              border-radius: 6px; 
              font-weight: 700; 
              font-size: 11px; 
              cursor: pointer;
            "
          >
            📞 Contact Owner & Book
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // Attach click event to popup contact button when opened
      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-contact-btn-${eq.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onContactClick) onContactClick(eq);
          };
        }
      });

      markersLayerGroupRef.current.addLayer(marker);
    });

  }, [equipmentList, farmerCoords, searchRadiusKm, farmerLocationName]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([farmerCoords.lat, farmerCoords.lng], 12);
    }
  };

  return (
    <div className="equipment-map-wrapper">
      {/* Map Control Floating Bar */}
      <div className="equipment-map-floating-overlay">
        <div className="map-legend-pill">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#15803d' }} />
          <span>Your Farm</span>
        </div>
        <div className="map-legend-pill">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />
          <span>Available ({equipmentList.filter(e => e.status === 'AVAILABLE').length})</span>
        </div>
        <div className="map-legend-pill">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8' }} />
          <span>Busy ({equipmentList.filter(e => e.status !== 'AVAILABLE').length})</span>
        </div>

        <button 
          onClick={handleRecenter} 
          className="map-recenter-btn"
          title="Recenter on your farm"
        >
          <Navigation size={14} /> Recenter Farm
        </button>
      </div>

      {/* Interactive Map DOM Element */}
      <div ref={mapContainerRef} className="equipment-leaflet-container" />
    </div>
  );
};
