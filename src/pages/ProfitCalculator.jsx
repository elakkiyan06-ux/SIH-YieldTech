import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  PieChart, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { cropsList } from '../data/mockData';

export const ProfitCalculator = () => {
  const [crop, setCrop] = useState('');
  const [landArea, setLandArea] = useState(''); 
  
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
          <Calculator size={28} color="#7c3aed" /> Agricultural Profit & Cost Calculator
        </h1>
        <p className="page-subtitle">
          Forecast input expenses, gross output revenue, net margins, and break-even mandi pricing before committing field resources.
        </p>
      </div>

      <div className="advisor-layout-grid" style={{ gridTemplateColumns: '460px 1fr' }}>
        {/* Left Inputs Form */}
        <div className="farm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 className="card-section-title">Cost & Yield Variables</h2>
            <button 
              type="button" 
              onClick={handleReset} 
              className="btn btn-secondary btn-sm"
              title="Clear all fields"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
          <p className="card-section-subtitle">Values are automatically scaled by land area.</p>

          <form onSubmit={handleCalculate} style={{ marginTop: '16px' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Crop</label>
                <select className="form-select" value={crop} onChange={(e) => handleCropChange(e.target.value)} required>
                  <option value="" disabled>Select Crop</option>
                  {cropsList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cultivated Area (Acres)</label>
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
              Per-Acre Input Expenditures (₹)
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Seed / Seedling Cost (₹)</label>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={seedCost} 
                  onChange={(e) => setSeedCost(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fertilizer & Nutrition (₹)</label>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={fertilizerCost} 
                  onChange={(e) => setFertilizerCost(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Labour & Spraying (₹)</label>
                <input 
                  type="number" min="0"
                  className="form-input" 
                  value={labourCost} 
                  onChange={(e) => setLabourCost(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Irrigation & Power (₹)</label>
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
              <label className="form-label">Other Machinery & Transport Expenses (₹)</label>
              <input 
                type="number" min="0"
                className="form-input" 
                value={otherExpenses} 
                onChange={(e) => setOtherExpenses(e.target.value)} 
                required
              />
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '14px 0 8px 0' }}>
              Output Yield & Mandi Pricing
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Expected Yield (Q/Acre)</label>
                <input 
                  type="number" step="0.1" min="0"
                  className="form-input" 
                  value={expectedYield} 
                  onChange={(e) => setExpectedYield(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expected Selling Price (₹/Q)</label>
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
              <TrendingUp size={18} /> Calculate Profit Margin
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
              <h3 style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '10px' }}>Ready to Calculate</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '320px', lineHeight: 1.5 }}>
                Enter your own expected costs and yield parameters to generate a personalized financial feasibility report.
              </p>
            </div>
          ) : (
            <div className="farm-card recommendation-card" style={{ borderTopColor: '#7c3aed' }}>
            <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>
              Financial Feasibility for {area} Acres of {crop}
            </span>

            {/* Main Profit Callout */}
            <div style={{ margin: '18px 0', padding: '20px 24px', background: netProfit >= 0 ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${netProfit >= 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: netProfit >= 0 ? '#166534' : '#991b1b', textTransform: 'uppercase' }}>
                Estimated Net Profit
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: netProfit >= 0 ? '#15803d' : '#dc2626', fontFamily: 'var(--font-display)', lineHeight: 1.15, marginTop: '4px' }}>
                ₹ {netProfit.toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.85rem' }}>
                  ROI: {roi}%
                </span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Net Profit per Acre: <strong>₹ {Math.round(netProfit / area).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid-2" style={{ gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Investment Cost</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                  ₹ {totalCost.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>₹{costPerAcre.toLocaleString()} / acre</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Gross Output Revenue</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                  ₹ {expectedRevenue.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{totalYield} Quintals total</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Break-Even Price</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                  ₹ {breakEvenPrice.toLocaleString()} / Q
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Minimum selling price to cover costs</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Profit Margin</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                  {expectedRevenue > 0 ? Math.round((netProfit / expectedRevenue) * 100) : 0}%
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Of gross harvest turnover</span>
              </div>
            </div>

            {/* Expenditure Proportion Bar */}
            <div style={{ background: '#fafafa', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                <span>Cost Component Share</span>
                <span>Labour ~ {Math.round((labourCost / costPerAcre) * 100)}%</span>
              </div>
              <div style={{ display: 'flex', height: '14px', borderRadius: '9999px', overflow: 'hidden', gap: '2px' }}>
                <div style={{ width: `${(seedCost / costPerAcre) * 100}%`, background: '#3b82f6' }} title={`Seed: ₹${seedCost}`} />
                <div style={{ width: `${(fertilizerCost / costPerAcre) * 100}%`, background: '#10b981' }} title={`Fertilizer: ₹${fertilizerCost}`} />
                <div style={{ width: `${(labourCost / costPerAcre) * 100}%`, background: '#f59e0b' }} title={`Labour: ₹${labourCost}`} />
                <div style={{ width: `${(irrigationCost / costPerAcre) * 100}%`, background: '#06b6d4' }} title={`Irrigation: ₹${irrigationCost}`} />
                <div style={{ width: `${(otherExpenses / costPerAcre) * 100}%`, background: '#8b5cf6' }} title={`Other: ₹${otherExpenses}`} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.72rem', color: '#64748b', marginTop: '10px' }}>
                <span><strong style={{ color: '#3b82f6' }}>■</strong> Seeds</span>
                <span><strong style={{ color: '#10b981' }}>■</strong> Fertilizers</span>
                <span><strong style={{ color: '#f59e0b' }}>■</strong> Labour</span>
                <span><strong style={{ color: '#06b6d4' }}>■</strong> Irrigation</span>
                <span><strong style={{ color: '#8b5cf6' }}>■</strong> Other</span>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
