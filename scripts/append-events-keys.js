import fs from 'fs';
import path from 'path';

export const eventTranslations = {
  DOSSIER_CREATED: { en: "Claim Dossier Created", ta: "கோரிக்கை ஆவணம் உருவாக்கப்பட்டது", hi: "दावा डोजियर बनाया गया", te: "క్లెయిమ్ పత్రం సృష్టించబడింది", kn: "ಕ್ಲೈಮ್ ದಾಖಲೆ ರಚಿಸಲಾಗಿದೆ", ml: "ക്ലെയിം രേഖ തയ്യാറാക്കി" },
  DOSSIER_UPDATED: { en: "Claim Dossier Updated", ta: "கோரிக்கை ஆவணம் புதுப்பிக்கப்பட்டது", hi: "दावा डोजियर अपडेट किया गया", te: "క్లెయిమ్ పత్రం నవీకరించబడింది", kn: "ಕ್ಲೈಮ್ ದಾಖಲೆ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "ക്ലെയിം രേഖ പുതുക്കി" },
  DOSSIER_DELETED: { en: "Claim Dossier Deleted", ta: "கோரிக்கை ஆவணம் நீக்கப்பட்டது", hi: "दावा डोजियर हटाया गया", te: "క్లెయిమ్ పత్రం తొలగించబడింది", kn: "ಕ್ಲೈಮ್ ದಾಖಲೆ ಅಳಿಸಲಾಗಿದೆ", ml: "ക്ലെയിം രേഖ നീക്കം ചെയ്തു" },
  EQUIPMENT_CREATED: { en: "Equipment Listing Created", ta: "உபகரணப் பட்டியல் சேர்க்கப்பட்டது", hi: "उपकरण सूची बनाई गई", te: "పరికరాల జాబితా సృష్టించబడింది", kn: "ಉಪಕರಣ ಪಟ್ಟಿ ರಚಿಸಲಾಗಿದೆ", ml: "ഉപകരണ ലിസ്റ്റിംഗ് ചേർത്തു" },
  EQUIPMENT_UPDATED: { en: "Equipment Listing Updated", ta: "உபகரணப் பட்டியல் புதுப்பிக்கப்பட்டது", hi: "उपकरण सूची अपडेट की गई", te: "పరికరాల జాబితా నవీకరించబడింది", kn: "ಉಪಕರಣ ಪಟ್ಟಿ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "ഉപകരണ ലിസ്റ്റിംഗ് പുതുക്കി" },
  EQUIPMENT_DELETED: { en: "Equipment Listing Deleted", ta: "உபகரணப் பட்டியல் நீக்கப்பட்டது", hi: "उपकरण सूची हटाई गई", te: "పరికరాల జాబితా తొలగించబడింది", kn: "ಉಪಕರಣ ಪಟ್ಟಿ ಅಳಿಸಲಾಗಿದೆ", ml: "ഉപകരണ ലിസ്റ്റിംഗ് നീക്കം ചെയ്തു" },
  ENQUIRY_CREATED: { en: "Enquiry Created", ta: "விசாரிப்பு உருவாக்கப்பட்டது", hi: "पूछताछ बनाई गई", te: "విచారణ సృష్టించబడింది", kn: "ವಿಚಾರಣೆ ರಚಿಸಲಾಗಿದೆ", ml: "അന്വേഷണം ചേർത്തു" },
  ENQUIRY_STATUS_UPDATED: { en: "Enquiry Status Updated", ta: "விசாரிப்பு நிலை புதுப்பிக்கப்பட்டது", hi: "पूछताछ स्थिति अपडेट की गई", te: "విచారణ స్థితి నవీకరించబడింది", kn: "ವಿಚಾರಣಾ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "അന്വേഷണ നില പുതുക്കി" },
  REPORT_SUBMITTED: { en: "Report Submitted", ta: "புகார் சமர்ப்பிக்கப்பட்டது", hi: "रिपोर्ट प्रस्तुत की गई", te: "నివేదిక సమర్పించబడింది", kn: "ವರದಿ ಸಲ್ಲಿಸಲಾಗಿದೆ", ml: "റിപ്പോർട്ട് സമർപ്പിച്ചു" },
  REPORT_DISMISSED: { en: "Report Dismissed", ta: "புகார் நிராகரிக்கப்பட்டது", hi: "रिपोर्ट खारिज की गई", te: "నివేదిక రద్దు చేయబడింది", kn: "ವರದಿ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ", ml: "റിപ്പോർട്ട് തള്ളി" },
  ADMIN_REMOVED_LISTING: { en: "Listing Removed by Admin", ta: "நிர்வாகியால் பட்டியல் நீக்கப்பட்டது", hi: "व्यवस्थापक द्वारा सूची हटाई गई", te: "అడ్మిన్ ద్వారా జాబితా తీసివేయబడింది", kn: "ನಿರ್ವಾಹಕರಿಂದ ಪಟ್ಟಿ ತೆಗೆದುಹಾಕಲಾಗಿದೆ", ml: "അഡ്മിൻ ലിസ്റ്റിംഗ് നീക്കം ചെയ്തു" },
  REELS_UPDATED: { en: "Reels Feed Updated", ta: "ரீல்ஸ் பக்கம் புதுப்பிக்கப்பட்டது", hi: "रील्स फ़ीड अपडेट की गई", te: "రీల్స్ ఫీడ్ నవీకరించబడింది", kn: "ರೀಲ್ಸ್ ಫೀಡ್ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "റീൽസ് ഫീഡ് പുതുക്കി" },
  REEL_LIKE_TOGGLED: { en: "Reel Like Toggled", ta: "ரீல் விருப்பம் மாற்றப்பட்டது", hi: "रील लाइक टॉगल किया गया", te: "రీల్ లైక్ మార్చబడింది", kn: "ರೀಲ್ ಲೈಕ್ ಬದಲಾಯಿಸಲಾಗಿದೆ", ml: "റീൽ ലൈക്ക് മാറ്റി" },
  REEL_SAVE_TOGGLED: { en: "Reel Save Toggled", ta: "ரீல் சேமிப்பு மாற்றப்பட்டது", hi: "रील सेव टॉगल किया गया", te: "రీల్ సేవ్ మార్చబడింది", kn: "ರೀಲ್ ಸೇವ್ ಬದಲಾಯಿಸಲಾಗಿದೆ", ml: "റീൽ സേവ് മാറ്റി" },
  REEL_COMMENT_ADDED: { en: "Comment Added", ta: "கருத்து சேர்க்கப்பட்டது", hi: "टिप्पणी जोड़ी गई", te: "వ్యాఖ్య జోడించబడింది", kn: "ಕಾಮೆಂಟ್ ಸೇರಿಸಲಾಗಿದೆ", ml: "അഭിപ്രായം ചേർത്തു" },
  COMMENT_LIKED: { en: "Comment Liked", ta: "கருத்து விரும்பப்பட்டது", hi: "टिप्पणी पसंद की गई", te: "వ్యాఖ్య లైక్ చేయబడింది", kn: "ಕಾಮೆಂಟ್ ಇಷ್ಟವಾಯಿತು", ml: "അഭിപ്രായം ഇഷ്ടപ്പെട്ടു" },
  REEL_SHARED: { en: "Reel Shared", ta: "ரீல் பகிரப்பட்டது", hi: "रील साझा की गई", te: "రీల్ భాగస్వామ్యం చేయబడింది", kn: "ರೀಲ್ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ", ml: "റീൽ പങ്കുവെച്ചു" },
  REEL_REPORTED: { en: "Reel Reported", ta: "ரீல் புகார் செய்யப்பட்டது", hi: "रील की सूचना दी गई", te: "రీల్ నివేదించబడింది", kn: "ರೀಲ್ ವರದಿ ಮಾಡಲಾಗಿದೆ", ml: "റീൽ റിപ്പോർട്ട് ചെയ്തു" },
  REEL_UPLOADED: { en: "Reel Uploaded", ta: "ரீல் பதிவேற்றப்பட்டது", hi: "रील अपलोड की गई", te: "రీల్ అప్‌లోడ్ చేయబడింది", kn: "ರೀಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ", ml: "റീൽ അപ്‌ലോഡ് ചെയ്തു" },
  CREATOR_FOLLOW_TOGGLED: { en: "Follow Status Updated", ta: "பின்பற்றும் நிலை புதுப்பிக்கப்பட்டது", hi: "फॉलो स्थिति अपडेट की गई", te: "ఫాలో స్థితి నవీకరించబడింది", kn: "ಫಾಲೋ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "ഫോളോ നില പുതുക്കി" },
  ADMIN_REEL_STATUS_UPDATED: { en: "Reel Status Updated", ta: "ரீல் நிலை புதுப்பிக்கப்பட்டது", hi: "रील स्थिति अपडेट की गई", te: "రీల్ స్థితి నవీకరించబడింది", kn: "ರೀಲ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "റീൽ നില പുതുക്കി" },
  ADMIN_REPORT_DISMISSED: { en: "Report Dismissed by Admin", ta: "நிர்வாகியால் புகார் நிராகரிக்கப்பட்டது", hi: "व्यवस्थापक द्वारा रिपोर्ट खारिज की गई", te: "అడ్మిన్ ద్వారా నివేదిక రద్దు చేయబడింది", kn: "ನಿರ್ವಾಹಕರಿಂದ ವರದಿ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ", ml: "അഡ്മിൻ റിപ്പോർട്ട് തള്ളി" },
  ADMIN_CREATOR_VERIFIED: { en: "Creator Verified", ta: "படைப்பாளர் சரிபார்க்கப்பட்டார்", hi: "निर्माता सत्यापित", te: "సృష్టికర్త ధృవీకరించబడ్డారు", kn: "ರಚನೆಕಾರ ಪರಿಶೀಲಿಸಲಾಗಿದೆ", ml: "സ്രഷ്ടാവ് പരിശോധിച്ചു" },
  SOS_CREATED: { en: "Emergency SOS Created", ta: "அவசர உதவி கோரிக்கை உருவாக்கப்பட்டது", hi: "आपातकालीन एसओएस बनाया गया", te: "అత్యవసర SOS సృష్టించబడింది", kn: "ತುರ್ತು ಎಸ್‌ಒಎಸ್ ರಚಿಸಲಾಗಿದೆ", ml: "അടിയന്തര SOS തയ്യാറാക്കി" },
  OFFICER_NOTIFIED: { en: "Extension Officer Notified", ta: "அதிகாரிக்கு தகவல் தெரிவிக்கப்பட்டது", hi: "विस्तार अधिकारी को सूचित किया गया", te: "విస్తరణ అధికారికి సమాచారం అందించబడింది", kn: "ವಿಸ್ತರಣಾ ಅಧಿಕಾರಿಗೆ ತಿಳಿಸಲಾಗಿದೆ", ml: "ഓഫീസറെ അറിയിച്ചു" },
  SOS_STATUS_UPDATED: { en: "SOS Status Updated", ta: "அவசர உதவி நிலை புதுப்பிக்கப்பட்டது", hi: "एसओएस स्थिति अपडेट की गई", te: "SOS స్థితి నవీకరించబడింది", kn: "ಎಸ್‌ಒಎಸ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "SOS നില പുതുക്കി" },
  LISTING_CREATED: { en: "Storage Listing Created", ta: "சேமிப்புப் பட்டியல் சேர்க்கப்பட்டது", hi: "भंडारण सूची बनाई गई", te: "నిల్వ జాబితా సృష్టించబడింది", kn: "ಶೇಖರಣಾ ಪಟ್ಟಿ ರಚಿಸಲಾಗಿದೆ", ml: "സംഭരണ ലിസ്റ്റിംഗ് ചേർത്തു" },
  LISTING_UPDATED: { en: "Storage Listing Updated", ta: "சேமிப்புப் பட்டியல் புதுப்பிக்கப்பட்டது", hi: "भंडारण सूची अपडेट की गई", te: "నిల్వ జాబితా నవీకరించబడింది", kn: "ಶೇಖರಣಾ ಪಟ್ಟಿ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "സംഭരണ ലിസ്റ്റിംഗ് പുതുക്കി" },
  LISTING_DELETED: { en: "Storage Listing Deleted", ta: "சேமிப்புப் பட்டியல் நீக்கப்பட்டது", hi: "भंडारण सूची हटाई गई", te: "నిల్వ జాబితా తొలగించబడింది", kn: "ಶೇಖರಣಾ ಪಟ್ಟಿ ಅಳಿಸಲಾಗಿದೆ", ml: "സംഭരണ ലിസ്റ്റിംഗ് നീക്കം ചെയ്തു" },
  ENQUIRY_SUBMITTED: { en: "Storage Enquiry Submitted", ta: "சேமிப்பு விசாரிப்பு அனுப்பப்பட்டது", hi: "भंडारण पूछताछ प्रस्तुत की गई", te: "నిల్వ విచారణ సమర్పించబడింది", kn: "ಶೇಖರಣಾ ವಿಚಾರಣೆ ಸಲ್ಲಿಸಲಾಗಿದೆ", ml: "സംഭരണ അന്വേഷണം സമർപ്പിച്ചു" },
  REPORT_FILED: { en: "Report Filed", ta: "புகார் பதிவு செய்யப்பட்டது", hi: "रिपोर्ट दर्ज की गई", te: "నివేదిక నమోదు చేయబడింది", kn: "ವರದಿ ದಾಖಲಿಸಲಾಗಿದೆ", ml: "റിപ്പോർട്ട് രേഖപ്പെടുത്തി" },
  LISTING_FLAGGED: { en: "Listing Flagged", ta: "பட்டியல் குறிக்கப்பட்டது", hi: "सूची चिह्नित की गई", te: "జాబితా గుర్తించబడింది", kn: "ಪಟ್ಟಿ ಗುರುತಿಸಲಾಗಿದೆ", ml: "ലിസ്റ്റിംഗ് അടയാളപ്പെടുത്തി" },
  TRANSPORT_REQUEST_CREATED: { en: "Transport Request Created", ta: "போக்குவரத்து கோரிக்கை உருவாக்கப்பட்டது", hi: "परिवहन अनुरोध बनाया गया", te: "రవాణా అభ్యర్థన సృష్టించబడింది", kn: "ಸಾರಿಗೆ ವಿನಂತಿ ರಚಿಸಲಾಗಿದೆ", ml: "ഗതാഗത അഭ്യർത്ഥന ചേർത്തു" },
  SHARED_BOOKING_CREATED: { en: "Shared Transport Booking Created", ta: "பகிரப்பட்ட வாகன முன்பதிவு செய்யப்பட்டது", hi: "साझा परिवहन बुकिंग बनाई गई", te: "షేర్డ్ రవాణా బుకింగ్ సృష్టించబడింది", kn: "ಹಂಚಿಕೆಯ ಸಾರಿಗೆ ಬುಕಿಂಗ್ ರಚಿಸಲಾಗಿದೆ", ml: "പങ്കിട്ട ഗതാഗത ബുക്കിംഗ് നടത്തി" },
  DRIVER_ASSIGNED: { en: "Driver Assigned", ta: "ஓட்டுநர் ஒதுக்கப்பட்டார்", hi: "चालक सौंपा गया", te: "డ్రైవర్ కేటాయించబడ్డారు", kn: "ಚಾಲಕ ನಿಯೋಜಿಸಲಾಗಿದೆ", ml: "ഡ്രൈവറെ നിയോഗിച്ചു" },
  TRIP_STATUS_UPDATED: { en: "Trip Status Updated", ta: "பயண நிலை புதுப்பிக்கப்பட்டது", hi: "यात्रा स्थिति अपडेट की गई", te: "ప్రయాణ స్థితి నవీకరించబడింది", kn: "ಪ್ರಯಾಣದ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ", ml: "യാത്രാ നില പുതുക്കി" },
  REQUEST_CANCELLED: { en: "Transport Request Cancelled", ta: "போக்குவரத்து கோரிக்கை ரத்து செய்யப்பட்டது", hi: "परिवहन अनुरोध रद्द किया गया", te: "రవాణా అభ్యర్థన రద్దు చేయబడింది", kn: "ಸಾರಿಗೆ ವಿನಂತಿ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ", ml: "ഗതാഗത അഭ്യർത്ഥന റദ്ദാക്കി" }
};

const languages = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const dirs = ['src/context/locales', 'SIH/src/context/locales'];

for (const lang of languages) {
  for (const dir of dirs) {
    const filePath = path.resolve(dir, `${lang}.js`);
    const jsonPath = path.resolve(dir, `${lang}.json`);
    let obj = {};
    if (fs.existsSync(jsonPath)) {
      obj = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else if (fs.existsSync(filePath)) {
      let raw = fs.readFileSync(filePath, 'utf8');
      const jsonMatch = raw.match(/export (?:const \w+ =|default) (\{[\s\S]*?\});/);
      if (jsonMatch) obj = JSON.parse(jsonMatch[1]);
    }
    for (const [k, map] of Object.entries(eventTranslations)) {
      obj[k] = map[lang] || map['en'] || k;
    }
    fs.writeFileSync(jsonPath, JSON.stringify(obj, null, 2), 'utf8');
    const newJs = `// Farmogram AI Dictionary - ${lang.toUpperCase()}\nexport const ${lang} = ${JSON.stringify(obj, null, 2)};\nexport default ${lang};\n`;
    fs.writeFileSync(filePath, newJs, 'utf8');
  }
}

console.log('Successfully updated all event bus keys across all 6 languages in both workspaces!');
