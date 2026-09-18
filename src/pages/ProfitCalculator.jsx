import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  PieChart, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Compass
} from 'lucide-react';
import { cropsList } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useAppState } from '../context/AppStateContext';

export const ProfitCalculator = () => {
  const { t } = useLanguage();
  const { setActivePage } = useAppState();
  const [crop, setCrop] = useState('');
  const [landArea, setLandArea] = useState(''); 
  const [transferredInfo, setTransferredInfo] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('farmogram_transfer_selling_price');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.sellingPricePerQtl) {
          setSellingPrice(String(parsed.sellingPricePerQtl));
          if (parsed.crop) {
            setCrop(parsed.crop);
          }
          setTransferredInfo(parsed);
          localStorage.removeItem('farmogram_transfer_selling_price');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  
  // Cost parameters (Per Acre base or total)
  const [seedCost, setSeedCost] = useState('');
  const [fertilizerCost, setFertilizerCost] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [irrigationCost, setIrrigationCost] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');

  // Output parameters
  const [expectedYield, setExpectedYield] = useState(''); 
  const [sellingPrice, setSellingPrice] = useState(''); 

  const [isCalculated, setIsCalculated] = useState(false);

  const handleCropChange = (selected) => {
    setCrop(selected);
    setIsCalculated(false);
  };

  const handleReset = () => {
    setCrop('');
    setLandArea('');
    setSeedCost('');
    setFertilizerCost('');
    setLabourCost('');
    setIrrigationCost('');
    setOtherExpenses('');
    setExpectedYield('');
    setSellingPrice('');
    setIsCalculated(false);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!crop || !landArea || seedCost === '' || fertilizerCost === '' || labourCost === '' || irrigationCost === '' || otherExpenses === '' || expectedYield === '' || sellingPrice === '') {
      return;
    }
    setIsCalculated(true);
  };

  const area = parseFloat(landArea) || 0;
  const costPerAcre = Number(seedCost) + Number(fertilizerCost) + Number(labourCost) + Number(irrigationCost) + Number(otherExpenses);
  const totalCost = costPerAcre * area;
  const totalYield = Number(expectedYield) * area;
  const expectedRevenue = totalYield * Number(sellingPrice);
  const netProfit = expectedRevenue - totalCost;
  const roi = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;
  const breakEvenPrice = totalYield > 0 ? Math.round(totalCost / totalYield) : 0;

  return (
    <div className="profit-calc-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <Calculator size={28} color="#7c3aed" /> {t('agri_profit_calc')}
        </h1>
        <p className="page-subtitle">
          {t('profit_calc_sub')}
        </p>
      </div>

      <div className="advisor-layout-grid" style={{ gridTemplateColumns: '460px 1fr' }}>
        {/* Left Inputs Form */}
        <div className="farm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 className="card-section-title">{t('cost_yield_variables')}</h2>
            <button 
              type="button" 
              onClick={handleReset} 
              className="btn btn-secondary btn-sm"
              title="Clear all fields"
            >
              <RotateCcw size={14} /> {t('reset')}
            </button>
          </div>
          <p className="card-section-subtitle">{t('values_scaled_by_area')}</p>

          {transferredInfo && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '10px',
              padding: '12px 14px',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '0.84rem',
              color: '#065f46'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>
                  <strong>{t('imported_destination_price') || 'Imported from Where Should I Sell?'}:</strong> ₹{transferredInfo.sellingPricePerQtl}/Q ({transferredInfo.mandiName})
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setTransferredInfo(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#047857', fontWeight: 700, padding: '2px 6px' }}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleCalculate} style={{ marginTop: '16px' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t('crop_cultivated')}</label>
                <select className="form-select" value={crop} onChange={(e) => handleCropChange(e.target.value)} required>
                  <option value="" disabled>{t('select_crop')}</option>
                  {cropsList.map(c => (
                    <option key={c} value={c}>{t(c) || c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('land_acres')}</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  className="form-input" 
                  value={landArea} 
                  onChange={(e) => setLandArea(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '14px 0 8px 0' }}>
              {t('total_expenses')} (₹ / Acre)
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t('seed_cost')} (₹)</label>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={seedCost} 
                  onChange={(e) => setSeedCost(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('fertilizer_cost')} (₹)</label>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={fertilizerCost} 
                  onChange={(e) => setFertilizerCost(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('labour_cost')} (₹)</label>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={labourCost} 
                  onChange={(e) => setLabourCost(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('irrigation_power_cost')} (₹)</label>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={irrigationCost} 
                  onChange={(e) => setIrrigationCost(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('other_expenses')} (₹)</label>
              <input 
                type="number" min="0"
                className="form-input" 
                value={otherExpenses} 
                onChange={(e) => setOtherExpenses(e.target.value)} 
                required
              />
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '14px 0 8px 0' }}>
              {t('expected_yield_acre')} & {t('expected_mandi_price')}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t('expected_yield_acre')} (Q)</label>
                <input 
                  type="number" step="0.1" min="0"
                  className="form-input" 
                  value={expectedYield} 
                  onChange={(e) => setExpectedYield(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>{t('expected_mandi_price')} (₹/Q)</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (crop) {
                        localStorage.setItem('farmogram_where_to_sell_crop', crop);
                      }
                      setActivePage('where-to-sell');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#16a34a',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                    title="Compare mandi and buyer net prices"
                  >
                    <Compass size={13} /> {t('compare_destinations_link') || 'Compare Options'}
                  </button>
                </div>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={sellingPrice} 
                  onChange={(e) => setSellingPrice(e.target.value)} 
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
              <TrendingUp size={18} /> {t('calculate_roi')}
            </button>
          </form>
        </div>

        {/* Right Financial Results Card */}
        <div className="calc-results-column">
          {!isCalculated ? (
            <div className="farm-card" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', border: '2px dashed #cbd5e1', background: '#f8fafc' }}>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '50%', padding: '20px', marginBottom: '20px' }}>
                <Calculator size={40} color="#64748b" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '10px' }}>{t('ready_to_calculate')}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '320px', lineHeight: 1.5 }}>
                {t('ready_to_calculate_sub')}
              </p>
            </div>
          ) : (
            <div className="farm-card recommendation-card" style={{ borderTopColor: '#7c3aed' }}>
            <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>
              {t('financial_forecast')} — {area} {t('land_acres')} ({t(crop) || crop})
            </span>

            {/* Main Profit Callout */}
            <div style={{ margin: '18px 0', padding: '20px 24px', background: netProfit >= 0 ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${netProfit >= 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: netProfit >= 0 ? '#166534' : '#991b1b', textTransform: 'uppercase' }}>
                {t('projected_net_profit')}
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: netProfit >= 0 ? '#15803d' : '#dc2626', fontFamily: 'var(--font-display)', lineHeight: 1.15, marginTop: '4px' }}>
                ₹ {netProfit.toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.85rem' }}>
                  {t('return_on_investment')}: {roi}%
                </span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  {t('net_profit')} / Acre: <strong>₹ {Math.round(netProfit / area).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid-2" style={{ gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('total_expenses')}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                  ₹ {totalCost.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>₹{costPerAcre.toLocaleString()} / acre</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('gross_revenue')}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                  ₹ {expectedRevenue.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{totalYield} Quintals total</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('break_even_price')}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                  ₹ {breakEvenPrice.toLocaleString()} / Q
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Minimum selling price to cover costs</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('return_on_investment')}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                  {expectedRevenue > 0 ? Math.round((netProfit / expectedRevenue) * 100) : 0}%
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Of gross harvest turnover</span>
              </div>
            </div>

            {/* Expenditure Proportion Bar */}
            <div style={{ background: '#fafafa', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                <span>{t('cost_yield_variables')}</span>
                <span>{t('labour_cost')} ~ {Math.round((labourCost / (costPerAcre || 1)) * 100)}%</span>
              </div>
              <div style={{ display: 'flex', height: '14px', borderRadius: '9999px', overflow: 'hidden', gap: '2px' }}>
                <div style={{ width: `${(seedCost / (costPerAcre || 1)) * 100}%`, background: '#3b82f6' }} title={`Seed: ₹${seedCost}`} />
                <div style={{ width: `${(fertilizerCost / (costPerAcre || 1)) * 100}%`, background: '#10b981' }} title={`Fertilizer: ₹${fertilizerCost}`} />
                <div style={{ width: `${(labourCost / (costPerAcre || 1)) * 100}%`, background: '#f59e0b' }} title={`Labour: ₹${labourCost}`} />
                <div style={{ width: `${(irrigationCost / (costPerAcre || 1)) * 100}%`, background: '#06b6d4' }} title={`Irrigation: ₹${irrigationCost}`} />
                <div style={{ width: `${(otherExpenses / (costPerAcre || 1)) * 100}%`, background: '#8b5cf6' }} title={`Other: ₹${otherExpenses}`} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.72rem', color: '#64748b', marginTop: '10px' }}>
                <span><strong style={{ color: '#3b82f6' }}>■</strong> {t('seed_cost')}</span>
                <span><strong style={{ color: '#10b981' }}>■</strong> {t('fertilizer_cost')}</span>
                <span><strong style={{ color: '#f59e0b' }}>■</strong> {t('labour_cost')}</span>
                <span><strong style={{ color: '#06b6d4' }}>■</strong> {t('irrigation_power_cost')}</span>
                <span><strong style={{ color: '#8b5cf6' }}>■</strong> {t('other_expenses')}</span>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
