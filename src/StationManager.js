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
    this.stations.push({ tile: { ...tile }, storage });
  }

  addFactory(tile) {
    const storage = {
      wood: 0,
      planks: 0,
    };
    this.factories.push({ tile: { ...tile }, storage });
  }

  addCity(tile) {
    const storage = {
      planks: 0,
      iron: 0,
    };
    this.cities.push({ tile: { ...tile }, storage });
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
    });
  }
}
