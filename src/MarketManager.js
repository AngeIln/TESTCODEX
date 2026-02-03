import { MARKET_CONFIG } from "./constants.js";

export default class MarketManager {
  constructor() {
    this.prices = { ...MARKET_CONFIG.basePrices };
    this.history = {
      wood: [this.prices.wood],
      iron: [this.prices.iron],
      planks: [this.prices.planks],
    };
  }

  getPrice(resource) {
    return this.prices[resource] ?? 0;
  }

  tick(stations, factories, cities) {
    const totals = this.calculateTotals(stations, factories, cities);
    const demandIndex = this.calculateDemandIndex(totals);

    Object.keys(this.prices).forEach((resource) => {
      const base = MARKET_CONFIG.basePrices[resource];
      const supply = totals.supply[resource] || 0;
      const demand = totals.demand[resource] || 0;
      const imbalance = demand - supply;
      const pressure = Math.tanh(imbalance / 20);
      const noise = (Math.random() - 0.5) * MARKET_CONFIG.volatility;
      const target = base * (1 + MARKET_CONFIG.demandWeight * pressure + noise) * demandIndex[resource];
      const blended = this.prices[resource] * 0.75 + target * 0.25;
      this.prices[resource] = Math.max(2, Number(blended.toFixed(2)));
      this.pushHistory(resource, this.prices[resource]);
    });
  }

  calculateTotals(stations, factories, cities) {
    const supply = { wood: 0, iron: 0, planks: 0 };
    const demand = { wood: 0, iron: 0, planks: 0 };

    stations.forEach((station) => {
      supply.wood += station.storage.wood;
      supply.iron += station.storage.iron;
    });

    factories.forEach((factory) => {
      demand.wood += factory.requests.wood;
      supply.planks += factory.storage.planks;
    });

    cities.forEach((city) => {
      demand.planks += city.requests.planks;
      demand.iron += city.requests.iron;
    });

    return { supply, demand };
  }

  calculateDemandIndex(totals) {
    const index = {};
    Object.keys(totals.demand).forEach((resource) => {
      const d = totals.demand[resource];
      const s = totals.supply[resource] || 1;
      index[resource] = Math.min(1.8, Math.max(0.6, 0.9 + (d - s) / 100));
    });
    return index;
  }

  pushHistory(resource, value) {
    const series = this.history[resource];
    series.push(value);
    if (series.length > MARKET_CONFIG.historyLength) {
      series.shift();
    }
  }
}
