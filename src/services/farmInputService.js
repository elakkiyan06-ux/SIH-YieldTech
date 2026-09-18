/**
 * Farm Input Price Watch Service Engine
 * Manages agricultural input price tracking, watchlists, price threshold alerts,
 * comparative market analysis, and Profit Calculator bridging.
 */

import { INITIAL_INPUT_ITEMS, FARM_INPUT_CATEGORIES } from '../data/farmInputSeedData';

const STORAGE_KEYS = {
  ITEMS: 'farmogram_input_price_items',
  WATCHLIST: 'farmogram_input_watchlist',
  ALERTS: 'farmogram_input_price_alerts',
  TRANSFER: 'farmogram_transfer_input_costs'
};

class FarmInputService {
  constructor() {
    this.initStorage();
    this.listeners = new Set();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_INPUT_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WATCHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(['inp-fert-01', 'inp-seed-01']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify([
        {
          id: 'alt-01',
          itemId: 'inp-fert-02',
          itemName: 'DAP (Di-Ammonium Phosphate 18:46:0)',
          targetPrice: 1300,
          condition: 'BELOW',
          createdAt: '18 Sep 2026',
          status: 'ACTIVE'
        }
      ]));
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(eventType, data) {
    this.listeners.forEach(cb => {
      try {
        cb({ type: eventType, data });
      } catch (e) {
        console.error('Error in input service listener:', e);
      }
    });
  }

  getAllItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return raw ? JSON.parse(raw) : INITIAL_INPUT_ITEMS;
    } catch (e) {
      return INITIAL_INPUT_ITEMS;
    }
  }

  getItemById(id) {
    const items = this.getAllItems();
    return items.find(item => item.id === id) || null;
  }

  getItems({ category = 'all', search = '', district = 'all', trendFilter = 'all' } = {}) {
    let items = this.getAllItems();

    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }

    if (district && district !== 'all') {
      items = items.filter(item => item.district.toLowerCase() === district.toLowerCase());
    }

    if (trendFilter && trendFilter !== 'all') {
      if (trendFilter === 'rising') {
        items = items.filter(item => item.priceChange > 0);
      } else if (trendFilter === 'falling') {
        items = items.filter(item => item.priceChange < 0);
      } else if (trendFilter === 'stable') {
        items = items.filter(item => item.priceChange === 0);
      } else if (trendFilter === 'subsidized') {
        items = items.filter(item => Boolean(item.subsidyNote));
      }
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }

    return items;
  }

  getWatchlist() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  isWatched(itemId) {
    const watchlist = this.getWatchlist();
    return watchlist.includes(itemId);
  }

  toggleWatchlist(itemId) {
    const watchlist = this.getWatchlist();
    let updated;
    if (watchlist.includes(itemId)) {
      updated = watchlist.filter(id => id !== itemId);
    } else {
      updated = [...watchlist, itemId];
    }
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(updated));
    this.notify('WATCHLIST_UPDATED', { itemId, watchlist: updated });
    return updated.includes(itemId);
  }

  getPriceAlerts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  setPriceAlert({ itemId, targetPrice, condition = 'BELOW', note = '' }) {
    const item = this.getItemById(itemId);
    if (!item) return null;

    const alerts = this.getPriceAlerts();
    const newAlert = {
      id: `alt-${Date.now()}`,
      itemId,
      itemName: item.name,
      unit: item.unit,
      currentPrice: item.currentPrice,
      targetPrice: Number(targetPrice),
      condition, // 'BELOW' | 'ABOVE'
      note,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'ACTIVE'
    };

    const updated = [newAlert, ...alerts];
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    this.notify('ALERT_CREATED', newAlert);
    return newAlert;
  }

  removePriceAlert(alertId) {
    const alerts = this.getPriceAlerts();
    const updated = alerts.filter(a => a.id !== alertId);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    this.notify('ALERT_REMOVED', { alertId });
    return true;
  }

  getComparisonData(itemIds = []) {
    const all = this.getAllItems();
    return itemIds.map(id => all.find(item => item.id === id)).filter(Boolean);
  }

  getMarketSummaryStats() {
    const items = this.getAllItems();
    const watchlist = this.getWatchlist();
    const alerts = this.getPriceAlerts();

    const rising = items.filter(i => i.priceChange > 0).length;
    const falling = items.filter(i => i.priceChange < 0).length;
    const stable = items.filter(i => i.priceChange === 0).length;
    const subsidized = items.filter(i => Boolean(i.subsidyNote)).length;

    return {
      totalTracked: items.length,
      risingCount: rising,
      fallingCount: falling,
      stableCount: stable,
      subsidizedCount: subsidized,
      watchlistCount: watchlist.length,
      activeAlertsCount: alerts.length
    };
  }

  /**
   * Transfer verified input price to Profit Calculator
   */
  transferToProfitCalculator(item) {
    const payload = {
      source: 'Farm Input Price Watch',
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      calcCategory: item.calcCategory || 'fertilizerCost',
      unit: item.unit,
      price: item.currentPrice,
      sellerName: item.sellerName,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.TRANSFER, JSON.stringify(payload));
    this.notify('TRANSFER_TO_PROFIT_CALC', payload);
    return payload;
  }
}

export const farmInputService = new FarmInputService();
export default farmInputService;
