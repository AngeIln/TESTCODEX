export default class EconomyManager {
  constructor(startingMoney = 2000) {
    this.money = startingMoney;
    this.listeners = [];
    this.ledger = [];
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
    this.addLedgerEntry("SPEND", -amount);
    this.notify();
  }

  earn(amount) {
    this.money += amount;
    this.addLedgerEntry("EARN", amount);
    this.notify();
  }

  addLedgerEntry(type, amount) {
    this.ledger.unshift({
      type,
      amount,
      timestamp: new Date().toISOString(),
    });
    if (this.ledger.length > 50) {
      this.ledger.pop();
    }
  }
}
