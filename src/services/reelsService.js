/**
 * Farmogram AI — Agricultural Reels Service Engine
 * Features:
 * - Persistent storage (localStorage) with realistic agricultural seed reels
 * - Full social interactions: Like (with double-tap pop), Comment, Share, Save/Bookmark
 * - Multi-category classification & search
 * - Deterministic smart feed recommendation (based on farmer profile & preferences)
 * - User reel upload pipeline with validation, progress simulation & preview
 * - Creator profile inspection & follow system
 * - Safety & Agronomy accuracy notices
 * - Admin moderation & reporting queue
 * - EventBus for real-time reactive UI updates
 */

class ReelsEventBus {
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
      eventId: `EVT-REEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType: event,
      timestamp: new Date().toISOString(),
      payload: data
    };
    this.listeners.get(event)?.forEach(cb => {
      try { cb(payload); } catch (e) { console.error(`Error in reels event listener (${event}):`, e); }
    });
    this.listeners.get('*')?.forEach(cb => {
      try { cb(payload); } catch (e) { console.error('Error in wildcard reels event listener:', e); }
    });
  }
}

export const reelsEvents = new ReelsEventBus();
export { reelsEvents as ReelsEventBus };

export const REEL_CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌾', key: 'all' },
  { id: 'crop_tips', label: 'Crop Tips', icon: '🌱', key: 'cat_crop_tips' },
  { id: 'irrigation', label: 'Irrigation', icon: '💧', key: 'cat_irrigation' },
  { id: 'disease', label: 'Disease Management', icon: '🦠', key: 'cat_disease_mgmt' },
  { id: 'harvest', label: 'Harvest', icon: '🌾', key: 'cat_harvest' },
  { id: 'machinery', label: 'Machinery', icon: '🚜', key: 'cat_machinery' },
  { id: 'market', label: 'Market Knowledge', icon: '📈', key: 'cat_market_knowledge' },
  { id: 'schemes', label: 'Government Schemes', icon: '🏛️', key: 'cat_govt_schemes' },
  { id: 'sustainable', label: 'Sustainable Farming', icon: '🌳', key: 'cat_sustainable' },
  { id: 'stories', label: 'Farmer Stories', icon: '👨‍🌾', key: 'cat_farmer_stories' },
  { id: 'soil', label: 'Soil & Fertilizer', icon: '🧪', key: 'cat_soil_fertilizer' }
];

export const REPORT_REASONS = [
  { id: 'misleading', label: 'Misleading information', key: 'report_misleading' },
  { id: 'false_claim', label: 'False agricultural claim', key: 'report_false_claim' },
  { id: 'inappropriate', label: 'Inappropriate content', key: 'report_inappropriate' },
  { id: 'spam', label: 'Spam or commercial promotion', key: 'report_spam' },
  { id: 'other', label: 'Other agricultural safety issue', key: 'report_other' }
];

const INITIAL_REELS = [
  {
    id: 'reel-101',
    title: 'Water-Saving Micro-Drip System in Tomato Cultivation',
    caption: 'Best method for saving up to 45% water in tomato farming while maintaining optimal root-zone moisture. Notice the lateral line spacing and emitter pressure regulation! 🌱💧',
    hashtags: ['#Tomato', '#WaterSaving', '#FarmTips', '#DripIrrigation', '#AgriTech'],
    category: 'irrigation',
    categoryLabel: '💧 Irrigation',
    crop: 'Tomato',
    location: 'Erode, Tamil Nadu',
    language: 'ta',
    audioTrack: 'Original Sound — Ramesh Kumar (Agri Innovator)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-watering-green-lettuce-seedlings-in-a-greenhouse-41595-large.mp4',
    poster: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23984?w=800',
    duration: '0:42',
    creator: {
      id: 'cr-ramesh-1',
      name: 'Ramesh Kumar',
      handle: '@ramesh_erode_agri',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      verified: true,
      role: 'Verified Agricultural Expert',
      bio: 'Progressive horticultural farmer with 18 years experience in drip fertigation and drip automation in western Tamil Nadu.',
      location: 'Erode, Tamil Nadu',
      reelsCount: 14,
      followersCount: 3820
    },
    likesCount: 1248,
    commentsCount: 38,
    sharesCount: 142,
    savesCount: 96,
    viewsCount: 14850,
    createdDate: '2026-03-12T09:30:00Z',
    status: 'Published',
    safetyNotice: null,
    comments: [
      {
        id: 'c-1',
        user: 'kavitha_salem',
        userName: 'Kavitha S.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        text: 'What is the recommended discharge rate per dripper (LPH) for red loamy soil?',
        time: '2 hours ago',
        likes: 12
      },
      {
        id: 'c-2',
        user: 'ramesh_erode_agri',
        userName: 'Ramesh Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        text: 'Hello sister! For red loamy soil with tomato, 2.0 to 2.4 LPH inline emitters spaced at 40cm works ideally without runoff.',
        time: '1 hour ago',
        likes: 24
      },
      {
        id: 'c-3',
        user: 'balu_farmer',
        userName: 'Balu Gounder',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        text: 'இந்த முறை தண்ணீர் பற்றாக்குறைக்கு மிக அருமையான தீர்வு! (Great solution for water scarcity!)',
        time: '45 mins ago',
        likes: 8
      }
    ]
  },
  {
    id: 'reel-102',
    title: 'Biological Control of Paddy Leaf Blast (Pyricularia oryzae)',
    caption: 'Early detection of diamond-shaped lesions in samba paddy. Learn how Trichoderma viride seed treatment and Pseudomonas fluorescens foliar spray prevent devastating blast epidemics organically! 🌾🦠',
    hashtags: ['#Paddy', '#BlastDisease', '#Biocontrol', '#RiceFarming', '#KVK'],
    category: 'disease',
    categoryLabel: '🦠 Disease Management',
    crop: 'Paddy / Rice',
    location: 'Thanjavur, Tamil Nadu',
    language: 'ta',
    audioTrack: 'Agronomy Guidance — Dr. Priya Soundar, Ph.D.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-in-a-cornfield-41584-large.mp4',
    poster: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    duration: '0:55',
    creator: {
      id: 'cr-priya-2',
      name: 'Dr. Priya Soundar',
      handle: '@dr_priya_agronomist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      verified: true,
      role: 'Verified Agricultural Expert',
      bio: 'Senior Plant Pathologist at Cauvery Agro-Research Station. Author of 24 papers on integrated pest management in rice.',
      location: 'Thanjavur, Tamil Nadu',
      reelsCount: 22,
      followersCount: 8940
    },
    likesCount: 2190,
    commentsCount: 64,
    sharesCount: 310,
    savesCount: 184,
    viewsCount: 28400,
    createdDate: '2026-03-14T11:00:00Z',
    status: 'Published',
    safetyNotice: 'Agronomy Advisory: Always adhere to biological formulation concentration (5g/L) and spray during morning or evening hours for maximum spore viability.',
    comments: [
      {
        id: 'c-4',
        user: 'selva_delta',
        userName: 'Selvaraj Thanjai',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
        text: 'Can we tank-mix Pseudomonas with chemical fungicides if blast is already severe?',
        time: '3 hours ago',
        likes: 19
      },
      {
        id: 'c-5',
        user: 'dr_priya_agronomist',
        userName: 'Dr. Priya Soundar',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        text: 'Never mix living biocontrol agents with copper or chemical fungicides directly. Keep a gap of at least 7 days between applications.',
        time: '2 hours ago',
        likes: 41
      }
    ]
  },
  {
    id: 'reel-103',
    title: 'Rich Vermicompost in 45 Days with Indigenous Earthworms',
    caption: 'Turn farm waste, dry leaves, and cow dung into black gold! Step-by-step layering technique, moisture control at 60%, and temperature stabilization for Eisenia fetida colonies. 🪱🌳',
    hashtags: ['#Vermicompost', '#OrganicFarming', '#SoilHealth', '#ZeroBudget', '#GreenLiving'],
    category: 'soil',
    categoryLabel: '🧪 Soil & Fertilizer',
    crop: 'Soil Nutrition',
    location: 'Coimbatore, Tamil Nadu',
    language: 'en',
    audioTrack: 'Nature Beats — Soil Enrichment Series',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-farmer-holding-soil-and-seeds-41598-large.mp4',
    poster: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    duration: '0:38',
    creator: {
      id: 'cr-selvam-3',
      name: 'Selvam Murugan',
      handle: '@selvam_natural_farms',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      verified: false,
      role: 'Organic Farmer & Producer',
      bio: 'Practicing 100% natural and regenerative farming on 8 acres in Pollachi foothills. Supplying certified organic compost.',
      location: 'Coimbatore, Tamil Nadu',
      reelsCount: 9,
      followersCount: 1450
    },
    likesCount: 876,
    commentsCount: 22,
    sharesCount: 88,
    savesCount: 112,
    viewsCount: 9800,
    createdDate: '2026-03-10T14:15:00Z',
    status: 'Published',
    safetyNotice: null,
    comments: [
      {
        id: 'c-6',
        user: 'karthik_pollachi',
        userName: 'Karthik N.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        text: 'How do you protect the vermicompost pit from red ants and rodents?',
        time: '1 day ago',
        likes: 7
      }
    ]
  },
  {
    id: 'reel-104',
    title: 'Precision Agri-Drone Spraying for Micronutrients in Sugarcane',
    caption: 'Witness 10 acres of sugarcane sprayed in under 40 minutes with 90% less water usage compared to knapsack manual sprayers! Micro-droplet penetration reaches under canopy. 🚜⚡',
    hashtags: ['#AgriDrone', '#Sugarcane', '#ModernMachinery', '#PrecisionAg', '#MakeInIndia'],
    category: 'machinery',
    categoryLabel: '🚜 Machinery',
    crop: 'Sugarcane',
    location: 'Salem, Tamil Nadu',
    language: 'en',
    audioTrack: 'High Tech Drone Engine — AgriMachinery',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-shot-of-a-field-of-green-crops-41582-large.mp4',
    poster: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
    duration: '0:48',
    creator: {
      id: 'cr-drone-4',
      name: 'AgriTech Drones India',
      handle: '@agritech_drones_tn',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      verified: true,
      role: 'Verified Agricultural Service Provider',
      bio: 'DGCA-certified drone service provider empowering smallholder farming clusters with aerial spraying and multispectral crop mapping.',
      location: 'Salem, Tamil Nadu',
      reelsCount: 19,
      followersCount: 5200
    },
    likesCount: 3410,
    commentsCount: 95,
    sharesCount: 420,
    savesCount: 310,
    viewsCount: 45600,
    createdDate: '2026-03-15T08:00:00Z',
    status: 'Published',
    safetyNotice: 'Safety Directive: Ensure 50-meter safety perimeter and do not spray near apiaries or water bodies when utilizing chemical micronutrient mixtures.',
    comments: [
      {
        id: 'c-7',
        user: 'kumar_cane',
        userName: 'Kumaravel Cane',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        text: 'What is the rental cost per acre including pilot and battery generator setup?',
        time: '4 hours ago',
        likes: 18
      }
    ]
  },
  {
    id: 'reel-105',
    title: 'How to Apply for PM-KUSUM 60% Solar Pump Subsidy Online',
    caption: 'Don’t pay middlemen! Step-by-step guide to applying on your state portal for solar water pump installation. Keep patta, EB certificate, and bank passbook ready. 🏛☀️',
    hashtags: ['#PMKUSUM', '#SolarPump', '#GovtSchemes', '#FarmerSubsidy', '#GreenEnergy'],
    category: 'schemes',
    categoryLabel: '🏛 Government Schemes',
    crop: 'Energy & Irrigation',
    location: 'Tiruchirappalli, Tamil Nadu',
    language: 'hi',
    audioTrack: 'Official Scheme Advisory — Ravi Extension Team',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-field-of-ripe-sunflowers-under-the-sun-41583-large.mp4',
    poster: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800',
    duration: '0:58',
    creator: {
      id: 'cr-ravi-5',
      name: 'Ravi Chandran',
      handle: '@agri_officer_ravi',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      verified: true,
      role: 'Verified Agricultural Extension Officer',
      bio: 'Agricultural officer dedicated to simplifying government welfare programs, crop subsidies, and sustainable farming credits for farmers.',
      location: 'Tiruchirappalli, Tamil Nadu',
      reelsCount: 31,
      followersCount: 11200
    },
    likesCount: 5620,
    commentsCount: 140,
    sharesCount: 980,
    savesCount: 650,
    viewsCount: 68900,
    createdDate: '2026-03-11T16:00:00Z',
    status: 'Published',
    safetyNotice: null,
    comments: [
      {
        id: 'c-8',
        user: 'kisan_veer',
        userName: 'Veerabhadran K.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Are tenant farmers eligible or is land patta in applicant name strictly mandatory?',
        time: '5 hours ago',
        likes: 29
      }
    ]
  },
  {
    id: 'reel-106',
    title: 'Combine Harvester Settings to Minimize Shattering in Wheat',
    caption: 'Check your reel speed ratio and cylinder clearance! Setting concave gap correctly saves up to 1.5 quintals per acre of grain loss during wheat harvest. 🌾🚜',
    hashtags: ['#WheatHarvest', '#CombineHarvester', '#PostHarvest', '#GrainCare', '#FarmEngineering'],
    category: 'harvest',
    categoryLabel: '🌾 Harvest',
    crop: 'Wheat',
    location: 'Ludhiana, Punjab',
    language: 'hi',
    audioTrack: 'Harvest Season Symphony — AgriMachinery',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-ripe-wheat-in-a-field-41586-large.mp4',
    poster: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    duration: '0:45',
    creator: {
      id: 'cr-gurpreet-6',
      name: 'Gurpreet Singh',
      handle: '@gurpreet_punjab_farming',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
      verified: true,
      role: 'Verified Agricultural Expert',
      bio: 'Agronomist and farm mechanization specialist at PAU alumni network. Helping farmers minimize post-harvest field losses.',
      location: 'Ludhiana, Punjab',
      reelsCount: 16,
      followersCount: 6300
    },
    likesCount: 1840,
    commentsCount: 42,
    sharesCount: 190,
    savesCount: 140,
    viewsCount: 22100,
    createdDate: '2026-03-13T10:20:00Z',
    status: 'Published',
    safetyNotice: null,
    comments: [
      {
        id: 'c-9',
        user: 'harjeet_sandhu',
        userName: 'Harjeet Sandhu',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        text: 'Best RPM setting for dry afternoon harvesting? Please guide paaji.',
        time: '6 hours ago',
        likes: 11
      }
    ]
  },
  {
    id: 'reel-107',
    title: 'Simple Soil pH Testing with Vinegar and Baking Soda',
    caption: 'No lab nearby? Test your soil alkalinity and acidity in 5 minutes right in your field using everyday household kitchen ingredients before applying lime or gypsum! 🧪🌱',
    hashtags: ['#SoilTest', '#SoilPH', '#FarmScience', '#EasyAgri', '#FertilizerTips'],
    category: 'soil',
    categoryLabel: '🧪 Soil & Fertilizer',
    crop: 'All Crops',
    location: 'Madurai, Tamil Nadu',
    language: 'ta',
    audioTrack: 'Educational Agri Audio — Farm DIY',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-plants-growing-in-the-soil-41599-large.mp4',
    poster: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    duration: '0:50',
    creator: {
      id: 'cr-anitha-7',
      name: 'Anitha Balan',
      handle: '@anitha_rural_innovator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      verified: false,
      role: 'Farmer Researcher',
      bio: 'Passionate farmer-innovator training women self-help groups in simple soil testing, composting, and indigenous seed preservation.',
      location: 'Madurai, Tamil Nadu',
      reelsCount: 11,
      followersCount: 2100
    },
    likesCount: 3120,
    commentsCount: 88,
    sharesCount: 340,
    savesCount: 420,
    viewsCount: 39500,
    createdDate: '2026-03-09T13:40:00Z',
    status: 'Published',
    safetyNotice: null,
    comments: [
      {
        id: 'c-10',
        user: 'radha_madurai',
        userName: 'Radha Krishnan',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        text: 'Very helpful demonstration! If it fizzes with vinegar it is alkaline, right?',
        time: '1 day ago',
        likes: 16
      }
    ]
  },
  {
    id: 'reel-108',
    title: 'Intercropping Red Gram with Groundnut for Climate Resilience',
    caption: 'Double insurance against erratic monsoon! Deep-rooted red gram draws deep moisture and fixes atmospheric nitrogen while groundnut suppresses weeds and gives early income. 👨🌾🌾',
    hashtags: ['#Intercropping', '#Groundnut', '#Pulses', '#DroughtProof', '#FarmerStories'],
    category: 'crop_tips',
    categoryLabel: '🌱 Crop Tips',
    crop: 'Groundnut & Red Gram',
    location: 'Dharmapuri, Tamil Nadu',
    language: 'ta',
    audioTrack: 'Folk Melody — Tamil Nadu Agrarian Heritage',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tractor-harvesting-crops-in-a-large-field-41581-large.mp4',
    poster: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    duration: '0:52',
    creator: {
      id: 'cr-karthik-8',
      name: 'Karthik Natarajan',
      handle: '@karthik_rainfed_farms',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      verified: true,
      role: 'Verified Agricultural Expert',
      bio: 'Dryland farming trainer and lead farmer at Dharmapuri Millets & Oilseeds Producer Company.',
      location: 'Dharmapuri, Tamil Nadu',
      reelsCount: 27,
      followersCount: 7800
    },
    likesCount: 2430,
    commentsCount: 51,
    sharesCount: 215,
    savesCount: 195,
    viewsCount: 31200,
    createdDate: '2026-03-08T17:10:00Z',
    status: 'Published',
    safetyNotice: null,
    comments: [
      {
        id: 'c-11',
        user: 'murugesan_dhar',
        userName: 'Murugesan K.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        text: 'What ratio do you follow? Is 6:1 or 8:1 spacing optimal for red gram in groundnut?',
        time: '2 days ago',
        likes: 14
      }
    ]
  }
];

class ReelsService {
  constructor() {
    this.storageKey = 'farmogram_reels_data_v2';
    this.likesKey = 'farmogram_reels_user_likes_v2';
    this.savesKey = 'farmogram_reels_user_saves_v2';
    this.followingKey = 'farmogram_reels_following_v2';
    this.reportsKey = 'farmogram_reels_reports_v2';
    this.initStorage();
  }

  initStorage() {
    try {
      const existing = localStorage.getItem(this.storageKey);
      if (!existing) {
        localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_REELS));
      }
      if (!localStorage.getItem(this.likesKey)) {
        localStorage.setItem(this.likesKey, JSON.stringify({}));
      }
      if (!localStorage.getItem(this.savesKey)) {
        localStorage.setItem(this.savesKey, JSON.stringify({}));
      }
      if (!localStorage.getItem(this.followingKey)) {
        localStorage.setItem(this.followingKey, JSON.stringify({}));
      }
      if (!localStorage.getItem(this.reportsKey)) {
        localStorage.setItem(this.reportsKey, JSON.stringify([]));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for ReelsService initialization:', e);
    }
  }

  getAllRawReels() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse stored reels:', e);
    }
    return INITIAL_REELS;
  }

  saveReels(reels) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(reels));
      reelsEvents.emit('REELS_UPDATED', reels);
    } catch (e) {
      console.error('Failed to save reels to localStorage:', e);
    }
  }

  getUserLikes() {
    try {
      return JSON.parse(localStorage.getItem(this.likesKey) || '{}');
    } catch (e) {
      return {};
    }
  }

  getUserSaves() {
    try {
      return JSON.parse(localStorage.getItem(this.savesKey) || '{}');
    } catch (e) {
      return {};
    }
  }

  getUserFollowing() {
    try {
      return JSON.parse(localStorage.getItem(this.followingKey) || '{}');
    } catch (e) {
      return {};
    }
  }

  getReports() {
    try {
      return JSON.parse(localStorage.getItem(this.reportsKey) || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Main query method for the public reels feed
   */
  getReels({
    category = 'all',
    search = '',
    tab = 'all', // 'all' | 'personalized' | 'saved' | 'my'
    farmerProfile = null,
    currentUserId = null
  } = {}) {
    const raw = this.getAllRawReels();
    const likesMap = this.getUserLikes();
    const savesMap = this.getUserSaves();

    // Attach user state (isLiked, isSaved)
    let processed = raw
      .filter(r => r.status === 'Published' || (tab === 'my' && r.creator?.id === currentUserId))
      .map(r => ({
        ...r,
        isLiked: Boolean(likesMap[r.id]),
        isSaved: Boolean(savesMap[r.id])
      }));

    // Filter by Tab
    if (tab === 'saved') {
      processed = processed.filter(r => r.isSaved);
    } else if (tab === 'my') {
      processed = processed.filter(r => r.creator?.id === (currentUserId || 'farmer-me'));
    } else if (tab === 'personalized' && farmerProfile) {
      // Deterministic ranking based on user's primary crop, state, or language
      const userCrop = (farmerProfile.crop || farmerProfile.primaryCrop || '').toLowerCase();
      const userState = (farmerProfile.state || farmerProfile.location || '').toLowerCase();

      processed = [...processed].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        if (userCrop && a.crop.toLowerCase().includes(userCrop)) scoreA += 10;
        if (userCrop && b.crop.toLowerCase().includes(userCrop)) scoreB += 10;

        if (userState && a.location.toLowerCase().includes(userState)) scoreA += 5;
        if (userState && b.location.toLowerCase().includes(userState)) scoreB += 5;

        // Verified expert reels have slightly higher priority
        if (a.creator?.verified) scoreA += 2;
        if (b.creator?.verified) scoreB += 2;

        return scoreB - scoreA;
      });
    }

    // Filter by Category
    if (category && category !== 'all') {
      processed = processed.filter(r => r.category === category);
    }

    // Filter by Search Query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      processed = processed.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.caption.toLowerCase().includes(q) ||
        r.crop.toLowerCase().includes(q) ||
        r.creator.name.toLowerCase().includes(q) ||
        r.hashtags.some(h => h.toLowerCase().includes(q))
      );
    }

    return processed;
  }

  getReelById(id) {
    const raw = this.getAllRawReels();
    const likesMap = this.getUserLikes();
    const savesMap = this.getUserSaves();
    const found = raw.find(r => r.id === id);
    if (!found) return null;
    return {
      ...found,
      isLiked: Boolean(likesMap[found.id]),
      isSaved: Boolean(savesMap[found.id])
    };
  }

  toggleLike(reelId) {
    const raw = this.getAllRawReels();
    const likesMap = this.getUserLikes();
    const isCurrentlyLiked = Boolean(likesMap[reelId]);
    const nextState = !isCurrentlyLiked;

    likesMap[reelId] = nextState;
    localStorage.setItem(this.likesKey, JSON.stringify(likesMap));

    const updated = raw.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          likesCount: nextState ? (r.likesCount || 0) + 1 : Math.max(0, (r.likesCount || 0) - 1)
        };
      }
      return r;
    });

    this.saveReels(updated);
    reelsEvents.emit('REEL_LIKE_TOGGLED', { reelId, isLiked: nextState });
    return nextState;
  }

  toggleSave(reelId) {
    const raw = this.getAllRawReels();
    const savesMap = this.getUserSaves();
    const isCurrentlySaved = Boolean(savesMap[reelId]);
    const nextState = !isCurrentlySaved;

    savesMap[reelId] = nextState;
    localStorage.setItem(this.savesKey, JSON.stringify(savesMap));

    const updated = raw.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          savesCount: nextState ? (r.savesCount || 0) + 1 : Math.max(0, (r.savesCount || 0) - 1)
        };
      }
      return r;
    });

    this.saveReels(updated);
    reelsEvents.emit('REEL_SAVE_TOGGLED', { reelId, isSaved: nextState });
    return nextState;
  }

  addComment(reelId, commentText, user = null) {
    if (!commentText || !commentText.trim()) return null;
    const raw = this.getAllRawReels();
    const newComment = {
      id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: user?.username || user?.handle || 'farmer_contributor',
      userName: user?.name || 'Practicing Farmer',
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Farmer')}&background=16a34a&color=fff`,
      text: commentText.trim(),
      time: 'Just now',
      likes: 0
    };

    const updated = raw.map(r => {
      if (r.id === reelId) {
        const comments = [newComment, ...(r.comments || [])];
        return {
          ...r,
          comments,
          commentsCount: comments.length
        };
      }
      return r;
    });

    this.saveReels(updated);
    reelsEvents.emit('REEL_COMMENT_ADDED', { reelId, comment: newComment });
    return newComment;
  }

  likeComment(reelId, commentId) {
    const raw = this.getAllRawReels();
    const updated = raw.map(r => {
      if (r.id === reelId && r.comments) {
        const updatedComments = r.comments.map(c => {
          if (c.id === commentId) {
            return { ...c, likes: (c.likes || 0) + 1 };
          }
          return c;
        });
        return { ...r, comments: updatedComments };
      }
      return r;
    });

    this.saveReels(updated);
    reelsEvents.emit('COMMENT_LIKED', { reelId, commentId });
  }

  incrementShare(reelId) {
    const raw = this.getAllRawReels();
    const updated = raw.map(r => {
      if (r.id === reelId) {
        return { ...r, sharesCount: (r.sharesCount || 0) + 1 };
      }
      return r;
    });
    this.saveReels(updated);
    reelsEvents.emit('REEL_SHARED', { reelId });
  }

  reportReel(reelId, reasonId, details = '', reportedBy = 'Farmer') {
    const raw = this.getAllRawReels();
    const reel = raw.find(r => r.id === reelId);
    if (!reel) return false;

    const reports = this.getReports();
    const reportItem = {
      id: `REP-REEL-${Date.now()}`,
      reelId,
      reelTitle: reel.title,
      creatorName: reel.creator?.name || 'Unknown',
      reasonId,
      reasonLabel: REPORT_REASONS.find(r => r.id === reasonId)?.label || reasonId,
      details,
      reportedBy,
      reportedDate: new Date().toISOString(),
      status: 'Pending Review'
    };

    reports.unshift(reportItem);
    localStorage.setItem(this.reportsKey, JSON.stringify(reports));

    // Update reel status to 'Reported' if multiple reports exist or mark flag
    const updated = raw.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          reportedCount: (r.reportedCount || 0) + 1
        };
      }
      return r;
    });
    this.saveReels(updated);

    reelsEvents.emit('REEL_REPORTED', reportItem);
    return true;
  }

  uploadReel(reelData, currentUser) {
    const raw = this.getAllRawReels();
    const newReel = {
      id: `reel-${Date.now()}`,
      title: reelData.title || 'Untitled Farming Reel',
      caption: reelData.caption || '',
      hashtags: Array.isArray(reelData.hashtags) 
        ? reelData.hashtags 
        : (reelData.hashtags || '').split(/[ ,]+/).filter(Boolean).map(h => h.startsWith('#') ? h : `#${h}`),
      category: reelData.category || 'crop_tips',
      categoryLabel: (() => {
        const catObj = REEL_CATEGORIES.find(c => c.id === reelData.category);
        return catObj ? `${catObj.icon} ${catObj.label}` : '🌱 Crop Tips';
      })(),
      crop: reelData.crop || 'General Agriculture',
      location: reelData.location || (currentUser?.location || 'Tamil Nadu, India'),
      language: reelData.language || 'en',
      audioTrack: reelData.audioTrack || `Original Sound — ${currentUser?.name || 'Farmer Creator'}`,
      videoUrl: reelData.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-plants-growing-in-the-soil-41599-large.mp4',
      poster: reelData.poster || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23984?w=800',
      duration: reelData.duration || '0:35',
      creator: {
        id: currentUser?.id || 'farmer-me',
        name: currentUser?.name || 'Progressive Farmer',
        handle: `@${(currentUser?.name || 'farmer').toLowerCase().replace(/\s+/g, '_')}`,
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        verified: Boolean(currentUser?.isExpert || currentUser?.isAdmin),
        role: currentUser?.isExpert ? 'Verified Agricultural Expert' : 'Farmer Creator',
        bio: currentUser?.bio || 'Passionate farmer sharing field trials and daily agrarian techniques.',
        location: currentUser?.location || 'Tamil Nadu, India',
        reelsCount: 1,
        followersCount: 1
      },
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      createdDate: new Date().toISOString(),
      status: 'Published', // Visible in feed immediately
      safetyNotice: reelData.safetyNotice || null,
      comments: []
    };

    const updated = [newReel, ...raw];
    this.saveReels(updated);
    reelsEvents.emit('REEL_UPLOADED', newReel);
    return newReel;
  }

  toggleFollowCreator(creatorId) {
    const following = this.getUserFollowing();
    const isFollowing = Boolean(following[creatorId]);
    following[creatorId] = !isFollowing;
    localStorage.setItem(this.followingKey, JSON.stringify(following));
    reelsEvents.emit('CREATOR_FOLLOW_TOGGLED', { creatorId, isFollowing: !isFollowing });
    return !isFollowing;
  }

  isFollowingCreator(creatorId) {
    const following = this.getUserFollowing();
    return Boolean(following[creatorId]);
  }

  // --- Admin Moderation Methods ---
  getAdminReels() {
    return this.getAllRawReels();
  }

  adminUpdateStatus(reelId, status) {
    const raw = this.getAllRawReels();
    const updated = raw.map(r => {
      if (r.id === reelId) {
        return { ...r, status };
      }
      return r;
    });
    this.saveReels(updated);
    reelsEvents.emit('ADMIN_REEL_STATUS_UPDATED', { reelId, status });
    return true;
  }

  adminDismissReport(reportId) {
    const reports = this.getReports().filter(rep => rep.id !== reportId);
    localStorage.setItem(this.reportsKey, JSON.stringify(reports));
    reelsEvents.emit('ADMIN_REPORT_DISMISSED', { reportId });
    return true;
  }

  adminVerifyCreator(creatorId, isVerified = true) {
    const raw = this.getAllRawReels();
    const updated = raw.map(r => {
      if (r.creator?.id === creatorId) {
        return {
          ...r,
          creator: {
            ...r.creator,
            verified: isVerified,
            role: isVerified ? 'Verified Agricultural Expert' : 'Farmer Creator'
          }
        };
      }
      return r;
    });
    this.saveReels(updated);
    reelsEvents.emit('ADMIN_CREATOR_VERIFIED', { creatorId, isVerified });
    return true;
  }
}

export const reelsService = new ReelsService();
