export const GRID = {
  cols: 50,
  rows: 50,
  tileSize: 32,
};

export const TILE_TYPES = {
  grass: "grass",
  rail: "rail",
  station: "station",
  factory: "factory",
  city: "city",
};

export const TILE_COLORS = {
  grass: 0x2f6f3e,
  rail: 0x9aa1a7,
  station: 0xf59e0b,
  factory: 0xef4444,
  city: 0x8b5cf6,
};

export const COSTS = {
  rail: 50,
  station: 200,
  factory: 300,
  city: 500,
  train: 400,
};

export const RESOURCE_LIMITS = {
  wood: 50,
  iron: 50,
  planks: 50,
};

export const MARKET_CONFIG = {
  basePrices: {
    wood: 12,
    iron: 20,
    planks: 30,
  },
  volatility: 0.08,
  demandWeight: 0.6,
  supplyWeight: 0.4,
  historyLength: 30,
};

export const TRAIN_CONFIG = {
  maxSpeed: 120,
  acceleration: 220,
  deceleration: 260,
  sizeRatio: 0.6,
};

export const PRODUCTION_TIMING = {
  tickMs: 1200,
};
