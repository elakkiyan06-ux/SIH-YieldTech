import React from 'react';
import { 
  Sprout, 
  CloudSun, 
  Bug, 
  Droplet, 
  TrendingUp, 
  Calculator, 
  Landmark, 
  HelpCircle, 
  Bell, 
  User, 
  ShieldAlert, 
  Wheat,
  Video,
  LogOut,
  ChevronRight,
  X,
  Settings,
  Truck,
  Tractor,
  Wrench,
  Warehouse
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar = () => {
  const { activePage, setActivePage, unreadNotificationsCount, isDrawerOpen, toggleDrawer } = useAppState();
  const { user, isAdmin, toggleRole, logout } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: Sprout, highlight: true },
    { id: 'equipment', label: t('nearby_equipment') || 'Nearby Equipment', icon: Tractor },
    { id: 'nearby-storage', label: t('nearby_storage') || 'Nearby Storage & Cold Store', icon: Warehouse },
    { id: 'transport', label: t('shared_transport') || 'Shared Transport', icon: Truck },
    { id: 'weather', label: t('weather'), icon: CloudSun },
    { id: 'el-nino-advisor', label: t('el_nino_advisor') || 'El Niño Preparedness', icon: CloudSun },
    { id: 'crop-insurance-claim', label: t('crop_claim_assistant') || 'Crop Claim Assistant', icon: ShieldAlert },
    { id: 'disease', label: t('disease_detection'), icon: Bug },
    { id: 'irrigation', label: t('irrigation'), icon: Droplet },
    { id: 'expert-qa', label: t('expert_qa') || 'Expert Q&A', icon: HelpCircle },
    { id: 'notifications', label: t('notifications'), icon: Bell, count: unreadNotificationsCount },
    { id: 'schemes', label: t('schemes'), icon: Landmark },
    { id: 'profile', label: t('profile'), icon: User }
  ];

  return (
    <aside className={`sidebar ${isDrawerOpen ? 'drawer-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div className="brand-logo-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Farmogram Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="brand-text-block">
            <div className="brand-name">
              Farmogram
            </div>
            <div className="brand-tagline">{t('smart_agri_decision')}</div>
          </div>
        </div>
        <button 
          onClick={toggleDrawer}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-500)', padding: '4px' }}
        >
          <X size={24} />
        </button>
      </div>



      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">{t('main_navigation')}</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id && !isAdmin;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isAdmin) toggleRole();
                setActivePage(item.id);
                toggleDrawer();
              }}
              className={`sidebar-nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'highlighted-nav' : ''}`}
            >
              <span className="nav-item-icon-wrapper">
                <Icon size={20} />
              </span>
              <span className="nav-item-label">{item.label}</span>

              {item.badge && (
                <span className="nav-item-badge">{item.badge}</span>
              )}

              {item.count > 0 && (
                <span className="nav-item-counter">{item.count}</span>
              )}

              <ChevronRight size={16} className="nav-item-arrow" />
            </button>
          );
        })}

        {/* Management & Owner Items */}
        <div className="nav-group-label" style={{ marginTop: '16px' }}>{t('management') || 'Management & Services'}</div>
        <button
          onClick={() => {
            setActivePage('list-equipment');
            toggleDrawer();
          }}
          className={`sidebar-nav-item ${activePage === 'list-equipment' ? 'active' : ''}`}
        >
          <span className="nav-item-icon-wrapper">
            <Wrench size={20} />
          </span>
          <span className="nav-item-label">{t('list_equipment') || 'List Your Equipment'}</span>
        </button>

        <button
          onClick={() => {
            setActivePage('list-storage');
            toggleDrawer();
          }}
          className={`sidebar-nav-item ${activePage === 'list-storage' ? 'active' : ''}`}
        >
          <span className="nav-item-icon-wrapper">
            <Warehouse size={20} />
          </span>
          <span className="nav-item-label">{t('list_storage') || 'List Storage Facility'}</span>
        </button>

        <button
          onClick={() => {
            setActivePage('settings');
            toggleDrawer();
          }}
          className={`sidebar-nav-item ${activePage === 'settings' ? 'active' : ''}`}
        >
          <span className="nav-item-icon-wrapper">
            <Settings size={20} />
          </span>
          <span className="nav-item-label">{t('settings')}</span>
        </button>
      </nav>

      {/* Farmer Profile Footer in Sidebar */}
      <div className="sidebar-footer">
        <div 
          className="user-profile-card"
          onClick={() => {
            setActivePage('profile');
            toggleDrawer();
          }}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="user-avatar"
            />
          ) : (
            <div 
              className="user-avatar"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: '2px solid #22c55e'
              }}
            >
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'F'}
            </div>
          )}
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-loc">{user.village}, {user.district}</div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }} 
            className="logout-icon-btn" 
            title={t('logout')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
