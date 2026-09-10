// Centralized Realistic Indian Agriculture Mock Data for Farmogram AI (SIH Prototype)

export const currentUser = {
  id: "usr_01",
  name: "Murugan K.",
  phone: "+91 98421 76540",
  email: "murugan.farm@example.in",
  village: "Perundurai",
  district: "Erode",
  state: "Tamil Nadu",
  landArea: "4.5", // Acres
  primaryCrops: ["Tomato", "Turmeric", "Paddy"],
  soilType: "Red Loam",
  waterSource: "Drip Irrigation + Borewell",
  language: "English (Tamil native)",
  avatar: null,
  bio: "Progressive farmer adopting precision drip irrigation and natural pest management practices. Cultivating since 2011.",
  verified: false,
  role: "farmer" // 'farmer' | 'admin'
};

export const currentFarmerStats = {
  postsCount: 14,
  savedCount: 23,
  questionsCount: 7,
  recommendationsCount: 9,
  acresCultivated: 4.5,
  yieldEfficiency: "94%"
};

export const currentCropSeason = "Kharif / Samba (2026)";

export const soilTypes = [
  { id: "red_loam", name: "Red Loam", description: "Good aeration and porous structure, ideal for groundnut, pulses, and vegetables with regulated drip." },
  { id: "clayey_alluvial", name: "Clayey Alluvial", description: "High moisture retention and nutrient capacity, optimal for wetland paddy and sugarcane." },
  { id: "black_cotton", name: "Black Cotton Soil (Regur)", description: "High clay content and self-ploughing nature, well-suited for cotton, maize, and chillies." },
  { id: "sandy_loam", name: "Sandy Loam", description: "Rapid drainage and light texture, excellent for tubers, root crops, watermelon, and drip-irrigated tomatoes." },
  { id: "laterite", name: "Laterite Soil", description: "Porous and acidic, suitable for plantation crops, banana, and cashew with organic soil conditioning." }
];

export const locations = [
  "Coimbatore",
  "Erode",
  "Salem",
  "Madurai",
  "Thanjavur",
  "Tiruchirappalli",
  "Dindigul",
  "Theni"
];

export const cropsList = [
  "Paddy",
  "Tomato",
  "Groundnut",
  "Sugarcane",
  "Cotton",
  "Banana",
  "Maize",
  "Turmeric"
];

export const seasonsList = [
  "Kharif / Samba (Jun - Nov)",
  "Rabi / Thaladi (Oct - Feb)",
  "Zaid / Navarai Summer (Feb - May)"
];

export const waterAvailabilityList = [
  "Abundant (Canal + High Borewell Yield)",
  "Moderate (Seasonal Well / Scheduled Borewell)",
  "Limited / Rainfed Only"
];

export const weatherData = {
  location: "Coimbatore, Tamil Nadu",
  currentTemp: 29,
  feelsLike: 31,
  condition: "Partly Cloudy",
  icon: "CloudSun",
  humidity: 74,
  windSpeed: 14,
  windDirection: "NW",
  rainfallProbability: 65,
  uvIndex: "Moderate (5)",
  soilMoisture: "Adequate (62%)",
  advisoryAlert: {
    type: "warning",
    title: "Rain Expected Tomorrow Afternoon",
    message: "Rain expected tomorrow (35-45mm). Hold pesticide spraying and check drainage channels in low-lying plots to avoid waterlogging.",
    urgency: "High"
  },
  forecast7Day: [
    { day: "Today", date: "Sep 4", tempMax: 30, tempMin: 22, condition: "Partly Cloudy", rainProb: 20, advisory: "Ideal for soil bed preparation & manual weeding." },
    { day: "Fri", date: "Sep 5", tempMax: 27, tempMin: 21, condition: "Heavy Showers", rainProb: 85, advisory: "Avoid pesticide/foliar spraying. Ensure drainage." },
    { day: "Sat", date: "Sep 6", tempMax: 28, tempMin: 22, condition: "Scattered Rain", rainProb: 60, advisory: "Delay irrigation; soil moisture will remain high." },
    { day: "Sun", date: "Sep 7", tempMax: 31, tempMin: 23, condition: "Sunny / Clear", rainProb: 15, advisory: "Optimal for fertilizer top-dressing after rain settles." },
    { day: "Mon", date: "Sep 8", tempMax: 32, tempMin: 23, condition: "Clear Sky", rainProb: 10, advisory: "Check field moisture; schedule light drip cycle." },
    { day: "Tue", date: "Sep 9", tempMax: 31, tempMin: 22, condition: "Passing Clouds", rainProb: 25, advisory: "Good window for intercultural hoeing." },
    { day: "Wed", date: "Sep 10", tempMax: 30, tempMin: 22, condition: "Partly Cloudy", rainProb: 30, advisory: "Monitor groundnut plots for early fungal signs." }
  ]
};

export const initialFeedPosts = [
  {
    id: "post_1",
    author: {
      name: "Murugan K.",
      role: "Farmer",
      location: "Perundurai, Erode",
      avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&auto=format&fit=crop&q=80",
      verified: false
    },
    crop: "Tomato",
    category: "Irrigation & Water Saving",
    timestamp: "2 hours ago",
    title: "Successful tomato cultivation using drip irrigation & plastic mulching",
    content: "Sharing our 4th harvest cycle of Shivam F1 tomato in Erode. By adopting 25-micron silver-black mulching film and inline drip fertigation (NPK 19:19:19), we reduced irrigation water use by 42% and weed growth was practically zero! Yield reached 28 tonnes per acre with excellent firmness for export.",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80", caption: "Drip Vine Growth" },
      { url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&auto=format&fit=crop&q=80", caption: "Mulched Raised Bed" },
      { url: "https://images.unsplash.com/photo-1546470427-227c7369a47d?w=800&auto=format&fit=crop&q=80", caption: "Firm Grade-A Harvest" }
    ],
    likes: 142,
    isLiked: false,
    saves: 38,
    isSaved: false,
    commentsCount: 24,
    comments: [
      { id: "c1", user: "Gopal V.", text: "What was your row-to-row spacing for the mulching bed?", time: "1 hour ago" },
      { id: "c2", user: "Murugan K.", text: "We kept 4.5 feet between bed centers and 1.5 feet plant-to-plant on a zigzag layout.", time: "45 mins ago" }
    ],
    tags: ["Tomato", "DripIrrigation", "Mulching", "ErodeFarmers"]
  },
  {
    id: "post_2",
    author: {
      name: "Dr. K. Soundararajan",
      role: "Senior Agronomist (TNAU)",
      location: "Coimbatore",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
      verified: true
    },
    crop: "Groundnut",
    category: "Pest & Disease Advisory",
    timestamp: "5 hours ago",
    title: "Groundnut Alert: Early Season Tikka Leaf Spot & Leaf Miner identification",
    content: "Field surveys across Coimbatore and Tirupur reveal initial circular necrotic spots surrounded by yellow chlorotic halos on lower foliage of 35-day groundnut crops. Do not delay action. Recommended control: Spray Mancozeb 75% WP @ 2g/liter or Neem Seed Kernel Extract (NSKE 5%) during morning hours before afternoon showers.",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80", caption: "Field Foliage Survey" },
      { url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80", caption: "Lower Foliage Check" },
      { url: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=800&auto=format&fit=crop&q=80", caption: "Healthy Groundnut Pods" }
    ],
    likes: 289,
    isLiked: false,
    saves: 94,
    isSaved: false,
    commentsCount: 36,
    comments: [
      { id: "c3", user: "Senthil Kumar", text: "Sir, does spraying right before rain wash it away?", time: "3 hours ago" },
      { id: "c4", user: "Dr. K. Soundararajan", text: "Yes! Add a wetting agent (sticker/spreader 0.5ml/L) and ensure at least a 3-hour rain-free window.", time: "2 hours ago" }
    ],
    tags: ["Groundnut", "TNAUAdvisory", "DiseaseAlert", "PestManagement"]
  },
  {
    id: "post_3",
    author: {
      name: "Arumugam V.",
      role: "Progressive Paddy Farmer",
      location: "Thiruvaiyaru, Thanjavur",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
      verified: true
    },
    crop: "Paddy",
    category: "Best Practices",
    timestamp: "Yesterday",
    title: "Samba Paddy SRI Technique: Achieving 40+ productive tillers per hill",
    content: "Transitioned 3 acres to Modified System of Rice Intensification (SRI) using CR 1009 Sub 1 variety. Transplanting 14-day single seedlings at 25x25 cm with cono-weeder passes at day 10, 20, and 30 aerated the soil tremendously. Panicle initiation is uniform and root mass is double compared to flood method.",
    image: `${import.meta.env.BASE_URL}images/posts/tn_paddy_field.jpg`,
    images: [
      { url: `${import.meta.env.BASE_URL}images/posts/tn_paddy_field.jpg`, caption: "Thanjavur Delta Field" },
      { url: `${import.meta.env.BASE_URL}images/posts/tn_paddy_seedlings.jpg`, caption: "SRI Green Seedlings" },
      { url: `${import.meta.env.BASE_URL}images/posts/tn_paddy_panicles.jpg`, caption: "Golden Panicles" }
    ],
    likes: 312,
    isLiked: false,
    saves: 110,
    isSaved: false,
    commentsCount: 42,
    comments: [],
    tags: ["Paddy", "SRIMethod", "ThanjavurDelta", "WaterConservation"]
  },
  {
    id: "post_4",
    author: {
      name: "Kavitha Rajendran",
      role: "Organic Grower",
      location: "Omalur, Salem",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
      verified: false
    },
    crop: "Turmeric",
    category: "Natural Farming",
    timestamp: "2 days ago",
    title: "Natural farming experience: Jeevamrutham application in Erode Local Turmeric",
    content: "Applied fermented Jeevamrutham through venturi injector every 15 days along with border crops of marigold and maize. Not a single chemical pesticide used this season. Rhizome development is thick with vibrant orange core. Zero chemical residue test report received!",
    image: `${import.meta.env.BASE_URL}images/posts/tn_turmeric_farm.jpg`,
    images: [
      { url: `${import.meta.env.BASE_URL}images/posts/tn_turmeric_farm.jpg`, caption: "Erode Turmeric Farm" },
      { url: `${import.meta.env.BASE_URL}images/posts/tn_turmeric_rhizome.jpg`, caption: "Fresh Orange Rhizome" },
      { url: `${import.meta.env.BASE_URL}images/posts/tn_turmeric_harvest.jpg`, caption: "Farmer Harvest Cluster" }
    ],
    likes: 198,
    isLiked: false,
    saves: 65,
    isSaved: false,
    commentsCount: 19,
    comments: [],
    tags: ["Turmeric", "NaturalFarming", "SalemOrganic", "ZeroBudget"]
  }
];

export const reelsData = [
  {
    id: "reel_1",
    title: "3 Drip Irrigation Mistakes Every Farmer Makes",
    creator: "Er. Ramesh Agritech",
    verified: true,
    crop: "All Crops",
    category: "Irrigation",
    location: "Coimbatore",
    views: "24.5K",
    likes: "1.8K",
    duration: "0:45",
    thumbnail: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
    description: "Flushing sub-mains weekly and acid treatment for salt deposits will double emitter life."
  },
  {
    id: "reel_2",
    title: "Quick Test: Is Your Tomato Infected with Early Blight?",
    creator: "Dr. Soundararajan (TNAU)",
    verified: true,
    crop: "Tomato",
    category: "Pest Control",
    location: "TNAU Campus",
    views: "42.1K",
    likes: "3.4K",
    duration: "0:58",
    thumbnail: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
    description: "Notice target-board concentric rings on the lower third foliage before yellowing spreads."
  },
  {
    id: "reel_3",
    title: "Groundnut Pod Filling Secret: Gypsum Application Timing",
    creator: "Balasubramaniam",
    verified: false,
    crop: "Groundnut",
    category: "Crop Tips",
    location: "Erode",
    views: "18.9K",
    likes: "1.2K",
    duration: "0:50",
    thumbnail: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
    description: "Apply 200 kg gypsum per acre strictly at 40-45 DAS along with earthing up for plump pods."
  },
  {
    id: "reel_4",
    title: "Harvesting Sugarcane at Peak Brix: Refractometer Demo",
    creator: "Sakthi Sugar Cane Cell",
    verified: true,
    crop: "Sugarcane",
    category: "Harvesting",
    location: "Appakudal",
    views: "15.3K",
    likes: "890",
    duration: "0:42",
    thumbnail: "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=600&auto=format&fit=crop&q=80",
    description: "Field refractometer brix above 19-20 ensures maximum sucrose recovery and highest mill price."
  },
  {
    id: "reel_5",
    title: "Paddy Straw Mushroom Cultivation in 15 Days",
    creator: "Malar Organic Farm",
    verified: false,
    crop: "Paddy",
    category: "Organic Farming",
    location: "Madurai",
    views: "31.2K",
    likes: "2.7K",
    duration: "0:55",
    thumbnail: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80",
    description: "Turn post-harvest paddy stubble into ₹500/day supplemental farm revenue with zero waste."
  },
  {
    id: "reel_6",
    title: "How to Read Live Mandi Rates Before Selling",
    creator: "Farmogram Advisory",
    verified: true,
    crop: "Market Tips",
    category: "Market Tips",
    location: "Tamil Nadu",
    views: "55.8K",
    likes: "4.9K",
    duration: "0:48",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
    description: "Always compare 3 adjacent mandis. Morning arrivals peak at 6:30 AM determines pricing power."
  }
];

export const marketCommodities = [
  {
    "id": "mkt_1",
    "commodity": "Paddy",
    "variety": "ADT 43",
    "mandi": "Thanjavur Regur APMC",
    "district": "Thanjavur",
    "currentPrice": 2156,
    "previousPrice": 2048,
    "changePercent": 5.3,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 92.5,
    "minPrice": 1999,
    "maxPrice": 2156,
    "history": [
      2025,
      2013,
      2060,
      1999,
      2017,
      2156
    ]
  },
  {
    "id": "mkt_2",
    "commodity": "Paddy",
    "variety": "BPT 5204",
    "mandi": "Coimbatore Central Market",
    "district": "Coimbatore",
    "currentPrice": 2503,
    "previousPrice": 2428,
    "changePercent": 3.1,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 94.7,
    "minPrice": 2319,
    "maxPrice": 2509,
    "history": [
      2319,
      2344,
      2443,
      2509,
      2458,
      2503
    ]
  },
  {
    "id": "mkt_3",
    "commodity": "Paddy",
    "variety": "Ponni",
    "mandi": "Salem Regulated Market",
    "district": "Salem",
    "currentPrice": 2500,
    "previousPrice": 2697,
    "changePercent": -7.3,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 59.2,
    "minPrice": 2500,
    "maxPrice": 2816,
    "history": [
      2816,
      2730,
      2562,
      2736,
      2788,
      2500
    ]
  },
  {
    "id": "mkt_4",
    "commodity": "Paddy",
    "variety": "BPT 5204",
    "mandi": "Theni Regulated Market",
    "district": "Theni",
    "currentPrice": 2074,
    "previousPrice": 2216,
    "changePercent": -6.4,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 144.2,
    "minPrice": 2074,
    "maxPrice": 2325,
    "history": [
      2324,
      2325,
      2172,
      2241,
      2321,
      2074
    ]
  },
  {
    "id": "mkt_5",
    "commodity": "Paddy",
    "variety": "BPT 5204",
    "mandi": "Erode Central Market",
    "district": "Erode",
    "currentPrice": 2427,
    "previousPrice": 2440,
    "changePercent": -0.5,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 53.4,
    "minPrice": 2391,
    "maxPrice": 2528,
    "history": [
      2528,
      2391,
      2448,
      2398,
      2404,
      2427
    ]
  },
  {
    "id": "mkt_6",
    "commodity": "Tomato",
    "variety": "Hybrid Shivam",
    "mandi": "Salem Regur APMC",
    "district": "Salem",
    "currentPrice": 2618,
    "previousPrice": 2636,
    "changePercent": -0.7,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 81.5,
    "minPrice": 2509,
    "maxPrice": 2754,
    "history": [
      2703,
      2754,
      2570,
      2509,
      2548,
      2618
    ]
  },
  {
    "id": "mkt_7",
    "commodity": "Tomato",
    "variety": "Hybrid Shivam",
    "mandi": "Erode Main Mandi",
    "district": "Erode",
    "currentPrice": 2739,
    "previousPrice": 2764,
    "changePercent": -0.9,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 58.3,
    "minPrice": 2635,
    "maxPrice": 2836,
    "history": [
      2662,
      2714,
      2635,
      2836,
      2674,
      2739
    ]
  },
  {
    "id": "mkt_8",
    "commodity": "Tomato",
    "variety": "Local",
    "mandi": "Thanjavur Uzhavar Sandhai",
    "district": "Thanjavur",
    "currentPrice": 2739,
    "previousPrice": 2925,
    "changePercent": -6.4,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 20.4,
    "minPrice": 2739,
    "maxPrice": 2980,
    "history": [
      2877,
      2834,
      2809,
      2856,
      2980,
      2739
    ]
  },
  {
    "id": "mkt_9",
    "commodity": "Tomato",
    "variety": "Hybrid Shivam",
    "mandi": "Theni Central Market",
    "district": "Theni",
    "currentPrice": 2600,
    "previousPrice": 2707,
    "changePercent": -4,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 118.6,
    "minPrice": 2574,
    "maxPrice": 2800,
    "history": [
      2574,
      2642,
      2644,
      2598,
      2800,
      2600
    ]
  },
  {
    "id": "mkt_10",
    "commodity": "Groundnut",
    "variety": "TMV 7",
    "mandi": "Madurai Uzhavar Sandhai",
    "district": "Madurai",
    "currentPrice": 6520,
    "previousPrice": 6369,
    "changePercent": 2.4,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 144.9,
    "minPrice": 6127,
    "maxPrice": 6520,
    "history": [
      6302,
      6286,
      6127,
      6483,
      6227,
      6520
    ]
  },
  {
    "id": "mkt_11",
    "commodity": "Groundnut",
    "variety": "TMV 7",
    "mandi": "Salem Main Mandi",
    "district": "Salem",
    "currentPrice": 6804,
    "previousPrice": 7093,
    "changePercent": -4.1,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 34.9,
    "minPrice": 6804,
    "maxPrice": 7336,
    "history": [
      7227,
      7200,
      7063,
      7336,
      6972,
      6804
    ]
  },
  {
    "id": "mkt_12",
    "commodity": "Groundnut",
    "variety": "TMV 7",
    "mandi": "Erode Central Market",
    "district": "Erode",
    "currentPrice": 6931,
    "previousPrice": 7278,
    "changePercent": -4.8,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 84.1,
    "minPrice": 6931,
    "maxPrice": 7633,
    "history": [
      7489,
      7227,
      7563,
      7546,
      7633,
      6931
    ]
  },
  {
    "id": "mkt_13",
    "commodity": "Groundnut",
    "variety": "TMV 7",
    "mandi": "Tiruchirappalli Uzhavar Sandhai",
    "district": "Tiruchirappalli",
    "currentPrice": 6174,
    "previousPrice": 6599,
    "changePercent": -6.4,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 81.5,
    "minPrice": 6174,
    "maxPrice": 6880,
    "history": [
      6808,
      6880,
      6452,
      6410,
      6601,
      6174
    ]
  },
  {
    "id": "mkt_14",
    "commodity": "Groundnut",
    "variety": "VRI 8",
    "mandi": "Theni Regulated Market",
    "district": "Theni",
    "currentPrice": 7128,
    "previousPrice": 7139,
    "changePercent": -0.2,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 120,
    "minPrice": 7068,
    "maxPrice": 7428,
    "history": [
      7428,
      7221,
      7068,
      7280,
      7129,
      7128
    ]
  },
  {
    "id": "mkt_15",
    "commodity": "Sugarcane",
    "variety": "CO 86032",
    "mandi": "Madurai Regur APMC",
    "district": "Madurai",
    "currentPrice": 327,
    "previousPrice": 305,
    "changePercent": 7.2,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 103.5,
    "minPrice": 290,
    "maxPrice": 327,
    "history": [
      290,
      314,
      300,
      298,
      295,
      327
    ]
  },
  {
    "id": "mkt_16",
    "commodity": "Sugarcane",
    "variety": "CO 0238",
    "mandi": "Coimbatore Central Market",
    "district": "Coimbatore",
    "currentPrice": 325,
    "previousPrice": 331,
    "changePercent": -1.8,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 97.7,
    "minPrice": 318,
    "maxPrice": 346,
    "history": [
      331,
      327,
      324,
      346,
      318,
      325
    ]
  },
  {
    "id": "mkt_17",
    "commodity": "Sugarcane",
    "variety": "CO 0238",
    "mandi": "Theni Regur APMC",
    "district": "Theni",
    "currentPrice": 313,
    "previousPrice": 326,
    "changePercent": -4,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 55.6,
    "minPrice": 310,
    "maxPrice": 325,
    "history": [
      323,
      310,
      316,
      325,
      325,
      313
    ]
  },
  {
    "id": "mkt_18",
    "commodity": "Sugarcane",
    "variety": "CO 86032",
    "mandi": "Salem Main Mandi",
    "district": "Salem",
    "currentPrice": 296,
    "previousPrice": 281,
    "changePercent": 5.3,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 91.6,
    "minPrice": 271,
    "maxPrice": 296,
    "history": [
      275,
      288,
      291,
      283,
      271,
      296
    ]
  },
  {
    "id": "mkt_19",
    "commodity": "Cotton",
    "variety": "Surabhi",
    "mandi": "Coimbatore Regulated Market",
    "district": "Coimbatore",
    "currentPrice": 7322,
    "previousPrice": 7729,
    "changePercent": -5.3,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 50.7,
    "minPrice": 7322,
    "maxPrice": 7976,
    "history": [
      7488,
      7825,
      7718,
      7829,
      7976,
      7322
    ]
  },
  {
    "id": "mkt_20",
    "commodity": "Cotton",
    "variety": "Surabhi",
    "mandi": "Erode Central Market",
    "district": "Erode",
    "currentPrice": 7773,
    "previousPrice": 7275,
    "changePercent": 6.8,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 49.7,
    "minPrice": 7032,
    "maxPrice": 7773,
    "history": [
      7032,
      7362,
      7331,
      7375,
      7632,
      7773
    ]
  },
  {
    "id": "mkt_21",
    "commodity": "Cotton",
    "variety": "MCU 5",
    "mandi": "Salem Central Market",
    "district": "Salem",
    "currentPrice": 6908,
    "previousPrice": 6897,
    "changePercent": 0.2,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 24.2,
    "minPrice": 6555,
    "maxPrice": 7129,
    "history": [
      7129,
      6684,
      7126,
      6811,
      6555,
      6908
    ]
  },
  {
    "id": "mkt_22",
    "commodity": "Cotton",
    "variety": "MCU 5",
    "mandi": "Thanjavur Main Mandi",
    "district": "Thanjavur",
    "currentPrice": 7883,
    "previousPrice": 7896,
    "changePercent": -0.2,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 109.4,
    "minPrice": 7546,
    "maxPrice": 7994,
    "history": [
      7977,
      7563,
      7546,
      7994,
      7793,
      7883
    ]
  },
  {
    "id": "mkt_23",
    "commodity": "Cotton",
    "variety": "MCU 5",
    "mandi": "Theni Regulated Market",
    "district": "Theni",
    "currentPrice": 7104,
    "previousPrice": 6666,
    "changePercent": 6.6,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 56.1,
    "minPrice": 6382,
    "maxPrice": 7104,
    "history": [
      6382,
      6424,
      6880,
      6684,
      6528,
      7104
    ]
  },
  {
    "id": "mkt_24",
    "commodity": "Banana",
    "variety": "Grand Naine",
    "mandi": "Madurai Uzhavar Sandhai",
    "district": "Madurai",
    "currentPrice": 2092,
    "previousPrice": 2049,
    "changePercent": 2.1,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 85.2,
    "minPrice": 1981,
    "maxPrice": 2131,
    "history": [
      2111,
      2098,
      2131,
      2108,
      1981,
      2092
    ]
  },
  {
    "id": "mkt_25",
    "commodity": "Banana",
    "variety": "Grand Naine",
    "mandi": "Erode Regulated Market",
    "district": "Erode",
    "currentPrice": 2231,
    "previousPrice": 2350,
    "changePercent": -5.1,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 139.4,
    "minPrice": 2231,
    "maxPrice": 2453,
    "history": [
      2288,
      2279,
      2321,
      2316,
      2453,
      2231
    ]
  },
  {
    "id": "mkt_26",
    "commodity": "Banana",
    "variety": "Rasthali",
    "mandi": "Dindigul Central Market",
    "district": "Dindigul",
    "currentPrice": 2037,
    "previousPrice": 1904,
    "changePercent": 7,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 100.2,
    "minPrice": 1826,
    "maxPrice": 2037,
    "history": [
      1826,
      1975,
      1873,
      1907,
      1937,
      2037
    ]
  },
  {
    "id": "mkt_27",
    "commodity": "Banana",
    "variety": "Poovan",
    "mandi": "Coimbatore Main Mandi",
    "district": "Coimbatore",
    "currentPrice": 2034,
    "previousPrice": 1989,
    "changePercent": 2.3,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 54.7,
    "minPrice": 1907,
    "maxPrice": 2071,
    "history": [
      1944,
      1967,
      2071,
      1970,
      1907,
      2034
    ]
  },
  {
    "id": "mkt_28",
    "commodity": "Maize",
    "variety": "Yellow Feed Grade",
    "mandi": "Theni Central Market",
    "district": "Theni",
    "currentPrice": 2454,
    "previousPrice": 2415,
    "changePercent": 1.6,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 52.7,
    "minPrice": 2343,
    "maxPrice": 2534,
    "history": [
      2378,
      2534,
      2510,
      2343,
      2431,
      2454
    ]
  },
  {
    "id": "mkt_29",
    "commodity": "Maize",
    "variety": "CO 6",
    "mandi": "Madurai Regulated Market",
    "district": "Madurai",
    "currentPrice": 2077,
    "previousPrice": 2139,
    "changePercent": -2.9,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 124,
    "minPrice": 2053,
    "maxPrice": 2226,
    "history": [
      2200,
      2226,
      2178,
      2103,
      2053,
      2077
    ]
  },
  {
    "id": "mkt_30",
    "commodity": "Maize",
    "variety": "Yellow Feed Grade",
    "mandi": "Coimbatore Central Market",
    "district": "Coimbatore",
    "currentPrice": 2132,
    "previousPrice": 2066,
    "changePercent": 3.2,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 145.4,
    "minPrice": 2042,
    "maxPrice": 2132,
    "history": [
      2118,
      2069,
      2042,
      2126,
      2073,
      2132
    ]
  },
  {
    "id": "mkt_31",
    "commodity": "Maize",
    "variety": "Yellow Feed Grade",
    "mandi": "Thanjavur Regulated Market",
    "district": "Thanjavur",
    "currentPrice": 2441,
    "previousPrice": 2561,
    "changePercent": -4.7,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 132.1,
    "minPrice": 2441,
    "maxPrice": 2669,
    "history": [
      2443,
      2519,
      2458,
      2516,
      2669,
      2441
    ]
  },
  {
    "id": "mkt_32",
    "commodity": "Maize",
    "variety": "Yellow Feed Grade",
    "mandi": "Tiruchirappalli Regulated Market",
    "district": "Tiruchirappalli",
    "currentPrice": 2137,
    "previousPrice": 2141,
    "changePercent": -0.2,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 50.8,
    "minPrice": 2052,
    "maxPrice": 2232,
    "history": [
      2052,
      2064,
      2085,
      2130,
      2232,
      2137
    ]
  },
  {
    "id": "mkt_33",
    "commodity": "Turmeric",
    "variety": "BSR 2",
    "mandi": "Thanjavur Regulated Market",
    "district": "Thanjavur",
    "currentPrice": 15006,
    "previousPrice": 13958,
    "changePercent": 7.5,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 126.7,
    "minPrice": 14305,
    "maxPrice": 15006,
    "history": [
      14378,
      14305,
      14418,
      14316,
      14465,
      15006
    ]
  },
  {
    "id": "mkt_34",
    "commodity": "Turmeric",
    "variety": "BSR 2",
    "mandi": "Madurai Main Mandi",
    "district": "Madurai",
    "currentPrice": 12602,
    "previousPrice": 12150,
    "changePercent": 3.7,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 26.2,
    "minPrice": 12046,
    "maxPrice": 12692,
    "history": [
      12692,
      12645,
      12046,
      12328,
      12522,
      12602
    ]
  },
  {
    "id": "mkt_35",
    "commodity": "Turmeric",
    "variety": "Salem Local",
    "mandi": "Dindigul Uzhavar Sandhai",
    "district": "Dindigul",
    "currentPrice": 14802,
    "previousPrice": 14471,
    "changePercent": 2.3,
    "unit": "₹ / Quintal",
    "trend": "up",
    "arrivalsTonnes": 130.6,
    "minPrice": 13923,
    "maxPrice": 15113,
    "history": [
      14359,
      14120,
      13923,
      15113,
      14748,
      14802
    ]
  },
  {
    "id": "mkt_36",
    "commodity": "Turmeric",
    "variety": "Erode Local",
    "mandi": "Theni Main Mandi",
    "district": "Theni",
    "currentPrice": 13362,
    "previousPrice": 14183,
    "changePercent": -5.8,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 117.7,
    "minPrice": 13362,
    "maxPrice": 14832,
    "history": [
      14832,
      13983,
      14352,
      13975,
      14570,
      13362
    ]
  },
  {
    "id": "mkt_37",
    "commodity": "Turmeric",
    "variety": "Erode Local",
    "mandi": "Tiruchirappalli Central Market",
    "district": "Tiruchirappalli",
    "currentPrice": 12890,
    "previousPrice": 13862,
    "changePercent": -7,
    "unit": "₹ / Quintal",
    "trend": "down",
    "arrivalsTonnes": 85.2,
    "minPrice": 12890,
    "maxPrice": 14277,
    "history": [
      13859,
      14167,
      14277,
      13209,
      14177,
      12890
    ]
  }
];

export const cropAdvisoriesDatabase = {
  "Groundnut": {
    crop: "Groundnut",
    variety: "VRI 8 / Kadiri 6",
    sowingWindow: "June 10 – June 25 (Kharif)",
    matchScore: 96,
    multiFactorRationale: [
      { factor: "Soil Type (Red Loam)", note: "Red Loam provides good aeration and optimal penetrability for peg entry and pod swelling. Soil is 1 of 6 multi-factorial criteria.", status: "Optimal" },
      { factor: "Season Alignment", note: "Kharif photoperiod matches vegetative cycle and flowering canopy requirement.", status: "Optimal" },
      { factor: "Weather & Temp", note: "Forecasted 28-32°C range matches optimum germination and initial leaf formation.", status: "Favorable" },
      { factor: "Water Availability", note: "Moderate water requirement (400-500mm). Easily satisfied with scheduled borewell drip.", status: "Adequate" },
      { factor: "Crop Rotation", note: "Previous crop was Tomato/Fallow; avoids nematode buildup and fixes atmospheric nitrogen.", status: "Beneficial" },
      { factor: "Market Outlook", note: "Oilseed mandi prices in Erode are trending up (+4%) due to strong miller procurement.", status: "High Demand" }
    ],
    financials: {
      expectedYield: "22 Quintals / Acre",
      cultivationCost: "₹ 28,500 / Acre",
      expectedRevenue: "₹ 59,400 / Acre",
      potentialProfit: "₹ 30,900 / Acre",
      roi: "108%"
    },
    practices: [
      "Seed treatment with Trichoderma viride @ 4g/kg seed + Rhizobium biofertilizer.",
      "Maintain spacing of 30 cm x 10 cm.",
      "Apply 200 kg gypsum per acre at 40-45 days after sowing during earthing up."
    ]
  },
  "Tomato": {
    crop: "Tomato",
    variety: "Shivam Hybrid / Arka Rakshak",
    sowingWindow: "July 1 – July 20",
    matchScore: 92,
    multiFactorRationale: [
      { factor: "Soil Type (Red / Sandy Loam)", note: "Well-drained soil avoids root asphyxiation during heavy rain spells. (Soil factor)", status: "Optimal" },
      { factor: "Season Alignment", note: "Pre-monsoon nursery sowing yields peak fruit production before winter dew.", status: "Optimal" },
      { factor: "Weather & Temp", note: "Current 29°C is ideal for flower setting; monitor forecast for heavy rain protection.", status: "Favorable" },
      { factor: "Water Availability", note: "Requires steady drip irrigation; fits existing borewell schedule with mulching.", status: "Adequate" },
      { factor: "Market Outlook", note: "Coimbatore market prices are currently surging at ₹2,800/quintal (+8.1%).", status: "High Demand" }
    ],
    financials: {
      expectedYield: "32 Tonnes / Acre",
      cultivationCost: "₹ 52,000 / Acre",
      expectedRevenue: "₹ 1,12,000 / Acre",
      potentialProfit: "₹ 60,000 / Acre",
      roi: "115%"
    },
    practices: [
      "Transplant 25-day sturdy seedlings on raised beds with drip lines.",
      "Install yellow sticky traps @ 12 traps/acre against whiteflies and thrips.",
      "Follow staking to prevent soil-borne fruit rot."
    ]
  },
  "Paddy": {
    crop: "Paddy",
    variety: "CR 1009 Sub 1 / BPT 5204",
    sowingWindow: "August 1 – August 25 (Samba)",
    matchScore: 89,
    multiFactorRationale: [
      { factor: "Soil Type (Clayey / Loamy)", note: "Clayey alluvial holds moisture needed for wetland paddy. (Soil factor)", status: "Optimal" },
      { factor: "Season Alignment", note: "Classic Samba season across Tamil Nadu delta zones.", status: "Optimal" },
      { factor: "Water Availability", note: "Requires abundant water availability or canal release; moderate for SRI technique.", status: "Moderate" },
      { factor: "Market Outlook", note: "Government MSP procurement centers ensure assured minimum floor price.", status: "Stable" }
    ],
    financials: {
      expectedYield: "26 Quintals / Acre",
      cultivationCost: "₹ 24,000 / Acre",
      expectedRevenue: "₹ 48,100 / Acre",
      potentialProfit: "₹ 24,100 / Acre",
      roi: "100%"
    },
    practices: [
      "Use SRI or machine transplanter for uniform spacing and lower seed rate.",
      "Incorporate Azospirillum and Phosphobacteria biofertilizers.",
      "Maintain alternate wetting and drying (AWD) water management."
    ]
  },
  "Maize": {
    crop: "Maize",
    variety: "CO 6 / Pioneer Hybrid",
    sowingWindow: "June 15 – July 10",
    matchScore: 87,
    multiFactorRationale: [
      { factor: "Soil Type", note: "Adapts to well-drained loam and black soils with good aeration. (Soil factor)", status: "Optimal" },
      { factor: "Water Availability", note: "Drought hardy with moderate irrigation needs; requires water at silking stage.", status: "Favorable" },
      { factor: "Market Outlook", note: "Steady demand from poultry and animal feed manufacturers in Namakkal/Salem belt.", status: "Stable" }
    ],
    financials: {
      expectedYield: "30 Quintals / Acre",
      cultivationCost: "₹ 21,000 / Acre",
      expectedRevenue: "₹ 45,000 / Acre",
      potentialProfit: "₹ 24,000 / Acre",
      roi: "114%"
    },
    practices: [
      "Ridge and furrow sowing at 60 cm x 20 cm spacing.",
      "Monitor for Fall Armyworm at 15-20 days stage using pheromone traps.",
      "Top-dress urea in two split doses at knee-high and tasseling stages."
    ]
  }
};

export const sampleDiseaseCases = [
  {
    id: "dis_1",
    crop: "Tomato",
    diseaseName: "Early Blight",
    pathogen: "Alternaria solani",
    confidence: 94,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80",
    symptoms: [
      "Brown to dark concentric rings ('target board' pattern) on older lower leaves",
      "Surrounding tissue turns chlorotic (yellow) and causes premature leaf drop",
      "Sunken, leathery dark lesions on stems near the soil line",
      "Direct yield reduction due to reduced photosynthetic canopy"
    ],
    prevention: [
      "Ensure 3-year crop rotation avoiding Solanaceae family members (chilli, brinjal, potato)",
      "Maintain wider row spacing (60 cm) to allow air circulation and faster canopy drying",
      "Adopt drip irrigation; avoid overhead sprinkler watering that wets leaves",
      "Mulch soil surface with straw or black plastic to prevent soil splash onto foliage"
    ],
    suggestedAction: [
      "Immediate organic spray: Neem Seed Kernel Extract (NSKE 5%) or Trichoderma viride @ 5g/L.",
      "Chemical control (if severe): Foliar spray of Mancozeb 75% WP @ 2.5g/L or Chlorothalonil 75% WP @ 2g/L.",
      "Remove and safely burn lower infected leaves to break fungal spore cycle."
    ],
    advisoryNote: "This is an AI-assisted indication and should be verified with an agricultural officer or Krishi Vigyan Kendra (KVK) expert when necessary."
  },
  {
    id: "dis_2",
    crop: "Paddy",
    diseaseName: "Leaf Blast",
    pathogen: "Magnaporthe oryzae",
    confidence: 91,
    image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800&auto=format&fit=crop&q=80",
    symptoms: [
      "Spindle-shaped lesions with grayish or white centers and brown margins",
      "Lesions enlarge and coalesce, causing entire leaves to dry and wither",
      "Neck blast phase causes panicles to break and fall over, resulting in chaffy grains"
    ],
    prevention: [
      "Avoid excessive nitrogen fertilizer application; split into 3-4 micro doses",
      "Maintain clean field bunds free from weed collateral hosts",
      "Use resistant/tolerant varieties such as CR 1009 Sub 1 or ADT 43"
    ],
    suggestedAction: [
      "Spray Tricyclazole 75% WP @ 0.6g/L or Kasugamycin 3% SL @ 2.5ml/L at early tillering",
      "Apply Pseudomonas fluorescens bio-agent @ 10g/L as preventive foliar spray",
      "Drain standing water for 24 hours to reduce microclimate humidity"
    ],
    advisoryNote: "This is an AI-assisted indication and should be verified with an agricultural officer or Krishi Vigyan Kendra (KVK) expert when necessary."
  },
  {
    id: "dis_3",
    crop: "Groundnut",
    diseaseName: "Tikka Leaf Spot (Cercospora)",
    pathogen: "Cercospora personata",
    confidence: 88,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
    symptoms: [
      "Small circular dark spots appearing on both upper and lower leaf surfaces",
      "Early leaf spot has prominent yellow halo; late leaf spot is darker without halo",
      "Severe defoliation leaving bare stems and reducing pod filling"
    ],
    prevention: [
      "Treat seeds before sowing with Carbendazim @ 2g/kg seed",
      "Avoid continuous groundnut monocropping in the same plot",
      "Ensure balanced potassium and gypsum application for leaf cell wall strength"
    ],
    suggestedAction: [
      "Spray Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2g/liter of water",
      "Alternatively spray Chlorothalonil 75 WP @ 2g/L with spreader sticker",
      "Repeat spray after 15 days if cloudy weather persists"
    ],
    advisoryNote: "This is an AI-assisted indication and should be verified with an agricultural officer or Krishi Vigyan Kendra (KVK) expert when necessary."
  }
];

export const irrigationScheduleMock = {
  getRecommendation: (crop, soilType, growthStage, weatherCondition) => {
    let waterRequirement = "Moderate (18 - 22 mm)";
    let nextIrrigation = "Tomorrow morning at 6:30 AM";
    let duration = "1.5 hours via inline drip";
    let rationale = `Low rainfall probability and crop is entering ${growthStage || "flowering stage"}. Soil type (${soilType || "Red Loam"}) has moderate drainage; morning irrigation minimizes evaporative loss.`;
    let urgency = "Normal";

    if (weatherCondition?.includes("Rain") || weatherCondition?.includes("Showers")) {
      waterRequirement = "None / Hold Irrigation";
      nextIrrigation = "After 48 hours (Post-Rain Assessment)";
      duration = "0 hours";
      rationale = "Heavy rain expected in the forecast. Excess irrigation will cause root aeration stress and nutrient leaching.";
      urgency = "Hold";
    } else if (growthStage === "Pod Development / Fruit Bulking") {
      waterRequirement = "High (28 - 32 mm)";
      nextIrrigation = "Today evening (5:00 PM)";
      duration = "2.5 hours via drip";
      rationale = "Critical moisture sensitivity stage. Water deficit during fruit bulking causes fruit drop and blossom end rot.";
      urgency = "High";
    }

    return {
      waterRequirement,
      nextIrrigation,
      duration,
      rationale,
      urgency,
      soilMoistureStatus: "Adequate (62%)",
      next7DayPlan: [
        { day: "Thu (Today)", action: "Hold evening drip. Rainfall expected tomorrow." },
        { day: "Fri", action: "Rainfall expected (35mm). Keep drainage channels open." },
        { day: "Sat", action: "No irrigation needed. Soil saturation sufficient." },
        { day: "Sun", action: "Resume light drip (45 mins) in late afternoon." },
        { day: "Mon", action: "Regular fertigation cycle (NPK 19:19:19)." },
        { day: "Tue", action: "Normal 1.5 hr drip cycle." },
        { day: "Wed", action: "Check soil moisture via tensiometer/finger test." }
      ]
    };
  }
};

export const governmentSchemes = [
  {
    id: "sch_1",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Financial Support",
    ministry: "Ministry of Agriculture & Farmers Welfare, Govt of India",
    benefits: "₹ 6,000 per year transferred directly to bank account in three 4-monthly installments of ₹2,000 each.",
    eligibility: "All landholding farmer families with cultivable land in their names. Institutional landholders and high-income tax payers are excluded.",
    documents: ["Aadhaar Card", "Land Ownership Record (Patta / Chitta)", "Active Bank Account linked with Aadhaar", "Mobile Number"],
    deadline: "Open All Year (Continuous Registration)",
    subsidyAmount: "₹6,000 / year",
    officialLink: "https://pmkisan.gov.in",
    status: "Active",
    badge: "Direct Benefit Transfer"
  },
  {
    id: "sch_2",
    name: "PMKSY - Per Drop More Crop (Micro Irrigation Subsidy)",
    category: "Irrigation",
    ministry: "Department of Agriculture & Farmers Welfare",
    benefits: "Up to 100% subsidy for Small & Marginal Farmers in Tamil Nadu (75% to 100% state-assisted), and 75% for other farmers for drip and sprinkler irrigation installations.",
    eligibility: "Farmers with verified cultivable land holding and operational water source (borewell/well) with electricity connection.",
    documents: ["Chitta/Adangal land proof", "Well/Borewell certificate", "Aadhaar Card", "Soil & Water Test Report", "Farm layout sketch"],
    deadline: "District-wise batch allocation (Current phase ends Oct 31)",
    subsidyAmount: "Up to 100% for Small Farmers",
    officialLink: "https://pmksy.gov.in",
    status: "Active",
    badge: "100% Subsidy"
  },
  {
    id: "sch_3",
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana - Crop Insurance)",
    category: "Insurance",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    benefits: "Comprehensive insurance cover against crop loss from non-preventable natural risks (drought, flood, unseasonal rain, pests). Farmers pay only 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.",
    eligibility: "All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.",
    documents: ["Aadhaar Card", "Sowing Certificate / VRO Adangal", "Bank Passbook", "Land record documents"],
    deadline: "July 31 for Kharif / Nov 15 for Samba Paddy",
    subsidyAmount: "Covers up to 100% sum insured",
    officialLink: "https://pmfby.gov.in",
    status: "Active",
    badge: "Crop Safety"
  },
  {
    id: "sch_4",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    category: "Machinery & Equipment",
    ministry: "Dept of Agrl Engineering, Govt of Tamil Nadu",
    benefits: "40% to 50% subsidy on procurement of agricultural machinery (Power tillers, Rotavators, Paddy Transplanters, Combine Harvesters, Drone sprayers).",
    eligibility: "Individual farmers, Farmer Producer Organizations (FPOs), and Custom Hiring Centers (CHCs). Priority to SC/ST and women farmers.",
    documents: ["Aadhaar Card", "Land patta copy", "Quotations from approved empaneled dealers", "Bank account details"],
    deadline: "Quarterly portal allotment (Ongoing)",
    subsidyAmount: "40% - 50% on machinery",
    officialLink: "https://agrimachinery.nic.in",
    status: "Active",
    badge: "Farm Mechanization"
  },
  {
    id: "sch_5",
    name: "Tamil Nadu Free Power Supply for Agriculture",
    category: "Utilities & Energy",
    ministry: "TANGEDCO, Govt of Tamil Nadu",
    benefits: "100% free electricity supply for agricultural pump sets for registered farmers across Tamil Nadu.",
    eligibility: "Farmers with dedicated agricultural borewell/open well connections.",
    documents: ["TANGEDCO application reference", "Patta copy", "VAO certificate for well existence"],
    deadline: "Regularized Tatkal & Normal Scheme open",
    subsidyAmount: "100% Free Power",
    officialLink: "https://tangedco.gov.in",
    status: "Active",
    badge: "State Scheme"
  },
  {
    id: "sch_6",
    name: "Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming)",
    category: "Organic Farming",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    benefits: "Financial assistance of ₹50,000 per hectare for 3 years, of which ₹31,000 is given directly to the farmer for organic inputs (seeds, bio-fertilizers, bio-pesticides, vermicompost).",
    eligibility: "Farmers forming clusters of 50 or more farmers with 50 acres of land practicing chemical-free farming.",
    documents: ["Aadhaar Card", "Cluster membership certificate", "Land records", "Soil baseline testing certificate"],
    deadline: "Annual cluster onboarding",
    subsidyAmount: "₹50,000 / hectare",
    officialLink: "https://pgsindia-ncof.gov.in",
    status: "Active",
    badge: "Eco Farming"
  }
];

export const expertQuestions = [

  {
    id: "q_4",
    farmer: {
      name: "Arumugam Chinnasamy",
      location: "Thanjavur Delta",
      crop: "Paddy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80"
    },
    question: "Yellowish-orange wavy margins and wilting on rice leaves during tillering stage. Is it Bacterial Leaf Blight?",
    timestamp: "4 hours ago",
    image: `${import.meta.env.BASE_URL}images/qa/paddy_leaf_blight.jpg`,
    answersCount: 2,
    verifiedAnswer: {
      expert: "Dr. S. Ramanathan (Rice Research Station, Aduthurai, TNAU)",
      qualification: "Ph.D. Plant Pathology, Lead Scientist",
      badge: "Verified Expert",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
      answer: "Yes, this is typical Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae). Notice the undulating wavy margins progressing downward from leaf tips.\n\n1. Spray Streptocycline (1g) + Copper Oxychloride (30g) in 10 liters of water (10g Streptocycline + 300g COC per acre).\n2. Drain standing water from the field for 48 hours to halt bacterial movement through surface irrigation.\n3. Completely withhold Urea top-dressing until lesions turn dry and papery. Top-dress MOP (Potash) @ 15 kg/acre to strengthen cell walls.",
      timestamp: "2 hours ago",
      upvotes: 38
    },
    replies: [
      { id: "r4_1", user: "Kandasamy M.", text: "Draining the water checked the disease within 3 days in our Kumbakonam plot.", time: "1 hour ago" }
    ]
  },
  {
    id: "q_5",
    farmer: {
      name: "Selvakumar R.",
      location: "Oddanchatram, Dindigul",
      crop: "Tomato",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80"
    },
    question: "Black sunken leathery spots at the bottom of developing hybrid tomatoes. How to correct this calcium imbalance?",
    timestamp: "6 hours ago",
    image: `${import.meta.env.BASE_URL}images/qa/tomato_blossom_rot.jpg`,
    answersCount: 3,
    verifiedAnswer: {
      expert: "Dr. Meenakshi Sundaram (Horticulture College, Periyakulam)",
      qualification: "Senior Scientist, Vegetable Crops",
      badge: "Verified Expert",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
      answer: "This is classic Blossom End Rot (BER), caused by Calcium deficiency during cell enlargement, triggered by fluctuations in soil moisture.\n\n1. Foliar Spray: Apply Calcium Nitrate @ 4–5 g/L + Borax @ 1 g/L early in the morning.\n2. Irrigation: Maintain uniform drip cycles; avoid dry spells followed by flooding.\n3. Mulching: Lay silver-black plastic mulch to reduce surface evaporation and keep soil moisture steady.",
      timestamp: "3 hours ago",
      upvotes: 49
    },
    replies: []
  },
  {
    id: "q_6",
    farmer: {
      name: "Muthusamy K.",
      location: "Attur, Salem",
      crop: "Cotton",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80"
    },
    question: "Small rosetted flowers and premature boll dropping in Bt Cotton. Signs of Pink Bollworm (PBW) infestation?",
    timestamp: "12 hours ago",
    image: `${import.meta.env.BASE_URL}images/qa/cotton_pink_bollworm.jpg`,
    answersCount: 2,
    verifiedAnswer: {
      expert: "Dr. V. Rajendran (CICR & TNAU Cotton Specialist)",
      qualification: "Ph.D. Entomology, Principal Scientist",
      badge: "Verified Expert",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
      answer: "Rosetted flowers with twisted petals are a hallmark sign of Pink Bollworm (Pectinophora gossypiella) larvae feeding inside.\n\n1. Install Gossyplure Pheromone Traps @ 5/acre to monitor moth catches (ETL is 8 moths/trap/night).\n2. Spray Emamectin Benzoate 5% SG @ 4g/10L water (80g/acre) or Profenofos 50% EC @ 2ml/L.\n3. Manually pick and destroy rosetted flowers to prevent larvae from entering bolls.",
      timestamp: "8 hours ago",
      upvotes: 56
    },
    replies: []
  },
  {
    id: "q_7",
    farmer: {
      name: "Kavitha Krishnan",
      location: "Musiri, Tiruchirappalli",
      crop: "Banana",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80"
    },
    question: "Yellow oval spots with dark brown centers and grey ash colored rings on Grand Naine banana leaves. How to stop spread?",
    timestamp: "1 day ago",
    image: `${import.meta.env.BASE_URL}images/qa/banana_sigatoka_disease.jpg`,
    answersCount: 4,
    verifiedAnswer: {
      expert: "Dr. T. Senguttuvan (National Research Centre for Banana, NRCB)",
      qualification: "Head of Crop Protection, ICAR-NRCB",
      badge: "Verified Expert",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
      answer: "This is Sigatoka Leaf Spot (Yellow/Black Sigatoka complex). Left unchecked, it destroys functional leaf canopy before bunch harvest.\n\n1. De-leaf: Prune severely spotted lower leaves and burn them outside the orchard.\n2. Fungicide Spray: Propiconazole 25% EC (Tilt) @ 1 ml/L + Petroleum spray oil (10 ml/L) directed under leaves.\n3. Drainage: Improve trench drainage between rows; stagnant water increases microclimate humidity.",
      timestamp: "18 hours ago",
      upvotes: 62
    },
    replies: [
      { id: "r7_1", user: "Saravanan R.", text: "Adding mineral oil to Tilt worked wonders during last month's humid spell.", time: "14 hours ago" }
    ]
  },
  {
    id: "q_8",
    farmer: {
      name: "Boopathi Raja",
      location: "Kodumudi, Erode",
      crop: "Turmeric",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80"
    },
    question: "Collar region of turmeric pseudostem softening and yellowing lower leaves. How to save rhizomes from fungal rot?",
    timestamp: "2 days ago",
    image: `${import.meta.env.BASE_URL}images/qa/turmeric_crop_rot.jpg`,
    answersCount: 3,
    verifiedAnswer: {
      expert: "Dr. P. Velmurugan (Spices & Plantation Crops Specialist, TNAU)",
      qualification: "Ph.D. Horticulture, Lead Extension Officer",
      badge: "Verified Expert",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80",
      answer: "This is Pythium Rhizome Rot (Soft Rot). Soil waterlogging triggers quick rotting of root and rhizome tissue.\n\n1. Chemical Drench: Drench affected clump basins with Metalaxyl 8% + Mancozeb 64% (Ridomil MZ) @ 2 g/L or Copper Oxychloride @ 2.5 g/L.\n2. Bio-Control: Broadcast Trichoderma viride @ 2.5 kg mixed in 100 kg well-composted farmyard manure along ridges.\n3. Drainage: Dig deep cross-drainage channels to prevent water stagnation in ridge furrows.",
      timestamp: "1 day ago",
      upvotes: 71
    },
    replies: []
  }
];

export const notificationsData = [
  {
    id: "notif_1",
    type: "weather",
    title: "🌧 Heavy Rain Advisory for Coimbatore & Erode",
    message: "Rain expected tomorrow (35-45mm). Hold pesticide and fertilizer spraying. Clear drainage ditches in low-lying fields.",
    time: "25 minutes ago",
    read: false,
    badge: "Urgent Weather",
    actionRoute: "weather"
  },
  {
    id: "notif_2",
    type: "market",
    title: "📈 Tomato Prices Surged by 8.1%",
    message: "Coimbatore mandi prices jumped to ₹2,800/quintal today with firm demand. Check live arrivals now.",
    time: "1 hour ago",
    read: false,
    badge: "Mandi Alert",
    actionRoute: "market"
  },
  {
    id: "notif_3",
    type: "expert",
    title: "👨‍🌾 Expert Response from Dr. Soundararajan",
    message: "Dr. Soundararajan replied to your community query on Groundnut Tikka spot identification.",
    time: "2 hours ago",
    read: true,
    badge: "Expert Q&A",
    actionRoute: "expert-qa"
  },
  {
    id: "notif_4",
    type: "advisor",
    title: "🌱 Recommended Sowing Window for Kharif Groundnut",
    message: "Ideal sowing window (June 10 - June 25) aligns with forecasted rainfall and soil moisture. Review Crop Advisor details.",
    time: "5 hours ago",
    read: true,
    badge: "Crop Advisory",
    actionRoute: "crop-advisor"
  },
  {
    id: "notif_5",
    type: "scheme",
    title: "🏛 PMKSY Micro-Irrigation Subsidy Window Extended",
    message: "Tamil Nadu Horticulture Dept has extended 100% drip subsidy application deadline till Oct 31.",
    time: "Yesterday",
    read: true,
    badge: "Scheme Deadline",
    actionRoute: "schemes"
  }
];

export const adminMetrics = {
  totalFarmers: "12,480",
  newFarmersToday: "+48",
  totalPosts: "3,842",
  totalReels: "420",
  reportedContent: "6",
  pendingVerifications: "4",
  systemUptime: "99.98%",
  activeDistricts: 14,
  reportsList: [
    { id: "rep_1", postTitle: "Black magic remedy for pest control", author: "Ramu M.", reason: "Misleading non-scientific agricultural claim", date: "Sep 3, 2026", status: "Pending Review" },
    { id: "rep_2", postTitle: "Commercial promotion of unapproved chemical", author: "AgroDealers Hub", reason: "Spam / Unregistered commercial promotion", date: "Sep 2, 2026", status: "Pending Review" }
  ],
  pendingExperts: [
    { id: "exp_1", name: "Dr. Anitha Priya", specialization: "Agricultural Entomology, TNAU", degree: "Ph.D. in Entomology", docProof: "TNAU Faculty ID #TN8842", status: "Pending" },
    { id: "exp_2", name: "Er. Rajeshwaran S.", specialization: "Precision Irrigation Engineering", degree: "M.Tech Agrl Engineering", docProof: "IEI Membership #M-10923", status: "Pending" }
  ]
};
