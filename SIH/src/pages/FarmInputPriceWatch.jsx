import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Bell,
  BarChart3,
  Scale,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Building,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  Info,
  RotateCcw,
  Layers,
  Sprout,
  Droplets,
  Bug,
  Wrench,
  Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { farmInputService } from '../services/farmInputService';
import { FARM_INPUT_CATEGORIES } from '../data/farmInputSeedData';
import './FarmInputPriceWatch.css';

export const FarmInputPriceWatch = () => {
  const { t } = useLanguage();
  const { setActivePage } = useAppState();
  const { user } = useAuth();

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [trendFilter, setTrendFilter] = useState('all'); // 'all' | 'rising' | 'falling' | 'stable' | 'subsidized'

  // Service datasets
  const [items, setItems] = useState(() => farmInputService.getAllItems());
  const [watchlist, setWatchlist] = useState(() => farmInputService.getWatchlist());
  const [alerts, setAlerts] = useState(() => farmInputService.getPriceAlerts());
  const [summaryStats, setSummaryStats] = useState(() => farmInputService.getMarketSummaryStats());

  // Comparison selection
  const [compareIds, setCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Active Modals
  const [trendModalItem, setTrendModalItem] = useState(null);
  const [alertModalItem, setAlertModalItem] = useState(null);
  const [targetAlertPrice, setTargetAlertPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState('BELOW');
  const [notificationSuccess, setNotificationSuccess] = useState('');

  // Subscribe to service updates
  useEffect(() => {
    const unsub = farmInputService.subscribe(() => {
      setWatchlist(farmInputService.getWatchlist());
      setAlerts(farmInputService.getPriceAlerts());
      setSummaryStats(farmInputService.getMarketSummaryStats());
      setItems(farmInputService.getAllItems());
    });
    return unsub;
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return farmInputService.getItems({
      category: activeCategory,
      search: searchQuery,
      district: selectedDistrict,
      trendFilter
    });
  }, [activeCategory, searchQuery, selectedDistrict, trendFilter, items]);

  // Unique districts in current dataset
  const districts = useMemo(() => {
    const all = farmInputService.getAllItems();
    return Array.from(new Set(all.map(i => i.district))).sort();
  }, []);

  // Handle Watchlist toggle
  const handleToggleWatchlist = (itemId, e) => {
    e.stopPropagation();
    const isNowWatched = farmInputService.toggleWatchlist(itemId);
    setWatchlist(farmInputService.getWatchlist());
    showToast(isNowWatched ? 'Added to Watchlist' : 'Removed from Watchlist');
  };

  // Handle Set Alert
  const handleOpenAlertModal = (item, e) => {
    e.stopPropagation();
    setAlertModalItem(item);
    setTargetAlertPrice(String(item.currentPrice));
    setAlertCondition('BELOW');
  };

  const handleSavePriceAlert = (e) => {
    e.preventDefault();
    if (!alertModalItem || !targetAlertPrice) return;

    farmInputService.setPriceAlert({
      itemId: alertModalItem.id,
      targetPrice: targetAlertPrice,
      condition: alertCondition
    });

    setAlertModalItem(null);
    showToast(`Price Alert activated for ${alertModalItem.name}!`);
  };

  // Handle Compare toggle
  const handleToggleCompare = (itemId, e) => {
    e.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 items at a time');
        return prev;
      }
      return [...prev, itemId];
    });
  };

  // Transfer to Profit Calculator
  const handleTransferToCalculator = (item, e) => {
    e.stopPropagation();
    farmInputService.transferToProfitCalculator(item);
    setActivePage('profit');
  };

  // Toast feedback helper
  const showToast = (msg) => {
    setNotificationSuccess(msg);
    setTimeout(() => {
      setNotificationSuccess('');
    }, 3000);
  };

  // Helper icon for categories
  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'seeds': return <Sprout size={16} />;
      case 'fertilizers': return <Sparkles size={16} />;
      case 'crop-protection': return <Bug size={16} />;
      case 'irrigation-equipment': return <Droplets size={16} />;
      case 'machinery-parts': return <Wrench size={16} />;
      case 'packaging-materials': return <Package size={16} />;
      default: return <Layers size={16} />;
    }
  };

  return (
    <div className="farm-input-price-watch-page">
      {/* Toast Notification */}
      {notificationSuccess && (
        <div className="input-watch-toast">
          <CheckCircle2 size={18} />
          <span>{notificationSuccess}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="input-page-header">
        <div className="input-header-left">
          <div className="input-header-icon-wrap">
            <Tag size={24} />
          </div>
          <div>
            <div className="input-title-row">
              <h1 className="input-page-title">{t('farm_input_price_watch') || 'Farm Input Price Watch'}</h1>
              <span className="verified-market-pill">
                <ShieldCheck size={13} />
                {t('verified_market_rates') || 'VERIFIED CO-OP & DEALER RATES'}
              </span>
            </div>
            <p className="input-page-subtitle">
              {t('input_watch_sub') || 'Track agricultural input prices, compare certified dealer quotes, and feed accurate costs into your farm budget.'}
            </p>
          </div>
        </div>

        {/* Quick Summary Action */}
        <div className="input-header-actions">
          <button 
            type="button" 
            className="input-top-btn"
            onClick={() => setActivePage('profit')}
          >
            <Calculator size={16} />
            <span>{t('open_profit_calculator') || 'Profit Calculator'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="input-kpi-strip">
        <div className="kpi-card">
          <div className="kpi-label">{t('total_tracked_inputs') || 'Tracked Inputs'}</div>
          <div className="kpi-value">{summaryStats.totalTracked}</div>
          <div className="kpi-sub">Across 6 Key Categories</div>
        </div>

        <div className="kpi-card trend-rising">
          <div className="kpi-label">{t('rising_prices') || 'Price Increases'}</div>
          <div className="kpi-value text-rising">
            <TrendingUp size={20} />
            {summaryStats.risingCount}
          </div>
          <div className="kpi-sub">Higher input procurement costs</div>
        </div>

        <div className="kpi-card trend-falling">
          <div className="kpi-label">{t('falling_prices') || 'Price Reductions'}</div>
          <div className="kpi-value text-falling">
            <TrendingDown size={20} />
            {summaryStats.fallingCount}
          </div>
          <div className="kpi-sub">Favorable purchasing windows</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">{t('govt_subsidized_inputs') || 'Subsidized Rates'}</div>
          <div className="kpi-value text-primary">{summaryStats.subsidizedCount}</div>
          <div className="kpi-sub">DBT / PACCS Schemes available</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">{t('my_watchlist') || 'My Watchlist'}</div>
          <div className="kpi-value text-accent">{summaryStats.watchlistCount}</div>
          <div className="kpi-sub">{summaryStats.activeAlertsCount} Active Threshold Alerts</div>
        </div>
      </div>

      {/* Category Selection Tabs Bar */}
      <div className="input-categories-bar">
        {FARM_INPUT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`input-category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="cat-icon">{getCategoryIcon(cat.id)}</span>
            <span>{t(`cat_${cat.id.replace(/-/g, '_')}`) || cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="input-toolbar-card">
        <div className="toolbar-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t('search_inputs_placeholder') || 'Search seeds, fertilizers, insecticides, drip pipes, machinery parts...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="toolbar-filter-group">
          {/* District Filter */}
          <div className="filter-select-wrap">
            <MapPin size={15} className="select-icon" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="all">{t('all_districts') || 'All Districts (Tamil Nadu)'}</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Trend Filter */}
          <div className="filter-select-wrap">
            <Filter size={15} className="select-icon" />
            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
            >
              <option value="all">{t('all_price_trends') || 'All Price Trends'}</option>
              <option value="falling">{t('falling_prices_filter') || 'Price Reductions Only'}</option>
              <option value="rising">{t('rising_prices_filter') || 'Price Increases Only'}</option>
              <option value="stable">{t('stable_prices_filter') || 'Stable Prices'}</option>
              <option value="subsidized">{t('subsidized_only_filter') || 'Subsidized Inputs Only'}</option>
            </select>
          </div>

          {/* Watchlist Filter Shortcut */}
          <button
            type="button"
            className={`btn-watchlist-toggle ${watchlist.length > 0 && activeCategory === 'watchlist' ? 'active' : ''}`}
            onClick={() => {
              if (activeCategory === 'watchlist') setActiveCategory('all');
              else setActiveCategory('watchlist');
            }}
          >
            <Star size={15} fill={activeCategory === 'watchlist' ? '#eab308' : 'none'} />
            <span>{t('saved_watchlist') || 'Watchlist'} ({watchlist.length})</span>
          </button>
        </div>
      </div>

      {/* Main Tracked Items Grid */}
      <div className="input-items-grid">
        {(activeCategory === 'watchlist'
          ? items.filter(i => watchlist.includes(i.id))
          : filteredItems
        ).map(item => {
          const isWatched = watchlist.includes(item.id);
          const isCompared = compareIds.includes(item.id);
          const isPriceUp = item.priceChange > 0;
          const isPriceDown = item.priceChange < 0;

          return (
            <div key={item.id} className="input-item-card">
              {/* Card Top Strip */}
              <div className="item-card-top">
                <div className="item-category-pill">
                  {getCategoryIcon(item.category)}
                  <span>{item.subcategory}</span>
                </div>

                <div className="item-card-top-actions">
                  {/* Watchlist Button */}
                  <button
                    type="button"
                    className={`item-icon-action-btn ${isWatched ? 'starred' : ''}`}
                    onClick={(e) => handleToggleWatchlist(item.id, e)}
                    title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    <Star size={16} fill={isWatched ? '#eab308' : 'none'} color={isWatched ? '#eab308' : '#94a3b8'} />
                  </button>

                  {/* Price Alert Button */}
                  <button
                    type="button"
                    className="item-icon-action-btn"
                    onClick={(e) => handleOpenAlertModal(item, e)}
                    title="Set Price Alert Threshold"
                  >
                    <Bell size={16} color="#0284c7" />
                  </button>
                </div>
              </div>

              {/* Product Title & Brand */}
              <h3 className="item-product-name">{item.name}</h3>
              <div className="item-brand-row">
                <span className="brand-label">Brand / Make:</span>
                <strong className="brand-val">{item.brand}</strong>
              </div>

              {/* Specs */}
              <p className="item-specs-text">{item.specs}</p>

              {/* Price Row */}
              <div className="item-price-block">
                <div className="current-price-wrap">
                  <span className="currency-symbol">₹</span>
                  <span className="price-number">{item.currentPrice.toLocaleString()}</span>
                  <span className="unit-label">/ {item.unit}</span>
                </div>

                {/* Previous Price & Change Pill */}
                <div className="previous-price-row">
                  <span className="prev-price-label">
                    Prev: ₹{item.previousPrice.toLocaleString()}
                  </span>
                  <span className={`price-change-pill ${isPriceUp ? 'change-up' : isPriceDown ? 'change-down' : 'change-stable'}`}>
                    {isPriceUp && <TrendingUp size={12} />}
                    {isPriceDown && <TrendingDown size={12} />}
                    {item.priceChange === 0 && <Minus size={12} />}
                    <span>
                      {item.priceChange > 0 ? `+₹${item.priceChange}` : item.priceChange < 0 ? `-₹${Math.abs(item.priceChange)}` : 'Stable'}
                      {item.priceChangePct !== 0 && ` (${item.priceChangePct > 0 ? '+' : ''}${item.priceChangePct}%)`}
                    </span>
                  </span>
                </div>
              </div>

              {/* Subsidy Note Pill if available */}
              {item.subsidyNote && (
                <div className="subsidy-callout-box">
                  <Sparkles size={14} className="subsidy-icon" />
                  <span>{item.subsidyNote}</span>
                </div>
              )}

              {/* Seller & Verification Details */}
              <div className="item-seller-block">
                <div className="seller-row">
                  <Building size={14} className="seller-icon" />
                  <span className="seller-name">{item.sellerName}</span>
                </div>
                <div className="location-row">
                  <MapPin size={14} className="location-icon" />
                  <span>{item.location}, {item.district}</span>
                </div>
                <div className="verification-row">
                  <ShieldCheck size={14} className="verified-icon" />
                  <span className="verified-badge-tag">{item.verificationBadge}</span>
                  <span className="timestamp-tag">
                    <Clock size={11} /> {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Bottom Interactive Actions Strip */}
              <div className="item-bottom-actions">
                <button
                  type="button"
                  className={`compare-checkbox-btn ${isCompared ? 'selected' : ''}`}
                  onClick={(e) => handleToggleCompare(item.id, e)}
                >
                  <Scale size={14} />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>

                <button
                  type="button"
                  className="trend-btn"
                  onClick={() => setTrendModalItem(item)}
                >
                  <BarChart3 size={14} />
                  <span>Trend</span>
                </button>

                <button
                  type="button"
                  className="profit-calc-bridge-btn"
                  onClick={(e) => handleTransferToCalculator(item, e)}
                  title="Apply this verified price into Profit Calculator"
                >
                  <Calculator size={14} />
                  <span>To Profit Calc</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="input-empty-state">
          <AlertCircle size={40} color="#94a3b8" />
          <h3>No agricultural inputs match your filter criteria</h3>
          <p>Try clearing search keywords or selecting All Categories to see available verified dealer prices.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setSelectedDistrict('all');
              setTrendFilter('all');
            }}
          >
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>
      )}

      {/* Floating Compare Drawer Bar */}
      {compareIds.length > 0 && (
        <div className="floating-compare-drawer">
          <div className="compare-drawer-left">
            <Scale size={20} color="#15803d" />
            <div>
              <strong>{compareIds.length} item{compareIds.length > 1 ? 's' : ''} selected for price comparison</strong>
              <span>Compare dealer specifications, unit prices, and subsidy eligibility side-by-side.</span>
            </div>
          </div>
          <div className="compare-drawer-right">
            <button
              type="button"
              className="btn-clear-compare"
              onClick={() => setCompareIds([])}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn-view-comparison"
              onClick={() => setShowCompareModal(true)}
            >
              <span>Compare Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 1. HISTORICAL PRICE TREND MODAL */}
      {trendModalItem && (
        <div className="input-modal-backdrop" onClick={() => setTrendModalItem(null)}>
          <div className="input-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">6-Month Price Movement Trajectory</h2>
                <p className="modal-subtitle">{trendModalItem.name} ({trendModalItem.brand})</p>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setTrendModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="trend-chart-container">
              {/* SVG Trend Visualization */}
              <div className="svg-chart-wrap">
                <svg viewBox="0 0 540 220" className="trend-svg">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="520" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="70" x2="520" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="120" x2="520" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="170" x2="520" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Calculate trend polyline points */}
                  {(() => {
                    const history = trendModalItem.history || [];
                    if (history.length === 0) return null;
                    const prices = history.map(h => h.price);
                    const min = Math.min(...prices) * 0.95;
                    const max = Math.max(...prices) * 1.05;
                    const range = max - min || 1;

                    const points = history.map((h, i) => {
                      const x = 50 + (i * ((500 - 50) / (history.length - 1)));
                      const y = 170 - (((h.price - min) / range) * 140);
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke={trendModalItem.priceChange > 0 ? '#ea580c' : '#16a34a'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                        {history.map((h, i) => {
                          const x = 50 + (i * ((500 - 50) / (history.length - 1)));
                          const y = 170 - (((h.price - min) / range) * 140);
                          return (
                            <g key={h.date}>
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#ffffff"
                                stroke={trendModalItem.priceChange > 0 ? '#ea580c' : '#16a34a'}
                                strokeWidth="2.5"
                              />
                              <text x={x} y={y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
                                ₹{h.price}
                              </text>
                              <text x={x} y={190} textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                                {h.date}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Trend Summary Box */}
              <div className="trend-summary-box">
                <div className="summary-stat-col">
                  <span>Current Price</span>
                  <strong>₹{trendModalItem.currentPrice.toLocaleString()}</strong>
                </div>
                <div className="summary-stat-col">
                  <span>Recorded Change</span>
                  <strong style={{ color: trendModalItem.priceChange > 0 ? '#ea580c' : '#16a34a' }}>
                    {trendModalItem.priceChange > 0 ? `+₹${trendModalItem.priceChange}` : `₹${trendModalItem.priceChange}`} ({trendModalItem.priceChangePct}%)
                  </strong>
                </div>
                <div className="summary-stat-col">
                  <span>Verification Source</span>
                  <strong>{trendModalItem.verificationBadge}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  handleTransferToCalculator(trendModalItem, e);
                  setTrendModalItem(null);
                }}
              >
                <Calculator size={16} />
                <span>Calculate Profit with this Price</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SET PRICE ALERT MODAL */}
      {alertModalItem && (
        <div className="input-modal-backdrop" onClick={() => setAlertModalItem(null)}>
          <div className="input-modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Set Price Alert Threshold</h2>
                <p className="modal-subtitle">{alertModalItem.name}</p>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setAlertModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePriceAlert} className="alert-form-body">
              <div className="form-group">
                <label>Current Verified Market Rate:</label>
                <div className="current-rate-display">
                  <strong>₹{alertModalItem.currentPrice.toLocaleString()}</strong> / {alertModalItem.unit}
                </div>
              </div>

              <div className="form-group">
                <label>Notify Me When Price Moves:</label>
                <div className="condition-radio-group">
                  <button
                    type="button"
                    className={`condition-btn ${alertCondition === 'BELOW' ? 'selected' : ''}`}
                    onClick={() => setAlertCondition('BELOW')}
                  >
                    Drops Below
                  </button>
                  <button
                    type="button"
                    className={`condition-btn ${alertCondition === 'ABOVE' ? 'selected' : ''}`}
                    onClick={() => setAlertCondition('ABOVE')}
                  >
                    Exceeds
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Target Price Threshold (₹):</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={targetAlertPrice}
                  onChange={(e) => setTargetAlertPrice(e.target.value)}
                  placeholder="e.g. 1300"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAlertModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Bell size={16} />
                  <span>Activate Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SIDE-BY-SIDE COMPARISON MODAL */}
      {showCompareModal && (
        <div className="input-modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div className="input-modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Agricultural Input Comparison</h2>
                <p className="modal-subtitle">Compare verified prices, specifications, and distributor terms</p>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setShowCompareModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Attributes</th>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <th key={id} className="compared-product-th">
                          <strong>{it.name}</strong>
                          <span className="th-brand">{it.brand}</span>
                        </th>
                      ) : null;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-header">Current Price</td>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <td key={id} className="price-cell">
                          <strong>₹{it.currentPrice.toLocaleString()}</strong>
                          <span className="unit-sub">/ {it.unit}</span>
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="row-header">Previous Price</td>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <td key={id}>₹{it.previousPrice.toLocaleString()}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="row-header">Net Price Trend</td>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <td key={id}>
                          <span className={`price-change-pill ${it.priceChange > 0 ? 'change-up' : it.priceChange < 0 ? 'change-down' : 'change-stable'}`}>
                            {it.priceChange > 0 ? `+₹${it.priceChange}` : it.priceChange < 0 ? `-₹${Math.abs(it.priceChange)}` : 'Stable'}
                          </span>
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="row-header">Specifications</td>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <td key={id} className="specs-cell">{it.specs}</td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="row-header">Seller / Channel</td>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <td key={id}>
                          <strong>{it.sellerName}</strong>
                          <div className="sub-tag">{it.location}</div>
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="row-header">Verification Level</td>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <td key={id}>
                          <span className="verified-badge-tag">{it.verificationBadge}</span>
                        </td>
                      ) : null;
                    })}
                  </tr>
                  <tr>
                    <td className="row-header">Subsidy Eligibility</td>
                    {compareIds.map(id => {
                      const it = farmInputService.getItemById(id);
                      return it ? (
                        <td key={id} className="subsidy-cell">{it.subsidyNote || 'Standard Market Rate'}</td>
                      ) : null;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCompareModal(false)}
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Transparency & Source Verification Box */}
      <div className="data-transparency-card">
        <div className="transparency-header">
          <Info size={18} className="info-icon" />
          <h3 className="transparency-title">{t('data_transparency') || 'Data Transparency & Source Methodology'}</h3>
        </div>
        <div className="transparency-content">
          <div className="transparency-col">
            <strong>Verified Agricultural Sources:</strong> Data points are sourced directly from Primary Agricultural Co-operative Societies (PACCS), TNAU Seed Farms, APMC Agmarknet Agro-Bulletins, and registered authorized distributors.
          </div>
          <div className="transparency-col">
            <strong>Subsidies & DBT:</strong> Central & State Government fertilizer subsidies (Urea statutory MRP, NBS rates) and NFSM seed rebates are strictly highlighted where applicable.
          </div>
          <div className="transparency-col">
            <strong>Zero Price Fabrication:</strong> If an input does not have an active verified quotation or certified dealer invoice within the current agricultural quarter, it is not listed as active.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmInputPriceWatch;
