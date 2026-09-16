/**
 * Crop Insurance Claim Preparation Assistant Service Engine
 * Features:
 * - Persistent storage of farmer-reported crop damage dossiers in localStorage
 * - Chronological incident timeline calculation
 * - Verification checklist for required PMFBY & state disaster relief documentation
 * - Official contact avenues, 72-hour intimation countdown, and reporting guidelines
 * - Synchronized event bus for reactive UI updates
 */

class ClaimEventBus {
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
      eventId: `EVT-CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType: event,
      timestamp: new Date().toISOString(),
      payload: data
    };
    this.listeners.get(event)?.forEach(cb => {
      try {
        cb(payload);
      } catch (e) {
        console.error(`Error in claim event listener (${event}):`, e);
      }
    });
  }
}

export const claimEvents = new ClaimEventBus();

const CLAIM_STORAGE_KEY = 'farmogram_crop_claim_dossiers';

// Pre-populated seed dossier representing a real-world Tamil Nadu unseasonal rain event
export const INITIAL_CLAIM_DOSSIERS = [
  {
    id: 'CLM-DOSS-2026-8812',
    referenceNumber: 'PMFBY-PRE-2026-TN-8812',
    farmerId: 'FARMER-MURUGAN-01',
    farmerName: 'Murugan P.',
    farmerPhone: '+91 98421 23456',
    farmerVillage: 'Perundurai',
    farmerTaluk: 'Perundurai',
    farmerDistrict: 'Erode',
    landSurveyNumber: 'Survey No. 142/3B, Patta No. 2041',
    gpsCoordinates: { lat: 11.2782, lng: 77.5854 },
    cropName: 'Paddy (Kuruvai / CO 51)',
    cultivationDates: {
      sowingDate: '2026-06-15',
      expectedHarvestDate: '2026-10-10'
    },
    totalCultivatedArea: '4.5 Acres',
    affectedArea: '3.2 Acres',
    affectedPercentage: 71,
    damageDate: '2026-09-12T14:30:00',
    damageCause: 'Unseasonal Inundation & Severe Lodging',
    damageCategory: 'EXCESS_RAINFALL',
    symptoms: [
      'Extensive crop lodging (flattening on muddy ground)',
      'Standing water submergence > 36 hours',
      'Grain discolouration and fungal spotting',
      'Root zone waterlogging causing panicle decay'
    ],
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        caption: 'Wide-angle view of submerged field parcel 142/3B',
        timestamp: '2026-09-12 16:45',
        geoTagged: true
      },
      {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80',
        caption: 'Close-up of lodged paddy panicles in stagnant water',
        timestamp: '2026-09-12 17:10',
        geoTagged: true
      }
    ],
    checklist: {
      aadhaarCard: true,
      landOwnershipPassbook: true,
      vaoCropAdangal: true,
      bankPassbookWithDebit: true,
      pmfbyApplicationReceipt: true,
      geotaggedPhotos: true,
      sowingCertificate: false
    },
    status: 'FARMER_REPORTED', // 'FARMER_REPORTED' | 'INTIMATION_SENT' | 'SURVEY_SCHEDULED'
    intimationDeadlineHours: 72,
    officialClaimReference: 'PMFBY/TN/2026/09/LOC-0492',
    reportingChannelUsed: 'National Crop Insurance Helpline 14447',
    notes: 'Reported within 24 hours of flash rainfall. Local VAO and Agriculture Officer informed over phone.',
    createdAt: '2026-09-13T09:15:00.000Z'
  }
];

export const OFFICIAL_CLAIM_PROCEDURES = {
  notificationWindowHours: 72,
  primaryScheme: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
  helpline: '14447',
  helplineName: 'National Crop Insurance Helpline (Toll-Free 24x7)',
  portalUrl: 'https://pmfby.gov.in',
  krishiRakshakUrl: 'https://krishirakshak.gov.in',
  stateDepartment: 'Department of Agriculture & Farmers Welfare, Govt of Tamil Nadu',
  steps: [
    {
      stepNumber: 1,
      title: '72-Hour Mandatory Damage Intimation',
      desc: 'In case of localized calamities (hailstorm, landslide, inundation, cloudburst, natural fire, post-harvest cyclone damage), intimate the loss within 72 hours of occurrence via Helpline 14447, the Crop Insurance App, or directly to your district Agricultural Officer (AO/ADA).'
    },
    {
      stepNumber: 2,
      title: 'Evidence Preservation & Geotagged Photography',
      desc: 'Capture at least 2 to 4 clear photographs showing both a panoramic view of the affected field with boundary markers and close-ups of damaged crop panicles or foliage before draining the field.'
    },
    {
      stepNumber: 3,
      title: 'Assemble Verification Document Packet',
      desc: 'Prepare your Aadhaar card, Land Record (Pattadhar Passbook / Chitta), Sowing Certificate or VAO Adangal extract, Bank Passbook showing insurance premium deduction, and PMFBY policy/receipt number.'
    },
    {
      stepNumber: 4,
      title: 'Joint Field Survey Assessment',
      desc: 'A joint assessment committee comprising the Agricultural Department Officer, Revenue Representative (VAO/RI), and the Insurance Company Surveyor will inspect the field within 10 to 14 days to record GPS coordinates and loss percentage.'
    }
  ],
  requiredDocuments: [
    { key: 'aadhaarCard', label: 'Aadhaar Card (Linked to PMFBY & Bank Account)', required: true },
    { key: 'landOwnershipPassbook', label: 'Land Ownership Record / Pattadhar Passbook / Chitta', required: true },
    { key: 'vaoCropAdangal', label: 'Village Administrative Officer (VAO) Adangal / Sowing Certificate', required: true },
    { key: 'bankPassbookWithDebit', label: 'Bank Passbook showing PMFBY Insurance Premium deduction', required: true },
    { key: 'pmfbyApplicationReceipt', label: 'PMFBY Application / Acknowledgement Receipt Number', required: true },
    { key: 'geotaggedPhotos', label: 'Geotagged & Timestamped Crop Damage Photographs', required: true },
    { key: 'sowingCertificate', label: 'Tenant Farmer / Sharecropper Agreement (if applicable)', required: false }
  ]
};

class CropClaimService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const existing = localStorage.getItem(CLAIM_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(CLAIM_STORAGE_KEY, JSON.stringify(INITIAL_CLAIM_DOSSIERS));
      }
    } catch (e) {
      console.error('Error initializing crop claim dossiers in localStorage:', e);
    }
  }

  getDossiers() {
    try {
      const raw = localStorage.getItem(CLAIM_STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_CLAIM_DOSSIERS;
    } catch (e) {
      return INITIAL_CLAIM_DOSSIERS;
    }
  }

  saveDossiers(dossiers) {
    try {
      localStorage.setItem(CLAIM_STORAGE_KEY, JSON.stringify(dossiers));
    } catch (e) {
      console.error('Failed to save crop claim dossiers:', e);
    }
  }

  getDossierById(id) {
    const dossiers = this.getDossiers();
    return dossiers.find(d => d.id === id) || null;
  }

  createDossier(data) {
    const dossiers = this.getDossiers();
    const newId = `CLM-DOSS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const refNum = `PMFBY-PRE-${new Date().getFullYear()}-TN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDossier = {
      id: newId,
      referenceNumber: refNum,
      farmerId: data.farmerId || 'FARMER-DEFAULT',
      farmerName: data.farmerName || 'Farmer Name',
      farmerPhone: data.farmerPhone || '',
      farmerVillage: data.farmerVillage || '',
      farmerTaluk: data.farmerTaluk || '',
      farmerDistrict: data.farmerDistrict || 'Erode',
      landSurveyNumber: data.landSurveyNumber || '',
      gpsCoordinates: data.gpsCoordinates || { lat: 11.2782, lng: 77.5854 },
      cropName: data.cropName || 'Paddy',
      cultivationDates: {
        sowingDate: data.cultivationDates?.sowingDate || '',
        expectedHarvestDate: data.cultivationDates?.expectedHarvestDate || ''
      },
      totalCultivatedArea: data.totalCultivatedArea || '1 Acre',
      affectedArea: data.affectedArea || '1 Acre',
      affectedPercentage: Number(data.affectedPercentage) || 50,
      damageDate: data.damageDate || new Date().toISOString(),
      damageCause: data.damageCause || 'Unseasonal Heavy Rainfall',
      damageCategory: data.damageCategory || 'EXCESS_RAINFALL',
      symptoms: data.symptoms || [],
      photos: data.photos || [],
      checklist: data.checklist || {
        aadhaarCard: false,
        landOwnershipPassbook: false,
        vaoCropAdangal: false,
        bankPassbookWithDebit: false,
        pmfbyApplicationReceipt: false,
        geotaggedPhotos: false,
        sowingCertificate: false
      },
      status: 'FARMER_REPORTED',
      intimationDeadlineHours: 72,
      officialClaimReference: data.officialClaimReference || '',
      reportingChannelUsed: data.reportingChannelUsed || 'Helpline 14447',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    dossiers.unshift(newDossier);
    this.saveDossiers(dossiers);
    claimEvents.emit('DOSSIER_CREATED', newDossier);
    return newDossier;
  }

  updateDossier(id, updatedFields) {
    const dossiers = this.getDossiers();
    const index = dossiers.findIndex(d => d.id === id);
    if (index === -1) return null;

    dossiers[index] = {
      ...dossiers[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    this.saveDossiers(dossiers);
    claimEvents.emit('DOSSIER_UPDATED', dossiers[index]);
    return dossiers[index];
  }

  toggleChecklistItem(id, key) {
    const dossier = this.getDossierById(id);
    if (!dossier) return null;

    const current = dossier.checklist || {};
    const updatedChecklist = {
      ...current,
      [key]: !current[key]
    };

    return this.updateDossier(id, { checklist: updatedChecklist });
  }

  deleteDossier(id) {
    let dossiers = this.getDossiers();
    const target = dossiers.find(d => d.id === id);
    if (!target) return false;

    dossiers = dossiers.filter(d => d.id !== id);
    this.saveDossiers(dossiers);
    claimEvents.emit('DOSSIER_DELETED', { id });
    return true;
  }

  calculateTimeline(dossier) {
    const events = [];

    if (dossier.cultivationDates?.sowingDate) {
      events.push({
        date: dossier.cultivationDates.sowingDate,
        title: 'Crop Sowing & Cultivation Initiated',
        badge: 'CROP START',
        type: 'start'
      });
    }

    if (dossier.damageDate) {
      events.push({
        date: dossier.damageDate.split('T')[0],
        title: `Damage Incident: ${dossier.damageCause}`,
        badge: 'INCIDENT OCCURRED',
        type: 'danger'
      });

      // Calculate 72-hour notification deadline
      const dmgTime = new Date(dossier.damageDate).getTime();
      const deadline = new Date(dmgTime + 72 * 3600 * 1000);
      events.push({
        date: deadline.toISOString().split('T')[0],
        title: '72-Hour PMFBY Notification Deadline to 14447',
        badge: 'MANDATORY DEADLINE',
        type: 'warning'
      });
    }

    if (dossier.createdAt) {
      events.push({
        date: dossier.createdAt.split('T')[0],
        title: 'Farmer Incident Dossier Prepared in Farmogram AI',
        badge: 'EVIDENCE LOGGED',
        type: 'info'
      });
    }

    if (dossier.cultivationDates?.expectedHarvestDate) {
      events.push({
        date: dossier.cultivationDates.expectedHarvestDate,
        title: 'Scheduled Normal Harvest Date',
        badge: 'EXPECTED HARVEST',
        type: 'secondary'
      });
    }

    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getProcedures() {
    return OFFICIAL_CLAIM_PROCEDURES;
  }
}

export const cropClaimService = new CropClaimService();
