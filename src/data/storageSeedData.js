// Agricultural Storage & Cold Storage Seed Data for Farmogram AI
// Realistic facility listings across Tamil Nadu agro-corridors

export const getStorageImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (
    url.startsWith('data:') || 
    url.startsWith('blob:') || 
    url.startsWith('http://') || 
    url.startsWith('https://')
  ) {
    return url;
  }
  let clean = url.trim();
  while (clean.startsWith('/') || clean.startsWith('./')) {
    if (clean.startsWith('./')) {
      clean = clean.slice(2);
    } else if (clean.startsWith('/')) {
      clean = clean.slice(1);
    }
  }
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${clean}`;
};

export const STORAGE_FACILITY_TYPES = [
  { id: 'all', label: 'All Storage Types', icon: 'Warehouse', badge: 'All' },
  { id: 'cold_storage', label: 'Cold Storage & CA', icon: 'Snowflake', badge: 'Refrigerated' },
  { id: 'grain_godown', label: 'Grain & Dry Godown', icon: 'Warehouse', badge: 'Ambient Dry' },
  { id: 'warehouse', label: 'Regulated Warehouse', icon: 'Building', badge: 'Multi-Commodity' },
  { id: 'packhouse', label: 'Post-Harvest Packhouse', icon: 'Package', badge: 'Sorting & Cold Chain' },
  { id: 'grain_silo', label: 'Bulk Grain Silos', icon: 'Layers', badge: 'Aerated Bulk' }
];

export const STORAGE_PHOTO_PRESETS = [
  {
    id: 'preset_cold',
    label: 'Modern Cold Storage Facility',
    type: 'cold_storage',
    url: 'images/storage/cold_storage_facility.jpg'
  },
  {
    id: 'preset_godown',
    label: 'Agricultural Grain Godown',
    type: 'grain_godown',
    url: 'images/storage/grain_godown_warehouse.jpg'
  },
  {
    id: 'preset_packhouse',
    label: 'Post-Harvest Packhouse',
    type: 'packhouse',
    url: 'images/storage/modern_packhouse_facility.jpg'
  },
  {
    id: 'preset_silo',
    label: 'Bulk Grain Silos',
    type: 'grain_silo',
    url: 'images/storage/grain_silo_facility.jpg'
  }
];

export const INITIAL_STORAGE_LISTINGS = [
  {
    id: 'ST-01',
    ownerId: 'OWN-ST-101',
    ownerName: 'K. Ramasamy',
    ownerPhone: '+91 98421 88712',
    ownerWhatsapp: '+91 98421 88712',
    ownerRating: 4.9,
    reviewsCount: 42,
    verifiedOwner: true,
    facilityName: 'Perundurai Agrotech Cold Storage & CA Facility',
    storageType: 'cold_storage',
    storageTypeLabel: 'Cold Storage & CA',
    images: [
      getStorageImageUrl('images/storage/cold_storage_facility.jpg')
    ],
    location: {
      village: 'Perundurai SIPCOT Agro Zone',
      taluk: 'Perundurai',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638052',
      coordinates: { lat: 11.2782, lng: 77.5854 },
      address: 'Plot 42, Phase II, SIPCOT Industrial Park, Perundurai Bypass Road'
    },
    serviceRadiusKm: 60,
    totalCapacity: 500, // Metric Tonnes
    availableCapacity: 350, // Metric Tonnes
    capacityUnit: 'MT', // 'MT' | 'Quintals' | 'Bags' | 'SqFt'
    price: 6, // Base rate
    priceUnit: 'tonne_day', // 'tonne_day' | 'bag_day' | 'tonne_month' | 'sqft_month'
    priceUnitLabel: '₹6 / Tonne / Day',
    bagPrice: 1.5, // Per 50kg bag per day
    monthPricePerTonne: 160,
    minStorageDurationDays: 3,
    storageConditions: 'Refrigerated (2°C to 8°C, RH 85-90%) with Ethylene Scrubbing',
    temperatureRange: { min: 2, max: 8, unit: '°C' },
    humidityPercentage: '85% - 90%',
    supportedCrops: ['Turmeric', 'Tomato', 'Banana', 'Carrot', 'Potato', 'Apple', 'Cabbage', 'Grapes', 'Chilli'],
    amenities: [
      '60 MT Electronic Weighbridge',
      '24/7 Security & CCTV Surveillance',
      'Heavy Truck Loading Dock & Forklift',
      '125 kVA Automated DG Power Backup',
      'Fire Hydrant & Smoke Detection',
      'Plastic Crates for Rental'
    ],
    additionalCharges: {
      loadingUnloading: 35, // ₹ per MT
      handlingFee: 15, // ₹ per MT
      electricityIncluded: true,
      insuranceAvailable: true,
      insurancePercentage: 0.25
    },
    operatingHours: { start: '06:00 AM', end: '08:30 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: 'AVAILABLE', // 'AVAILABLE' | 'FULL' | 'MAINTENANCE'
    description: 'State-of-the-art multi-commodity refrigerated warehouse equipped with Bitzer German cooling compressors, automated humidity controllers, and ethylene absorbers. Approved for government subsidized storage and bank pledge loans.',
    storageRules: 'Produce must be graded and free of rot or pest infestation. Bags and crates must be clearly marked with farmer identifier tag.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'ST-02',
    ownerId: 'OWN-ST-102',
    ownerName: 'V. Subramanian',
    ownerPhone: '+91 94432 77410',
    ownerWhatsapp: '+91 94432 77410',
    ownerRating: 4.8,
    reviewsCount: 36,
    verifiedOwner: true,
    facilityName: 'Kongu Agricultural Grain Godown & Buffer Storage',
    storageType: 'grain_godown',
    storageTypeLabel: 'Grain & Dry Godown',
    images: [
      getStorageImageUrl('images/storage/grain_godown_warehouse.jpg')
    ],
    location: {
      village: 'Chennimalai Rural',
      taluk: 'Perundurai',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638051',
      coordinates: { lat: 11.1685, lng: 77.6112 },
      address: 'Near Chennimalai Weavers Colony & Agro Yard'
    },
    serviceRadiusKm: 45,
    totalCapacity: 1200,
    availableCapacity: 780,
    capacityUnit: 'MT',
    price: 4,
    priceUnit: 'tonne_day',
    priceUnitLabel: '₹4 / Tonne / Day',
    bagPrice: 1.2,
    monthPricePerTonne: 110,
    minStorageDurationDays: 7,
    storageConditions: 'Scientific Dry Ambient, Raised Damp-Proof Concrete Plinth with Aeration',
    temperatureRange: { min: 22, max: 32, unit: '°C' },
    humidityPercentage: '< 65%',
    supportedCrops: ['Paddy', 'Maize', 'Groundnut', 'Blackgram', 'Greengram', 'Millets', 'Sesame'],
    amenities: [
      '50 MT Electronic Weighbridge',
      'Moisture Testing Lab with Instant Printout',
      'Rotary Aeration Fans & Rodent Proofing',
      'Quarterly Prophylactic Pest Fumigation',
      '24/7 Security Guard & Guard Dog'
    ],
    additionalCharges: {
      loadingUnloading: 30,
      handlingFee: 10,
      electricityIncluded: true,
      insuranceAvailable: true,
      insurancePercentage: 0.2
    },
    operatingHours: { start: '06:30 AM', end: '07:30 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: 'AVAILABLE',
    description: 'High-ceilinged 1,200 MT dry grain warehouse managed by retired warehousing corporation staff. Specially treated damp-proof cement flooring with wooden dunnage crates to prevent moisture absorption in paddy and maize sacks.',
    storageRules: 'Grain moisture content must be below 14.5% for paddy and 12% for pulses before intake. Testing conducted free of charge at entry gate.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-05T10:30:00Z'
  },
  {
    id: 'ST-03',
    ownerId: 'OWN-ST-103',
    ownerName: 'M. Thangavel',
    ownerPhone: '+91 98422 33190',
    ownerWhatsapp: '+91 98422 33190',
    ownerRating: 4.9,
    reviewsCount: 58,
    verifiedOwner: true,
    facilityName: 'Erode Central Turmeric & Spice Regulated Warehouse',
    storageType: 'warehouse',
    storageTypeLabel: 'Regulated Warehouse',
    images: [
      getStorageImageUrl('images/storage/grain_godown_warehouse.jpg')
    ],
    location: {
      village: 'Semmampalayam',
      taluk: 'Erode',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638009',
      coordinates: { lat: 11.3410, lng: 77.7172 },
      address: 'Opposite New Turmeric Market Complex, Poondurai Road'
    },
    serviceRadiusKm: 80,
    totalCapacity: 2000,
    availableCapacity: 1150,
    capacityUnit: 'MT',
    price: 5,
    priceUnit: 'tonne_day',
    priceUnitLabel: '₹5 / Tonne / Day',
    bagPrice: 1.35,
    monthPricePerTonne: 135,
    minStorageDurationDays: 15,
    storageConditions: 'Airtight Sealed Fumigation Chambers for High-Curcumin Spices',
    temperatureRange: { min: 20, max: 28, unit: '°C' },
    humidityPercentage: '< 60%',
    supportedCrops: ['Turmeric', 'Chilli', 'Coriander', 'Pepper', 'Cardamom', 'Cumin', 'Ginger'],
    amenities: [
      'WDRA Certified Warehouse with e-NWR Support',
      '100 MT Heavy Double Weighbridge',
      'Direct APMC Mandi Conveyor Link',
      'Bank Pledge Loan Facility with 70% Value Credit',
      'Motorized Bag Stackers & Pallet Trucks'
    ],
    additionalCharges: {
      loadingUnloading: 40,
      handlingFee: 20,
      electricityIncluded: true,
      insuranceAvailable: true,
      insurancePercentage: 0.3
    },
    operatingHours: { start: '06:00 AM', end: '08:00 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    status: 'AVAILABLE',
    description: 'WDRA-registered regulated spice godown located directly opposite Erode Regulated Market. Provides negotiable warehouse receipts (e-NWR) eligible for instant low-interest 7% agricultural pledge loans from nationalised banks.',
    storageRules: 'Gunny bags must be standard 65kg or 70kg weight. Turmeric fingers must be dry with moisture under 10%.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-08T11:00:00Z'
  },
  {
    id: 'ST-04',
    ownerId: 'OWN-ST-104',
    ownerName: 'S. Nachimuthu',
    ownerPhone: '+91 94420 55112',
    ownerWhatsapp: '+91 94420 55112',
    ownerRating: 4.7,
    reviewsCount: 28,
    verifiedOwner: true,
    facilityName: 'Pollachi Anaimalai Coconut & Banana Packhouse',
    storageType: 'packhouse',
    storageTypeLabel: 'Post-Harvest Packhouse',
    images: [
      getStorageImageUrl('images/storage/modern_packhouse_facility.jpg')
    ],
    location: {
      village: 'Anaimalai Agro Cluster',
      taluk: 'Pollachi',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '642104',
      coordinates: { lat: 10.6588, lng: 77.0086 },
      address: 'Meenkarai Road, Near Coconut FPO Cooperative Complex'
    },
    serviceRadiusKm: 50,
    totalCapacity: 250,
    availableCapacity: 140,
    capacityUnit: 'MT',
    price: 8,
    priceUnit: 'tonne_day',
    priceUnitLabel: '₹8 / Tonne / Day',
    bagPrice: 2.2,
    monthPricePerTonne: 210,
    minStorageDurationDays: 2,
    storageConditions: 'Cold Water Washing, Anti-Microbial Dip, Pre-Cooling (12°C)',
    temperatureRange: { min: 12, max: 16, unit: '°C' },
    humidityPercentage: '90% - 95%',
    supportedCrops: ['Coconut', 'Banana', 'Mango', 'Papaya', 'Avocado', 'Guava', 'Vegetables'],
    amenities: [
      'Automated Fruit Washing & Sorting Line',
      'De-sapping Tables for Export Grade Bananas',
      'Palletizing & Corrugated Box Sealing Facility',
      'Refrigerated Container Loading Dock',
      'Electronic Platform Weigh Scales'
    ],
    additionalCharges: {
      loadingUnloading: 60,
      handlingFee: 25,
      electricityIncluded: true,
      insuranceAvailable: false
    },
    operatingHours: { start: '06:00 AM', end: '09:00 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: 'AVAILABLE',
    description: 'Post-harvest processing and short-term holding packhouse designed specifically for coconut producers and banana growers in the Pollachi-Anaimalai belt. Minimizes post-harvest transit losses by up to 22%.',
    storageRules: 'Fruits must be brought within 12 hours of harvesting to ensure quality retention during de-sapping and cool holding.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-11T12:00:00Z'
  },
  {
    id: 'ST-05',
    ownerId: 'OWN-ST-105',
    ownerName: 'Dr. T. Natarajan',
    ownerPhone: '+91 94431 12908',
    ownerWhatsapp: '+91 94431 12908',
    ownerRating: 5.0,
    reviewsCount: 64,
    verifiedOwner: true,
    facilityName: 'Thanjavur Delta Paddy & Grain Aerated Silo Complex',
    storageType: 'grain_silo',
    storageTypeLabel: 'Bulk Grain Silos',
    images: [
      getStorageImageUrl('images/storage/grain_silo_facility.jpg')
    ],
    location: {
      village: 'Vallam Delta Agro Hub',
      taluk: 'Thanjavur',
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      pincode: '613403',
      coordinates: { lat: 10.7870, lng: 79.1378 },
      address: 'Kumbakonam Main Road, Near Delta Agro Logistics Center'
    },
    serviceRadiusKm: 100,
    totalCapacity: 4000,
    availableCapacity: 2400,
    capacityUnit: 'MT',
    price: 4.5,
    priceUnit: 'tonne_day',
    priceUnitLabel: '₹4.5 / Tonne / Day',
    bagPrice: 1.3,
    monthPricePerTonne: 125,
    minStorageDurationDays: 10,
    storageConditions: 'Continuous Computerized Aerated Silo (< 13.5% Grain Moisture)',
    temperatureRange: { min: 18, max: 24, unit: '°C' },
    humidityPercentage: '< 55%',
    supportedCrops: ['Paddy', 'Maize', 'Sorghum', 'Pulses', 'Wheat'],
    amenities: [
      'Bulk Gravity Hydraulic Grain Unloader',
      'Real-Time Thermocouple Cable Monitoring',
      'Automated Aeration and Dust Extraction',
      '120 MT Double Pitless Weighbridge',
      'Automated Bagging & Stitching Unit on Request'
    ],
    additionalCharges: {
      loadingUnloading: 25,
      handlingFee: 15,
      electricityIncluded: true,
      insuranceAvailable: true,
      insurancePercentage: 0.2
    },
    operatingHours: { start: '05:30 AM', end: '09:30 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: 'AVAILABLE',
    description: 'Premier 4,000 MT steel silo installation in the Cauvery delta region. Features internal temperature and moisture sensor cables transmitting live metrics. Eliminates bag tearing, rodent damage, and spillage completely.',
    storageRules: 'Bulk grain intake only (or debagged at hopper). Grain must be winnowed with chaff content under 2%.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'ST-06',
    ownerId: 'OWN-ST-106',
    ownerName: 'K. Palanisamy',
    ownerPhone: '+91 98424 99011',
    ownerWhatsapp: '+91 98424 99011',
    ownerRating: 4.8,
    reviewsCount: 39,
    verifiedOwner: true,
    facilityName: 'Oddanchatram Multi-Chamber Perishable Cold Storage',
    storageType: 'cold_storage',
    storageTypeLabel: 'Cold Storage & CA',
    images: [
      getStorageImageUrl('images/storage/cold_storage_facility.jpg')
    ],
    location: {
      village: 'Oddanchatram Mandi Bypass',
      taluk: 'Oddanchatram',
      district: 'Dindigul',
      state: 'Tamil Nadu',
      pincode: '624619',
      coordinates: { lat: 10.4851, lng: 77.7478 },
      address: 'NH 209 Dindigul-Palani Road, 1 km from Gandhi Market'
    },
    serviceRadiusKm: 50,
    totalCapacity: 400,
    availableCapacity: 260,
    capacityUnit: 'MT',
    price: 7,
    priceUnit: 'tonne_day',
    priceUnitLabel: '₹7 / Tonne / Day',
    bagPrice: 1.8,
    monthPricePerTonne: 185,
    minStorageDurationDays: 4,
    storageConditions: 'Multi-Chamber Refrigeration (0°C to 4°C for Veg, 8°C for Banana)',
    temperatureRange: { min: 0, max: 8, unit: '°C' },
    humidityPercentage: '85% - 95%',
    supportedCrops: ['Onion', 'Tomato', 'Potato', 'Garlic', 'Drumstick', 'Capsicum', 'Chillies', 'Beans', 'Cabbage'],
    amenities: [
      '4 Independent Precision Cold Chambers',
      'Food Grade High-Density Plastic Crates',
      'Dual Compressor Setup (100% Redundancy)',
      'Backup Generator with Auto Mains Failure (AMF)',
      'Direct Buyer-Farmer Linking Kiosk'
    ],
    additionalCharges: {
      loadingUnloading: 35,
      handlingFee: 15,
      electricityIncluded: true,
      insuranceAvailable: true,
      insurancePercentage: 0.25
    },
    operatingHours: { start: '05:00 AM', end: '10:00 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: 'AVAILABLE',
    description: 'Located right next to South India’s largest vegetable mandi in Oddanchatram. Helps farmers store distress-sale tomatoes and bell peppers during market gluts and sell when prices rebound.',
    storageRules: 'Vegetables must be packed in breathable mesh sacks or plastic crates. Soft/decayed items cannot be accepted.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-16T14:00:00Z'
  },
  {
    id: 'ST-07',
    ownerId: 'OWN-ST-107',
    ownerName: 'A. Velusamy',
    ownerPhone: '+91 94437 88201',
    ownerWhatsapp: '+91 94437 88201',
    ownerRating: 4.6,
    reviewsCount: 22,
    verifiedOwner: true,
    facilityName: 'Udumalaipettai Dry Cotton & Grain Godown',
    storageType: 'grain_godown',
    storageTypeLabel: 'Grain & Dry Godown',
    images: [
      getStorageImageUrl('images/storage/grain_godown_warehouse.jpg')
    ],
    location: {
      village: 'Udumalpet East',
      taluk: 'Udumalaipettai',
      district: 'Tiruppur',
      state: 'Tamil Nadu',
      pincode: '642126',
      coordinates: { lat: 10.5855, lng: 77.2479 },
      address: 'Dharapuram Main Road, Near Spinning Mill Corridor'
    },
    serviceRadiusKm: 40,
    totalCapacity: 900,
    availableCapacity: 620,
    capacityUnit: 'MT',
    price: 3.8,
    priceUnit: 'tonne_day',
    priceUnitLabel: '₹3.8 / Tonne / Day',
    bagPrice: 1.1,
    monthPricePerTonne: 105,
    minStorageDurationDays: 7,
    storageConditions: 'Dry Ambient, Industrial Concrete Floor with High Ventilation',
    temperatureRange: { min: 22, max: 32, unit: '°C' },
    humidityPercentage: '< 60%',
    supportedCrops: ['Cotton', 'Maize', 'Groundnut', 'Sorghum', 'Sunn Hemp', 'Paddy'],
    amenities: [
      'High-Plinth Dock for Direct Lorry Loading',
      'Industrial Fire Sprinklers & Hose Reels',
      'Electronic Digital Weighbridge',
      '24/7 Security Patrol',
      'Tarpaulin Dunnage Mats'
    ],
    additionalCharges: {
      loadingUnloading: 30,
      handlingFee: 10,
      electricityIncluded: true,
      insuranceAvailable: true,
      insurancePercentage: 0.35
    },
    operatingHours: { start: '06:00 AM', end: '08:00 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    status: 'AVAILABLE',
    description: 'Clean, secure dry godown engineered for raw seed cotton (Kapas), pressed cotton bales, and coarse grains. Protected by comprehensive fire security equipment and strict non-smoking protocol.',
    storageRules: 'No combustible items or loose fuel allowed. Cotton bales must be bound with clean ties.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-18T09:00:00Z'
  },
  {
    id: 'ST-08',
    ownerId: 'OWN-ST-108',
    ownerName: 'R. Govindaraj',
    ownerPhone: '+91 98427 66205',
    ownerWhatsapp: '+91 98427 66205',
    ownerRating: 4.9,
    reviewsCount: 47,
    verifiedOwner: true,
    facilityName: 'Salem Shevaroy Integrated Mango & Fruit Cold Store',
    storageType: 'cold_storage',
    storageTypeLabel: 'Cold Storage & CA',
    images: [
      getStorageImageUrl('images/storage/cold_storage_facility.jpg')
    ],
    location: {
      village: 'Omalur Agro Cluster',
      taluk: 'Omalur',
      district: 'Salem',
      state: 'Tamil Nadu',
      pincode: '636455',
      coordinates: { lat: 11.7423, lng: 78.0416 },
      address: 'Bangalore National Highway NH 44, Near Omalur Toll Gate'
    },
    serviceRadiusKm: 65,
    totalCapacity: 350,
    availableCapacity: 190,
    capacityUnit: 'MT',
    price: 7.5,
    priceUnit: 'tonne_day',
    priceUnitLabel: '₹7.5 / Tonne / Day',
    bagPrice: 2.0,
    monthPricePerTonne: 195,
    minStorageDurationDays: 3,
    storageConditions: 'Refrigerated (4°C to 10°C, RH 90%) with Ethylene Ripening Chambers Attached',
    temperatureRange: { min: 4, max: 10, unit: '°C' },
    humidityPercentage: '88% - 92%',
    supportedCrops: ['Mango', 'Guava', 'Papaya', 'Tomato', 'Sapota', 'Grapes', 'Vegetables'],
    amenities: [
      'Scientific Ethylene Ripening Chambers',
      'Pre-Cooling Tunnel for Rapid Temperature Drop',
      'Reefer Truck Bay with Inflatable Dock Seals',
      'Standby Generator with Auto-Switching',
      'FSSAI Certified Food Safety Compliant'
    ],
    additionalCharges: {
      loadingUnloading: 40,
      handlingFee: 20,
      electricityIncluded: true,
      insuranceAvailable: true,
      insurancePercentage: 0.25
    },
    operatingHours: { start: '06:00 AM', end: '09:00 PM' },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: 'AVAILABLE',
    description: 'Specialized horticultural cold chain facility on the Salem-Bangalore highway corridor. Offers advanced pre-cooling to remove field heat from freshly plucked mangoes and vegetables, extending shelf life by up to 28 days.',
    storageRules: 'Fruits must be in plastic crates or carton boxes. Direct sorting on floor is prohibited.',
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-20T10:00:00Z'
  }
];

export const TN_STORAGE_COORDINATES = {
  'Perundurai': { lat: 11.2782, lng: 77.5854, district: 'Erode', pincode: '638052' },
  'Erode': { lat: 11.3410, lng: 77.7172, district: 'Erode', pincode: '638001' },
  'Bhavani': { lat: 11.4500, lng: 77.6833, district: 'Erode', pincode: '638301' },
  'Gobichettipalayam': { lat: 11.4552, lng: 77.4338, district: 'Erode', pincode: '638452' },
  'Sathyamangalam': { lat: 11.5034, lng: 77.2346, district: 'Erode', pincode: '638401' },
  'Coimbatore': { lat: 11.0168, lng: 76.9558, district: 'Coimbatore', pincode: '641001' },
  'Pollachi': { lat: 10.6609, lng: 77.0048, district: 'Coimbatore', pincode: '642001' },
  'Mettupalayam': { lat: 11.3000, lng: 76.9500, district: 'Coimbatore', pincode: '641301' },
  'Tiruppur': { lat: 11.1085, lng: 77.3411, district: 'Tiruppur', pincode: '641601' },
  'Udumalaipettai': { lat: 10.5846, lng: 77.2472, district: 'Tiruppur', pincode: '642126' },
  'Dharapuram': { lat: 10.7300, lng: 77.5200, district: 'Tiruppur', pincode: '638656' },
  'Kangeyam': { lat: 11.0000, lng: 77.5600, district: 'Tiruppur', pincode: '638701' },
  'Salem': { lat: 11.6643, lng: 78.1460, district: 'Salem', pincode: '636001' },
  'Attur': { lat: 11.5900, lng: 78.6000, district: 'Salem', pincode: '636102' },
  'Omalur': { lat: 11.7423, lng: 78.0416, district: 'Salem', pincode: '636455' },
  'Oddanchatram': { lat: 10.4857, lng: 77.7478, district: 'Dindigul', pincode: '624619' },
  'Dindigul': { lat: 10.3673, lng: 77.9803, district: 'Dindigul', pincode: '624001' },
  'Thanjavur': { lat: 10.7870, lng: 79.1378, district: 'Thanjavur', pincode: '613001' },
  'Kumbakonam': { lat: 10.9601, lng: 79.3845, district: 'Thanjavur', pincode: '612001' },
  'Namakkal': { lat: 11.2189, lng: 78.1674, district: 'Namakkal', pincode: '637001' },
  'Tiruchengode': { lat: 11.3800, lng: 77.8900, district: 'Namakkal', pincode: '637211' },
  'Madurai': { lat: 9.9252, lng: 78.1198, district: 'Madurai', pincode: '625001' },
  'Usilampatti': { lat: 9.9700, lng: 77.7900, district: 'Madurai', pincode: '625532' }
};

export const TN_STORAGE_LOCATION_COORDINATES = TN_STORAGE_COORDINATES;

