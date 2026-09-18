import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  TrendingUp, 
  Truck, 
  Warehouse, 
  Calculator, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Filter, 
  ArrowRight, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  DollarSign, 
  Layers, 
  Scale, 
  Info, 
  Sparkles,
  Phone,
  FileText,
  X,
  Share2,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  whereToSellService, 
  SELLING_CROPS, 
  QUALITY_GRADES, 
  LOCATION_COORDINATES 
} from '../services/whereToSellService';
import './WhereToSell.css';

export const WhereToSell = () => {
  const { user } = useAuth();
  const { setActivePage } = useAppState();
  const { t } = useLanguage();

  // Input Form State (pre-filled with farmer profile if available)
  const [selectedCropId, setSelectedCropId] = useState(() => {
    if (user?.crops && user.crops.length > 0) {
      const match = SELLING_CROPS.find(c => user.crops.includes(c.id));
      if (match) return match.id;
    }
    return 'Tomato';
  });
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState('Quintal'); // 'Quintal' | 'Kg' | 'Tonne'
  const [selectedGrade, setSelectedGrade] = useState('B'); // 'A' | 'B' | 'C'
  const [harvestDate, setHarvestDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [farmLocation, setFarmLocation] = useState(() => {
    if (user?.village && user?.district) return `${user.village}, ${user.district}`;
    if (user?.district) return user.district;
    return 'Perundurai, Erode';
  });
  const [isHoldingProduce, setIsHoldingProduce] = useState(false);
  const [holdingDays, setHoldingDays] = useState(15);
  const [useSharedTransport, setUseSharedTransport] = useState(true);

  // Sorting & Filtering State
  const [sortBy, setSortBy] = useState('net_return'); // 'net_return' | 'net_price' | 'distance' | 'gross_price'
  const [destinationFilter, setDestinationFilter] = useState('ALL'); // 'ALL' | 'APMC_MANDI' | 'DIRECT_BUYER' | 'FARMGATE'

  // Comparison & Modal State
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [detailsModalItem, setDetailsModalItem] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run the Decision Engine
  const evaluatedDestinations = useMemo(() => {
    return whereToSellService.evaluateDestinations({
      cropId: selectedCropId,
      quantity,
      unit,
      grade: selectedGrade,
      harvestDate,
      farmLocation,
      holdingDays: isHoldingProduce ? holdingDays : 0,
      useSharedTransport
    });
  }, [selectedCropId, quantity, unit, selectedGrade, harvestDate, farmLocation, isHoldingProduce, holdingDays, useSharedTransport]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let list = [...evaluatedDestinations];

    // Filter by type
    if (destinationFilter === 'APMC_MANDI') {
      list = list.filter(item => item.destination.type === 'APMC_MANDI' || item.destination.type === 'WHOLESALE_MARKET');
    } else if (destinationFilter === 'DIRECT_BUYER') {
      list = list.filter(item => item.destination.type === 'VERIFIED_FPO' || item.destination.type === 'DIRECT_PROCESSOR');
    } else if (destinationFilter === 'FARMGATE') {
      list = list.filter(item => item.destination.type === 'FARMGATE_AGGREGATOR');
    }

    // Sort options (strictly neutral without labeling any as "best")
    if (sortBy === 'net_return') {
      list.sort((a, b) => b.estimatedNetReturn - a.estimatedNetReturn);
    } else if (sortBy === 'net_price') {
      list.sort((a, b) => b.realizedNetPricePerQuintal - a.realizedNetPricePerQuintal);
    } else if (sortBy === 'distance') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'gross_price') {
      list.sort((a, b) => b.grossPricePerQuintal - a.grossPricePerQuintal);
    }

    return list;
  }, [evaluatedDestinations, destinationFilter, sortBy]);

  // Quick stats
  const selectedCropObj = SELLING_CROPS.find(c => c.id === selectedCropId) || SELLING_CROPS[0];
  const maxNetReturn = Math.max(...evaluatedDestinations.map(d => d.estimatedNetReturn), 0);
  const minDistance = Math.min(...evaluatedDestinations.map(d => d.distanceKm));
  const maxGrossRate = Math.max(...evaluatedDestinations.map(d => d.grossPricePerQuintal), 0);

  // Toggle side-by-side comparison checkbox
  const handleToggleCompare = (id) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter(item => item !== id));
    } else {
      if (selectedForComparison.length >= 3) {
        showToast(t('max_three_compare') || 'You can compare up to 3 destinations simultaneously.');
        return;
      }
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  // Cross-Module Deep Linking Handlers
  const handleTransferToProfitCalc = (item) => {
    try {
      localStorage.setItem('farmogram_transfer_selling_price', JSON.stringify({
        crop: item.crop.id,
        sellingPrice: item.realizedNetPricePerQuintal,
        destinationName: item.destination.shortName,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {}
    showToast(`${t('price_sent_to_profit_calc') || 'Net price ₹' + item.realizedNetPricePerQuintal + '/qtl transferred to Profit Calculator!'}`);
    setTimeout(() => {
      setActivePage('profit');
    }, 400);
  };

  const handleBookTransport = (item) => {
    try {
      localStorage.setItem('farmogram_transfer_transport', JSON.stringify({
        produceType: item.crop.name,
        quantityKg: Math.round(item.quantityQuintals * 100),
        pickupLocation: farmLocation,
        destinationMarketId: item.destination.id,
        destinationMarketName: item.destination.name,
        estimatedCost: item.deductions.transport
      }));
    } catch (e) {}
    setActivePage('transport');
  };

  const handleFindNearbyStorage = (item) => {
    setActivePage('nearby-storage');
  };

  const handleResetInputs = () => {
    setSelectedCropId('Tomato');
    setQuantity(50);
    setUnit('Quintal');
    setSelectedGrade('B');
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setFarmLocation(user?.district || 'Perundurai, Erode');
    setIsHoldingProduce(false);
    setHoldingDays(15);
    setUseSharedTransport(true);
    setSelectedForComparison([]);
  };

  return (
    <div className="where-to-sell-page">
      {/* 1. Header Section */}
      <div className="page-header where-to-sell-header">
        <div className="header-left-title-group">
          <h1 className="page-title">
            <Compass size={28} className="header-compass-icon" />
            <span>{t('where_should_i_sell_title') || 'Where Should I Sell?'}</span>
          </h1>
          <p className="page-subtitle">
            {t('where_should_i_sell_sub') || 'Compare transparent estimated net returns across APMC mandis, wholesale markets, and verified buyers after deducting transport, handling, and storage costs.'}
          </p>
        </div>

        {/* Action button to explore historical trends */}
        <button 
          className="btn btn-secondary btn-sm header-mkt-intel-btn"
          onClick={() => setActivePage('market')}
        >
          <TrendingUp size={15} color="#16a34a" />
          <span>{t('view_live_mandi_trends') || 'View Market Intelligence'}</span>
        </button>
      </div>

      {/* 2. Objective Transparency Disclaimer Banner */}
      <div className="neutrality-advisory-banner">
        <div className="advisory-icon-circle">
          <Info size={18} color="#0284c7" />
        </div>
        <div className="advisory-text-body">
          <strong>{t('neutral_decision_support_title') || 'Independent & Objective Decision Support'}:</strong>{' '}
          {t('neutral_decision_support_desc') || 'Farmogram AI does not rank any buyer as "best" or guarantee future rates. We calculate itemized cost deductions and present transparent returns so you can decide based on your preferred payment timeline and transport convenience.'}
        </div>
      </div>

      {/* 3. Main Dashboard Grid Layout */}
      <div className="where-to-sell-layout-grid">
        
        {/* Left Column: Farmer Decision Input Form */}
        <div className="farmer-input-card farm-card">
          <div className="input-card-header">
            <h2 className="card-section-title">
              <span>🌾 {t('harvest_sale_variables') || 'Your Produce & Location'}</span>
            </h2>
            <button 
              type="button" 
              className="btn-reset-clean" 
              onClick={handleResetInputs}
              title={t('reset_all_inputs') || 'Reset inputs'}
            >
              <RotateCcw size={13} /> {t('reset') || 'Reset'}
            </button>
          </div>
          <p className="card-section-subtitle">
            {t('enter_produce_specs_desc') || 'Enter your crop specifications to calculate customized transport and handling deductions.'}
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="decision-form-container">
            {/* 1. Crop Selection */}
            <div className="form-group">
              <label className="form-label">{t('crop_commodity') || 'Crop / Commodity'}</label>
              <div className="crop-selector-grid">
                {SELLING_CROPS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCropId(c.id)}
                    className={`crop-pick-chip ${selectedCropId === c.id ? 'active' : ''}`}
                  >
                    <span className="crop-chip-emoji">{c.icon}</span>
                    <span className="crop-chip-name">{t(c.id) || c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Quantity with Unit Switch */}
            <div className="form-group">
              <div className="label-with-unit-switch">
                <label className="form-label">{t('harvest_quantity') || 'Harvest Quantity'}</label>
                <div className="unit-toggle-pill">
                  {['Quintal', 'Kg', 'Tonne'].map(u => (
                    <button
                      key={u}
                      type="button"
                      className={`unit-toggle-btn ${unit === u ? 'active' : ''}`}
                      onClick={() => setUnit(u)}
                    >
                      {u === 'Quintal' ? (t('unit_quintal') || 'Quintal (100 kg)') : u === 'Kg' ? (t('unit_kg') || 'Kg') : (t('unit_tonne') || 'Tonne (10 Qtl)')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="quantity-input-wrapper">
                <input 
                  type="number" 
                  className="form-input quantity-numeric-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 0))}
                  min="1"
                  step="1"
                  required
                />
                <span className="input-unit-adornment">
                  {unit}s ({unit === 'Quintal' ? `${quantity * 100} kg` : unit === 'Tonne' ? `${quantity * 10} Quintals` : `${(quantity / 100).toFixed(1)} Quintals`})
                </span>
              </div>
            </div>

            {/* 3. Quality / Grade Selector */}
            <div className="form-group">
              <label className="form-label">
                {t('produce_quality_grade') || 'Quality / Lot Grade'}
                <span className="label-helper-sub"> ({t('affects_destination_price') || 'Affects realized market rate'})</span>
              </label>
              <div className="grades-selector-cards">
                {QUALITY_GRADES.map(g => (
                  <div 
                    key={g.id}
                    onClick={() => setSelectedGrade(g.id)}
                    className={`grade-selection-box ${selectedGrade === g.id ? 'active' : ''}`}
                  >
                    <div className="grade-box-top">
                      <span className={`grade-indicator-pill ${g.badgeClass}`}>
                        {g.shortLabel}
                      </span>
                      <span className="grade-multiplier-tag">
                        {g.id === 'A' ? '+10% Premium' : g.id === 'B' ? 'Base Rate (FAQ)' : '-12% Processing'}
                      </span>
                    </div>
                    <p className="grade-box-desc">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Farm Location */}
            <div className="form-group">
              <label className="form-label">{t('farm_pickup_location') || 'Farm Location (Pickup Origin)'}</label>
              <div className="location-input-group">
                <MapPin size={16} className="location-pin-icon" />
                <input 
                  type="text" 
                  className="form-input location-text-input"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="e.g. Perundurai, Erode or Coimbatore"
                />
              </div>
              <div className="quick-locations-strip">
                <span className="quick-loc-label">{t('quick_select') || 'Quick Select'}:</span>
                {['Perundurai', 'Erode', 'Sathyamangalam', 'Coimbatore', 'Salem', 'Thanjavur'].map(loc => (
                  <button 
                    key={loc}
                    type="button" 
                    className="quick-loc-chip"
                    onClick={() => setFarmLocation(`${loc}, Tamil Nadu`)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Harvest Date & Storage Timeline Toggle */}
            <div className="form-group">
              <label className="form-label">{t('harvest_date') || 'Harvest Date'}</label>
              <input 
                type="date" 
                className="form-input" 
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
              />
            </div>

            {/* Storage Timeline Option */}
            <div className="storage-holding-box">
              <label className="checkbox-toggle-label">
                <input 
                  type="checkbox" 
                  checked={isHoldingProduce}
                  onChange={(e) => setIsHoldingProduce(e.target.checked)}
                />
                <span className="checkbox-toggle-text">
                  <strong>{t('plan_to_store') || 'Hold produce in storage before selling'}</strong>
                  <small>{selectedCropObj.perishability === 'HIGH' ? (t('requires_cold_store_warn') || 'Requires cold storage facility') : (t('storable_in_warehouse') || 'Storable in dry warehouse godown')}</small>
                </span>
              </label>

              {isHoldingProduce && (
                <div className="holding-days-slider-row">
                  <div className="holding-header">
                    <span>{t('holding_duration') || 'Holding Duration'}: <strong>{holdingDays} {t('days') || 'Days'}</strong></span>
                    <span className="est-daily-fee">
                      ~₹{selectedCropObj.perishability === 'HIGH' ? selectedCropObj.coldStorageDailyCostPerQtl : selectedCropObj.dryStorageDailyCostPerQtl}/qtl/day
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="90" 
                    step="5"
                    value={holdingDays}
                    onChange={(e) => setHoldingDays(parseInt(e.target.value))}
                    className="holding-range-slider"
                  />
                </div>
              )}
            </div>

            {/* 6. Shared Transport Option */}
            <div className="transport-mode-box">
              <label className="checkbox-toggle-label">
                <input 
                  type="checkbox" 
                  checked={useSharedTransport}
                  onChange={(e) => setUseSharedTransport(e.target.checked)}
                />
                <span className="checkbox-toggle-text">
                  <strong>{t('use_shared_transport_calc') || 'Calculate with Shared Transport Cost-Sharing'}</strong>
                  <small>{t('shared_transport_subtext') || 'Reduces transport fees by pooling vehicle capacity with nearby farmers on the same route.'}</small>
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Right Column: Comparative Destinations & Financial Ledgers */}
        <div className="destinations-results-column">
          
          {/* Quick Metrics Header */}
          <div className="results-metrics-strip">
            <div className="metric-pill">
              <span className="metric-label">{t('crop_analyzed') || 'Commodity'}</span>
              <strong className="metric-val">{selectedCropObj.icon} {t(selectedCropObj.id) || selectedCropObj.name}</strong>
            </div>
            <div className="metric-pill">
              <span className="metric-label">{t('lot_size') || 'Lot Size'}</span>
              <strong className="metric-val">{evaluatedDestinations[0]?.quantityQuintals} Quintals</strong>
            </div>
            <div className="metric-pill">
              <span className="metric-label">{t('options_compared') || 'Destinations'}</span>
              <strong className="metric-val">{evaluatedDestinations.length} {t('markets_buyers') || 'Markets'}</strong>
            </div>
            <div className="metric-pill">
              <span className="metric-label">{t('max_gross_mkt_rate') || 'Max Gross Rate'}</span>
              <strong className="metric-val" style={{ color: '#16a34a' }}>₹{maxGrossRate.toLocaleString('en-IN')}/Qtl</strong>
            </div>
          </div>

          {/* Filtering & Sorting Toolbar */}
          <div className="results-toolbar farm-card">
            {/* Filter by Type */}
            <div className="filter-pill-group">
              <button 
                type="button"
                className={`filter-btn ${destinationFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setDestinationFilter('ALL')}
              >
                {t('all_destinations') || 'All Options'} ({evaluatedDestinations.length})
              </button>
              <button 
                type="button"
                className={`filter-btn ${destinationFilter === 'APMC_MANDI' ? 'active' : ''}`}
                onClick={() => setDestinationFilter('APMC_MANDI')}
              >
                🏛 {t('apmc_mandis') || 'APMC Mandis'}
              </button>
              <button 
                type="button"
                className={`filter-btn ${destinationFilter === 'DIRECT_BUYER' ? 'active' : ''}`}
                onClick={() => setDestinationFilter('DIRECT_BUYER')}
              >
                🤝 {t('direct_buyers_fpos') || 'FPOs & Processors'}
              </button>
              <button 
                type="button"
                className={`filter-btn ${destinationFilter === 'FARMGATE' ? 'active' : ''}`}
                onClick={() => setDestinationFilter('FARMGATE')}
              >
                🏡 {t('farmgate_direct') || 'Farmgate'}
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-select-wrapper">
              <span className="sort-label">{t('sort_by') || 'Sort By'}:</span>
              <select 
                className="sort-dropdown-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="net_return">{t('sort_highest_net_return') || 'Estimated Net Return (₹ High to Low)'}</option>
                <option value="net_price">{t('sort_net_price_per_qtl') || 'Net Price / Quintal (High to Low)'}</option>
                <option value="distance">{t('sort_nearest_distance') || 'Distance (Nearest First)'}</option>
                <option value="gross_price">{t('sort_gross_market_rate') || 'Gross Market Rate (High to Low)'}</option>
              </select>
            </div>
          </div>

          {/* Side-by-Side Floating Bar if 2+ selected */}
          {selectedForComparison.length > 0 && (
            <div className="floating-compare-trigger-strip">
              <span>
                <strong>{selectedForComparison.length} {t('destinations_selected') || 'destinations selected for comparison'}</strong>
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedForComparison([])}
                >
                  {t('clear') || 'Clear'}
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsCompareModalOpen(true)}
                >
                  <Scale size={14} />
                  <span>{t('compare_side_by_side') || 'Compare Side-by-Side'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Destination Comparison Cards Feed */}
          <div className="destination-cards-feed">
            {filteredAndSorted.length === 0 ? (
              <div className="empty-destinations-notice farm-card">
                <AlertCircle size={36} color="#94a3b8" />
                <h3>{t('no_destinations_found') || 'No selling destinations match this filter'}</h3>
                <p>{t('try_different_filter_desc') || 'Try selecting "All Options" or checking a different crop category.'}</p>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setDestinationFilter('ALL')}
                >
                  {t('view_all_destinations') || 'View All Options'}
                </button>
              </div>
            ) : (
              filteredAndSorted.map(item => {
                const isSelected = selectedForComparison.includes(item.id);

                return (
                  <div key={item.id} className="destination-card farm-card">
                    {/* Destination Card Header */}
                    <div className="dest-card-header">
                      <div className="dest-title-type-group">
                        <div className="dest-main-title-row">
                          <h3 className="dest-name">{item.destination.name}</h3>
                          <span className={`dest-type-pill ${item.destination.badgeClass}`}>
                            {item.destination.typeLabel}
                          </span>
                        </div>
                        <div className="dest-meta-location-row">
                          <span className="dest-location-tag">
                            <MapPin size={13} /> {item.destination.location}
                          </span>
                          <span className="dest-distance-tag">
                            {item.distanceKm === 0 ? (
                              <strong style={{ color: '#16a34a' }}>🏡 {t('at_farm_gate') || 'At Your Farm Gate (0 km)'}</strong>
                            ) : (
                              <>🛣️ <strong>{item.distanceKm} km</strong> {t('from_farm') || 'from your farm'}</>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Compare Checkbox */}
                      <label className="compare-checkbox-label" title={t('select_to_compare') || 'Select to compare side-by-side'}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleToggleCompare(item.id)}
                        />
                        <span>{t('compare') || 'Compare'}</span>
                      </label>
                    </div>

                    {/* Price & Verification Source Bar */}
                    <div className="verified-rate-strip">
                      <div className="price-source-block">
                        <div className="live-rate-tag">
                          <span className="rate-num">₹{item.grossPricePerQuintal.toLocaleString('en-IN')}</span>
                          <span className="rate-unit">/ Quintal</span>
                          <span className="verified-badge-pill">
                            <ShieldCheck size={12} color="#16a34a" /> {t('verified_data') || 'Verified Market Rate'}
                          </span>
                        </div>
                        <div className="source-timestamp-note">
                          <span>{t('source') || 'Source'}: <strong>{item.dataSource}</strong></span>
                          <span className="source-dot">•</span>
                          <span>{t('updated') || 'Updated'}: {item.priceTimestamp}</span>
                        </div>
                      </div>

                      {/* Gross Value Pill */}
                      <div className="gross-total-pill">
                        <span className="gross-sub">{t('gross_selling_value') || 'Gross Value'} ({item.quantityQuintals} Qtl)</span>
                        <span className="gross-val">₹{item.grossValue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Itemized Deductions & Expenses Ledger */}
                    <div className="itemized-deductions-container">
                      <div className="deductions-header">
                        <span className="deductions-title">
                          🧾 {t('estimated_cost_deductions') || 'Itemized Selling Expenses'}
                        </span>
                        <span className="deductions-total-tag">
                          {t('total_expenses') || 'Total Deductions'}: <strong>-₹{item.deductions.total.toLocaleString('en-IN')}</strong>
                        </span>
                      </div>

                      <div className="deductions-grid">
                        {/* 1. Transport */}
                        <div className="deduction-unit">
                          <div className="deduction-label">
                            <Truck size={13} color="#0284c7" />
                            <span>{t('transport_expense') || 'Transport'}</span>
                          </div>
                          <span className={`deduction-val ${item.deductions.transport === 0 ? 'zero-cost' : ''}`}>
                            {item.deductions.transport === 0 ? '₹0 (Free Farmgate)' : `-₹${item.deductions.transport.toLocaleString('en-IN')}`}
                          </span>
                          <span className="deduction-calc-sub">
                            {item.distanceKm === 0 ? t('buyer_picks_up') || 'Buyer pickup' : `${item.distanceKm} km @ ${item.isSharedTransport ? 'Shared Pool' : 'Standard'}`}
                          </span>
                        </div>

                        {/* 2. Loading & Unloading */}
                        <div className="deduction-unit">
                          <div className="deduction-label">
                            <Layers size={13} color="#d97706" />
                            <span>{t('handling_hamali') || 'Labor (Hamali)'}</span>
                          </div>
                          <span className={`deduction-val ${item.deductions.handling === 0 ? 'zero-cost' : ''}`}>
                            {item.deductions.handling === 0 ? '₹0 (Trader Labor)' : `-₹${item.deductions.handling.toLocaleString('en-IN')}`}
                          </span>
                          <span className="deduction-calc-sub">
                            {item.deductions.handling === 0 ? t('included') || 'Included' : `Loading & Unloading`}
                          </span>
                        </div>

                        {/* 3. Mandi / Marketing Fees */}
                        <div className="deduction-unit">
                          <div className="deduction-label">
                            <Scale size={13} color="#7c3aed" />
                            <span>{t('mandi_user_fees') || 'Mandi Cess & Weighing'}</span>
                          </div>
                          <span className={`deduction-val ${item.deductions.mandiFees === 0 ? 'zero-cost' : ''}`}>
                            {item.deductions.mandiFees === 0 ? '₹0 (Zero Fee)' : `-₹${item.deductions.mandiFees.toLocaleString('en-IN')}`}
                          </span>
                          <span className="deduction-calc-sub">
                            {item.destination.mandiFeePercent > 0 ? `${item.destination.mandiFeePercent}% APMC cess` : t('direct_procurement') || 'Direct Purchase'}
                          </span>
                        </div>

                        {/* 4. Storage / Delay */}
                        <div className="deduction-unit">
                          <div className="deduction-label">
                            <Warehouse size={13} color="#059669" />
                            <span>{t('storage_cost') || 'Storage Holding'}</span>
                          </div>
                          <span className={`deduction-val ${item.deductions.storage === 0 ? 'zero-cost' : ''}`}>
                            {item.deductions.storage === 0 ? '₹0 (Immediate Sale)' : `-₹${item.deductions.storage.toLocaleString('en-IN')}`}
                          </span>
                          <span className="deduction-calc-sub">
                            {item.holdingDays > 0 ? `${item.holdingDays} days holding` : t('zero_holding') || 'Zero delay'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Prominent Estimated Net Return Banner */}
                    <div className="net-return-summary-box">
                      <div className="net-return-primary-block">
                        <span className="net-return-label">
                          💰 {t('estimated_net_return') || 'Estimated Net Return'}
                        </span>
                        <div className="net-return-amount">
                          ₹{item.estimatedNetReturn.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="realized-rate-pill">
                        <span className="realized-sub">{t('effective_realized_price') || 'Effective Realized Rate'}:</span>
                        <strong className="realized-val">₹{item.realizedNetPricePerQuintal.toLocaleString('en-IN')}</strong>
                        <span className="realized-unit">/ Quintal</span>
                      </div>
                    </div>

                    {/* Storage Advisory & Payment Terms */}
                    <div className="dest-footer-logistics-bar">
                      <div className="storage-advisory-text">
                        <Info size={13} color="#64748b" />
                        <span>{item.storageNotice}</span>
                      </div>
                      <div className="payment-speed-tag">
                        <span>💳 {item.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Action Buttons Row (Deep Links into other modules) */}
                    <div className="dest-actions-row">
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setDetailsModalItem(item)}
                        title={t('view_full_itemized_receipt') || 'View full itemized breakdown'}
                      >
                        <FileText size={14} />
                        <span>{t('view_details') || 'View Details'}</span>
                      </button>

                      {item.distanceKm > 0 && (
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleBookTransport(item)}
                          title={t('book_shared_vehicle_desc') || 'Find and book shared transport on this route'}
                        >
                          <Truck size={14} color="#0284c7" />
                          <span>{t('book_shared_transport') || 'Find Transport'}</span>
                        </button>
                      )}

                      {selectedCropObj.perishability === 'HIGH' && (
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleFindNearbyStorage(item)}
                          title={t('explore_nearby_cold_storage') || 'Explore cold storage facilities'}
                        >
                          <Warehouse size={14} color="#059669" />
                          <span>{t('find_storage') || 'Storage'}</span>
                        </button>
                      )}

                      <button 
                        type="button"
                        className="btn btn-primary btn-sm dest-profit-calc-btn"
                        onClick={() => handleTransferToProfitCalc(item)}
                        title={t('use_in_profit_calc_tooltip') || 'Apply this realized net price to your farm Profit Calculator'}
                      >
                        <Calculator size={14} />
                        <span>{t('apply_to_profit_calc') || 'Send to Profit Calc'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 4. Itemized Details Modal */}
      {detailsModalItem && (
        <div className="decision-modal-overlay" onClick={() => setDetailsModalItem(null)}>
          <div className="decision-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`dest-type-pill ${detailsModalItem.destination.badgeClass}`}>
                  {detailsModalItem.destination.typeLabel}
                </span>
                <h3 className="modal-title">{detailsModalItem.destination.name}</h3>
              </div>
              <button 
                className="modal-close-icon-btn" 
                onClick={() => setDetailsModalItem(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-scrollable-content">
              {/* Destination Profile & Facilities */}
              <div className="modal-profile-box farm-card">
                <div className="modal-profile-grid">
                  <div>
                    <span className="meta-dim-label">{t('location_address') || 'Location Address'}</span>
                    <div className="meta-bold-val">📍 {detailsModalItem.destination.location}</div>
                  </div>
                  <div>
                    <span className="meta-dim-label">{t('distance_from_farm') || 'Road Distance'}</span>
                    <div className="meta-bold-val">🛣️ {detailsModalItem.distanceKm} km from your farm</div>
                  </div>
                  <div>
                    <span className="meta-dim-label">{t('receiving_hours') || 'Receiving & Auction Hours'}</span>
                    <div className="meta-bold-val">⏰ {detailsModalItem.operatingHours}</div>
                  </div>
                  <div>
                    <span className="meta-dim-label">{t('weighment_system') || 'Weighment & Assaying'}</span>
                    <div className="meta-bold-val">⚖️ {detailsModalItem.weighmentType}</div>
                  </div>
                  <div>
                    <span className="meta-dim-label">{t('contact_inquiry') || 'Contact Phone'}</span>
                    <div className="meta-bold-val">📞 {detailsModalItem.contactPhone}</div>
                  </div>
                  <div>
                    <span className="meta-dim-label">{t('payment_timeline') || 'Payment Timeline'}</span>
                    <div className="meta-bold-val">💳 {detailsModalItem.paymentSpeed} ({detailsModalItem.paymentMethod})</div>
                  </div>
                </div>

                {detailsModalItem.facilities && detailsModalItem.facilities.length > 0 && (
                  <div className="modal-facilities-strip">
                    <span className="meta-dim-label">{t('available_facilities') || 'Available Facilities'}:</span>
                    <div className="facility-tags-list">
                      {detailsModalItem.facilities.map((fac, idx) => (
                        <span key={idx} className="facility-tag-chip">✓ {fac}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Complete Itemized Financial Ledger */}
              <div className="itemized-financial-ledger-table farm-card">
                <h4 className="ledger-table-title">
                  🧾 {t('complete_itemized_ledger') || 'Complete Itemized Financial Breakdown'}
                </h4>

                <div className="ledger-row ledger-gross-row">
                  <div>
                    <strong>{t('gross_market_value') || 'Gross Market Value'}</strong>
                    <div className="ledger-sub-calc">
                      {detailsModalItem.quantityQuintals} Quintals × ₹{detailsModalItem.grossPricePerQuintal.toLocaleString('en-IN')}/qtl ({detailsModalItem.grade.shortLabel})
                    </div>
                  </div>
                  <strong className="ledger-amount-pos">
                    +₹{detailsModalItem.grossValue.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="ledger-separator-line" />

                {/* Deductions */}
                <div className="ledger-row">
                  <div>
                    <span>{t('road_transport_expense') || 'Road Transport'}</span>
                    <div className="ledger-sub-calc">
                      {detailsModalItem.distanceKm} km {detailsModalItem.isSharedTransport ? '(Shared Cost-Sharing)' : '(Dedicated Truck)'}
                    </div>
                  </div>
                  <span className="ledger-amount-neg">
                    -₹{detailsModalItem.deductions.transport.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="ledger-row">
                  <div>
                    <span>{t('handling_and_labor') || 'Loading & Unloading (Hamali)'}</span>
                    <div className="ledger-sub-calc">
                      Standard labor handling fee
                    </div>
                  </div>
                  <span className="ledger-amount-neg">
                    -₹{detailsModalItem.deductions.handling.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="ledger-row">
                  <div>
                    <span>{t('apmc_mandi_user_fee') || 'APMC Cess & Weighing Fee'}</span>
                    <div className="ledger-sub-calc">
                      {detailsModalItem.destination.mandiFeePercent > 0 ? `${detailsModalItem.destination.mandiFeePercent}% APMC cess + weighing` : 'Zero APMC cess'}
                    </div>
                  </div>
                  <span className="ledger-amount-neg">
                    -₹{detailsModalItem.deductions.mandiFees.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="ledger-row">
                  <div>
                    <span>{t('storage_holding_expense') || 'Storage Holding Expense'}</span>
                    <div className="ledger-sub-calc">
                      {detailsModalItem.holdingDays > 0 ? `${detailsModalItem.holdingDays} days holding in warehouse` : 'Sold immediately upon harvest'}
                    </div>
                  </div>
                  <span className="ledger-amount-neg">
                    -₹{detailsModalItem.deductions.storage.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="ledger-separator-line" />

                {/* Net Return Summary */}
                <div className="ledger-row ledger-net-final-row">
                  <div>
                    <strong className="final-net-title">
                      💰 {t('estimated_net_return') || 'Estimated Net Return'}
                    </strong>
                    <div className="final-realized-text">
                      {t('realized_net_rate') || 'Realized Net Rate'}: <strong>₹{detailsModalItem.realizedNetPricePerQuintal.toLocaleString('en-IN')} / Quintal</strong>
                    </div>
                  </div>
                  <strong className="final-net-amount">
                    ₹{detailsModalItem.estimatedNetReturn.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              {/* Explicit Labeling Notice */}
              <div className="data-verification-legend-card">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={18} color="#16a34a" />
                  <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                    <strong>{t('verified_vs_estimated_distinction') || 'Data Grounding Notice'}:</strong>{' '}
                    The gross price is verified from <strong>{detailsModalItem.dataSource}</strong> as of {detailsModalItem.priceTimestamp}. Logistics deductions (transport, handling, storage) are estimated according to standard regional road and labor tariffs. Actual returns may vary slightly based on final physical lot inspection and negotiated transport rates.
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setDetailsModalItem(null)}
              >
                {t('close') || 'Close'}
              </button>

              <button 
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleTransferToProfitCalc(detailsModalItem);
                  setDetailsModalItem(null);
                }}
              >
                <Calculator size={14} />
                <span>{t('apply_to_profit_calc') || 'Send to Profit Calc'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <div className="decision-modal-overlay" onClick={() => setIsCompareModalOpen(false)}>
          <div className="decision-modal-card compare-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="#16a34a" />
                <h3 className="modal-title">
                  {t('side_by_side_comparison') || 'Side-by-Side Destination Comparison'}
                </h3>
              </div>
              <button 
                className="modal-close-icon-btn" 
                onClick={() => setIsCompareModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-scrollable-content">
              <div className="compare-table-responsive-wrapper">
                <table className="side-by-side-table">
                  <thead>
                    <tr>
                      <th style={{ width: '220px' }}>{t('parameter') || 'Feature / Metric'}</th>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        if (!item) return null;
                        return (
                          <th key={id} className="compare-dest-head">
                            <div className="compare-head-title">{item.destination.shortName}</div>
                            <span className={`dest-type-pill ${item.destination.badgeClass}`}>
                              {item.destination.typeLabel}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="param-title">📍 {t('distance_from_farm') || 'Distance'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id}>
                            <strong>{item.distanceKm === 0 ? '0 km (Farmgate)' : `${item.distanceKm} km`}</strong>
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">🏷️ {t('gross_market_rate') || 'Gross Market Rate'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id}>
                            <strong style={{ color: '#16a34a' }}>₹{item.grossPricePerQuintal.toLocaleString('en-IN')} / Qtl</strong>
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">💵 {t('gross_selling_value') || 'Gross Selling Value'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id}>
                            ₹{item.grossValue.toLocaleString('en-IN')}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">🚛 {t('transport_expense') || 'Transport Cost'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id} style={{ color: item.deductions.transport === 0 ? '#16a34a' : '#ef4444' }}>
                            {item.deductions.transport === 0 ? '₹0' : `-₹${item.deductions.transport.toLocaleString('en-IN')}`}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">📦 {t('handling_hamali') || 'Handling & Labor'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id} style={{ color: item.deductions.handling === 0 ? '#16a34a' : '#ef4444' }}>
                            {item.deductions.handling === 0 ? '₹0' : `-₹${item.deductions.handling.toLocaleString('en-IN')}`}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">🏛 {t('mandi_user_fees') || 'Mandi Cess & Weighing'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id} style={{ color: item.deductions.mandiFees === 0 ? '#16a34a' : '#ef4444' }}>
                            {item.deductions.mandiFees === 0 ? '₹0' : `-₹${item.deductions.mandiFees.toLocaleString('en-IN')}`}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">❄️ {t('storage_cost') || 'Storage Holding'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id} style={{ color: item.deductions.storage === 0 ? '#16a34a' : '#ef4444' }}>
                            {item.deductions.storage === 0 ? '₹0' : `-₹${item.deductions.storage.toLocaleString('en-IN')}`}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="highlight-row">
                      <td className="param-title">
                        <strong>💰 {t('estimated_net_return') || 'Estimated Net Return'}</strong>
                      </td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>
                              ₹{item.estimatedNetReturn.toLocaleString('en-IN')}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              ₹{item.realizedNetPricePerQuintal.toLocaleString('en-IN')} / Qtl
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">💳 {t('payment_speed') || 'Payment Speed'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id}>
                            <span className="badge badge-blue">{item.paymentSpeed}</span>
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="param-title">ℹ️ {t('data_source') || 'Data Source'}</td>
                      {selectedForComparison.map(id => {
                        const item = evaluatedDestinations.find(d => d.id === id);
                        return (
                          <td key={id} style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {item.dataSource} ({item.priceTimestamp})
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsCompareModalOpen(false)}
              >
                {t('close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Bubble */}
      {toastMessage && (
        <div className="where-to-sell-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
