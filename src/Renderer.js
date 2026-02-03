import { TILE_TYPES, TILE_COLORS, GRID } from "./constants.js";

export default class Renderer {
  constructor(scene) {
    this.scene = scene;
  }

  createTextures() {
    this.createTileTexture(TILE_TYPES.grass, TILE_COLORS.grass, {
      stroke: 0x1b4d2d,
      detail: 0x255a33,
    });
    this.createTileTexture(TILE_TYPES.rail, TILE_COLORS.rail, {
      stroke: 0x4b5563,
      detail: 0x6b7280,
      accent: 0xfbbf24,
    });
    this.createTileTexture(TILE_TYPES.station, TILE_COLORS.station, {
      stroke: 0x92400e,
      detail: 0xfcd34d,
      accent: 0x0f172a,
    });
    this.createTileTexture(TILE_TYPES.factory, TILE_COLORS.factory, {
      stroke: 0x7f1d1d,
      detail: 0xfca5a5,
      accent: 0x111827,
    });
    this.createTileTexture(TILE_TYPES.city, TILE_COLORS.city, {
      stroke: 0x4c1d95,
      detail: 0xd8b4fe,
      accent: 0x0f172a,
    });

    this.createTrainTexture();
  }

  createTileTexture(key, fill, palette) {
    const size = GRID.tileSize;
    const gfx = this.scene.add.graphics();

    gfx.fillStyle(fill, 1);
    gfx.fillRect(0, 0, size, size);

    gfx.lineStyle(2, palette.stroke ?? 0x1f2937, 1);
    gfx.strokeRect(1, 1, size - 2, size - 2);

    gfx.fillStyle(palette.detail ?? 0xffffff, 0.6);
    gfx.fillRect(4, size - 8, size - 8, 4);

    if (palette.accent) {
      gfx.fillStyle(palette.accent, 0.9);
      gfx.fillRect(4, 4, size - 8, 6);
    }

    if (key === TILE_TYPES.rail) {
      gfx.fillStyle(0x1f2937, 1);
      gfx.fillRect(6, size / 2 - 2, size - 12, 4);
      gfx.fillStyle(0xd1d5db, 0.8);
      for (let i = 8; i < size - 8; i += 6) {
        gfx.fillRect(i, size / 2 - 4, 2, 8);
      }
    }

    gfx.generateTexture(key, size, size);
    gfx.destroy();
  }

  createTrainTexture() {
    const size = GRID.tileSize;
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(0x2563eb, 1);
    gfx.fillRoundedRect(0, size * 0.15, size * 0.8, size * 0.5, 6);
    gfx.fillStyle(0x93c5fd, 1);
    gfx.fillRoundedRect(size * 0.1, size * 0.22, size * 0.45, size * 0.2, 4);
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillRect(size * 0.62, size * 0.28, size * 0.12, size * 0.2);
    gfx.fillStyle(0x0f172a, 1);
    gfx.fillCircle(size * 0.2, size * 0.65, size * 0.08);
    gfx.fillCircle(size * 0.6, size * 0.65, size * 0.08);
    gfx.generateTexture("train", size, size);
    gfx.destroy();
  }
}
