/**
 * El Niño Impact & Farm Preparedness Knowledge Base & Advisory Engine
 * 
 * Includes:
 * - Bilingual Educational Core (English & Tamil)
 * - The Critical Scientific Nuance: El Niño is not synonymous with drought; IOD/MJO interactions
 * - 5 Agricultural Impact Dimensions (Rainfall, Water/Irrigation, Heat Stress, Crop Planning, Livestock)
 * - Dynamic Advisory Matrix based on District, Crop, Stage, and Irrigation Type
 * - Forecast Status & Verification Sources (IMD, NOAA CPC, TNAU ACRC)
 */

export const EL_NINO_EXPLANATION = {
  en: {
    title: 'Understanding El Niño & Monsoon Interactions',
    subtitle: 'A scientific overview for informed farm management',
    whatIsIt: 'El Niño refers to the periodic abnormal warming of sea surface temperatures across the central and eastern equatorial Pacific Ocean (typically >0.5°C above normal in the Niño 3.4 region). This warming alters global atmospheric circulation (Walker Circulation), shifting tropical rainfall patterns.',
    crucialNuanceTitle: 'Crucial Nuance: El Niño Does NOT Automatically Mean Drought',
    crucialNuanceBody: 'While El Niño is historically associated with weaker or erratic southwest monsoon rainfall over parts of India, it is NOT an automatic guarantee of drought. In fact, historical records from the India Meteorological Department (IMD) show that approximately 40% of El Niño years resulted in normal or above-normal monsoon rainfall. Countervailing climate drivers—specifically a Positive Indian Ocean Dipole (+IOD) and favorable phases of the Madden-Julian Oscillation (MJO)—can completely offset El Niño suppression and bring abundant monsoon precipitation.',
    tamilNaduSpecifics: 'For Tamil Nadu, the impact is uniquely nuanced: while the Southwest Monsoon (June–Sept) may experience higher dry-spell frequency in the western districts, El Niño years frequently coincide with normal to above-normal Northeast Monsoon (Oct–Dec) rainfall along coastal and delta agro-ecosystems.',
    keyTakeaway: 'Farmers should not panic or abandon cropping. Instead, adopt proactive moisture conservation, contingency crop selection, and efficient micro-irrigation scheduling.'
  },
  ta: {
    title: 'எல் நினோ (El Niño) மற்றும் பருவமழை தாக்கம்: விவசாயிகளுக்கான வழிகாட்டி',
    subtitle: 'அறிவியல் பூர்வமான தெளிவு மற்றும் பண்ணை தயார்நிலை',
    whatIsIt: 'எல் நினோ என்பது பசிபிக் பெருங்கடலின் மத்திய மற்றும் கிழக்கு பகுதிகளில் கடல் மேற்பரப்பு வெப்பநிலை இயல்பை விட 0.5°C-க்கு மேல் அதிகரிக்கும் ஒரு இயற்கை நிகழ்வு ஆகும். இதனால் உலகளாவிய காற்று சுழற்சி மற்றும் மழைப்பொழிவு வடிவங்கள் மாறுகின்றன.',
    crucialNuanceTitle: 'முக்கிய அறிவியல் உண்மை: எல் நினோ என்பது எப்போதும் வறட்சி அல்ல',
    crucialNuanceBody: 'எல் நினோ காலத்தில் இந்தியாவில் தென்மேற்கு பருவமழை சில பகுதிகளில் குறைய வாய்ப்புள்ளது உண்மைதான். ஆனால் அது எப்போதுமே கடுமையான வறட்சியை ஏற்படுத்தும் என்று பொருளல்ல. இந்திய வானிலை ஆய்வு மையத்தின் (IMD) வரலாற்று தரவுகளின்படி, ஏறத்தாழ 40% எல் நினோ ஆண்டுகளில் இயல்பான அல்லது இயல்பை விட கூடுதலான மழை பதிவாகியுள்ளது. இதற்கு காரணம், இந்தியப் பெருங்கடல் இருமுனை (Positive IOD) சாதகமாக அமைந்தால், எல் நினோவின் தாக்கத்தை சமன் செய்து நல்ல மழையை வழங்கிவிடும்.',
    tamilNaduSpecifics: 'தமிழ்நாட்டைப் பொறுத்தவரை: தென்மேற்கு பருவமழை (ஜூன்-செப்) மேற்கு மாவட்டங்களில் லேசான இடைவெளி கண்டாலும், வடகிழக்கு பருவமழை (அக்டோபர்-டிசம்பர்) காலத்தில் எல் நினோ ஆண்டுகளில் காவிரி டெல்டா மற்றும் கடலோரப் பகுதிகளில் இயல்பான அல்லது கூடுதல் மழை கிடைப்பதாக வானிலை ஆய்வுகள் தெரிவிக்கின்றன.',
    keyTakeaway: 'பயப்பட தேவையில்லை! பயிர் திட்டமிடல், பண்ணைக் குட்டை நீர் சேமிப்பு, நுண்ணீர் பாசனம் மற்றும் சொட்டுநீர் உரமிடுதல் மூலம் அபாயங்களை முழுமையாக குறைக்கலாம்.'
  }
};

export const EL_NINO_IMPACT_PILLARS = [
  {
    id: 'rainfall',
    title: 'Rainfall Variability & Dry Spells',
    titleTa: 'மழைப்பொழிவு மாறுபாடு மற்றும் இடைவெளிகள்',
    icon: 'CloudRain',
    color: '#0284c7',
    bg: '#f0f9ff',
    riskLevel: 'Moderate to High',
    description: 'Monsoon onset may be delayed or interrupted by prolonged dry spells (10–18 days) between precipitation events.',
    descriptionTa: 'பருவமழை தொடங்குவதில் தாமதம் அல்லது மழைக்கிடையே 10 முதல் 18 நாட்கள் வரை நீண்ட இடைவெளி ஏற்பட வாய்ப்புள்ளது.',
    actionableAdvice: [
      'Create broad bed and furrows (BBF) to capture sudden heavy runoff.',
      'Maintain farm ponds to harvest surplus water from episodic cloud bursts.',
      'Practice summer ploughing to improve soil water infiltration.'
    ]
  },
  {
    id: 'water',
    title: 'Groundwater & Reservoir Storage',
    titleTa: 'நிலத்தடி நீர் மற்றும் அணைகளின் இருப்பு',
    icon: 'Droplet',
    color: '#0369a1',
    bg: '#e0f2fe',
    riskLevel: 'Moderate',
    description: 'Surface reservoirs and tank storage may face reduced inflows, leading to canal rotational supply and higher reliance on borewells.',
    descriptionTa: 'அணைகள் மற்றும் ஏரிகளில் நீர் வரத்து குறைந்து முறைப்பாசனம் அமல்படுத்தப்படலாம்; ஆழ்துளை கிணற்று பாசனம் அதிகரிக்கலாம்.',
    actionableAdvice: [
      'Adopt Alternate Wetting and Drying (AWD) in paddy to save 25–30% irrigation water.',
      'Install drip or sprinkler systems under 100% government micro-irrigation subsidy.',
      'Irrigate during evening or night hours to curb evaporative losses.'
    ]
  },
  {
    id: 'heat',
    title: 'Thermal Stress & Evapotranspiration',
    titleTa: 'வெப்ப அழுத்தம் மற்றும் ஆவியாதல் அதிகரிப்பு',
    icon: 'Thermometer',
    color: '#ea580c',
    bg: '#fff7ed',
    riskLevel: 'High during Flowering',
    description: 'Elevated daytime temperatures (1.5–2.5°C above seasonal mean) accelerate soil moisture depletion and induce pollen sterility in cereals.',
    descriptionTa: 'பகல் நேர வெப்பநிலை 1.5 முதல் 2.5°C வரை உயர்வதால் நிலத்தின் ஈரப்பதம் விரைந்து உலர்ந்து பூக்கும் தருணத்தில் மகரந்தச் சேர்க்கை பாதிக்கப்படலாம்.',
    actionableAdvice: [
      'Apply organic coir pith mulching or crop residue mulch to preserve root-zone moisture.',
      'Foliar spray of 1% Potassium Chloride (KCl) or 2% DAP at flowering to improve drought tolerance.',
      'Spray Pink Pigmented Facultative Methylotrophs (PPFM) at 500 ml/acre to reduce transpiration.'
    ]
  },
  {
    id: 'crops',
    title: 'Crop Selection & Contingency Planning',
    titleTa: 'மாற்று பயிர் தேர்வு மற்றும் தற்செயல் திட்டமிடல்',
    icon: 'Sprout',
    color: '#15803d',
    bg: '#f0fdf4',
    riskLevel: 'Manageable with Variety Choice',
    description: 'Long-duration, water-guzzling varieties face higher risk. Contingency planning with drought-hardy and short-duration cultivars is essential.',
    descriptionTa: 'நீண்டகால, அதிக நீர் தேவைப்படும் பயிர்களை விட குறுகிய கால வறட்சி தாங்கும் ரகங்களை தேர்வு செய்வதே சிறந்தது.',
    actionableAdvice: [
      'In delta areas, choose short-duration paddy varieties like ADT 53, CO 51, or ASD 16.',
      'Consider dryland crops: Pearl millet (Cumbu), Finger millet (Ragi), or Black gram (VBN 8 / VBN 11).',
      'Adopt Direct Seeded Rice (DSR) with seed priming (soaking in 1% KCl for 12 hours).'
    ]
  },
  {
    id: 'livestock',
    title: 'Livestock Care & Fodder Security',
    titleTa: 'கால்நடை பராமரிப்பு மற்றும் தீவனப் பாதுகாப்பு',
    icon: 'ShieldAlert',
    color: '#7c3aed',
    bg: '#f5f3ff',
    riskLevel: 'Moderate to High',
    description: 'Heat stress suppresses milk yield by 15–20% and reduces conception rates in cattle. Green fodder availability declines in summer dry spells.',
    descriptionTa: 'அதிக வெப்பத்தால் கறவை மாடுகளின் பால் உற்பத்தி 15–20% குறையலாம்; பசுந்தீவன தட்டுப்பாடு ஏற்படக்கூடும்.',
    actionableAdvice: [
      'Provide continuous cool drinking water with electrolyte or mineral mixtures.',
      'Prepare silage from surplus maize/sorghum fodder before dry spells begin.',
      'Provide thatch or green shading nets over cattle sheds and sprinkle water on roofs at noon.'
    ]
  }
];

export const TN_DISTRICT_AGRO_ZONES = [
  { id: 'thanjavur', name: 'Thanjavur (Cauvery Delta)', zone: 'Delta Zone', riskFactor: 'Water Canal Rationing' },
  { id: 'tiruvarur', name: 'Tiruvarur (Cauvery Delta)', zone: 'Delta Zone', riskFactor: 'Tail-end Drainage & Salinity' },
  { id: 'nagapattinam', name: 'Nagapattinam (Coastal Delta)', zone: 'Delta Zone', riskFactor: 'Coastal Dry Spells' },
  { id: 'erode', name: 'Erode (Western Agro-Corridor)', zone: 'Western Zone', riskFactor: 'Borewell & Soil Drying' },
  { id: 'coimbatore', name: 'Coimbatore (Western Agro-Corridor)', zone: 'Western Zone', riskFactor: 'Evaporative Heat' },
  { id: 'tiruppur', name: 'Tiruppur (Western Agro-Corridor)', zone: 'Western Zone', riskFactor: 'Rainfed Dry Spells' },
  { id: 'salem', name: 'Salem (North Western Zone)', zone: 'North Western Zone', riskFactor: 'Thermal Stress on Millets' },
  { id: 'dharmapuri', name: 'Dharmapuri (North Western Zone)', zone: 'North Western Zone', riskFactor: 'Groundwater Depletion' },
  { id: 'dindigul', name: 'Dindigul (Southern Zone)', zone: 'Southern Zone', riskFactor: 'Vegetable Flower Drop' },
  { id: 'madurai', name: 'Madurai (Southern Zone)', zone: 'Southern Zone', riskFactor: 'Heat Shock on Pulses' },
  { id: 'ramanathapuram', name: 'Ramanathapuram (Coastal Dry Zone)', zone: 'Southern Zone', riskFactor: 'High Water Deficit' },
  { id: 'trichy', name: 'Tiruchirappalli (Central Zone)', zone: 'Central Zone', riskFactor: 'Canal Uncertainty' }
];

export const CROPS_CATALOG = [
  { id: 'paddy', name: 'Paddy (Rice / நெல்)', waterNeed: 'High', sensitivity: 'Critical at Flowering' },
  { id: 'turmeric', name: 'Turmeric (மஞ்சள்)', waterNeed: 'Medium-High', sensitivity: 'Rhizome Development' },
  { id: 'sugarcane', name: 'Sugarcane (கரும்பு)', waterNeed: 'High', sensitivity: 'Formative Phase' },
  { id: 'cotton', name: 'Cotton (பருத்தி)', waterNeed: 'Medium', sensitivity: 'Boll Formation' },
  { id: 'maize', name: 'Maize / Corn (மக்காச்சோளம்)', waterNeed: 'Medium', sensitivity: 'Tasseling & Silking' },
  { id: 'banana', name: 'Banana (வாழை)', waterNeed: 'Very High', sensitivity: 'Shooting & Fruit Filling' },
  { id: 'groundnut', name: 'Groundnut (நிலக்கடலை)', waterNeed: 'Medium-Low', sensitivity: 'Pegging & Pod Filling' },
  { id: 'pulses', name: 'Pulses (Blackgram/Greengram / உளுந்து)', waterNeed: 'Low', sensitivity: 'Pod Setting' },
  { id: 'millets', name: 'Millets (Ragi/Bajra / சிறுதானியங்கள்)', waterNeed: 'Very Low (Drought Hardy)', sensitivity: 'Grain Filling' },
  { id: 'vegetables', name: 'Vegetables (Tomato/Chilli / காய்கறிகள்)', waterNeed: 'Medium', sensitivity: 'Flowering & Fruit Set' }
];

export const CROP_STAGES = [
  { id: 'sowing', label: 'Sowing / Germination / Nursery (விதைப்பு / நாற்று)' },
  { id: 'vegetative', label: 'Vegetative Growth / Tillering (வளர்ச்சிப் பருவம்)' },
  { id: 'flowering', label: 'Flowering / Anthesis (பூக்கும் பருவம் - அதிக உணர்திறன்)' },
  { id: 'grain_filling', label: 'Grain / Pod / Fruit Filling (பால் பிடிக்கும் / காய் வளர்ச்சி)' },
  { id: 'harvesting', label: 'Maturity & Harvesting (முதிர்ச்சி & அறுவடை)' }
];

export const IRRIGATION_TYPES = [
  { id: 'rainfed', label: 'Rainfed (Monsoon Dependent / மானாவாரி)' },
  { id: 'borewell', label: 'Borewell / Open Well (ஆழ்துளை / கிணற்று பாசனம்)' },
  { id: 'canal_tank', label: 'Canal / Public Tank System (கால்வாய் / ஏரிப் பாசனம்)' },
  { id: 'drip_sprinkler', label: 'Drip / Sprinkler Micro-irrigation (சொட்டுநீர் / தெளிப்புநீர்)' }
];

/**
 * Dynamic Agronomic Preparedness Guidance Generator
 */
export const getPreparednessGuidance = ({ district, crop, stage, irrigation }) => {
  let riskScore = 40; // baseline 0-100
  const recommendations = [];
  const alerts = [];

  // Stage-based rules
  if (stage === 'flowering') {
    riskScore += 25;
    alerts.push({
      type: 'warning',
      text: 'Flowering stage is highly susceptible to heat and moisture stress. Even a 3-day dry spell can cause substantial pollen desiccation.'
    });
    recommendations.push('Foliar spray of 1% Potassium Chloride (KCl) or 2% Diammonium Phosphate (DAP) during early morning to reduce flower abscission.');
    recommendations.push('Ensure soil remains at field capacity; avoid moisture stress between 09:00 AM and 03:00 PM.');
  } else if (stage === 'sowing') {
    riskScore += 15;
    recommendations.push('Practice seed priming: soak seeds in 1% KCl or Pseudomonas fluorescens solution for 12 hours before sowing to enhance seedling vigor.');
    recommendations.push('Delay transplanting until sufficient water is guaranteed in canal or tank reserves.');
  } else if (stage === 'grain_filling') {
    riskScore += 15;
    recommendations.push('Apply light, frequent irrigations rather than heavy inundation to prevent terminal heat stress.');
    recommendations.push('Monitor for aphid and mite outbreaks which thrive in dry, warm weather.');
  }

  // Irrigation-based rules
  if (irrigation === 'rainfed') {
    riskScore += 25;
    alerts.push({
      type: 'danger',
      text: 'Rainfed parcel has highest exposure to erratic rainfall distribution during El Niño phases.'
    });
    recommendations.push('Apply coir pith or paddy straw mulch at 5 tonnes/ha across crop rows to retain capillary moisture.');
    recommendations.push('Dig in-situ trenches or compartment bunding to hold every drop of episodic rainfall.');
    recommendations.push('If prolonged drought is anticipated, consider intercropping with drought-resilient pigeonpea or horsegram.');
  } else if (irrigation === 'canal_tank') {
    riskScore += 15;
    recommendations.push('Form water user associations to organize rotational canal rationing (Warabandi system).');
    recommendations.push('Pump tail-end drainage water into farm ponds as an emergency buffer.');
  } else if (irrigation === 'drip_sprinkler') {
    riskScore -= 15;
    recommendations.push('Maintain precise fertigation scheduling during night hours (07:00 PM – 11:00 PM) to optimize water absorption.');
    recommendations.push('Check dripper emitters for salt crusting and flush lines with 0.1% nitric acid if groundwater has high carbonates.');
  }

  // Crop-based rules
  if (crop === 'paddy') {
    riskScore += 10;
    recommendations.push('Adopt Alternate Wetting and Drying (AWD) with a 20-cm perforated field tube; irrigate only when water drops 5 cm below soil surface.');
    recommendations.push('In delta areas, consider switching from long-duration CR 1009 to medium-duration CO 52 or ADT 53.');
  } else if (crop === 'millets') {
    riskScore -= 20;
    recommendations.push('Millets (Ragi, Cumbu, Sorghum) have naturally high water-use efficiency (C4 photosynthesis) and can withstand extended dry spells.');
  } else if (crop === 'banana') {
    riskScore += 15;
    recommendations.push('Provide tree propping against sudden gusts and cover bunches with perforated silver-black reflective sleeves to prevent sun-scald.');
  } else if (crop === 'vegetables') {
    riskScore += 10;
    recommendations.push('Erect 35% shade netting or green shade tunnels over tomato and capsicum nursery beds to counter heat shock.');
  }

  // Bound risk score between 10 and 95
  const normalizedRisk = Math.min(95, Math.max(15, riskScore));
  let riskLevel = 'MODERATE';
  let riskColor = '#f59e0b';

  if (normalizedRisk >= 70) {
    riskLevel = 'ELEVATED';
    riskColor = '#dc2626';
  } else if (normalizedRisk <= 35) {
    riskLevel = 'LOW';
    riskColor = '#16a34a';
  }

  return {
    riskScore: normalizedRisk,
    riskLevel,
    riskColor,
    alerts,
    recommendations
  };
};

export const OFFICIAL_FORECAST_STATUS = {
  statusType: 'DEMO_ADVISORY_STATE', // 'OFFICIAL_DATA_READY' | 'DEMO_ADVISORY_STATE'
  ensoPhase: 'ENSO-Neutral (Transitioning towards El Niño Watch)',
  seaSurfaceAnomaly: '+0.68°C in Niño 3.4 Region',
  iodStatus: '+0.42°C (Positive Indian Ocean Dipole Favorable for Monsoon)',
  latestUpdateDate: 'September 2026 Monthly Climate Diagnostic',
  verifiedSources: [
    {
      name: 'India Meteorological Department (IMD Pune / New Delhi)',
      role: 'Official Seasonal Long-Range Monsoon Forecast & Agromet Advisories',
      url: 'https://mausam.imd.gov.in',
      badge: 'National Mandate'
    },
    {
      name: 'NOAA Climate Prediction Center (CPC / IRI ENSO Diagnostic)',
      role: 'Global Equatorial Pacific Ocean-Atmosphere Diagnostic Bulletin',
      url: 'https://www.cpc.ncep.noaa.gov',
      badge: 'Global Observation'
    },
    {
      name: 'TNAU Agro Climate Research Centre (ACRC, Coimbatore)',
      role: 'Tamil Nadu Agro-Climatic Zone Agrometeorological Bulletins',
      url: 'https://agritech.tnau.ac.in',
      badge: 'State Agricultural University'
    }
  ],
  disclaimer: 'The climate indices, anomalies, and status presented in this advisory module are aggregated from published agrometeorological advisories and sample simulation data for farmer preparedness. They do NOT constitute an individualized real-time meteorological guarantee or legal forecast. Always cross-check with your local district Agromet Field Unit (AMFU) and Block Assistant Director of Agriculture (ADA).'
};
