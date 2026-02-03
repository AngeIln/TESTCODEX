import { RESOURCE_LIMITS } from "./constants.js";

export default class StationManager {
  constructor() {
    this.stations = [];
    this.factories = [];
    this.cities = [];
  }

  addStation(tile) {
    const storage = {
      wood: 10,
      iron: 6,
      planks: 4,
    };
    const capacity = {
      wood: 40,
      iron: 40,
      planks: 30,
    };
    this.stations.push({ tile: { ...tile }, storage, capacity });
  }

  addFactory(tile) {
    const storage = {
      wood: 0,
      planks: 0,
    };
    const capacity = {
      wood: 30,
      planks: 30,
    };
    const requests = {
      wood: 20,
      planks: 0,
    };
    this.factories.push({ tile: { ...tile }, storage, capacity, requests });
  }

  addCity(tile) {
    const storage = {
      planks: 0,
      iron: 0,
    };
    const requests = {
      planks: 30,
      iron: 20,
    };
    this.cities.push({ tile: { ...tile }, storage, requests });
  }

  getStationAt(tile) {
    return this.stations.find((station) => station.tile.x === tile.x && station.tile.y === tile.y);
  }

  getFactoryAt(tile) {
    return this.factories.find((factory) => factory.tile.x === tile.x && factory.tile.y === tile.y);
  }

  getCityAt(tile) {
    return this.cities.find((city) => city.tile.x === tile.x && city.tile.y === tile.y);
  }

  tickProduction() {
    this.stations.forEach((station) => {
      station.storage.wood = Math.min(RESOURCE_LIMITS.wood, station.storage.wood + 1);
      station.storage.iron = Math.min(RESOURCE_LIMITS.iron, station.storage.iron + 1);
    });

    this.factories.forEach((factory) => {
      if (factory.storage.wood >= 2) {
        factory.storage.wood -= 2;
        factory.storage.planks = Math.min(RESOURCE_LIMITS.planks, factory.storage.planks + 1);
      }
      factory.requests.wood = Math.max(0, factory.capacity.wood - factory.storage.wood);
    });

    this.cities.forEach((city) => {
      city.requests.planks = Math.max(10, 30 - city.storage.planks);
      city.requests.iron = Math.max(5, 20 - city.storage.iron);
    });
  }
}
