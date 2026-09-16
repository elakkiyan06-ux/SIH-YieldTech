// Agricultural Equipment Seed Data for Farmogram AI
// Realistic machinery listings across Tamil Nadu agro-corridors

export const EQUIPMENT_CATEGORIES = [
  { id: 'all', name: 'All Equipment', icon: 'Sparkles', count: 12 },
  { id: 'tractor', name: 'Tractors (35-65 HP)', icon: 'Tractor', count: 3 },
  { id: 'jcb', name: 'JCB & Earthmovers', icon: 'Shovel', count: 1 },
  { id: 'harvester', name: 'Combine Harvesters', icon: 'Wheat', count: 1 },
  { id: 'rotavator', name: 'Rotavators & Tillers', icon: 'Disc', count: 1 },
  { id: 'cultivator', name: 'Cultivators & Rippers', icon: 'Grid', count: 1 },
  { id: 'seed_drill', name: 'Seed Drills & Planters', icon: 'Sprout', count: 1 },
  { id: 'plough', name: 'Ploughs (MB & Disc)', icon: 'Layers', count: 1 },
  { id: 'water_tanker', name: 'Water Tankers & Mist Sprayers', icon: 'Droplets', count: 1 },
  { id: 'power_tiller', name: 'Power Tillers (Walk-behind)', icon: 'Wrench', count: 1 },
  { id: 'drone', name: 'Agri Sprayer Drones', icon: 'Compass', count: 1 }
];

export const INITIAL_EQUIPMENT_LISTINGS = [
  {
    id: 'EQ-01',
    ownerId: 'OWN-101',
    ownerName: 'Senthil Velan',
    ownerPhone: '+91 98421 88712',
    ownerRating: 4.9,
    reviewsCount: 38,
    verifiedOwner: true,
    title: 'Mahindra 575 DI Sarpanch (45 HP) with Rotavator & MB Plough',
    category: 'tractor',
    categoryLabel: 'Tractor',
    brand: 'Mahindra & Mahindra',
    model: '575 DI Sarpanch',
    horsepower: 45,
    year: 2022,
    images: [
      '/images/equipment/tractor_mahindra_rotavator.jpg'
    ],
    price: 850,
    priceUnit: 'hour', // 'hour' | 'acre' | 'day'
    minBookingDuration: '2 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 8,
    transportFeePerKm: 25,
    location: {
      village: 'Perundurai Rural',
      taluk: 'Perundurai',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638052',
      coordinates: { lat: 11.2782, lng: 77.5854 },
      address: 'Near Old Bus Stand, Perundurai Bypass Road'
    },
    serviceRadiusKm: 25,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '06:00 AM', end: '07:30 PM' },
    status: 'AVAILABLE', // 'AVAILABLE' | 'BUSY' | 'MAINTENANCE'
    description: 'Heavy duty 45 HP Mahindra tractor in prime condition with expert operator. Equipped with 42-blade Shaktiman rotavator and 2-bottom mouldboard plough. Ideal for wetland puddling, dry land cultivation, ridge making, and transport.',
    specifications: {
      engineCapacity: '2730 cc 4-Cylinder DI Engine',
      drive: '2WD with differential lock',
      ptoPower: '39.8 HP',
      fuelType: 'Diesel (Owner supplied or client provided)',
      attachmentsIncluded: ['Rotavator', '9-Tyne Cultivator', 'Cage Wheels on request']
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'EQ-02',
    ownerId: 'OWN-102',
    ownerName: 'C. Kaliappan',
    ownerPhone: '+91 94432 77410',
    ownerRating: 4.8,
    reviewsCount: 29,
    verifiedOwner: true,
    title: 'John Deere 5310 4WD (55 HP Heavy Duty) + 11-Tyne Cultivator',
    category: 'tractor',
    categoryLabel: 'Tractor',
    brand: 'John Deere',
    model: '5310 PowerTech 4WD',
    horsepower: 55,
    year: 2023,
    images: [
      '/images/equipment/johndeere_cultivator.jpg'
    ],
    price: 1100,
    priceUnit: 'hour',
    minBookingDuration: '3 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 10,
    transportFeePerKm: 30,
    location: {
      village: 'Chennimalai Village',
      taluk: 'Perundurai',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638051',
      coordinates: { lat: 11.1685, lng: 77.6120 },
      address: 'Kangeyam Main Road, Chennimalai'
    },
    serviceRadiusKm: 35,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '06:00 AM', end: '08:00 PM' },
    status: 'AVAILABLE',
    description: 'Powerful 4-wheel drive John Deere 5310 capable of deep soil ripping and subsoiling in tough black cotton soils and dry red clay. Features power steering, dual PTO, and oil-immersed disc brakes.',
    specifications: {
      engineCapacity: '2900 cc Turbocharged',
      drive: '4WD (Four Wheel Drive)',
      ptoPower: '46.7 HP',
      fuelType: 'Diesel',
      attachmentsIncluded: ['11-Tyne Duckfoot Cultivator', 'Heavy Subsoiler', 'Laser Land Leveller']
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 'EQ-03',
    ownerId: 'OWN-103',
    ownerName: 'R. Govindaraj',
    ownerPhone: '+91 97890 55219',
    ownerRating: 4.95,
    reviewsCount: 44,
    verifiedOwner: true,
    title: 'JCB 3DX Super EcoXcellence Backhoe Loader (Farm Levelling & Trenching)',
    category: 'jcb',
    categoryLabel: 'JCB & Earthmover',
    brand: 'JCB',
    model: '3DX Super EcoXcellence',
    horsepower: 76,
    year: 2024,
    images: [
      '/images/equipment/jcb_3dx_backhoe.jpg'
    ],
    price: 1350,
    priceUnit: 'hour',
    minBookingDuration: '2 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 5,
    transportFeePerKm: 35,
    location: {
      village: 'Bhavani Town',
      taluk: 'Bhavani',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638301',
      coordinates: { lat: 11.4485, lng: 77.6830 },
      address: 'Kalingarayan Canal Bridge, Bhavani'
    },
    serviceRadiusKm: 40,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '06:30 AM', end: '07:00 PM' },
    status: 'AVAILABLE',
    description: 'Certified skilled operator with 10+ years experience in agricultural land development: digging farm ponds (Kuttai), drip irrigation pipeline trenches, bund clearing, tree stump uprooting, canal desilting, and field contour bunding.',
    specifications: {
      engineCapacity: 'JCB ecoMAX 4.8L Engine',
      drive: '4x4 Transmission',
      bucketCapacity: '1.0 cu.m Front Loader, 0.24 cu.m Backhoe Bucket',
      attachmentsIncluded: ['Trenching Bucket (1.5 ft)', 'Standard Backhoe Bucket (2.5 ft)', 'Rock Breaker on notice']
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-15T09:15:00Z'
  },
  {
    id: 'EQ-04',
    ownerId: 'OWN-104',
    ownerName: 'M. Thangavel',
    ownerPhone: '+91 94421 33901',
    ownerRating: 4.85,
    reviewsCount: 52,
    verifiedOwner: true,
    title: 'Kubota DC-68G Combine Paddy Harvester (Rubber Track Crawler)',
    category: 'harvester',
    categoryLabel: 'Combine Harvester',
    brand: 'Kubota',
    model: 'DC-68G',
    horsepower: 68,
    year: 2023,
    images: [
      '/images/equipment/combine_paddy_harvester.jpg'
    ],
    price: 2400,
    priceUnit: 'acre',
    minBookingDuration: '1 Acre',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FIXED',
    freeRadiusKm: 15,
    transportFee: 500,
    location: {
      village: 'Kumbakonam Delta Hub',
      taluk: 'Kumbakonam',
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      pincode: '612001',
      coordinates: { lat: 10.9602, lng: 79.3845 },
      address: 'Cauvery Basin Agro Yard, Kumbakonam'
    },
    serviceRadiusKm: 65,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '06:00 AM', end: '08:30 PM' },
    status: 'AVAILABLE',
    description: 'High efficiency rubber crawler combine harvester designed specifically for wetland paddy fields. Causes zero soil compaction. Cuts, threshes, cleans, and bags paddy grain in a single operation with less than 1.5% grain loss.',
    specifications: {
      engineCapacity: 'Kubota V2403 Turbo Diesel (68 HP)',
      cuttingWidth: '2.0 Metres (6.5 Feet)',
      grainTankCapacity: '1,250 Litres (~800 kg Paddy)',
      harvestSpeed: '1 to 1.5 Acres per hour'
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-18T11:45:00Z'
  },
  {
    id: 'EQ-05',
    ownerId: 'OWN-105',
    ownerName: 'P. Mani',
    ownerPhone: '+91 98433 11204',
    ownerRating: 4.9,
    reviewsCount: 22,
    verifiedOwner: true,
    title: 'Shaktiman Regular Light Rotavator (42 L-Blades) + Swaraj 855 FE',
    category: 'rotavator',
    categoryLabel: 'Rotavator',
    brand: 'Shaktiman / Swaraj',
    model: 'Regular Light 165 + 855 FE (52 HP)',
    horsepower: 52,
    year: 2023,
    images: [
      '/images/equipment/rotavator_swaraj.jpg'
    ],
    price: 950,
    priceUnit: 'hour',
    minBookingDuration: '2 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 8,
    transportFeePerKm: 25,
    location: {
      village: 'Gobichettipalayam Town',
      taluk: 'Gobichettipalayam',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638452',
      coordinates: { lat: 11.4550, lng: 77.4420 },
      address: 'Sathy Road, Gobichettipalayam'
    },
    serviceRadiusKm: 25,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '06:00 AM', end: '07:00 PM' },
    status: 'AVAILABLE',
    description: 'Finest soil tilth in one pass. Incorporates green manure, paddy stubble, sugarcane trash, and farmyard manure deep into the soil. Excellent seedbed preparation for turmeric, tapioca, vegetables, and maize.',
    specifications: {
      bladeType: 'Boron Steel L-Type Blades (42 Count)',
      tillingWidth: '5.5 Feet (165 cm)',
      gearDrive: 'Multi-speed side gear drive',
      suitableCrops: 'Turmeric, Maize, Sugarcane, Vegetables'
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-20T16:20:00Z'
  },
  {
    id: 'EQ-06',
    ownerId: 'OWN-106',
    ownerName: 'K. Saravanan',
    ownerPhone: '+91 97881 66320',
    ownerRating: 4.75,
    reviewsCount: 19,
    verifiedOwner: true,
    title: 'National 9-Tyne Spring Loaded Heavy Cultivator + Mahindra 475',
    category: 'cultivator',
    categoryLabel: 'Cultivator',
    brand: 'National Implements',
    model: '9-Tyne Spring Loaded (Heavy)',
    horsepower: 42,
    year: 2022,
    images: [
      '/images/equipment/heavy_spring_cultivator.jpg'
    ],
    price: 700,
    priceUnit: 'hour',
    minBookingDuration: '2 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 6,
    transportFeePerKm: 20,
    location: {
      village: 'Omalur Rural',
      taluk: 'Omalur',
      district: 'Salem',
      state: 'Tamil Nadu',
      pincode: '636455',
      coordinates: { lat: 11.7450, lng: 78.0420 },
      address: 'Near Toll Plaza, Omalur'
    },
    serviceRadiusKm: 30,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '06:00 AM', end: '06:30 PM' },
    status: 'AVAILABLE',
    description: 'Forged high-carbon steel tynes with heavy-duty dual springs. Ideal for primary ploughing, breaking hardpan, aerating soil, and eradicating deep weed roots in rocky and dry red soils.',
    specifications: {
      tyneCount: '9 Tynes with Reversible Shovels',
      frameMaterial: 'Box Section High Tensile Steel',
      workingDepth: '8 to 10 Inches',
      attachmentType: 'Standard 3-Point Category II Hitch'
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-22T08:00:00Z'
  },
  {
    id: 'EQ-07',
    ownerId: 'OWN-107',
    ownerName: 'N. Balasubramanian',
    ownerPhone: '+91 94430 99881',
    ownerRating: 4.9,
    reviewsCount: 31,
    verifiedOwner: true,
    title: 'Pneumatic 9-Row Precision Seed & Fertilizer Drill',
    category: 'seed_drill',
    categoryLabel: 'Seed Drill',
    brand: 'Fieldking',
    model: 'FKSD-9 Automatic Metering',
    horsepower: 45,
    year: 2024,
    images: [
      '/images/equipment/seed_fertilizer_drill.jpg'
    ],
    price: 1100,
    priceUnit: 'acre',
    minBookingDuration: '1 Acre',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 10,
    transportFeePerKm: 25,
    location: {
      village: 'Kangeyam',
      taluk: 'Kangeyam',
      district: 'Tiruppur',
      state: 'Tamil Nadu',
      pincode: '638701',
      coordinates: { lat: 11.0050, lng: 77.5600 },
      address: 'Dharapuram Main Road, Kangeyam'
    },
    serviceRadiusKm: 35,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '06:00 AM', end: '07:00 PM' },
    status: 'AVAILABLE',
    description: 'Precision seed placement with uniform seed-to-seed spacing and depth control. Places DAP/urea fertilizer simultaneously 2 inches below the seed for maximum germination and root uptake. Saves 25% seed cost.',
    specifications: {
      rowCapacity: '9 Adjustable Rows (Spacing 7 to 18 inches)',
      hopperCapacity: 'Seed 60 kg, Fertilizer 65 kg',
      supportedCrops: ['Groundnut', 'Maize', 'Soybean', 'Blackgram', 'Millets'],
      efficiency: '1.2 Acres per hour'
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-25T13:10:00Z'
  },
  {
    id: 'EQ-08',
    ownerId: 'OWN-108',
    ownerName: 'V. Ramamurthy',
    ownerPhone: '+91 98427 44550',
    ownerRating: 4.8,
    reviewsCount: 16,
    verifiedOwner: true,
    title: '10,000 Litre Agri Water Tanker with Tractor High-Pressure Spray Pump',
    category: 'water_tanker',
    categoryLabel: 'Water Tanker & Mist Sprayer',
    brand: 'Mahindra / custom tanker',
    model: 'Heavy Baffle 10,000L with 3-inch Delivery Pump',
    horsepower: 50,
    year: 2023,
    images: [
      '/images/equipment/water_tanker_agri.jpg'
    ],
    price: 1200,
    priceUnit: 'day',
    minBookingDuration: '1 Trip',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 8,
    transportFeePerKm: 30,
    location: {
      village: 'Vijayamangalam',
      taluk: 'Perundurai',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638056',
      coordinates: { lat: 11.2350, lng: 77.4950 },
      address: 'National Highway 544, Vijayamangalam'
    },
    serviceRadiusKm: 25,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '05:30 AM', end: '09:00 PM' },
    status: 'AVAILABLE',
    description: 'Emergency water supply tanker for drought protection, young orchard seedling establishment, nursery irrigation, and bulk farm pond filling. Equipped with 100-metre heavy lay-flat delivery hose and high-pressure spray gun.',
    specifications: {
      capacity: '10,000 Litres (Mild Steel Epoxied Tank)',
      pumpType: 'Tractor PTO Driven High-Pressure Water Pump',
      dischargeRate: '1,000 Litres per minute',
      features: ['Internal anti-surge baffles', '100m Delivery Hose', 'Tractor included']
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-27T15:00:00Z'
  },
  {
    id: 'EQ-09',
    ownerId: 'OWN-109',
    ownerName: 'A. Muthusamy',
    ownerPhone: '+91 98439 77812',
    ownerRating: 4.88,
    reviewsCount: 27,
    verifiedOwner: true,
    title: 'VST Shakti 130 DI Power Tiller (13 HP) with Rotary Tiller & Ridger',
    category: 'power_tiller',
    categoryLabel: 'Power Tiller',
    brand: 'VST Tillers Tractors',
    model: 'Shakti 130 DI (13 HP)',
    horsepower: 13,
    year: 2023,
    images: [
      '/images/equipment/power_tiller_farm.jpg'
    ],
    price: 450,
    priceUnit: 'hour',
    minBookingDuration: '3 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 5,
    transportFeePerKm: 20,
    location: {
      village: 'Pollachi Rural',
      taluk: 'Pollachi',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '642001',
      coordinates: { lat: 10.6580, lng: 77.0080 },
      address: 'Udumalpet Road, Pollachi'
    },
    serviceRadiusKm: 18,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '06:00 AM', end: '06:30 PM' },
    status: 'AVAILABLE',
    description: 'Compact, fuel-efficient walk-behind power tiller with operator. Outstanding performance for inter-cultivation inside coconut groves, banana plantations, vegetable raised beds, and wet terrace paddy puddling.',
    specifications: {
      engine: '13 HP Direct Injection Diesel',
      tillingWidth: '600 mm (Side-drive rotavator)',
      weight: '480 kg (Light on wet mud)',
      attachmentsIncluded: ['Rotary Tiller Blades', 'Furrow Ridger', 'Trailer hitch']
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-28T09:40:00Z'
  },
  {
    id: 'EQ-10',
    ownerId: 'OWN-110',
    ownerName: 'S. Karthik (Coimbatore Agro-Drone)',
    ownerPhone: '+91 97910 88319',
    ownerRating: 4.95,
    reviewsCount: 64,
    verifiedOwner: true,
    title: 'IoTechWorld AGRIBOT Agricultural Drone (10L Precision Foliar Sprayer)',
    category: 'drone',
    categoryLabel: 'Agri Drone Sprayer',
    brand: 'IoTechWorld',
    model: 'AGRIBOT Hexacopter',
    horsepower: 0,
    year: 2024,
    images: [
      '/images/equipment/agri_drone_sprayer.jpg'
    ],
    price: 450,
    priceUnit: 'acre',
    minBookingDuration: '2 Acres',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 15,
    transportFeePerKm: 20,
    location: {
      village: 'Coimbatore Agri-Corridor',
      taluk: 'Coimbatore North',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641003',
      coordinates: { lat: 11.0168, lng: 76.9558 },
      address: 'Near TNAU Gate, Marudhamalai Road'
    },
    serviceRadiusKm: 50,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '06:00 AM', end: '11:00 AM' },
    status: 'AVAILABLE',
    description: 'DGCA Certified Remote Drone Pilot. Precision foliar spraying of organic bio-fertilizers, micronutrients, neem oil, and pest control. Spray 1 acre in just 7 minutes with zero crop damage and 90% water saving.',
    specifications: {
      payloadTank: '10 Litre Chemical / Micronutrient Tank',
      nozzles: '4 Micron Rotary Atomizers (100-200 micron droplet)',
      flightTime: '20 mins per battery set (4 sets included)',
      coverageSpeed: '25 to 30 Acres per day'
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-08-30T07:20:00Z'
  },
  {
    id: 'EQ-11',
    ownerId: 'OWN-111',
    ownerName: 'D. Selvaraj',
    ownerPhone: '+91 94435 22109',
    ownerRating: 4.82,
    reviewsCount: 14,
    verifiedOwner: true,
    title: 'Lemken Opal 080 2-Bottom Hydraulic Reversible Mouldboard Plough',
    category: 'plough',
    categoryLabel: 'Plough',
    brand: 'Lemken',
    model: 'Opal 080 Hydraulic Reversible',
    horsepower: 50,
    year: 2023,
    images: [
      '/images/equipment/mouldboard_plough.jpg'
    ],
    price: 1050,
    priceUnit: 'hour',
    minBookingDuration: '2 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 8,
    transportFeePerKm: 25,
    location: {
      village: 'Udumalaipettai Rural',
      taluk: 'Udumalaipettai',
      district: 'Tiruppur',
      state: 'Tamil Nadu',
      pincode: '642126',
      coordinates: { lat: 10.5820, lng: 77.2480 },
      address: 'Dharapuram Highway, Udumalaipettai'
    },
    serviceRadiusKm: 30,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '06:00 AM', end: '07:00 PM' },
    status: 'AVAILABLE',
    description: 'German engineered Lemken reversible MB plough. Inverts topsoil completely up to 14 inches depth, burying weeds and crop residues while bringing up nutrient-rich subsoil without creating side furrows.',
    specifications: {
      ploughBodies: '2 Furrow Reversible Bodies (Dual share points)',
      hydraulicReversal: 'Direct tractor dual-spool hydraulic flip',
      workingDepth: '10 to 14 Inches (250-350 mm)',
      powerRequired: '45 to 60 HP Tractor'
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'EQ-12',
    ownerId: 'OWN-112',
    ownerName: 'T. Duraisamy',
    ownerPhone: '+91 98421 99182',
    ownerRating: 4.9,
    reviewsCount: 35,
    verifiedOwner: true,
    title: 'Mahindra Yuvo Tech+ 585 4WD (49 HP) with Front End Loader Bucket',
    category: 'tractor',
    categoryLabel: 'Tractor',
    brand: 'Mahindra & Mahindra',
    model: 'Yuvo Tech+ 585 4WD + Front Loader',
    horsepower: 49,
    year: 2024,
    images: [
      '/images/equipment/mahindra_front_loader.jpg'
    ],
    price: 1150,
    priceUnit: 'hour',
    minBookingDuration: '2 Hours',
    operatorCharges: 'INCLUDED',
    operatorFee: 0,
    transportCharges: 'FREE_LOCAL',
    freeRadiusKm: 8,
    transportFeePerKm: 30,
    location: {
      village: 'Surampatti',
      taluk: 'Erode',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638009',
      coordinates: { lat: 11.3200, lng: 77.7200 },
      address: 'Namakkal Highway, Surampatti, Erode'
    },
    serviceRadiusKm: 30,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: { start: '06:00 AM', end: '08:00 PM' },
    status: 'AVAILABLE',
    description: 'Heavy 4WD tractor equipped with hydraulic front bucket loader for rapid manure loading, compost spreading, farm levelling, and soil transport. Cuts manual loading labor cost by 80%.',
    specifications: {
      engine: '49 HP 4-Cylinder mZip Engine',
      loaderCapacity: '750 kg bucket payload capacity',
      dumpHeight: '10.5 Feet (loads directly into tipper lorries)',
      transmission: '12 Forward + 3 Reverse Shuttle Shift'
    },
    flagged: false,
    reportsCount: 0,
    createdAt: '2026-09-02T10:30:00Z'
  }
];

export const CATEGORY_DEFAULT_IMAGES = {
  tractor: '/images/equipment/tractor_mahindra_rotavator.jpg',
  jcb: '/images/equipment/jcb_3dx_backhoe.jpg',
  harvester: '/images/equipment/combine_paddy_harvester.jpg',
  rotavator: '/images/equipment/rotavator_swaraj.jpg',
  cultivator: '/images/equipment/heavy_spring_cultivator.jpg',
  seed_drill: '/images/equipment/seed_fertilizer_drill.jpg',
  water_tanker: '/images/equipment/water_tanker_agri.jpg',
  power_tiller: '/images/equipment/power_tiller_farm.jpg',
  drone: '/images/equipment/agri_drone_sprayer.jpg',
  plough: '/images/equipment/mouldboard_plough.jpg'
};

export const EQUIPMENT_PHOTO_PRESETS = [
  {
    category: 'tractor',
    title: 'Mahindra 575 DI with Rotavator',
    url: '/images/equipment/tractor_mahindra_rotavator.jpg'
  },
  {
    category: 'tractor',
    title: 'John Deere 5310 4WD Heavy Tractor',
    url: '/images/equipment/johndeere_cultivator.jpg'
  },
  {
    category: 'tractor',
    title: 'Mahindra 4WD with Front Loader Bucket',
    url: '/images/equipment/mahindra_front_loader.jpg'
  },
  {
    category: 'jcb',
    title: 'JCB 3DX Super Backhoe Loader',
    url: '/images/equipment/jcb_3dx_backhoe.jpg'
  },
  {
    category: 'harvester',
    title: 'Combine Paddy Harvester in Field',
    url: '/images/equipment/combine_paddy_harvester.jpg'
  },
  {
    category: 'rotavator',
    title: 'Swaraj Tractor + Shaktiman Rotavator',
    url: '/images/equipment/rotavator_swaraj.jpg'
  },
  {
    category: 'cultivator',
    title: 'National 9-Tyne Spring Cultivator',
    url: '/images/equipment/heavy_spring_cultivator.jpg'
  },
  {
    category: 'seed_drill',
    title: 'Precision Seed & Fertilizer Planter Drill',
    url: '/images/equipment/seed_fertilizer_drill.jpg'
  },
  {
    category: 'water_tanker',
    title: '10,000L Agri Water Tanker with Spray Pump',
    url: '/images/equipment/water_tanker_agri.jpg'
  },
  {
    category: 'power_tiller',
    title: 'VST Shakti 130 DI Walk-Behind Power Tiller',
    url: '/images/equipment/power_tiller_farm.jpg'
  },
  {
    category: 'drone',
    title: 'IoTechWorld Precision Agri Drone Sprayer',
    url: '/images/equipment/agri_drone_sprayer.jpg'
  },
  {
    category: 'plough',
    title: 'Hydraulic Reversible Mouldboard Plough',
    url: '/images/equipment/mouldboard_plough.jpg'
  }
];

export const TN_LOCATION_COORDINATES = {
  // Erode District
  'Perundurai': { lat: 11.2782, lng: 77.5854, district: 'Erode' },
  'Erode': { lat: 11.3410, lng: 77.7172, district: 'Erode' },
  'Bhavani': { lat: 11.4485, lng: 77.6830, district: 'Erode' },
  'Gobichettipalayam': { lat: 11.4550, lng: 77.4420, district: 'Erode' },
  'Chennimalai': { lat: 11.1685, lng: 77.6120, district: 'Erode' },
  'Sathyamangalam': { lat: 11.5034, lng: 77.2344, district: 'Erode' },
  'Kodumudi': { lat: 11.0800, lng: 77.8800, district: 'Erode' },
  'Anthiyur': { lat: 11.5800, lng: 77.5900, district: 'Erode' },

  // Coimbatore District
  'Coimbatore': { lat: 11.0168, lng: 76.9558, district: 'Coimbatore' },
  'Pollachi': { lat: 10.6580, lng: 77.0080, district: 'Coimbatore' },
  'Mettupalayam': { lat: 11.3000, lng: 76.9400, district: 'Coimbatore' },
  'Sulur': { lat: 11.0250, lng: 77.1250, district: 'Coimbatore' },
  'Annur': { lat: 11.2330, lng: 77.1830, district: 'Coimbatore' },

  // Tiruppur District
  'Tiruppur': { lat: 11.1085, lng: 77.3411, district: 'Tiruppur' },
  'Kangeyam': { lat: 11.0050, lng: 77.5600, district: 'Tiruppur' },
  'Dharapuram': { lat: 10.7300, lng: 77.5200, district: 'Tiruppur' },
  'Udumalaipettai': { lat: 10.5820, lng: 77.2480, district: 'Tiruppur' },
  'Palladam': { lat: 10.9980, lng: 77.2880, district: 'Tiruppur' },

  // Salem District
  'Salem': { lat: 11.6643, lng: 78.1460, district: 'Salem' },
  'Omalur': { lat: 11.7450, lng: 78.0420, district: 'Salem' },
  'Attur': { lat: 11.5970, lng: 78.5990, district: 'Salem' },
  'Mettur': { lat: 11.7950, lng: 77.8000, district: 'Salem' },
  'Sankari': { lat: 11.4850, lng: 77.8700, district: 'Salem' },

  // Namakkal District
  'Namakkal': { lat: 11.2189, lng: 78.1674, district: 'Namakkal' },
  'Tiruchengode': { lat: 11.3780, lng: 77.8960, district: 'Namakkal' },
  'Rasipuram': { lat: 11.4640, lng: 78.1750, district: 'Namakkal' },
  'Paramathi Velur': { lat: 11.0500, lng: 78.0100, district: 'Namakkal' },

  // Thanjavur & Delta
  'Thanjavur': { lat: 10.7867, lng: 79.1378, district: 'Thanjavur' },
  'Kumbakonam': { lat: 10.9602, lng: 79.3845, district: 'Thanjavur' },
  'Papanasam': { lat: 10.9250, lng: 79.2750, district: 'Thanjavur' },
  'Pattukkottai': { lat: 10.4300, lng: 79.3200, district: 'Thanjavur' },

  // Madurai District
  'Madurai': { lat: 9.9252, lng: 78.1198, district: 'Madurai' },
  'Melur': { lat: 10.0500, lng: 78.3300, district: 'Madurai' },
  'Usilampatti': { lat: 9.9700, lng: 77.7900, district: 'Madurai' },
  'Vadipatti': { lat: 10.0800, lng: 78.0200, district: 'Madurai' },

  // Tiruchirappalli
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047, district: 'Tiruchirappalli' },
  'Lalgudi': { lat: 10.8700, lng: 78.8200, district: 'Tiruchirappalli' },
  'Musiri': { lat: 10.9400, lng: 78.4500, district: 'Tiruchirappalli' },
  'Manapparai': { lat: 10.6100, lng: 78.4200, district: 'Tiruchirappalli' }
};
