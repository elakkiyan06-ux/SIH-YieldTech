import React from 'react';
import { CloudSun, Bell, MapPin, Search, Menu, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';

export const Header = () => {
  const { user, isAdmin } = useAuth();
  const { setActivePage, unreadNotificationsCount, toggleDrawer, weather } = useAppState();
  const { currentLang, setCurrentLang, t } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting_morning');
    if (hour < 17) return t('greeting_afternoon');
    return t('greeting_evening');
  };

  const getConditionLabel = (cond) => {
    if (!cond) return '';
    const norm = cond.toLowerCase().trim();
    if (norm.includes('partly')) return t('cond_partly_cloudy');
    if (norm.includes('cloud')) return t('cond_cloudy');
    if (norm.includes('thunder')) return t('cond_thunderstorm');
    if (norm.includes('rain')) return t('cond_rain');
    if (norm.includes('shower')) return t('cond_showers');
    if (norm.includes('fog')) return t('cond_fog');
    if (norm.includes('snow')) return t('cond_snow');
    if (norm.includes('clear') || norm.includes('sunny')) return t('cond_clear');
    return cond;
  };

  return (
    <header className="top-header">
      {/* Hamburger Menu & Location */}
      <div className="header-greeting-block" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={toggleDrawer}
          className="hamburger-menu-btn"
          title={t('open_menu')}
          style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--slate-700)' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="greeting-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Farmogram Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Farmogram</span>
          </div>
        </div>
      </div>

      {/* Weather Chip, Language Selector & Notifications */}
      <div className="header-actions">
        {/* Global Language Selector */}
        <div 
          className="header-lang-picker"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: '#ffffff', 
            borderRadius: '9999px', 
            padding: '5px 12px', 
            border: '1.5px solid #86efac', 
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.12)' 
          }}
        >
          <Globe size={16} color="#16a34a" />
          <select 
            value={currentLang} 
            onChange={(e) => setCurrentLang(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#0f172a', 
              cursor: 'pointer', 
              outline: 'none' 
            }}
            title={t('switch_lang_title')}
          >
            <option value="en">English (EN)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
          </select>
        </div>

        {/* Quick Weather Snapshot */}
        <button 
          onClick={() => setActivePage('weather')} 
          className="header-weather-chip"
          title={t('view_7day_forecast')}
        >
          <CloudSun size={18} color="#16a34a" />
          <span>{weather.location.split(',')[0]} <strong>{weather.currentTemp}°C</strong></span>
          <span style={{ opacity: 0.75 }}>• {getConditionLabel(weather.condition)}</span>
        </button>

        {/* Notification Bell */}
        <button 
          onClick={() => setActivePage('notifications')}
          className="header-notif-btn" 
          title={t('view_agri_alerts')}
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span className="notif-pulse-dot" />
          )}
        </button>

        {/* Small Avatar on Mobile/Tablet */}
        <button
          onClick={() => setActivePage('profile')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
          title={t('profile')}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                objectFit: 'cover',
                border: '2px solid #22c55e'
              }}
            />
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '2px solid #22c55e',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)'
              }}
            >
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'F'}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
