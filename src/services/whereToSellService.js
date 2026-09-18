/**
 * Farmogram AI — "Where Should I Sell?" Decision-Support Service Engine
 * Features:
 * - Comprehensive regional destination directory: APMC mandis, verified direct buyers, FPOs, processors, and farmgate aggregators.
 * - Crop configuration matrix: Packaging, perishability index, storage feasibility, and quality grade adjustments.
 * - Objective financial calculation engine: Gross selling value, transport cost, handling/hamali, storage, mandi fees, and estimated net return.
 * - Strict neutrality: Transparent calculated ledgers WITHOUT ranking options as "best" or guaranteeing future returns.
 * - Explicit labeling of verified market data vs. estimated logistics deductions.
 */

// Supported Crops & Logistics Parameters
export const SELLING_CROPS = [
  {
    id: 'Tomato',
    name: 'Tomato',
    icon: '🍅',
    category: 'Horticulture / Perishable',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'HIGH', // High perishability: fast transport / cold storage needed
    maxHoldingDaysWithoutColdStorage: 2,
    coldStorageDailyCostPerQtl: 4.5,
    dryStorageDailyCostPerQtl: 0, // Not applicable
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.10, // +10% for uniform size, color & firmness
      B: 1.00, // Standard / FAQ
      C: 0.88  // -12% for sorting/ripeness variations
    },
    handlingRatePerQtl: 18 // Loading + unloading labor (hamali)
  },
  {
    id: 'Paddy',
    name: 'Paddy',
    icon: '🌾',
    category: 'Cereal / Non-Perishable',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'LOW',
    maxHoldingDaysWithoutColdStorage: 180,
    coldStorageDailyCostPerQtl: 0,
    dryStorageDailyCostPerQtl: 0.85, // Standard dry warehouse / godown
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.07, // Low moisture (<14%), Grade A grain
      B: 1.00, // Common / FAQ
      C: 0.92  // High moisture or discolored
    },
    handlingRatePerQtl: 20
  },
  {
    id: 'Turmeric',
    name: 'Turmeric',
    icon: '🌿',
    category: 'Cash Crop / Spice',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'LOW',
    maxHoldingDaysWithoutColdStorage: 365,
    coldStorageDailyCostPerQtl: 0,
    dryStorageDailyCostPerQtl: 1.20, // Clean dry godown
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.12, // Finger variety, high curcumin (>3.5%)
      B: 1.00, // Standard bulb / finger mix
      C: 0.85  // Low grade / secondary root
    },
    handlingRatePerQtl: 22
  },
  {
    id: 'Onion',
    name: 'Onion',
    icon: '🧅',
    category: 'Vegetable / Semi-Perishable',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'MEDIUM',
    maxHoldingDaysWithoutColdStorage: 20,
    coldStorageDailyCostPerQtl: 3.0,
    dryStorageDailyCostPerQtl: 1.10, // Ventilated storage
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.09, // Big size, cured outer skin
      B: 1.00, // Medium / standard
      C: 0.87  // Small / double bulbs
    },
    handlingRatePerQtl: 18
  },
  {
    id: 'Maize',
    name: 'Maize',
    icon: '🌽',
    category: 'Feed & Industrial Grain',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'LOW',
    maxHoldingDaysWithoutColdStorage: 150,
    coldStorageDailyCostPerQtl: 0,
    dryStorageDailyCostPerQtl: 0.80,
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.06, // Clean dry kernels (<12% moisture)
      B: 1.00, // FAQ
      C: 0.90  // High moisture / broken
    },
    handlingRatePerQtl: 19
  },
  {
    id: 'Groundnut',
    name: 'Groundnut',
    icon: '🥜',
    category: 'Oilseed',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'LOW',
    maxHoldingDaysWithoutColdStorage: 120,
    coldStorageDailyCostPerQtl: 0,
    dryStorageDailyCostPerQtl: 1.00,
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.08, // Bold pods, high shelling %
      B: 1.00, // Standard FAQ
      C: 0.89  // Small / damp
    },
    handlingRatePerQtl: 20
  },
  {
    id: 'Cotton',
    name: 'Cotton',
    icon: '☁️',
    category: 'Commercial Fiber',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'LOW',
    maxHoldingDaysWithoutColdStorage: 180,
    coldStorageDailyCostPerQtl: 0,
    dryStorageDailyCostPerQtl: 1.50,
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.10, // Long staple, zero trash
      B: 1.00, // Medium staple
      C: 0.88  // High moisture or discolored
    },
    handlingRatePerQtl: 25
  },
  {
    id: 'Chilli',
    name: 'Dry Chilli',
    icon: '🌶️',
    category: 'Spice / Cash Crop',
    standardUnit: 'Quintal',
    kgPerUnit: 100,
    perishability: 'LOW',
    maxHoldingDaysWithoutColdStorage: 240,
    coldStorageDailyCostPerQtl: 3.5, // Often kept in cold storage for color retention
    dryStorageDailyCostPerQtl: 1.30,
    defaultGrade: 'B',
    gradeMultipliers: {
      A: 1.12, // Bright red, unbroken, high pungency
      B: 1.00, // Standard FAQ
      C: 0.86  // Whitened / broken pods
    },
    handlingRatePerQtl: 22
  }
];

// Quality Grade Definitions
export const QUALITY_GRADES = [
  {
    id: 'A',
    label: 'Grade A (Premium / Export Quality)',
    shortLabel: 'Grade A — Premium',
    badgeClass: 'grade-badge-a',
    multiplier: 1.10,
    description: 'Uniform shape, superior color, optimal moisture (<12-14%), zero pest damage, meets export/supermarket specs.'
  },
  {
    id: 'B',
    label: 'Grade B (Standard / FAQ — Fair Average Quality)',
    shortLabel: 'Grade B — Standard FAQ',
    badgeClass: 'grade-badge-b',
    multiplier: 1.00,
    description: 'Normal market standards, minor cosmetic variations, acceptable commercial moisture, typical APMC benchmark.'
  },
  {
    id: 'C',
    label: 'Grade C (Fair / Secondary / Processing)',
    shortLabel: 'Grade C — Processing',
    badgeClass: 'grade-badge-c',
    multiplier: 0.88,
    description: 'Mixed sizes, higher moisture, slight skin blemishes, suitable for extraction, paste, or local processing.'
  }
];

// Master Directory of Selling Destinations in Western & Central Tamil Nadu
export const SELLING_DESTINATIONS = [
  // 1. APMC Regulated Markets
  {
    id: 'DEST-APMC-ERODE',
    name: 'Erode Regulated Market (APMC)',
    shortName: 'Erode APMC Mandi',
    type: 'APMC_MANDI',
    typeLabel: 'APMC Regulated Mandi',
    badgeClass: 'badge-apmc',
    location: 'Perundurai Road, Erode',
    district: 'Erode',
    coords: { lat: 11.3320, lng: 77.7050 },
    verifiedDataSource: 'Agmarknet / TN Agri Marketing Board',
    priceTimestamp: 'Today, 08:30 AM',
    supportedCrops: {
      Tomato: 2650,
      Paddy: 2450,
      Turmeric: 14800,
      Onion: 2850,
      Maize: 2220,
      Groundnut: 6550,
      Cotton: 7200,
      Chilli: 18500
    },
    mandiFeePercent: 1.0, // 1% APMC cess
    commissionPercent: 0, // No farmer commission in regulated market
    weighingFeePerQtl: 6,
    handlingLaborPerQtl: 18,
    paymentMethod: 'e-NAM DBT Bank Transfer (Within 24 Hours)',
    paymentSpeed: '24-48 Hours',
    weighmentType: 'Certified Electronic Weighbridge',
    operatingHours: '06:00 AM - 01:30 PM (Mon-Sat)',
    contactPhone: '+91 424 2253100',
    facilities: ['e-NAM Assaying Lab', 'Covered Drying Yard', 'Farmer Rest House', 'CCTV Auction Hall']
  },
  {
    id: 'DEST-APMC-PERUNDURAI',
    name: 'Perundurai Agro Regulated Mandi',
    shortName: 'Perundurai Mandi',
    type: 'APMC_MANDI',
    typeLabel: 'APMC Regulated Mandi',
    badgeClass: 'badge-apmc',
    location: 'Sanatorium, Perundurai',
    district: 'Erode',
    coords: { lat: 11.2800, lng: 77.5850 },
    verifiedDataSource: 'TN Agri Marketing Daily Bulletin',
    priceTimestamp: 'Today, 09:00 AM',
    supportedCrops: {
      Tomato: 2580,
      Paddy: 2420,
      Turmeric: 14950,
      Onion: 2790,
      Maize: 2240,
      Groundnut: 6600
    },
    mandiFeePercent: 1.0,
    commissionPercent: 0,
    weighingFeePerQtl: 5,
    handlingLaborPerQtl: 16,
    paymentMethod: 'Direct Bank Transfer / RTGS',
    paymentSpeed: 'Same Day / 24 Hours',
    weighmentType: 'Digital Weighbridge',
    operatingHours: '06:30 AM - 12:30 PM (Mon-Fri)',
    contactPhone: '+91 4294 220250',
    facilities: ['Moisture Meter Assaying', 'Farmer Shed', 'Godown Storage Facility']
  },
  {
    id: 'DEST-APMC-CBE-MGR',
    name: 'Coimbatore MGR Wholesale Vegetable Market',
    shortName: 'Coimbatore MGR Market',
    type: 'WHOLESALE_MARKET',
    typeLabel: 'Wholesale Mandi',
    badgeClass: 'badge-wholesale',
    location: 'Mettupalayam Road, Coimbatore',
    district: 'Coimbatore',
    coords: { lat: 11.0250, lng: 76.9550 },
    verifiedDataSource: 'MGR Market Traders Association Daily Rate Card',
    priceTimestamp: 'Today, 06:15 AM',
    supportedCrops: {
      Tomato: 2820,
      Onion: 3050,
      Chilli: 19200,
      Banana: 3400
    },
    mandiFeePercent: 0,
    commissionPercent: 2.5, // Standard wholesale commission
    weighingFeePerQtl: 8,
    handlingLaborPerQtl: 20,
    paymentMethod: 'Spot Cash / Instant UPI at Gate',
    paymentSpeed: 'Instant Cash',
    weighmentType: 'Manual Beam & Digital Platform',
    operatingHours: '03:30 AM - 10:00 AM Daily',
    contactPhone: '+91 422 2451980',
    facilities: ['Rapid Unloading Bays', 'Instant Cash Counters', 'High Liquidity Wholesale Volume']
  },
  {
    id: 'DEST-APMC-SALEM',
    name: 'Salem Regulated Market (Shevapet)',
    shortName: 'Salem Regulated Mandi',
    type: 'APMC_MANDI',
    typeLabel: 'APMC Regulated Mandi',
    badgeClass: 'badge-apmc',
    location: 'Shevapet, Salem',
    district: 'Salem',
    coords: { lat: 11.6550, lng: 78.1450 },
    verifiedDataSource: 'e-NAM Electronic Auction Feed',
    priceTimestamp: 'Today, 08:45 AM',
    supportedCrops: {
      Tomato: 2620,
      Paddy: 2490,
      Turmeric: 14720,
      Maize: 2210,
      Groundnut: 6520
    },
    mandiFeePercent: 1.0,
    commissionPercent: 0,
    weighingFeePerQtl: 5,
    handlingLaborPerQtl: 17,
    paymentMethod: 'e-NAM Bank Escrow Settlement',
    paymentSpeed: '24-48 Hours',
    weighmentType: 'Certified Electronic Scale',
    operatingHours: '07:00 AM - 01:00 PM',
    contactPhone: '+91 427 2210840',
    facilities: ['Agri Laboratory', 'Drying Floors', 'Farmers Common Service Center']
  },
  {
    id: 'DEST-APMC-ODDANCHATRAM',
    name: 'Oddanchatram Central Vegetable Market',
    shortName: 'Oddanchatram Mandi',
    type: 'WHOLESALE_MARKET',
    typeLabel: 'Major Wholesale Mandi',
    badgeClass: 'badge-wholesale',
    location: 'Oddanchatram, Dindigul',
    district: 'Dindigul',
    coords: { lat: 10.4850, lng: 77.7450 },
    verifiedDataSource: 'Oddanchatram Commission Merchants Association',
    priceTimestamp: 'Today, 07:00 AM',
    supportedCrops: {
      Tomato: 2900,
      Chilli: 19400,
      Onion: 3100
    },
    mandiFeePercent: 0,
    commissionPercent: 3.0,
    weighingFeePerQtl: 7,
    handlingLaborPerQtl: 22,
    paymentMethod: 'Immediate Cash / UPI Transfer',
    paymentSpeed: 'Instant Cash',
    weighmentType: 'High Capacity Weigh Platforms',
    operatingHours: '04:00 AM - 11:30 AM Daily',
    contactPhone: '+91 4545 240112',
    facilities: ['Heavy Commercial Outflow', 'Kerala Inter-State Buyers Presence', 'Cold Van Loading Points']
  },
  {
    id: 'DEST-APMC-THANJAVUR',
    name: 'Thanjavur Regulated Market (Paddy Special)',
    shortName: 'Thanjavur APMC Mandi',
    type: 'APMC_MANDI',
    typeLabel: 'APMC Regulated Mandi',
    badgeClass: 'badge-apmc',
    location: 'Trichy Road, Thanjavur',
    district: 'Thanjavur',
    coords: { lat: 10.7850, lng: 79.1350 },
    verifiedDataSource: 'Tamil Nadu Civil Supplies & APMC Feed',
    priceTimestamp: 'Today, 09:15 AM',
    supportedCrops: {
      Paddy: 2560,
      Maize: 2180,
      Groundnut: 6480
    },
    mandiFeePercent: 1.0,
    commissionPercent: 0,
    weighingFeePerQtl: 6,
    handlingLaborPerQtl: 18,
    paymentMethod: 'Government Direct Benefit Transfer (DBT)',
    paymentSpeed: '48-72 Hours',
    weighmentType: 'Electronic Weighbridge with Moisture Meter',
    operatingHours: '08:00 AM - 04:00 PM',
    contactPhone: '+91 4362 230910',
    facilities: ['Direct MSP Procurement Counters', 'Scientific Godowns', 'Moisture Checking']
  },

  // 2. Verified Direct Buyers, FPOs & Corporate Processors
  {
    id: 'DEST-BUYER-KONGU-FPO',
    name: 'Kongu Organic Spices & Turmeric FPO',
    shortName: 'Kongu Spices FPO',
    type: 'VERIFIED_FPO',
    typeLabel: 'Farmer Producer Org (FPO)',
    badgeClass: 'badge-fpo',
    location: 'Chennimalai Road, Erode',
    district: 'Erode',
    coords: { lat: 11.2350, lng: 77.6200 },
    verifiedDataSource: 'NABARD Registered FPO Procurement Price',
    priceTimestamp: 'Today, 09:30 AM (Contract Offer)',
    supportedCrops: {
      Turmeric: 15300,
      Tomato: 2600,
      Groundnut: 6700
    },
    mandiFeePercent: 0, // No APMC cess for direct FPO purchase
    commissionPercent: 0, // No middlemen commission
    weighingFeePerQtl: 0, // Absorbed by FPO
    handlingLaborPerQtl: 10,
    paymentMethod: 'Direct NEFT / IMPS to Farmer Bank',
    paymentSpeed: 'Within 12 Hours',
    weighmentType: 'Certified Digital Platform Scale',
    operatingHours: '08:00 AM - 05:00 PM (Mon-Sat)',
    contactPhone: '+91 94432 90112',
    facilities: ['Quality Incentive Bonus', 'Zero Hidden Fees', 'Organic Certification Premium Assistance']
  },
  {
    id: 'DEST-BUYER-AGROFRESH',
    name: 'AgroFresh Retail Procurement Hub',
    shortName: 'AgroFresh Collection Center',
    type: 'DIRECT_PROCESSOR',
    typeLabel: 'Verified Retail Aggregator',
    badgeClass: 'badge-processor',
    location: 'Sulur Industrial Corridor, Coimbatore',
    district: 'Coimbatore',
    coords: { lat: 11.0250, lng: 77.1250 },
    verifiedDataSource: 'AgroFresh Daily Supermarket Procurement Bulletin',
    priceTimestamp: 'Today, 07:30 AM',
    supportedCrops: {
      Tomato: 2750,
      Onion: 2980,
      Chilli: 18900
    },
    mandiFeePercent: 0,
    commissionPercent: 0,
    weighingFeePerQtl: 0,
    handlingLaborPerQtl: 12,
    paymentMethod: 'Direct Bank Transfer with SMS Slip',
    paymentSpeed: '24 Hours',
    weighmentType: 'Calibrated Electronic Scales',
    operatingHours: '05:30 AM - 12:00 PM Daily',
    contactPhone: '+91 98421 66543',
    facilities: ['Crate Exchange Available', 'Sorting & Grading Table', 'Direct Supermarket Distribution']
  },
  {
    id: 'DEST-BUYER-TN-MILLERS',
    name: 'TN Modern Rice Millers Federation Depot',
    shortName: 'Rice Millers Modern Depot',
    type: 'DIRECT_PROCESSOR',
    typeLabel: 'Modern Rice Processing Mill',
    badgeClass: 'badge-processor',
    location: 'Bhavani Road, Erode',
    district: 'Erode',
    coords: { lat: 11.4100, lng: 77.6800 },
    verifiedDataSource: 'Millers Association Direct Purchase Rate',
    priceTimestamp: 'Today, 08:00 AM',
    supportedCrops: {
      Paddy: 2510,
      Maize: 2260
    },
    mandiFeePercent: 0,
    commissionPercent: 0,
    weighingFeePerQtl: 0,
    handlingLaborPerQtl: 14,
    paymentMethod: 'Instant RTGS on Final Moisture Test',
    paymentSpeed: 'Same Day (Within 4 Hours)',
    weighmentType: '60-Tonne Industrial Weighbridge',
    operatingHours: '07:00 AM - 06:00 PM',
    contactPhone: '+91 424 2339870',
    facilities: ['Automated Grain Sampler', 'Rapid Moisture Meter', 'Large Truck Unloading Dock']
  },

  // 3. Local Farmgate Aggregators (Zero transport, lower price)
  {
    id: 'DEST-FARMGATE-TRADER',
    name: 'Local Village Farmgate Aggregator',
    shortName: 'Direct Farmgate Pickup',
    type: 'FARMGATE_AGGREGATOR',
    typeLabel: 'Farmgate Direct Collection',
    badgeClass: 'badge-farmgate',
    location: 'At Farmer Farm Gate (Farmer Village)',
    district: 'Local Farm Location',
    coords: null, // Dynamic: at farm gate
    verifiedDataSource: 'Regional Farmgate Average Benchmark',
    priceTimestamp: 'Today, 09:00 AM',
    supportedCrops: {
      Tomato: 2350,
      Paddy: 2250,
      Turmeric: 13900,
      Onion: 2550,
      Maize: 2050,
      Groundnut: 6150,
      Cotton: 6700,
      Chilli: 16800
    },
    mandiFeePercent: 0,
    commissionPercent: 0,
    weighingFeePerQtl: 0,
    handlingLaborPerQtl: 0, // Trader brings own loading laborers!
    paymentMethod: 'Immediate Cash at Farmgate',
    paymentSpeed: 'Instant Cash at Farm',
    weighmentType: 'Portable Hanging / Platform Scale',
    operatingHours: 'On-Call (Farmer Requested Time)',
    contactPhone: '+91 97880 45678',
    facilities: ['Zero Farmer Transport Cost', 'Zero Farmer Labor Required', 'Instant Cash on Spot']
  }
];

// District & Village Coordinates for Distance Calculation
export const LOCATION_COORDINATES = {
  'Perundurai': { lat: 11.2750, lng: 77.5850 },
  'Erode': { lat: 11.3410, lng: 77.7172 },
  'Sathyamangalam': { lat: 11.5030, lng: 77.2400 },
  'Gobichettipalayam': { lat: 11.4550, lng: 77.4420 },
  'Bhavani': { lat: 11.4480, lng: 77.6820 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Pollachi': { lat: 10.6600, lng: 77.0100 },
  'Tiruppur': { lat: 11.1085, lng: 77.3411 },
  'Dharapuram': { lat: 10.7300, lng: 77.5300 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Namakkal': { lat: 11.2189, lng: 78.1674 },
  'Thanjavur': { lat: 10.7870, lng: 79.1378 },
  'Theni': { lat: 10.0104, lng: 77.4768 },
  'Dindigul': { lat: 10.3673, lng: 77.9803 },
  'Madurai': { lat: 9.9252, lng: 78.1198 }
};

class WhereToSellService {
  /**
   * Calculate distance between two coordinates in kilometers using Haversine formula
   * with a road tortuosity factor of 1.25 for realistic driving distance
   */
  calculateDistanceKm(coord1, coord2) {
    if (!coord1 || !coord2) return 0;
    const R = 6371; // Earth radius in km
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = R * c;
    return Math.max(1, Math.round(straightKm * 1.25)); // 25% road curve factor
  }

  /**
   * Resolve coordinates for a location string or default to Perundurai/Erode
   */
  getCoordinatesForLocation(locationStr) {
    if (!locationStr) return LOCATION_COORDINATES['Perundurai'];
    const norm = locationStr.toLowerCase();
    for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (norm.includes(key.toLowerCase())) {
        return coords;
      }
    }
    return LOCATION_COORDINATES['Perundurai'];
  }

  /**
   * Core Decision-Support Engine: Evaluate all applicable selling destinations
   * for a given crop, quantity, quality grade, location, and holding timeline.
   */
  evaluateDestinations({
    cropId = 'Tomato',
    quantity = 50,
    unit = 'Quintal', // 'Quintal' | 'Kg' | 'Tonne'
    grade = 'B', // 'A' | 'B' | 'C'
    harvestDate = new Date().toISOString().split('T')[0],
    farmLocation = 'Perundurai, Erode',
    holdingDays = 0, // 0 = Sell immediately on harvest
    useSharedTransport = true // If true, benefits from shared transport cost splitting
  }) {
    // 1. Standardize Quantity to Quintals (1 Quintal = 100 Kg = 0.1 Tonne)
    let quantityInQuintals = parseFloat(quantity) || 1;
    if (unit === 'Kg') {
      quantityInQuintals = quantityInQuintals / 100;
    } else if (unit === 'Tonne') {
      quantityInQuintals = quantityInQuintals * 10;
    }
    quantityInQuintals = Math.max(0.1, Number(quantityInQuintals.toFixed(2)));

    // 2. Crop specs
    const cropSpec = SELLING_CROPS.find(c => c.id === cropId) || SELLING_CROPS[0];
    const gradeObj = QUALITY_GRADES.find(g => g.id === grade) || QUALITY_GRADES[1];
    const gradeMultiplier = cropSpec.gradeMultipliers[grade] || 1.0;

    // 3. Farmer Farm Location Coordinates
    const farmCoords = this.getCoordinatesForLocation(farmLocation);

    // 4. Transport Rate Matrix (matches shared transport service)
    // Base mini truck rate ~₹32/km; shared vehicle factor ~0.65; full dedicated ~1.0
    const transportRatePerKm = useSharedTransport ? 24 : 34;

    // 5. Evaluate Destinations
    const evaluatedResults = [];

    for (const dest of SELLING_DESTINATIONS) {
      // Check if this destination purchases this crop
      const basePrice = dest.supportedCrops[cropSpec.id];
      if (!basePrice) continue;

      // Quality grade adjusted gross price
      const grossPricePerQuintal = Math.round(basePrice * gradeMultiplier);
      const grossValue = Math.round(quantityInQuintals * grossPricePerQuintal);

      // Distance calculation
      let distanceKm = 0;
      if (dest.type === 'FARMGATE_AGGREGATOR') {
        distanceKm = 0; // Farmgate: 0 km
      } else {
        distanceKm = this.calculateDistanceKm(farmCoords, dest.coords);
      }

      // 1. Transport Cost Deduction
      let transportCost = 0;
      if (distanceKm > 0) {
        // Base vehicle trip cost scaled by weight
        const truckCapacityQuintals = 20; // 2 Tonne mini truck = 20 quintals
        const tripsNeeded = Math.ceil(quantityInQuintals / truckCapacityQuintals);
        
        if (useSharedTransport && quantityInQuintals < truckCapacityQuintals) {
          // Weight-proportional shared transport model
          const weightFraction = Math.max(0.2, quantityInQuintals / truckCapacityQuintals);
          transportCost = Math.round(distanceKm * transportRatePerKm * weightFraction);
          transportCost = Math.max(350, transportCost); // Minimum booking fee
        } else {
          transportCost = Math.round(distanceKm * transportRatePerKm * tripsNeeded);
          transportCost = Math.max(500, transportCost);
        }
      }

      // 2. Loading & Unloading (Hamali) Labor Deduction
      let handlingLaborCost = 0;
      if (dest.type !== 'FARMGATE_AGGREGATOR') {
        const ratePerQtl = dest.handlingLaborPerQtl || cropSpec.handlingRatePerQtl;
        handlingLaborCost = Math.round(quantityInQuintals * ratePerQtl);
      }

      // 3. Storage Deduction (if farmer holds produce past harvest)
      let storageCost = 0;
      let storageNotice = null;
      const days = parseInt(holdingDays) || 0;

      if (days > 0) {
        if (cropSpec.perishability === 'HIGH') {
          // Requires cold storage
          storageCost = Math.round(quantityInQuintals * cropSpec.coldStorageDailyCostPerQtl * days);
          storageNotice = `Requires Cold Storage (${days} days @ ₹${cropSpec.coldStorageDailyCostPerQtl}/qtl/day)`;
        } else {
          // Dry storage warehouse
          storageCost = Math.round(quantityInQuintals * cropSpec.dryStorageDailyCostPerQtl * days);
          storageNotice = `Warehouse Godown Storage (${days} days @ ₹${cropSpec.dryStorageDailyCostPerQtl}/qtl/day)`;
        }
      } else {
        if (cropSpec.perishability === 'HIGH') {
          storageNotice = 'Perishable Produce: Same-day market arrival recommended';
        } else {
          storageNotice = 'Storable: Warehouse receipt financing / safe holding possible';
        }
      }

      // 4. Mandi Fees, APMC Cess, Weighing & Statutory Deductions
      let mandiFeeCost = 0;
      if (dest.mandiFeePercent > 0) {
        mandiFeeCost += Math.round(grossValue * (dest.mandiFeePercent / 100));
      }
      if (dest.commissionPercent > 0) {
        mandiFeeCost += Math.round(grossValue * (dest.commissionPercent / 100));
      }
      if (dest.weighingFeePerQtl > 0) {
        mandiFeeCost += Math.round(quantityInQuintals * dest.weighingFeePerQtl);
      }

      // Total Deductions
      const totalDeductions = transportCost + handlingLaborCost + storageCost + mandiFeeCost;

      // Estimated Net Return
      const estimatedNetReturn = Math.max(0, grossValue - totalDeductions);
      const realizedNetPricePerQuintal = Math.round(estimatedNetReturn / quantityInQuintals);

      evaluatedResults.push({
        id: dest.id,
        destination: dest,
        crop: cropSpec,
        grade: gradeObj,
        quantityQuintals: quantityInQuintals,
        distanceKm,
        
        // Transparent Financial Ledger
        grossPricePerQuintal,
        grossValue,
        deductions: {
          transport: transportCost,
          handling: handlingLaborCost,
          storage: storageCost,
          mandiFees: mandiFeeCost,
          total: totalDeductions
        },
        estimatedNetReturn,
        realizedNetPricePerQuintal,
        
        // Logistics & Quality Metadata
        storageNotice,
        holdingDays: days,
        isSharedTransport: useSharedTransport,
        priceTimestamp: dest.priceTimestamp,
        dataSource: dest.verifiedDataSource,
        paymentMethod: dest.paymentMethod,
        paymentSpeed: dest.paymentSpeed,
        weighmentType: dest.weighmentType,
        operatingHours: dest.operatingHours,
        contactPhone: dest.contactPhone,
        facilities: dest.facilities,
        
        // Neutral Disclaimer Notice
        disclaimerNotice: 'Estimates based on current prevailing rates and road distance. Actual net returns depend on physical lot grading, moisture test at receiving gate, and negotiated transport fees.'
      });
    }

    return evaluatedResults;
  }
}

export const whereToSellService = new WhereToSellService();
