export default class EconomyManager {
  constructor(startingMoney = 2000) {
    this.money = startingMoney;
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach((callback) => callback(this.money));
  }

  canAfford(amount) {
    return this.money >= amount;
  }

  spend(amount) {
    this.money = Math.max(0, this.money - amount);
    this.notify();
  }

  earn(amount) {
    this.money += amount;
    this.notify();
  }
}
