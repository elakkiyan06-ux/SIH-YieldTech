import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, ShieldCheck } from 'lucide-react';
import { getStorageImageUrl } from '../../data/storageSeedData';
import './StorageMap.css';

export const StorageMap = ({
  facilities = [],
  farmerCoords = { lat: 11.2782, lng: 77.5854 },
  farmerLocationName = 'Your Farm Location (Perundurai)',
  searchRadiusKm = 25,
  onSelectFacility,
  onEnquireFacility
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const circleLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const initialZoom = searchRadiusKm <= 10 ? 12 : searchRadiusKm <= 25 ? 11 : searchRadiusKm <= 50 ? 9 : 8;
      const map = L.map(mapContainerRef.current, {
        center: [farmerCoords.lat, farmerCoords.lng],
        zoom: initialZoom,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Farmogram AI Storage Finder',
        maxZoom: 18,
      }).addTo(map);

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

  // Update Markers and Radius
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const zoom = searchRadiusKm <= 10 ? 12 : searchRadiusKm <= 25 ? 11 : searchRadiusKm <= 50 ? 9 : 8;
    map.setView([farmerCoords.lat, farmerCoords.lng], zoom);

    // 1. Circle layer
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

    // 2. Clear previous markers
    if (markersLayerGroupRef.current) {
      markersLayerGroupRef.current.clearLayers();
    }

    // 3. User Farm Marker
    const farmerIcon = L.divIcon({
      className: 'storage-leaflet-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(22, 163, 74, 0.35); animation: storage-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #15803d; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 14px;">
            🌾
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const farmerMarker = L.marker([farmerCoords.lat, farmerCoords.lng], { icon: farmerIcon });
    farmerMarker.bindPopup(`
      <div style="padding: 4px; font-family: sans-serif;">
        <strong style="color: #15803d; font-size: 13px;">📍 ${farmerLocationName}</strong>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Current selected search center point (${searchRadiusKm} km search radius active).</p>
      </div>
    `);
    markersLayerGroupRef.current.addLayer(farmerMarker);

    // 4. Facility Markers
    facilities.forEach((fac) => {
      const lat = fac.location?.coordinates?.lat;
      const lng = fac.location?.coordinates?.lng;
      if (!lat || !lng) return;

      const typeConfig = {
        cold_storage: { bg: '#0284c7', icon: '❄️', label: 'Cold Storage' },
        warehouse: { bg: '#16a34a', icon: '🏢', label: 'Warehouse' },
        packhouse: { bg: '#7c3aed', icon: '📦', label: 'Packhouse' },
        silo: { bg: '#d97706', icon: '🏗️', label: 'Grain Silo' }
      }[fac.storageType] || { bg: '#0f766e', icon: '🏛️', label: 'Storage' };

      const markerHtml = `
        <div style="
          display: inline-flex; 
          align-items: center; 
          gap: 5px; 
          background: #ffffff; 
          border: 2px solid ${typeConfig.bg}; 
          border-radius: 20px; 
          padding: 3px 8px; 
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          font-family: sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          cursor: pointer;
        ">
          <span>${typeConfig.icon}</span>
          <span>₹${fac.price}/MT</span>
          <span style="background: ${typeConfig.bg}; color: #ffffff; padding: 1px 5px; border-radius: 10px; font-size: 10px;">
            ${fac.availableCapacity} MT
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'storage-leaflet-pin',
        html: markerHtml,
        iconSize: [110, 30],
        iconAnchor: [55, 15]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const thumbnailImg = getStorageImageUrl(fac.images?.[0] || 'images/storage/cold_storage_facility.jpg');

      const popupHtml = `
        <div style="min-width: 240px; max-width: 280px; font-family: sans-serif; padding: 2px;">
          <div style="width: 100%; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <img src="${thumbnailImg}" alt="${fac.facilityName}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; color: ${typeConfig.bg}; text-transform: uppercase;">
              ${fac.storageTypeLabel}
            </span>
            ${fac.distanceKm != null ? `<span style="font-size: 11px; font-weight: 700; color: #15803d;">📍 ${fac.distanceKm} km</span>` : ''}
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 13px; color: #0f172a; line-height: 1.3;">
            ${fac.facilityName}
          </h4>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${fac.location?.village}, ${fac.location?.district}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px;">
            <div>
              <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Base Rate</div>
              <strong style="color: #15803d; font-size: 13px;">₹${fac.price} / MT / day</strong>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Space Available</div>
              <strong style="color: #0f172a; font-size: 13px;">${fac.availableCapacity} MT</strong>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button 
              id="map-details-btn-${fac.id}"
              style="
                flex: 1;
                background: #15803d;
                color: #ffffff;
                border: none;
                padding: 7px 10px;
                border-radius: 6px;
                font-weight: 700;
                font-size: 11px;
                cursor: pointer;
              "
            >
              📊 Details & Calc
            </button>
            <button 
              id="map-enquire-btn-${fac.id}"
              style="
                flex: 1;
                background: #0284c7;
                color: #ffffff;
                border: none;
                padding: 7px 10px;
                border-radius: 6px;
                font-weight: 700;
                font-size: 11px;
                cursor: pointer;
              "
            >
              📩 Enquire
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const detailsBtn = document.getElementById(`map-details-btn-${fac.id}`);
        if (detailsBtn) {
          detailsBtn.onclick = () => {
            if (onSelectFacility) onSelectFacility(fac);
          };
        }
        const enquireBtn = document.getElementById(`map-enquire-btn-${fac.id}`);
        if (enquireBtn) {
          enquireBtn.onclick = () => {
            if (onEnquireFacility) onEnquireFacility(fac);
          };
        }
      });

      markersLayerGroupRef.current.addLayer(marker);
    });

  }, [facilities, farmerCoords, searchRadiusKm, farmerLocationName]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([farmerCoords.lat, farmerCoords.lng], 12);
    }
  };

  return (
    <div className="storage-map-wrapper">
      <div className="storage-map-floating-overlay">
        <div className="storage-map-legend-pill">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#0284c7' }} />
          <span>Cold Storage</span>
        </div>
        <div className="storage-map-legend-pill">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />
          <span>Warehouse</span>
        </div>
        <div className="storage-map-legend-pill">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#7c3aed' }} />
          <span>Packhouse</span>
        </div>
        <div className="storage-map-legend-pill">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#d97706' }} />
          <span>Silo</span>
        </div>

        <button 
          onClick={handleRecenter} 
          className="storage-map-recenter-btn"
          title="Recenter map on your farm"
        >
          <Navigation size={14} /> Recenter Farm
        </button>
      </div>

      <div ref={mapContainerRef} className="storage-leaflet-container" />
    </div>
  );
};
