/**
 * Agricultural Equipment Rental & Service Marketplace Engine
 * Handles:
 * - Persistent listings storage with realistic Tamil Nadu seed data
 * - Haversine geospatial distance calculation
 * - Service radius matching (determines if farmer is within owner's operational zone)
 * - Equipment enquiry submission & owner notification bus
 * - Farmer reporting & Admin moderation queue
 * - Geocoding lookup for Tamil Nadu districts & taluks
 */

import { 
  INITIAL_EQUIPMENT_LISTINGS, 
  EQUIPMENT_CATEGORIES, 
  TN_LOCATION_COORDINATES 
} from '../data/equipmentSeedData';

class EquipmentEventBus {
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
      eventId: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType: event,
      timestamp: new Date().toISOString(),
      payload: data
    };
    this.listeners.get(event)?.forEach(cb => {
      try {
        cb(payload);
      } catch (e) {
        console.error(`Error in equipment event listener (${event}):`, e);
      }
    });
    this.listeners.get('*')?.forEach(cb => {
      try {
        cb(payload);
      } catch (e) {
        console.error('Error in wildcard equipment event listener:', e);
      }
    });
  }
}

export const equipmentEvents = new EquipmentEventBus();

/**
 * Accurate Haversine Distance Formula between two GPS coordinates (km)
 */
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in kilometres
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

// Initial Seed Storage Keys
const STORAGE_KEYS = {
  LISTINGS: 'farmogram_equipment_listings',
  ENQUIRIES: 'farmogram_equipment_enquiries',
  REPORTS: 'farmogram_equipment_reports',
  CATEGORIES: 'farmogram_equipment_categories'
};

class EquipmentRentalService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    const existingListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (!existingListings) {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_EQUIPMENT_LISTINGS));
    } else {
      try {
        const parsed = JSON.parse(existingListings);
        const seedMap = new Map(INITIAL_EQUIPMENT_LISTINGS.map(item => [item.id, item]));
        let modified = false;

        const updated = parsed.map(item => {
          const seed = seedMap.get(item.id);
          if (seed) {
            if (JSON.stringify(item.images) !== JSON.stringify(seed.images) || item.title !== seed.title) {
              modified = true;
              return { 
                ...item, 
                images: seed.images, 
                title: seed.title, 
                category: seed.category, 
                categoryLabel: seed.categoryLabel 
              };
            }
          }
          return item;
        });

        if (modified) {
          localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updated));
        }
      } catch (e) {
        console.warn('Migrating equipment storage:', e);
        localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_EQUIPMENT_LISTINGS));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(EQUIPMENT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
      // Seed an initial demo enquiry for seamless presentation
      const initialEnquiries = [
        {
          id: 'ENQ-DEMO-01',
          equipmentId: 'EQ-01',
          equipmentTitle: 'Mahindra 575 DI Sarpanch (45 HP) with Rotavator',
          ownerPhone: '+91 98421 88712',
          ownerName: 'Senthil Velan',
          farmerId: 'usr_01',
          farmerName: 'Murugan K.',
          farmerPhone: '+91 98421 76540',
          farmLocation: 'Perundurai Village, Erode (Field #4)',
          requiredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          preferredTime: '07:00 AM',
          estimatedDuration: '4 Hours (Field Tilth & Ridge Making)',
          workNotes: 'Need 42-blade rotavator for preparing tomato bed after turmeric harvest.',
          status: 'ACCEPTED',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(initialEnquiries));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    }
  }

  // --- Coordinates Lookup ---
  getCoordinatesForLocation(locationName) {
    if (!locationName) return { lat: 11.2782, lng: 77.5854 }; // Default to Perundurai
    const clean = locationName.trim();
    if (TN_LOCATION_COORDINATES[clean]) {
      return TN_LOCATION_COORDINATES[clean];
    }
    // Search substring match
    const matchedKey = Object.keys(TN_LOCATION_COORDINATES).find(k => 
      clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase())
    );
    if (matchedKey) {
      return TN_LOCATION_COORDINATES[matchedKey];
    }
    return { lat: 11.2782, lng: 77.5854 }; // Default fallback
  }

  // --- Listings Operations ---
  getAllRawListings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return data ? JSON.parse(data) : INITIAL_EQUIPMENT_LISTINGS;
    } catch (e) {
      return INITIAL_EQUIPMENT_LISTINGS;
    }
  }

  saveListings(listings) {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to save equipment listings:', e);
    }
  }

  /**
   * Primary Search & Filtering Method
   * Computes dynamic distance using Haversine formula based on farmer coordinates.
   */
  getListings({
    farmerCoords = { lat: 11.2782, lng: 77.5854 }, // Default Perundurai
    radiusKm = 50, // 5 | 10 | 25 | 50 | 100 | 'all'
    category = 'all',
    pricingUnit = 'all',
    availableOnly = false,
    searchQuery = '',
    sortBy = 'nearest' // 'nearest' | 'price_low' | 'price_high' | 'rating'
  } = {}) {
    let list = this.getAllRawListings();

    // 1. Calculate real-time distance and service coverage for each item
    list = list.map(item => {
      const itemLat = item.location?.coordinates?.lat;
      const itemLng = item.location?.coordinates?.lng;
      const distance = calculateHaversineDistance(
        farmerCoords.lat, 
        farmerCoords.lng, 
        itemLat, 
        itemLng
      );

      // Check whether farmer's location is within owner's operational service radius
      const isServiceable = distance != null && distance <= (item.serviceRadiusKm || 25);

      return {
        ...item,
        distanceKm: distance != null ? distance : 9999,
        isServiceable
      };
    });

    // 2. Search Query filter (Equipment name, brand, model, village, owner name)
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.model && item.model.toLowerCase().includes(q)) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(q)) ||
        (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q)) ||
        (item.location?.village && item.location.village.toLowerCase().includes(q)) ||
        (item.location?.taluk && item.location.taluk.toLowerCase().includes(q)) ||
        (item.location?.district && item.location.district.toLowerCase().includes(q))
      );
    }

    // 3. Category Filter
    if (category && category !== 'all') {
      list = list.filter(item => item.category === category);
    }

    // 4. Pricing Unit Filter
    if (pricingUnit && pricingUnit !== 'all') {
      list = list.filter(item => item.priceUnit === pricingUnit);
    }

    // 5. Availability Filter
    if (availableOnly) {
      list = list.filter(item => item.status === 'AVAILABLE');
    }

    // 6. Radius Distance Filter
    if (radiusKm && radiusKm !== 'all') {
      const maxDistance = Number(radiusKm);
      list = list.filter(item => item.distanceKm <= maxDistance);
    }

    // 7. Sort
    list.sort((a, b) => {
      if (sortBy === 'nearest') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'price_low') {
        return a.price - b.price;
      }
      if (sortBy === 'price_high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return (b.ownerRating || 0) - (a.ownerRating || 0);
      }
      return 0;
    });

    return list;
  }

  getListingById(id) {
    const list = this.getAllRawListings();
    return list.find(item => item.id === id) || null;
  }

  createListing(newEquipmentData) {
    const list = this.getAllRawListings();
    const id = `EQ-${Date.now()}-${Math.floor(Math.random() * 100)}`;

    // Resolve coordinates if missing
    let coordinates = newEquipmentData.location?.coordinates;
    if (!coordinates || !coordinates.lat) {
      coordinates = this.getCoordinatesForLocation(
        newEquipmentData.location?.taluk || newEquipmentData.location?.district || 'Perundurai'
      );
    }

    const created = {
      id,
      ...newEquipmentData,
      location: {
        ...newEquipmentData.location,
        coordinates
      },
      flagged: false,
      reportsCount: 0,
      createdAt: new Date().toISOString()
    };

    const updatedList = [created, ...list];
    this.saveListings(updatedList);
    equipmentEvents.emit('EQUIPMENT_CREATED', created);
    return created;
  }

  updateListing(id, updatedFields) {
    const list = this.getAllRawListings();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updated = { ...list[index], ...updatedFields };
    list[index] = updated;
    this.saveListings(list);
    equipmentEvents.emit('EQUIPMENT_UPDATED', updated);
    return updated;
  }

  toggleAvailability(id) {
    const list = this.getAllRawListings();
    const item = list.find(i => i.id === id);
    if (!item) return null;

    const nextStatus = item.status === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
    return this.updateListing(id, { status: nextStatus });
  }

  deleteListing(id) {
    const list = this.getAllRawListings();
    const filtered = list.filter(item => item.id !== id);
    this.saveListings(filtered);
    equipmentEvents.emit('EQUIPMENT_DELETED', { id });
    return true;
  }

  getOwnerListings(ownerPhoneOrId) {
    if (!ownerPhoneOrId) return [];
    const clean = ownerPhoneOrId.toString().replace(/[\s+-]/g, '');
    const list = this.getAllRawListings();
    return list.filter(item => {
      const itemPhoneClean = item.ownerPhone ? item.ownerPhone.toString().replace(/[\s+-]/g, '') : '';
      return item.ownerId === ownerPhoneOrId || (clean && itemPhoneClean.includes(clean));
    });
  }

  // --- Booking Enquiry Operations ---
  getEnquiries() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveEnquiries(enquiries) {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error('Failed to save equipment enquiries:', e);
    }
  }

  createEnquiry(enquiryData) {
    const enquiries = this.getEnquiries();
    const id = `ENQ-${Date.now()}-${Math.floor(Math.random() * 100)}`;
    const newEnquiry = {
      id,
      ...enquiryData,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const updated = [newEnquiry, ...enquiries];
    this.saveEnquiries(updated);
    equipmentEvents.emit('ENQUIRY_CREATED', newEnquiry);
    return newEnquiry;
  }

  getEnquiriesForOwner(ownerPhoneOrId) {
    const enquiries = this.getEnquiries();
    if (!ownerPhoneOrId) return enquiries;
    const clean = ownerPhoneOrId.toString().replace(/[\s+-]/g, '');
    return enquiries.filter(enq => {
      const p = enq.ownerPhone ? enq.ownerPhone.replace(/[\s+-]/g, '') : '';
      return enq.ownerId === ownerPhoneOrId || (clean && p.includes(clean));
    });
  }

  getEnquiriesByFarmer(farmerPhoneOrId) {
    const enquiries = this.getEnquiries();
    if (!farmerPhoneOrId) return [];
    const clean = farmerPhoneOrId.toString().replace(/[\s+-]/g, '');
    return enquiries.filter(enq => {
      const p = enq.farmerPhone ? enq.farmerPhone.replace(/[\s+-]/g, '') : '';
      return enq.farmerId === farmerPhoneOrId || (clean && p.includes(clean));
    });
  }

  updateEnquiryStatus(enquiryId, status) {
    const enquiries = this.getEnquiries();
    const index = enquiries.findIndex(e => e.id === enquiryId);
    if (index === -1) return null;

    enquiries[index].status = status;
    enquiries[index].updatedAt = new Date().toISOString();
    this.saveEnquiries(enquiries);
    equipmentEvents.emit('ENQUIRY_STATUS_UPDATED', enquiries[index]);
    return enquiries[index];
  }

  // --- Farmer Reporting & Admin Moderation ---
  getReports() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveReports(reports) {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports:', e);
    }
  }

  reportListing({ listingId, reason, details, reportedBy = 'Murugan K.' }) {
    const reports = this.getReports();
    const listing = this.getListingById(listingId);

    const reportItem = {
      id: `REP-EQ-${Date.now()}`,
      listingId,
      listingTitle: listing?.title || 'Unknown Equipment',
      ownerName: listing?.ownerName || 'Unknown Owner',
      ownerPhone: listing?.ownerPhone || 'N/A',
      reason,
      details,
      reportedBy,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString()
    };

    const updatedReports = [reportItem, ...reports];
    this.saveReports(updatedReports);

    // Update listing flagged status
    if (listing) {
      this.updateListing(listingId, {
        flagged: true,
        reportsCount: (listing.reportsCount || 0) + 1
      });
    }

    equipmentEvents.emit('REPORT_SUBMITTED', reportItem);
    return reportItem;
  }

  dismissReport(reportId) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = 'DISMISSED';
    report.resolvedAt = new Date().toISOString();
    this.saveReports(reports);

    // Unflag listing if no other pending reports
    const otherPending = reports.filter(r => r.listingId === report.listingId && r.status === 'PENDING_REVIEW');
    if (otherPending.length === 0) {
      this.updateListing(report.listingId, { flagged: false });
    }

    equipmentEvents.emit('REPORT_DISMISSED', { reportId });
    return true;
  }

  removeListingByAdmin(listingId, reportId = null) {
    this.deleteListing(listingId);
    if (reportId) {
      const reports = this.getReports();
      const report = reports.find(r => r.id === reportId);
      if (report) {
        report.status = 'LISTING_REMOVED';
        report.resolvedAt = new Date().toISOString();
        this.saveReports(reports);
      }
    }
    equipmentEvents.emit('ADMIN_REMOVED_LISTING', { listingId });
    return true;
  }

  // --- Admin Telemetry ---
  getAdminStats() {
    const listings = this.getAllRawListings();
    const enquiries = this.getEnquiries();
    const reports = this.getReports();

    const uniqueOwners = new Set(listings.map(l => l.ownerPhone || l.ownerId)).size;
    const availableCount = listings.filter(l => l.status === 'AVAILABLE').length;
    const flaggedCount = listings.filter(l => l.flagged).length;
    const pendingReports = reports.filter(r => r.status === 'PENDING_REVIEW');

    return {
      totalListings: listings.length,
      availableCount,
      uniqueOwners,
      totalEnquiries: enquiries.length,
      flaggedCount,
      pendingReportsCount: pendingReports.length,
      categoriesCount: EQUIPMENT_CATEGORIES.length - 1 // excluding 'all'
    };
  }
}

export const equipmentRentalService = new EquipmentRentalService();
