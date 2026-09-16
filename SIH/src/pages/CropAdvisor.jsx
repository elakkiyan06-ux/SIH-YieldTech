import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  MapPin,
  CheckCircle2, 
  Info,
  ArrowLeft,
  Thermometer,
  Droplets,
  Layers
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import indianStatesData from '../data/indianStates.json';
import { CROPS_DB } from '../data/cropsDb.js';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCropReport } from '../utils/reportLocalization';

const STATE_OPTIONS = indianStatesData.states.map(s => ({ label: s.state, value: s.state }));
const CITIES_BY_STATE = {};
indianStatesData.states.forEach(s => {
  CITIES_BY_STATE[s.state] = s.districts;
});

// --- ADAPTIVE QUESTION ENGINE ---

const LOCALIZED_QUESTIONS = {
  en: {
    state: "Which State is your field located in?",
    city: "Which District/City is your field located in?",
    water_availability: "What is the primary source of water?",
    water_options: {
      rainfed: "Rainfed (No Irrigation)",
      irrigated: "Irrigated (Reliable Well/Canal)",
      partial: "Partially Irrigated (Limited)"
    },
    planting_date: "When do you intend to plant?",
    land_area: "What is the cultivable land area (in acres)?",
    has_soil_test: "Do you have a recent soil test report for this field?",
    soil_ph: "What is the exact soil pH from your report?",
    welcome_title: "Welcome to Smart Crop Advisor",
    welcome_desc: "We will ask a few targeted questions about your field and provide highly accurate crop recommendations based on real-time weather and soil data.",
    start_btn: "Start Questionnaire",
    select_option: "Select an option...",
    yes: "Yes",
    no: "No",
    processing: "Processing...",
    next: "Next",
    back: "Back",
    edit_inputs: "Edit Inputs",
    top_match: "Top Match",
    overall_score: "Overall Score",
    breakdown_title: "Suitability Breakdown Analysis",
    climate_align: "Climate Alignment",
    soil_chem: "Soil Chemistry",
    water_feas: "Water Feasibility",
    risks_title: "Agronomic Risks Detected",
    confidence_level: "Data Confidence Level",
    agri_report_title: "Comprehensive Agronomic Management Plan"
  },
  ta: {
    state: "உங்கள் விவசாய நிலம் எந்த மாநிலத்தில் உள்ளது?",
    city: "உங்கள் நிலம் எந்த மாவட்டத்தில் உள்ளது?",
    water_availability: "உங்கள் முதன்மை நீர் ஆதாரம் எது?",
    water_options: {
      rainfed: "மானாவாரி (மழைநீர் மட்டும்)",
      irrigated: "பாசன வசதி (கிணறு / வாய்க்கால்)",
      partial: "பகுதி பாசனம் (குறைந்த நீர்)"
    },
    planting_date: "எப்போது நடவு/விதைக்க திட்டமிட்டுள்ளீர்கள்?",
    land_area: "பயிரிடக்கூடிய நிலத்தின் பரப்பளவு (ஏக்கரில்)?",
    has_soil_test: "சமீபத்திய மண் பரிசோதனை அறிக்கை உங்களிடம் உள்ளதா?",
    soil_ph: "அறிக்கையில் உள்ள துல்லியமான மண் pH அளவு என்ன?",
    welcome_title: "ஸ்மார்ட் பயிர் ஆலோசகருக்கு வரவேற்கிறோம்",
    welcome_desc: "உங்கள் நிலத்தைப் பற்றிய சில கேள்விகளைக் கேட்போம். செயற்கைக்கோள் வானிலை மற்றும் மண் தரவுகளின் அடிப்படையில் மிகச் சிறந்த பயிர் பரிந்துரைகளை வழங்குவோம்.",
    start_btn: "பரிசோதனையைத் தொடங்குக",
    select_option: "தேர்ந்தெடுக்கவும்...",
    yes: "ஆம்",
    no: "இல்லை",
    processing: "செயலாக்குகிறது...",
    next: "அடுத்து",
    back: "பின்",
    edit_inputs: "விவரங்களை மாற்று",
    top_match: "முதல் தர பரிந்துரை",
    overall_score: "ஒட்டுமொத்த தகுதி",
    breakdown_title: "தகுதி பகுப்பாய்வு விவரங்கள்",
    climate_align: "காலநிலை பொருத்தம்",
    soil_chem: "மண் வேதியியல் தகுதி",
    water_feas: "நீர்ப் பாசன சாத்தியம்",
    risks_title: "கண்டறியப்பட்ட வேளாண் இடர்கள்",
    confidence_level: "தரவு நம்பகத்தன்மை அளவு",
    agri_report_title: "விரிவான வேளாண் மேலாண்மை அறிக்கை"
  },
  hi: {
    state: "आपका खेत किस राज्य में स्थित है?",
    city: "आपका खेत किस जिले में स्थित है?",
    water_availability: "पानी का मुख्य स्रोत क्या है?",
    water_options: {
      rainfed: "वर्षा आधारित (सिंचाई नहीं)",
      irrigated: "सिंचित (कुआं / नहर)",
      partial: "आंशिक रूप से सिंचित (सीमित पानी)"
    },
    planting_date: "आप कब बुवाई करने की योजना बना रहे हैं?",
    land_area: "कृषि योग्य भूमि का क्षेत्रफल (एकड़ में)?",
    has_soil_test: "क्या आपके पास हाल ही की मिट्टी परीक्षण रिपोर्ट है?",
    soil_ph: "आपकी रिपोर्ट के अनुसार मिट्टी का सटीक pH क्या है?",
    welcome_title: "स्मार्ट फसल सलाहकार में आपका स्वागत है",
    welcome_desc: "हम आपके खेत के बारे में कुछ लक्षित प्रश्न पूछेंगे और वास्तविक मौसम व मिट्टी डेटा के आधार पर सटीक फसल अनुशंसाएं देंगे।",
    start_btn: "प्रश्नावली शुरू करें",
    select_option: "एक विकल्प चुनें...",
    yes: "हाँ",
    no: "नहीं",
    processing: "प्रक्रिया जारी है...",
    next: "अगला",
    back: "पीछे",
    edit_inputs: "विवरण संपादित करें",
    top_match: "शीर्ष उपयुक्त फसल",
    overall_score: "कुल स्कोर",
    breakdown_title: "उपयुक्तता विश्लेषण",
    climate_align: "जलवायु अनुकूलता",
    soil_chem: "मिट्टी की उर्वरता",
    water_feas: "जल उपलब्धता",
    risks_title: "कृषि संबंधी जोखिम",
    confidence_level: "डेटा सटीकता स्तर",
    agri_report_title: "व्यापक कृषि प्रबंधन योजना रिपोर्ट"
  },
  te: {
    state: "మీ పొలం ఏ రాష్ట్రంలో ఉంది?",
    city: "మీ పొలం ఏ జిల్లాలో ఉంది?",
    water_availability: "ప్రధాన నీటి వనరు ఏమిటి?",
    water_options: {
      rainfed: "వర్షాధారం (నీటిపారుదల లేదు)",
      irrigated: "నీటిపారుదల (బావి / కాలువ)",
      partial: "పాక్షిక నీటిపారుదల"
    },
    planting_date: "మీరు ఎప్పుడు నాటాలని అనుకుంటున్నారు?",
    land_area: "సాగు భూమి విస్తీర్ణం (ఎకరాల్లో)?",
    has_soil_test: "మీ వద్ద ఇటీవలి నేల పరీక్ష నివేదిక ఉందా?",
    soil_ph: "మీ నివేదిక ప్రకారం నేల pH ఎంత?",
    welcome_title: "స్మార్ట్ క్రాప్ అడ్వైజర్‌కు స్వాగతం",
    welcome_desc: "మేము మీ పొలం గురించి కొన్ని ప్రశ్నలు అడుగుతాము మరియు నిజ-సమయ వాతావరణం ఆధారంగా ఖచ్చితమైన పంట సిఫార్సులను అందిస్తాము.",
    start_btn: "ప్రారంభించండి",
    select_option: "ఎంచుకోండి...",
    yes: "అవును",
    no: "కాదు",
    processing: "ప్రాసెస్ చేస్తోంది...",
    next: "తరువాత",
    back: "వెనుకకు",
    edit_inputs: "సవరించండి",
    top_match: "ఉత్తమ సిఫార్సు",
    overall_score: "మొత్తం స్కోరు",
    breakdown_title: "అనుకూలత విశ్లేషణ",
    climate_align: "వాతావరణ అనుకూలత",
    soil_chem: "నేల స్వభావం",
    water_feas: "నీటి లభ్యత",
    risks_title: "వ్యవసాయ ప్రమాదాలు",
    confidence_level: "సమాచార ఖచ్చితత్వ స్థాయి",
    agri_report_title: "సమగ్ర వ్యవసాయ యాజమాన్య ప్రణాళిక నివేదిక"
  },
  kn: {
    state: "ನಿಮ್ಮ ಜಮೀನು ಯಾವ ರಾಜ್ಯದಲ್ಲಿದೆ?",
    city: "ನಿಮ್ಮ ಜಮೀನು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿದೆ?",
    water_availability: "ನೀರಿನ ಮುಖ್ಯ ಮೂಲ ಯಾವುದು?",
    water_options: {
      rainfed: "ಮಳೆ ಆಶ್ರಿತ (ನೀರಾವರಿ ಇಲ್ಲ)",
      irrigated: "ನೀರಾವರಿ (ಬಾವಿ / ಕಾಲುವೆ)",
      partial: "ಭಾಗಶಃ ನೀರಾವರಿ"
    },
    planting_date: "ನೀವು ಯಾವಾಗ ಬಿತ್ತನೆ ಮಾಡಲು ಉದ್ದೇಶಿಸಿದ್ದೀರಿ?",
    land_area: "ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ (ಎಕರೆಗಳಲ್ಲಿ)?",
    has_soil_test: "ಇತ್ತೀಚಿನ ಮಣ್ಣು ಪರೀಕ್ಷಾ ವರದಿ ನಿಮ್ಮ ಬಳಿ ಇದೆಯೇ?",
    soil_ph: "ವರದಿಯ ಪ್ರಕಾರ ಮಣ್ಣಿನ pH ಎಷ್ಟು?",
    welcome_title: "ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಸಲಹೆಗಾರರಿಗೆ ಸುಸ್ವಾಗತ",
    welcome_desc: "ನಿಮ್ಮ ಜಮೀನಿನ ಬಗ್ಗೆ ನಾವು ಕೆಲವು ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುತ್ತೇವೆ ಮತ್ತು ಅತ್ಯಂತ ನಿಖರವಾದ ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.",
    start_btn: "ಪ್ರಾರಂಭಿಸಿ",
    select_option: "ಆಯ್ಕೆಮಾಡಿ...",
    yes: "ಹೌದು",
    no: "ಇಲ್ಲ",
    processing: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    next: "ಮುಂದೆ",
    back: "ಹಿಂದೆ",
    edit_inputs: "ತಿದ್ದುಪಡಿ ಮಾಡಿ",
    top_match: "ಉತ್ತಮ ಬೆಳೆ",
    overall_score: "ಒಟ್ಟಾರೆ ಸ್ಕೋರ್",
    breakdown_title: "ಸೂಕ್ತತೆಯ ವಿಶ್ಲೇಷಣೆ",
    climate_align: "ಹವಾಮಾನ ಹೊಂದಾಣಿಕೆ",
    soil_chem: "ಮಣ್ಣಿನ ಫಲವತ್ತತೆ",
    water_feas: "ನೀರಿನ ಲಭ್ಯತೆ",
    risks_title: "ಕೃಷಿ ಅಪಾಯಗಳು",
    confidence_level: "ಮಾಹಿತಿ ನಿಖರತೆಯ ಮಟ್ಟ",
    agri_report_title: "ಸಮಗ್ರ ಕೃಷಿ ನಿರ್ವಹಣಾ ಯೋಜನೆ ವರದಿ"
  },
  ml: {
    state: "നിങ്ങളുടെ കൃഷിഭൂമി ഏത് സംസ്ഥാനത്താണ് സ്ഥിതി ചെയ്യുന്നത്?",
    city: "നിങ്ങളുടെ കൃഷിഭൂമി ഏത് ജില്ലയിലാണ്?",
    water_availability: "പ്രധാന ജലസ്രോതസ്സ് ഏതാണ്?",
    water_options: {
      rainfed: "മഴയെ ആശ്രയിച്ച് (ജലസേചനമില്ല)",
      irrigated: "ജലസേചന സൗകര്യമുള്ളത് (കിണർ / കനാൽ)",
      partial: "ഭാഗിക ജലസേചനം"
    },
    planting_date: "എപ്പോഴാണ് നടാൻ ഉദ്ദേശിക്കുന്നത്?",
    land_area: "കൃഷിഭൂമിയുടെ വിസ്തീർണ്ണം (ഏക്കറിൽ)?",
    has_soil_test: "സമീപകാല മണ്ണുപരിശോധനാ റിപ്പോർട്ട് കൈവശമുണ്ടോ?",
    soil_ph: "റിപ്പോർട്ട് പ്രകാരമുള്ള മണ്ണിന്റെ കൃത്യമായ pH എത്രയാണ്?",
    welcome_title: "സ്മാർട്ട് ക്രോപ്പ് അഡ്വൈസറിലേക്ക് സ്വാഗതം",
    welcome_desc: "ഞങ്ങൾ നിങ്ങളുടെ കൃഷിയിടത്തെക്കുറിച്ച് ചില ചോദ്യങ്ങൾ ചോദിക്കുകയും തത്സമയ കാലാവസ്ഥ അടിസ്ഥാനമാക്കി മികച്ച വിള ശുപാർശകൾ നൽകുകയും ചെയ്യും.",
    start_btn: "ചോദ്യങ്ങൾ ആരംഭിക്കുക",
    select_option: "തിരഞ്ഞെടുക്കുക...",
    yes: "അതെ",
    no: "അല്ല",
    processing: "പ്രോസസ്സ് ചെയ്യുന്നു...",
    next: "അടുത്തത്",
    back: "പിന്നിലേക്ക്",
    edit_inputs: "തിരുത്തുക",
    top_match: "ഏറ്റവും മികച്ച വിള",
    overall_score: "മൊത്തം സ്കോർ",
    breakdown_title: "അനുയോജ്യതാ വിശകലനം",
    climate_align: "കാലാവസ്ഥാ അനുയോജ്യത",
    soil_chem: "മണ്ണിന്റെ ഗുണനിലവാരം",
    water_feas: "ജല ലഭ്യത",
    risks_title: "കാർഷിക അപകടസാധ്യതകൾ",
    confidence_level: "വിവരങ്ങളുടെ കൃത്യതാ നിലവാരം",
    agri_report_title: "സമഗ്ര കാർഷിക പരിപാലന റിപ്പോർട്ട്"
  }
};

const QUESTIONS_KB = [
  { 
    id: "state", 
    question: "Which State is your field located in?", 
    type: "select", 
    options: STATE_OPTIONS,
    importance: 100 
  },
  { 
    id: "city", 
    question: "Which District/City is your field located in?", 
    type: "select", 
    options: [], // Populated dynamically
    importance: 99 
  },
  { 
    id: "water_availability", 
    question: "What is the primary source of water?", 
    type: "select", 
    options: [
      {label: "Rainfed (No Irrigation)", value: "rainfed"},
      {label: "Irrigated (Reliable Well/Canal)", value: "irrigated"},
      {label: "Partially Irrigated (Limited)", value: "partial"}
    ],
    importance: 98 
  },
  { id: "planting_date", question: "When do you intend to plant?", type: "date", importance: 97 },
  { id: "land_area", question: "What is the cultivable land area (in acres)?", type: "number", importance: 96 },
  { id: "has_soil_test", question: "Do you have a recent soil test report for this field?", type: "boolean", importance: 95 },
  { id: "soil_ph", question: "What is the exact soil pH from your report?", type: "number", required_when: {"has_soil_test": true}, importance: 94 }
];

const evaluateCondition = (condition, collectedData) => {
  for (const [key, value] of Object.entries(condition)) {
    if (collectedData[key] !== value) return false;
  }
  return true;
};

const getNextQuestion = (collectedData) => {
  let candidates = [];
  for (let q of QUESTIONS_KB) {
    if (collectedData[q.id] !== undefined) continue;
    if (q.required_when && !evaluateCondition(q.required_when, collectedData)) continue;
    candidates.push(q);
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.importance - a.importance);
  return candidates[0];
};

// --- RECOMMENDATION ENGINE & REAL DATA ---
// CROPS_DB is imported from ../data/cropsDb.js

const generateRecommendations = async (sessionData) => {
  let lat = 11.0;
  let lon = 77.0;
  let weatherData = null;
  let soilData = null;
  let locationName = `${sessionData.city}, ${sessionData.state}`;

  // 1. Geocoding
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`);
    const geoJson = await geoRes.json();
    if (geoJson && geoJson.length > 0) {
      lat = parseFloat(geoJson[0].lat);
      lon = parseFloat(geoJson[0].lon);
      locationName = geoJson[0].display_name.split(',')[0];
    }
  } catch (e) { console.error("Geocoding failed", e); }

  // 2. Fetch Weather and Soil in parallel for speed
  const fetchWeather = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation`)
    .then(res => res.json())
    .then(wJson => { weatherData = wJson.current; })
    .catch(e => console.error("Weather API failed", e));

  let fetchSoil = Promise.resolve();
  if (!sessionData.has_soil_test) {
    fetchSoil = fetch(`https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o&depth=0-5cm&value=mean`)
      .then(res => res.json())
      .then(sJson => {
        const phLayer = sJson.properties?.layers?.find(l => l.name === 'phh2o');
        if (phLayer && phLayer.depths[0]?.values?.mean) {
          soilData = { ph: phLayer.depths[0].values.mean / 10 };
        }
      })
      .catch(e => console.error("Soil API failed", e));
  } else {
    soilData = { ph: parseFloat(sessionData.soil_ph) };
  }

  await Promise.all([fetchWeather, fetchSoil]);
  
  // If fallback fails, default to 6.5
  if (!soilData) {
    soilData = { ph: 6.5 };
  }

  // Confidence calculation
  let confidence = 100.0;
  let missingInfo = [];
  if (!sessionData.has_soil_test) {
    confidence -= 15.0;
    missingInfo.push("Recent laboratory soil test");
  }

  let recommendations = CROPS_DB.map(crop => {
    let climateScore = 50;
    let soilScore = 50;
    let waterScore = 50;

    // Climate Eval: Exact midpoint penalty to prevent ties
    if (weatherData && weatherData.temperature_2m && crop.temp_range) {
      const temp = weatherData.temperature_2m;
      const optMid = (crop.temp_range.optimal_min + crop.temp_range.optimal_max) / 2;
      
      if (temp < crop.temp_range.min || temp > crop.temp_range.max) {
        climateScore = 20.0;
      } else {
        const distToMid = Math.abs(temp - optMid);
        // E.g. temp diff from exact optimal center * penalty factor
        // This ensures continuous fractional variance
        climateScore = Math.max(20.0, 95.0 - (distToMid * 1.5));
      }
    } else {
      climateScore = 60.0;
    }

    // Soil Eval: Exact midpoint penalty to prevent ties
    if (soilData && soilData.ph && crop.soil_ph_range) {
      const ph = soilData.ph;
      const optMid = (crop.soil_ph_range.optimal_min + crop.soil_ph_range.optimal_max) / 2;

      if (ph < crop.soil_ph_range.min || ph > crop.soil_ph_range.max) {
        soilScore = 30.0;
      } else {
        const distToMid = Math.abs(ph - optMid);
        soilScore = Math.max(30.0, 95.0 - (distToMid * 15.0)); 
      }
    } else {
      soilScore = 60.0; 
    }

    // Water Eval: Exact Crop Requirement vs Farm Availability Matrix
    if (sessionData.water_availability === "irrigated") {
      if (crop.water_requirement === "high") waterScore = 95;
      else if (crop.water_requirement === "medium") waterScore = 90;
      else waterScore = 80; // Over-irrigation isn't necessarily bad, but less resource efficient
    } else if (sessionData.water_availability === "partial") {
      if (crop.water_requirement === "high") waterScore = 40;
      else if (crop.water_requirement === "medium") waterScore = 85;
      else waterScore = 95;
    } else if (sessionData.water_availability === "rainfed") {
      if (crop.water_requirement === "high") waterScore = 15;
      else if (crop.water_requirement === "medium") waterScore = 55;
      else waterScore = 90;
    } else {
      waterScore = 50;
    }

    // Regional Relevance Multiplier
    const isRegional = crop.regions.includes(sessionData.state);
    let regionalBonus = isRegional ? 15 : 0; // Huge boost for native/regional crops

    let overall = (climateScore * 0.25) + (soilScore * 0.35) + (waterScore * 0.40);
    overall = Math.min(98, overall + regionalBonus); // Max 98, nothing is perfect

    // If it's not a regional crop and overall is low, it might not even make the list, which is good.

    let risks = [];
    if (sessionData.water_availability === "rainfed" && crop.water_requirement === "high") {
      risks.push({ type: "Drought Risk", mitigation: "Extremely vulnerable without supplemental irrigation." });
    }
    if (soilData && soilData.ph && (soilData.ph < crop.soil_ph_range.min || soilData.ph > crop.soil_ph_range.max)) {
      risks.push({ type: "Soil pH Mismatch", mitigation: `Current pH is ${soilData.ph.toFixed(1)}. Optimal is ${crop.soil_ph_range.min}-${crop.soil_ph_range.max}. Requires soil amendments.` });
    }
    
    // Dynamic Explanation Generation
    let exp = "";
    if (isRegional) {
      exp += `${crop.name} is a major commercial crop traditionally grown in ${sessionData.state}. `;
    } else {
      exp += `While not traditionally dominant in ${sessionData.state}, ${crop.name} can be grown here. `;
    }
    
    // Inject unique agronomic trait
    if (crop.agronomic_trait) {
      exp += `${crop.agronomic_trait} `;
    }
    
    let phText = sessionData.has_soil_test ? `inputted soil pH of ${soilData?.ph}` : `regionally estimated soil pH of ${soilData?.ph?.toFixed(1)}`;
    exp += `Based on your live local temperature of ${weatherData?.temperature_2m}°C and ${phText}, it has a ${overall.toFixed(1)}% suitability match. `;
    
    if (waterScore < 50) {
      exp += `However, your ${sessionData.water_availability} setup poses a significant water feasibility challenge for this crop.`;
    } else if (climateScore > 85 && soilScore > 85) {
      exp += `Your environment provides excellent agronomic conditions.`;
    }

    return {
      crop: crop.name,
      suitabilityScore: overall,
      confidence: confidence,
      soilSuitability: soilScore,
      waterSuitability: waterScore,
      climateSuitability: climateScore,
      risks: risks,
      realData: {
        temp: weatherData?.temperature_2m,
        ph: soilData?.ph
      },
      cropData: crop,
      explanation: exp
    };
  });

  recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  
  return {
    recommendedCrops: recommendations.slice(0, 5),
    confidence: confidence,
    missingInformation: missingInfo,
    locationName: locationName,
    weatherFetched: !!weatherData,
    soilFetched: !sessionData.has_soil_test && !!soilData
  };
};

const ScoreBar = ({ label, score, color, icon: Icon }) => (
  <div style={{ marginBottom: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Icon size={14} color={color} /> {label}
      </span>
      <span style={{ color: score > 80 ? '#16a34a' : score < 50 ? '#ef4444' : '#d97706' }}>
        {score.toFixed(0)}%
      </span>
    </div>
    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${score}%`, background: color, transition: 'width 1s ease-out' }}></div>
    </div>
  </div>
);

export const CropAdvisor = () => {
  const { currentLang, t } = useLanguage();
  const qLang = LOCALIZED_QUESTIONS[currentLang] || LOCALIZED_QUESTIONS.en;
  const [collectedData, setCollectedData] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [answer, setAnswer] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const firstQ = getNextQuestion({});
    setCurrentQuestion(firstQ);
  }, []);

  const handleNext = async () => {
    if (!currentQuestion) return;
    setLoading(true);
    
    let submittedValue = answer;
    if (currentQuestion.type === 'boolean') {
      submittedValue = answer === 'true';
    } else if (currentQuestion.type === 'number') {
      submittedValue = parseFloat(answer);
    }

    const newCollected = { ...collectedData, [currentQuestion.id]: submittedValue };
    setCollectedData(newCollected);
    setQuestionHistory([...questionHistory, currentQuestion]);
    
    const nextQ = getNextQuestion(newCollected);
    
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setAnswer('');
      setLoading(false);
    } else {
      setCurrentQuestion(null);
      const recs = await generateRecommendations(newCollected);
      setRecommendations(recs);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (questionHistory.length === 0) return;
    
    const prevQ = questionHistory[questionHistory.length - 1];
    const newHistory = questionHistory.slice(0, -1);
    setQuestionHistory(newHistory);
    
    const newCollected = { ...collectedData };
    delete newCollected[prevQ.id];
    setCollectedData(newCollected);
    
    setCurrentQuestion(prevQ);
    setAnswer('');
    setRecommendations(null);
  };

  return (
    <div className="advisor-page">
      <div className="page-header">
        <h1 className="page-title">
          <Sprout size={28} color="#16a34a" /> Real-Time Crop Advisor
        </h1>
        <p className="page-subtitle">
          Adaptive agronomic engine.
        </p>
      </div>

      <div className="advisor-layout-grid" style={{ gridTemplateColumns: recommendations ? '1fr' : '1fr', maxWidth: recommendations ? '900px' : '600px', margin: '0 auto' }}>
        
        {/* Intro Page UI */}
        {!hasStarted && (
          <div className="farm-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '50%' }}>
                <Sprout size={48} color="#16a34a" />
              </div>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              {qLang.welcome_title}
            </h2>
            <p style={{ color: '#475569', marginBottom: '32px', lineHeight: 1.6, fontSize: '1.05rem', maxWidth: '400px', margin: '0 auto 32px auto' }}>
              {qLang.welcome_desc}
            </p>
            <button 
              className="btn btn-primary" 
              style={{ padding: '14px 40px', fontSize: '1.1rem', fontWeight: 600, borderRadius: '8px' }}
              onClick={() => setHasStarted(true)}
            >
              {qLang.start_btn}
            </button>
          </div>
        )}

        {/* Adaptive Question Engine UI */}
        {hasStarted && !recommendations && currentQuestion && (
          <div className="farm-card" style={{ padding: '32px' }}>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>
              {qLang[currentQuestion.id] || currentQuestion.question}
            </h2>

            <div style={{ marginBottom: '24px' }}>
              {currentQuestion.type === 'select' && (
                <select className="form-select" value={answer} onChange={(e) => setAnswer(e.target.value)}>
                  <option value="">{qLang.select_option}</option>
                  {(currentQuestion.id === 'city' && collectedData.state 
                    ? (CITIES_BY_STATE[collectedData.state] || []).map(c => ({label: c, value: c})) 
                    : currentQuestion.options).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}

              {currentQuestion.type === 'boolean' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className={`btn ${answer === 'true' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setAnswer('true')}
                    style={{ flex: 1 }}
                  >{qLang.yes}</button>
                  <button 
                    className={`btn ${answer === 'false' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setAnswer('false')}
                    style={{ flex: 1 }}
                  >{qLang.no}</button>
                </div>
              )}

              {(currentQuestion.type === 'text' || currentQuestion.type === 'number' || currentQuestion.type === 'date') && (
                <input 
                  type={currentQuestion.type} 
                  className="form-input" 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={currentQuestion.type === 'text' ? "e.g., Coimbatore" : ""}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {questionHistory.length > 0 && (
                <button 
                  className="btn btn-outline"
                  style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={handleBack}
                  disabled={loading}
                >
                  <ArrowLeft size={18} /> {qLang.back}
                </button>
              )}
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '14px' }}
                onClick={handleNext}
                disabled={loading || !answer}
              >
                {loading ? qLang.processing : qLang.next}
              </button>
            </div>
          </div>
        )}

        {/* Results UI */}
        {recommendations && (
          <div className="advisor-result-column" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Action Bar & Global Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="#16a34a" /> {recommendations.locationName}
                </h3>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Thermometer size={14} color="#3b82f6" /> {recommendations.weatherFetched ? "Live Weather" : "Default Weather"}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={14} color="#b45309" /> {collectedData.has_soil_test ? `User Provided pH: ${collectedData.soil_ph}` : (recommendations.soilFetched ? "Geo-Estimated Soil" : "Default Soil")}
                  </span>
                </div>
              </div>
              <button className="btn btn-outline" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> {qLang.edit_inputs}
              </button>
            </div>

            {/* Recommendations List */}
            <div style={{ display: 'grid', gap: '24px' }}>
              {recommendations.recommendedCrops.map((rec, idx) => (
                <div key={idx} className="farm-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: idx === 0 ? '4px solid #16a34a' : 'none', padding: '24px' }}>
                  
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      {idx === 0 && <span className="badge badge-green" style={{ marginBottom: '12px', display: 'inline-block' }}>{qLang.top_match}</span>}
                      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{rec.crop}</h2>
                      <p style={{ color: '#475569', fontSize: '0.95rem', marginTop: '4px', maxWidth: '500px' }}>{rec.explanation}</p>
                    </div>
                    <div style={{ textAlign: 'right', background: '#f8fafc', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{qLang.overall_score}</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: rec.suitabilityScore > 80 ? '#16a34a' : '#d97706' }}>
                        {rec.suitabilityScore.toFixed(1)}<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/100</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytical Breakdown Bars */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '8px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>{qLang.breakdown_title}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ScoreBar label={qLang.climate_align} score={rec.climateSuitability} color="#3b82f6" icon={Thermometer} />
                        {rec.realData.temp && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '-12px' }}>
                            Based on local temp: <strong>{rec.realData.temp}°C</strong><br/>
                            <span style={{opacity: 0.8}}>(Optimal: {rec.cropData.temp_range.optimal_min}-{rec.cropData.temp_range.optimal_max}°C)</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ScoreBar label={qLang.soil_chem} score={rec.soilSuitability} color="#b45309" icon={Layers} />
                        {rec.realData.ph && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '-12px' }}>
                            {collectedData.has_soil_test ? (
                              <>Based on pH: <strong>{rec.realData.ph.toFixed(1)}</strong></>
                            ) : (
                              <>Estimated based on region: <strong>{rec.realData.ph.toFixed(1)}</strong></>
                            )}
                            <br/>
                            <span style={{opacity: 0.8}}>(Optimal: {rec.cropData.soil_ph_range.optimal_min}-{rec.cropData.soil_ph_range.optimal_max})</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ScoreBar label={qLang.water_feas} score={rec.waterSuitability} color="#0284c7" icon={Droplets} />
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '-12px' }}>
                          Based on <strong>{collectedData.water_availability}</strong> inputs
                        </div>
                      </div>

                    </div>
                  </div>
                  

                  {/* Localized Comprehensive Agronomic Report */}
                  {(() => {
                    const localizedReport = getLocalizedCropReport(rec.crop, collectedData.soil_type || 'Red Loam', collectedData.land_area, currentLang);
                    return (
                      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '18px 20px', marginTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 800, fontSize: '1.05rem', marginBottom: '10px' }}>
                          <CheckCircle2 size={20} color="#16a34a" />
                          <span>{localizedReport.title}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.88rem', color: '#166534', marginBottom: '8px' }}>
                          <div>🌾 <strong>{t('expected_yield') || 'Yield'}:</strong> {localizedReport.expectedYield}</div>
                          <div>🧪 <strong>{t('suitability') || 'Suitability'}:</strong> {localizedReport.suitability}</div>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#15803d', marginBottom: '6px', lineHeight: 1.5 }}>
                          💧 <strong>{t('irrigation') || 'Water'}:</strong> {localizedReport.waterSchedule}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#15803d', marginBottom: '6px', lineHeight: 1.5 }}>
                          🌱 <strong>NPK:</strong> {localizedReport.npkRecommendation}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#166534', lineHeight: 1.5, background: 'rgba(255,255,255,0.7)', padding: '8px 12px', borderRadius: '8px' }}>
                          ⚡ <strong>{t('actionable_advisories') || 'Advisory'}:</strong> {localizedReport.keyAction}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Risks Alert Box */}
                  {rec.risks.length > 0 && (
                    <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', gap: '12px' }}>
                      <Info size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <h4 style={{ color: '#991b1b', fontWeight: 700, marginBottom: '4px' }}>{qLang.risks_title}</h4>
                        <ul style={{ paddingLeft: '16px', color: '#7f1d1d', margin: 0, fontSize: '0.9rem' }}>
                          {rec.risks.map((r, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>
                              <strong>{r.type}:</strong> {r.mitigation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
            
            {recommendations.missingInformation.length > 0 && (
              <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a', fontSize: '0.9rem', color: '#92400e', textAlign: 'center' }}>
                <strong>Data Confidence Level: {recommendations.confidence}%</strong> <br/>
                We used geospatial estimates for missing data. To improve accuracy, provide a <strong>{recommendations.missingInformation.join(', ')}</strong> in your next session.
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};
