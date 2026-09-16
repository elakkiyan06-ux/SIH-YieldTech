/**
 * Agricultural Storage & Cold Storage Marketplace Service Engine
 * Features:
 * - Persistent storage with realistic Tamil Nadu agro-corridor seed data
 * - Haversine geospatial distance calculation
 * - Dynamic capacity & pricing updates
 * - Storage enquiry pipeline & owner notification bus
 * - Farmer reporting & Admin moderation queue
 * - Geocoding lookup for Tamil Nadu agricultural hubs
 */

import { 
  INITIAL_STORAGE_LISTINGS, 
  STORAGE_FACILITY_TYPES,
  getStorageImageUrl
} from '../data/storageSeedData';

class StorageEventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event, data) {
    const payload = {
      eventId: `EVT-ST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType: event,
      timestamp: new Date().toISOString(),
      payload: data
    };
    this.listeners.get(event)?.forEach(cb => {
      try {
        cb(payload);
      } catch (e) {
        console.error(`Error in storage event listener (${event}):`, e);
      }
    });
    this.listeners.get('*')?.forEach(cb => {
      try {
        cb(payload);
      } catch (e) {
        console.error('Error in wildcard storage event listener:', e);
      }
    });
  }
}

export const storageEvents = new StorageEventBus();
export { storageEvents as StorageEventBus };

/**
 * Accurate Haversine Distance Formula between two GPS coordinates (in kilometres)
 */
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

// Known Agro-Hub Coordinates in Tamil Nadu
export const TN_STORAGE_LOCATION_COORDINATES = {
  'Perundurai': { lat: 11.2782, lng: 77.5854 },
  'Erode': { lat: 11.3410, lng: 77.7172 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Pollachi': { lat: 10.6588, lng: 77.0086 },
  'Thanjavur': { lat: 10.7870, lng: 79.1378 },
  'Dindigul': { lat: 10.3673, lng: 77.9803 },
  'Oddanchatram': { lat: 10.4851, lng: 77.7478 },
  'Tiruppur': { lat: 11.1085, lng: 77.3411 },
  'Tirupur': { lat: 11.1085, lng: 77.3411 },
  'Udumalaipettai': { lat: 10.5855, lng: 77.2479 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Omalur': { lat: 11.7423, lng: 78.0416 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Theni': { lat: 10.0104, lng: 77.4768 },
  'Namakkal': { lat: 11.2189, lng: 78.1674 },
  'Karur': { lat: 10.9601, lng: 78.0766 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Trichy': { lat: 10.7905, lng: 78.7047 }
};

const STORAGE_KEYS = {
  LISTINGS: 'farmogram_storage_listings',
  ENQUIRIES: 'farmogram_storage_enquiries',
  REPORTS: 'farmogram_storage_reports'
};

class StorageFacilityService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (!existing) {
        localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_STORAGE_LISTINGS));
      } else {
        // Merge any new seed facilities if missing
        const parsed = JSON.parse(existing);
        const existingIds = new Set(parsed.map(item => item.id));
        let modified = false;
        INITIAL_STORAGE_LISTINGS.forEach(seed => {
          if (!existingIds.has(seed.id)) {
            parsed.push(seed);
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(parsed));
        }
      }

      if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
      }
    } catch (e) {
      console.error('Failed to init storage in localStorage:', e);
    }
  }

  getRawListings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return raw ? JSON.parse(raw) : INITIAL_STORAGE_LISTINGS;
    } catch (e) {
      return INITIAL_STORAGE_LISTINGS;
    }
  }

  saveListings(listings) {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.error('Error saving storage listings:', e);
    }
  }

  /**
   * Filter and sort storage facilities based on farmer parameters
   */
  getListings({
    farmerCoords = { lat: 11.2782, lng: 77.5854 },
    radiusKm = 50,
    storageType = 'all',
    crop = 'all',
    minCapacity = 0,
    maxPrice = null,
    searchQuery = '',
    sortBy = 'nearest',
    availableOnly = false
  } = {}) {
    let listings = this.getRawListings().filter(item => !item.flagged);

    // 1. Calculate distance from farmer for every facility
    listings = listings.map(facility => {
      const facilityCoords = facility.location?.coordinates;
      let dist = null;
      if (facilityCoords && farmerCoords) {
        dist = calculateHaversineDistance(
          farmerCoords.lat,
          farmerCoords.lng,
          facilityCoords.lat,
          facilityCoords.lng
        );
      }
      return {
        ...facility,
        distanceKm: dist
      };
    });

    // 2. Filter by radius (if specified and not 'all')
    if (radiusKm && radiusKm !== 'all') {
      const numRadius = Number(radiusKm);
      listings = listings.filter(item => item.distanceKm != null && item.distanceKm <= numRadius);
    }

    // 3. Filter by storage type
    if (storageType && storageType !== 'all') {
      listings = listings.filter(item => item.storageType === storageType);
    }

    // 4. Filter by supported crop
    if (crop && crop !== 'all') {
      const qCrop = crop.toLowerCase().trim();
      listings = listings.filter(item => 
        item.supportedCrops?.some(c => c.toLowerCase().includes(qCrop))
      );
    }

    // 5. Filter by available capacity
    if (minCapacity && Number(minCapacity) > 0) {
      const needed = Number(minCapacity);
      listings = listings.filter(item => Number(item.availableCapacity || 0) >= needed);
    }

    // 6. Filter by maximum price
    if (maxPrice && Number(maxPrice) > 0) {
      const maxP = Number(maxPrice);
      listings = listings.filter(item => Number(item.price || 0) <= maxP);
    }

    // 7. Filter by availability status
    if (availableOnly) {
      listings = listings.filter(item => item.status === 'AVAILABLE');
    }

    // 8. Search query (matches facility name, district, taluk, village, crops)
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      listings = listings.filter(item => {
        return (
          item.facilityName?.toLowerCase().includes(q) ||
          item.ownerName?.toLowerCase().includes(q) ||
          item.storageTypeLabel?.toLowerCase().includes(q) ||
          item.location?.district?.toLowerCase().includes(q) ||
          item.location?.taluk?.toLowerCase().includes(q) ||
          item.location?.village?.toLowerCase().includes(q) ||
          item.location?.pincode?.includes(q) ||
          item.supportedCrops?.some(c => c.toLowerCase().includes(q)) ||
          item.description?.toLowerCase().includes(q)
        );
      });
    }

    // 9. Sorting
    listings.sort((a, b) => {
      if (sortBy === 'nearest') {
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'price_low') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'capacity_high') {
        return (b.availableCapacity || 0) - (a.availableCapacity || 0);
      }
      if (sortBy === 'charges_low') {
        const extraA = (a.additionalCharges?.loadingUnloading || 0) + (a.additionalCharges?.handlingFee || 0);
        const extraB = (b.additionalCharges?.loadingUnloading || 0) + (b.additionalCharges?.handlingFee || 0);
        return extraA - extraB;
      }
      if (sortBy === 'rating') {
        return (b.ownerRating || 0) - (a.ownerRating || 0);
      }
      return 0;
    });

    return listings;
  }

  getFacilities(params) {
    return this.getListings(params);
  }

  getFacilityById(id) {
    return this.getListingById(id);
  }

  createFacility(facilityData) {
    return this.createListing(facilityData);
  }

  updateFacility(id, updatedData) {
    return this.updateListing(id, updatedData);
  }

  deleteFacility(id) {
    return this.deleteListing(id);
  }

  reportFacility(reportData) {
    return this.reportListing(reportData);
  }

  getListingById(id) {
    const list = this.getRawListings();
    return list.find(item => item.id === id) || null;
  }

  createListing(facilityData) {
    const listings = this.getRawListings();
    const newId = `ST-${Date.now().toString().slice(-5)}`;
    
    // Resolve coordinates if missing but district/village present
    let coords = facilityData.location?.coordinates;
    if (!coords || !coords.lat) {
      coords = this.getCoordinatesForLocation(facilityData.location?.village || facilityData.location?.district || 'Perundurai');
    }

    const newListing = {
      id: newId,
      ownerId: facilityData.ownerId || `OWN-${Date.now()}`,
      ownerName: facilityData.ownerName || 'Facility Owner',
      ownerPhone: facilityData.ownerPhone || '+91 98421 00000',
      ownerWhatsapp: facilityData.ownerWhatsapp || facilityData.ownerPhone || '+91 98421 00000',
      ownerRating: 5.0,
      reviewsCount: 1,
      verifiedOwner: true,
      facilityName: facilityData.facilityName,
      storageType: facilityData.storageType || 'cold_storage',
      storageTypeLabel: STORAGE_FACILITY_TYPES.find(t => t.id === facilityData.storageType)?.label || 'Storage Facility',
      images: (facilityData.images && facilityData.images.length > 0) 
        ? facilityData.images 
        : [getStorageImageUrl('images/storage/cold_storage_facility.jpg')],
      location: {
        village: facilityData.location?.village || '',
        taluk: facilityData.location?.taluk || '',
        district: facilityData.location?.district || 'Erode',
        state: facilityData.location?.state || 'Tamil Nadu',
        pincode: facilityData.location?.pincode || '',
        coordinates: coords,
        address: facilityData.location?.address || ''
      },
      serviceRadiusKm: Number(facilityData.serviceRadiusKm) || 50,
      totalCapacity: Number(facilityData.totalCapacity) || 100,
      availableCapacity: Number(facilityData.availableCapacity != null ? facilityData.availableCapacity : facilityData.totalCapacity),
      capacityUnit: facilityData.capacityUnit || 'MT',
      price: Number(facilityData.price) || 5,
      priceUnit: facilityData.priceUnit || 'tonne_day',
      priceUnitLabel: facilityData.priceUnitLabel || `₹${facilityData.price || 5} / Tonne / Day`,
      bagPrice: Number(facilityData.bagPrice) || 1.5,
      monthPricePerTonne: Number(facilityData.monthPricePerTonne) || (Number(facilityData.price || 5) * 26),
      minStorageDurationDays: Number(facilityData.minStorageDurationDays) || 3,
      storageConditions: facilityData.storageConditions || 'Ambient Dry Storage',
      temperatureRange: facilityData.temperatureRange || null,
      humidityPercentage: facilityData.humidityPercentage || 'Ambient',
      supportedCrops: facilityData.supportedCrops || ['Paddy', 'Grains'],
      amenities: facilityData.amenities || ['Weighbridge', 'Security'],
      additionalCharges: {
        loadingUnloading: Number(facilityData.additionalCharges?.loadingUnloading || 30),
        handlingFee: Number(facilityData.additionalCharges?.handlingFee || 10),
        electricityIncluded: Boolean(facilityData.additionalCharges?.electricityIncluded ?? true),
        insuranceAvailable: Boolean(facilityData.additionalCharges?.insuranceAvailable ?? false)
      },
      operatingHours: facilityData.operatingHours || { start: '06:00 AM', end: '08:00 PM' },
      availableDays: facilityData.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      status: facilityData.status || 'AVAILABLE',
      description: facilityData.description || 'Agricultural produce storage facility.',
      storageRules: facilityData.storageRules || 'Standard cleanliness and moisture norms apply.',
      flagged: false,
      reportsCount: 0,
      createdAt: new Date().toISOString()
    };

    listings.unshift(newListing);
    this.saveListings(listings);
    storageEvents.emit('LISTING_CREATED', newListing);
    return newListing;
  }

  updateListing(id, updatedData) {
    const listings = this.getRawListings();
    const idx = listings.findIndex(item => item.id === id);
    if (idx === -1) return null;

    listings[idx] = {
      ...listings[idx],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    this.saveListings(listings);
    storageEvents.emit('LISTING_UPDATED', listings[idx]);
    return listings[idx];
  }

  updateCapacity(id, newAvailableCapacity) {
    return this.updateListing(id, {
      availableCapacity: Number(newAvailableCapacity),
      status: Number(newAvailableCapacity) <= 0 ? 'FULL' : 'AVAILABLE'
    });
  }

  toggleAvailability(id) {
    const item = this.getListingById(id);
    if (!item) return null;
    const nextStatus = item.status === 'AVAILABLE' ? 'FULL' : 'AVAILABLE';
    return this.updateListing(id, { status: nextStatus });
  }

  deleteListing(id) {
    let listings = this.getRawListings();
    const target = listings.find(item => item.id === id);
    if (!target) return false;

    listings = listings.filter(item => item.id !== id);
    this.saveListings(listings);
    storageEvents.emit('LISTING_DELETED', { id });
    return true;
  }

  getMyListings(ownerPhoneOrId) {
    const listings = this.getRawListings();
    if (!ownerPhoneOrId) return listings.slice(0, 2); // Demo default
    return listings.filter(item => 
      item.ownerId === ownerPhoneOrId || 
      item.ownerPhone === ownerPhoneOrId ||
      item.ownerName?.toLowerCase().includes('ramasamy') ||
      item.ownerName?.toLowerCase().includes('murugan')
    );
  }

  // --- ENQUIRY MANAGEMENT ---

  getEnquiries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  submitEnquiry(enquiryData) {
    const enquiries = this.getEnquiries();
    const newEnquiry = {
      id: `ENQ-ST-${Date.now().toString().slice(-6)}`,
      facilityId: enquiryData.facilityId,
      facilityName: enquiryData.facilityName,
      ownerPhone: enquiryData.ownerPhone,
      farmerName: enquiryData.farmerName || 'Farmer Murugan',
      farmerPhone: enquiryData.farmerPhone || '+91 94432 10987',
      farmerVillage: enquiryData.farmerVillage || 'Perundurai',
      crop: enquiryData.crop || 'Paddy',
      quantity: Number(enquiryData.quantity) || 10,
      quantityUnit: enquiryData.quantityUnit || 'MT',
      durationDays: Number(enquiryData.durationDays) || 14,
      startDate: enquiryData.startDate || new Date().toISOString().split('T')[0],
      estimatedCost: Number(enquiryData.estimatedCost) || 0,
      notes: enquiryData.notes || '',
      status: 'PENDING', // 'PENDING' | 'ACCEPTED' | 'COMPLETED'
      createdAt: new Date().toISOString()
    };

    enquiries.unshift(newEnquiry);
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error('Failed to save storage enquiry:', e);
    }
    storageEvents.emit('ENQUIRY_SUBMITTED', newEnquiry);
    return newEnquiry;
  }

  // --- REPORTING & MODERATION ---

  getReports() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  reportListing({ facilityId, facilityName, reason, details, reporterPhone }) {
    const reports = this.getReports();
    const newReport = {
      id: `REP-ST-${Date.now().toString().slice(-5)}`,
      facilityId,
      facilityName,
      reason,
      details,
      reporterPhone: reporterPhone || '+91 98421 00000',
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString()
    };

    reports.unshift(newReport);
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {}

    // Increment report count on listing
    const listings = this.getRawListings();
    const target = listings.find(item => item.id === facilityId);
    if (target) {
      target.reportsCount = (target.reportsCount || 0) + 1;
      this.saveListings(listings);
    }

    storageEvents.emit('REPORT_FILED', newReport);
    return newReport;
  }

  dismissReport(reportId) {
    const reports = this.getReports();
    const target = reports.find(r => r.id === reportId);
    if (target) {
      target.status = 'DISMISSED';
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      storageEvents.emit('REPORT_DISMISSED', { reportId });
    }
  }

  removeListingByAdmin(facilityId, reportId) {
    let listings = this.getRawListings();
    const target = listings.find(item => item.id === facilityId);
    if (target) {
      target.flagged = true;
      target.status = 'SUSPENDED';
      this.saveListings(listings);
    }
    if (reportId) {
      this.dismissReport(reportId);
    }
    storageEvents.emit('LISTING_FLAGGED', { facilityId });
  }

  getAdminStats() {
    const listings = this.getRawListings();
    const reports = this.getReports();
    const totalCapacity = listings.reduce((sum, item) => sum + (Number(item.totalCapacity) || 0), 0);
    const availableCapacity = listings.reduce((sum, item) => sum + (Number(item.availableCapacity) || 0), 0);
    const coldStores = listings.filter(item => item.storageType === 'cold_storage').length;
    const pendingReports = reports.filter(r => r.status === 'PENDING_REVIEW').length;

    return {
      totalFacilities: listings.length,
      totalCapacityMT: totalCapacity,
      availableCapacityMT: availableCapacity,
      coldStoresCount: coldStores,
      pendingReportsCount: pendingReports
    };
  }

  getCoordinatesForLocation(locationName) {
    if (!locationName) return { lat: 11.2782, lng: 77.5854 };
    const clean = locationName.trim();
    for (const [key, coords] of Object.entries(TN_STORAGE_LOCATION_COORDINATES)) {
      if (clean.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clean.toLowerCase())) {
        return coords;
      }
    }
    return { lat: 11.2782, lng: 77.5854 }; // Default to Perundurai Agro Cluster
  }
}

export const storageService = new StorageFacilityService();
