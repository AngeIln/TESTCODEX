import { TILE_TYPES } from "./constants.js";

export default class Pathfinder {
  static heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  static findPath(grid, start, goal) {
    if (!grid.inBounds(start.x, start.y) || !grid.inBounds(goal.x, goal.y)) {
      return [];
    }

    const passable = new Set([
      TILE_TYPES.rail,
      TILE_TYPES.station,
      TILE_TYPES.factory,
      TILE_TYPES.city,
    ]);

    const openSet = [start];
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    const key = (pos) => `${pos.x},${pos.y}`;
    gScore.set(key(start), 0);
    fScore.set(key(start), this.heuristic(start, goal));

    while (openSet.length > 0) {
      openSet.sort((a, b) => (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity));
      const current = openSet.shift();
      if (!current) break;

      if (current.x === goal.x && current.y === goal.y) {
        return this.reconstructPath(cameFrom, current);
      }

      grid.getNeighbors(current.x, current.y).forEach((neighbor) => {
        const tile = grid.getTile(neighbor.x, neighbor.y);
        if (!tile || !passable.has(tile.type)) return;

        const tentativeG = (gScore.get(key(current)) ?? Infinity) + 1;
        if (tentativeG < (gScore.get(key(neighbor)) ?? Infinity)) {
          cameFrom.set(key(neighbor), current);
          gScore.set(key(neighbor), tentativeG);
          fScore.set(key(neighbor), tentativeG + this.heuristic(neighbor, goal));
          if (!openSet.find((node) => node.x === neighbor.x && node.y === neighbor.y)) {
            openSet.push({ ...neighbor });
          }
        }
      });
    }

    return [];
  }

  static reconstructPath(cameFrom, current) {
    const path = [current];
    const key = (pos) => `${pos.x},${pos.y}`;
    let cursor = current;

    while (cameFrom.has(key(cursor))) {
      cursor = cameFrom.get(key(cursor));
      if (!cursor) break;
      path.unshift({ ...cursor });
    }

    return path;
  }
}
