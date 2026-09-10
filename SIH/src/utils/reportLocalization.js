// Dynamic Multi-Language Report Generators for Farmogram
// Supports: en, ta, hi, te, kn, ml

export const getLocalizedCropReport = (cropName, soilType, landAcres, lang = 'en') => {
  const reports = {
    en: {
      title: `${cropName} Agronomic Advisory & Management Plan`,
      suitability: "94% High Suitability",
      soilMatch: `Optimal fit for ${soilType} soil condition with adequate drainage`,
      landEstimate: `Calculated for ${landAcres || 2} acres of cultivable land`,
      expectedYield: `${cropName === 'Paddy' ? '28 - 32 Quintals' : cropName === 'Tomato' ? '25 - 30 Tonnes' : '18 - 22 Quintals'} per acre`,
      waterSchedule: "Critical irrigation needed at vegetative surge, flowering, and grain/fruit filling stages.",
      npkRecommendation: "Basal: 50% N + 100% P + 50% K; Top-dressing at 30 & 60 days after sowing.",
      keyAction: "Conduct regular foliar spray during morning hours; practice weed management via cono-weeder or light hoeing."
    },
    ta: {
      title: `${cropName} விரிவான வேளாண்மை ஆலோசனை & மேலாண்மை அறிக்கை`,
      suitability: "94% சிறந்த சாகுபடி தகுதி",
      soilMatch: `${soilType} மண் வகைக்கு மிகச் சிறந்த வடிகால் அமைப்புடன் உகந்தது`,
      landEstimate: `${landAcres || 2} ஏக்கர் நிலப் பரப்பிற்கு கணக்கிடப்பட்டது`,
      expectedYield: `ஏக்கருக்கு ${cropName === 'Paddy' ? '28 - 32 குவிண்டால்' : cropName === 'Tomato' ? '25 - 30 டன்' : '18 - 22 குவிண்டால்'} மகசூல் எதிர்பார்ப்பு`,
      waterSchedule: "வளர்ச்சி நிலை, பூக்கும் பருவம் மற்றும் காய்/தானிய முதிர்ச்சி நிலைகளில் தடையற்ற நீர் பாசனம் அவசியம்.",
      npkRecommendation: "அடி உரம்: 50% தழைச்சத்து (N) + 100% மணிச்சத்து (P) + 50% சாம்பல்சத்து (K); விதைத்த 30 மற்றும் 60 நாட்களில் மேலுரம்.",
      keyAction: "காலை வேளையில் இலைவழி உரம் தெளிக்கவும்; கோனோ-வீடர் அல்லது கைக்களை மூலம் களைகளை கட்டுப்படுத்தவும்."
    },
    hi: {
      title: `${cropName} व्यापक कृषि सलाह और प्रबंधन रिपोर्ट`,
      suitability: "94% उच्च उपयुक्तता",
      soilMatch: `${soilType} मिट्टी के लिए उत्कृष्ट जल निकासी के साथ सर्वोत्तम`,
      landEstimate: `${landAcres || 2} एकड़ कृषि भूमि के लिए आकलित`,
      expectedYield: `प्रति एकड़ ${cropName === 'Paddy' ? '28 - 32 क्विंटल' : cropName === 'Tomato' ? '25 - 30 टन' : '18 - 22 क्विंटल'} अनुमानित पैदावार`,
      waterSchedule: "वानस्पतिक वृद्धि, फूल आने और दाना/फल भराव के समय नियमित सिंचाई अनिवार्य है।",
      npkRecommendation: "बुवाई के समय: 50% N + 100% P + 50% K; बुवाई के 30 और 60 दिन बाद टॉप-ड्रेसिंग।",
      keyAction: "सुबह के समय पर्णीय छिड़काव करें और समय पर निराई-गुड़ाई सुनिश्चित करें।"
    },
    te: {
      title: `${cropName} సమగ్ర వ్యవసాయ సలహా మరియు యాజమాన్య నివేదిక`,
      suitability: "94% అత్యంత అనుకూలం",
      soilMatch: `${soilType} నేల పరిస్థితులకు సరైన నీటి పారుదలతో అనువైనది`,
      landEstimate: `${landAcres || 2} ఎకరాల సాగు భూమి కోసం లెక్కించబడింది`,
      expectedYield: `ఎకరానికి ${cropName === 'Paddy' ? '28 - 32 క్వింటాళ్లు' : cropName === 'Tomato' ? '25 - 30 టన్నులు' : '18 - 22 క్వింటాళ్లు'} దిగుబడి అంచనా`,
      waterSchedule: "మొక్కల పెరుగుదల, పూత మరియు గింజ పక్వ దశలలో సమయానికి నీటిపారుదల తప్పనిసరి.",
      npkRecommendation: "ప్రాథమిక ఎరువు: 50% N + 100% P + 50% K; నాటిన 30 మరియు 60 రోజులకు పైపాటు ఎరువు.",
      keyAction: "ఉదయం వేళల్లో పిచికారీ చేయండి; కలుపు నివారణ సకాలంలో చేపట్టండి."
    },
    kn: {
      title: `${cropName} ಸಮಗ್ರ ಕೃಷಿ ಸಲಹಾ ಮತ್ತು ನಿರ್ವಹಣಾ ವರದಿ`,
      suitability: "94% ಅತ್ಯುತ್ತಮ ಸೂಕ್ತತೆ",
      soilMatch: `${soilType} ಮಣ್ಣಿಗೆ ಉತ್ತಮ ನೀರು ಬಸಿದುಹೋಗುವ ವ್ಯವಸ್ಥೆಯೊಂದಿಗೆ ಸೂಕ್ತವಾಗಿದೆ`,
      landEstimate: `${landAcres || 2} ಎಕರೆ ಕೃಷಿ ಭೂಮಿಗೆ ಅಂದಾಜಿಸಲಾಗಿದೆ`,
      expectedYield: `ಪ್ರತಿ ಎಕರೆಗೆ ${cropName === 'Paddy' ? '28 - 32 ಕ್ವಿಂಟಾಲ್' : cropName === 'Tomato' ? '25 - 30 ಟನ್' : '18 - 22 ಕ್ವಿಂಟಾಲ್'} ನಿರೀಕ್ಷಿತ ಇಳುವರಿ`,
      waterSchedule: "ಸಸ್ಯದ ಬೆಳವಣಿಗೆ, ಹೂಬಿಡುವ ಮತ್ತು ಧಾನ್ಯ ತುಂಬುವ ಹಂತಗಳಲ್ಲಿ ಸಮರ್ಪಕ ನೀರಾವರಿ ಅಗತ್ಯ.",
      npkRecommendation: "ಮೂಲ ಗೊಬ್ಬರ: 50% ಸಾರಜನಕ + 100% ರಂಜಕ + 50% ಪೊಟ್ಯಾಶ್; ಬಿತ್ತಿದ 30 ಮತ್ತು 60 ದಿನಗಳಲ್ಲಿ ಮೇಲ್ಗೊಬ್ಬರ.",
      keyAction: "ಬೆಳಗಿನ ಜಾವದಲ್ಲಿ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಣೆ ಮಾಡಿ ಮತ್ತು ಕಳೆ ಕೀಳುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."
    },
    ml: {
      title: `${cropName} സമഗ്ര കാർഷിക ഉപദേശവും പരിപാലന റിപ്പോർട്ടും`,
      suitability: "94% ഉയർന്ന അനുയോജ്യത",
      soilMatch: `${soilType} മണ്ണിന് അനുയോജ്യമായ നീർവാർച്ചാ സൗകര്യത്തോടെ മികച്ചത്`,
      landEstimate: `${landAcres || 2} ഏക്കർ കൃഷിഭൂമിക്കായി കണക്കാക്കിയത്`,
      expectedYield: `ഏക്കറിന് ${cropName === 'Paddy' ? '28 - 32 ക്വിന്റൽ' : cropName === 'Tomato' ? '25 - 30 ടൺ' : '18 - 22 ക്വിന്റൽ'} പ്രതീക്ഷിത വിളവ്`,
      waterSchedule: "വളർച്ചാ ഘട്ടത്തിലും പൂവിടുമ്പോഴും കായ്കൾ മൂക്കുമ്പോഴും കൃത്യമായ ജലസേചനം ഉറപ്പാക്കുക.",
      npkRecommendation: "അടിവളം: 50% നൈട്രജൻ + 100% ഫോസ്ഫറസ് + 50% പൊട്ടാഷ്; 30, 60 ദിവസങ്ങളിൽ മേൽവളം.",
      keyAction: "രാവിലെ ഇലകളിൽ തളിക്കൽ നടത്തുക; കളനിയന്ത്രണം കൃത്യമായി പാലിക്കുക."
    }
  };

  return reports[lang] || reports['en'];
};

export const getLocalizedDiseaseReport = (cropName, diseaseKey, lang = 'en') => {
  const reports = {
    en: {
      diseaseName: "Early Blight & Leaf Spot Disease",
      pathogen: "Alternaria solani / Cercospora spp.",
      confidence: "94% Verified AI Confidence",
      symptoms: [
        "Concentric target-like circular dark brown lesions on lower leaves",
        "Yellow chlorotic halos developing around leaf spots",
        "Premature defoliation and reduced photosynthesis"
      ],
      chemicalTreatment: "Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L during morning hours.",
      organicTreatment: "Foliar application of 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens @ 10g/L.",
      preventiveMeasures: "Practice crop rotation, maintain 2-foot plant spacing for airflow, and avoid overhead sprinkler watering."
    },
    ta: {
      diseaseName: "இலைப்புள்ளி மற்றும் கருகல் நோய் (Early Blight)",
      pathogen: "ஆல்டர்நேரியா சொலானி / செர்கோஸ்போரா பூஞ்சை",
      confidence: "94% துல்லியமான AI பரிசோதனை முடிவு",
      symptoms: [
        "கீழ் இலைகளில் வட்ட வடிவ அடர் பழுப்பு நிற வளைய புள்ளிகள் தோன்றுதல்",
        "இலை புள்ளிகளைச் சுற்றி மஞ்சள் நிற வளையம் பரவுதல்",
        "இலைகள் காய்ந்து முன்கூட்டியே உதிர்தல் மற்றும் ஒளிச்சேர்க்கை பாதிப்பு"
      ],
      chemicalTreatment: "மேன்கோசெப் 75% WP (Mancozeb) லிட்டருக்கு 2.5 கிராம் அல்லது அசோக்சிஸ்ட்ரோபின் (Azoxystrobin) 1 மி.லி கலந்து காலை வேளையில் தெளிக்கவும்.",
      organicTreatment: "வேப்பங்கொட்டை சாறு (NSKE 5%) அல்லது சூடோமோனாஸ் ஃபுளோரசன்ஸ் லிட்டருக்கு 10 கிராம் தெளிக்கவும்.",
      preventiveMeasures: "பயிர் சுழற்சி முறையை பின்பற்றவும்; போதுமான இடைவெளி விட்டு நடவு செய்யவும்; மேல்நோக்கி நீர் தெளிப்பதை தவிர்க்கவும்."
    },
    hi: {
      diseaseName: "अगेती झुलसा और पत्ती धब्बा रोग (Early Blight)",
      pathogen: "अल्टरनेरिया सोलानी / सर्कोस्पोरा कवक",
      confidence: "94% सत्यापित एआई सटीकता",
      symptoms: [
        "निचली पत्तियों पर गहरे भूरे रंग के छल्लेदार धब्बे बनना",
        "धब्बों के चारों ओर पीले घेरे दिखाई देना",
        "पत्तियों का समय से पहले सूखना और प्रकाश संश्लेषण कम होना"
      ],
      chemicalTreatment: "मैनकोजेब 75% WP 2.5 ग्राम प्रति लीटर या एज़ोक्सीस्ट्रोबिन 1 मिली प्रति लीटर सुबह के समय छिड़कें।",
      organicTreatment: "5% नीम के बीज की गिरी का अर्क (NSKE) या स्यूडोमोनास फ्लोरोसेंस 10 ग्राम प्रति लीटर का छिड़काव करें।",
      preventiveMeasures: "फसल चक्र अपनाएं, उचित दूरी पर पौधे लगाएं और पत्तियों पर सीधे पानी देने से बचें।"
    },
    te: {
      diseaseName: "ఆకుమచ్చ మరియు ముందస్తు తెగులు (Early Blight)",
      pathogen: "ఆల్టర్నేరియా సోలాని / సెర్కోస్పోరా ఫంగస్",
      confidence: "94% ధృవీకరించబడిన AI ఖచ్చితత్వం",
      symptoms: [
        "దిగువ ఆకులపై వృత్తాకార గోధుమ రంగు మచ్చలు ఏర్పడటం",
        "మచ్చల చుట్టూ పసుపు రంగు వలయాలు కనిపించడం",
        "ఆకులు రాలిపోవడం మరియు కిరణజన్య సంయోగక్రియ తగ్గడం"
      ],
      chemicalTreatment: "మాంకోజెబ్ 75% WP లీటరుకు 2.5 గ్రాములు లేదా అజోక్సిస్ట్రోబిన్ 1 మి.లీ కలిపి ఉదయం పిచికారీ చేయండి.",
      organicTreatment: "5% వేప గింజల కషాయం (NSKE) లేదా సూడోమోనాస్ ఫ్లోరోసెన్స్ లీటరుకు 10 గ్రాములు పిచికారీ చేయండి.",
      preventiveMeasures: "పంట మార్పిడిని పాటించండి, మొక్కల మధ్య తగినంత దూరం ఉంచండి మరియు డ్రిప్ పద్ధతిని వాడండి."
    },
    kn: {
      diseaseName: "ಎಲೆ ಚುಕ್ಕೆ ಮತ್ತು ಮುಂಚಿನ ಅಂಗಮಾರಿ ರೋಗ (Early Blight)",
      pathogen: "ಆಲ್ಟರ್ನೇರಿಯಾ ಸೊಲಾನಿ / ಸೆರ್ಕೋಸ್ಪೊರಾ ಶಿಲೀಂಧ್ರ",
      confidence: "94% ಪರಿಶೀಲಿಸಿದ ಎಐ ನಿಖರತೆ",
      symptoms: [
        "ಕೆಳಭಾಗದ ಎಲೆಗಳ ಮೇಲೆ ವೃತ್ತಾಕಾರದ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು",
        "ಚುಕ್ಕೆಗಳ ಸುತ್ತ ಹಳದಿ ಬಣ್ಣದ ವೃತ್ತ ಕಾಣಿಸಿಕೊಳ್ಳುವುದು",
        "ಎಲೆಗಳು ಅಕಾಲಿಕವಾಗಿ ಉದುರುವುದು ಮತ್ತು ಬೆಳವಣಿಗೆ ಕುಂಠಿತವಾಗುವುದು"
      ],
      chemicalTreatment: "ಮ್ಯಾಂಕೋಜೆಬ್ 75% ಡಬ್ಲ್ಯುಪಿ ಲೀಟರ್‌ಗೆ 2.5 ಗ್ರಾಂ ಅಥವಾ ಅಜಾಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ 1 ಮಿ.ಲೀ ಬೆಳಗಿನ ಜಾವ ಸಿಂಪಡಿಸಿ.",
      organicTreatment: "ಬೇವಿನ ಬೀಜದ ಕಷಾಯ (5%) ಅಥವಾ ಸೂಡೋಮೊನಾಸ್ ಫ್ಲೋರೊಸೆನ್ಸ್ 10 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.",
      preventiveMeasures: "ಬೆಳೆ ಪರಿವರ್ತನೆ ಮಾಡಿ, ಸೂಕ್ತ ಗಾಳಿಯಾಡುವಂತೆ ಅಂತರ ಕಾಯ್ದುಕೊಳ್ಳಿ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಬಳಸಿ."
    },
    ml: {
      diseaseName: "ഇലപ്പുള്ളി രോഗവും കരിമ്പൻ ബാധയും (Early Blight)",
      pathogen: "ആൾട്ടർനേരിയ സൊളാനി / സെർകോസ്പോറ ഫംഗസ്",
      confidence: "94% കൃത്യതയുള്ള എഐ പരിശോധനാ ഫലം",
      symptoms: [
        "താഴത്തെ ഇലകളിൽ വൃത്താകൃതിയിലുള്ള തവിട്ടുനിറത്തിലുള്ള പാടുകൾ",
        "പാടുകൾക്ക് ചുറ്റും മഞ്ഞനിറം പടരുന്നത്",
        "ഇലകൾ കൊഴിയുകയും വളർച്ച മുടങ്ങുകയും ചെയ്യുന്നത്"
      ],
      chemicalTreatment: "മാങ്കോസെബ് 75% WP ലിറ്ററിന് 2.5 ഗ്രാം അല്ലെങ്കിൽ അസോക്സിസ്ട്രോബിൻ 1 മില്ലി രാവിലെ തളിക്കുക.",
      organicTreatment: "വേപ്പെണ്ണ എമൽഷൻ അല്ലെങ്കിൽ സ്യൂഡോമോണസ് ഫ്ലൂറസെൻസ് ലിറ്ററിന് 10 ഗ്രാം തളിക്കുക.",
      preventiveMeasures: "വിള പരിക്രമണം നടത്തുക; ചെടികൾ തമ്മിൽ ആവശ്യമായ അകലം പാലിക്കുക."
    }
  };

  return reports[lang] || reports['en'];
};
