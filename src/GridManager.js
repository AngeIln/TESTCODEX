import { TILE_TYPES } from "./constants.js";

export default class GridManager {
  constructor(cols, rows, tileSize) {
    this.cols = cols;
    this.rows = rows;
    this.tileSize = tileSize;
    this.tiles = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ type: TILE_TYPES.grass, data: null }))
    );
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notifyChange(x, y) {
    this.listeners.forEach((callback) => callback(x, y));
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.cols && y < this.rows;
  }

  getTile(x, y) {
    if (!this.inBounds(x, y)) return null;
    return this.tiles[y][x];
  }

  setTile(x, y, type, data = null) {
    if (!this.inBounds(x, y)) return false;
    this.tiles[y][x] = { type, data };
    this.notifyChange(x, y);
    return true;
  }

  isRail(x, y) {
    const tile = this.getTile(x, y);
    return tile && tile.type === TILE_TYPES.rail;
  }

  getNeighbors(x, y) {
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ].filter((pos) => this.inBounds(pos.x, pos.y));
  }
}
