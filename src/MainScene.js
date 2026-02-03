import GridManager from "./GridManager.js";
import EconomyManager from "./EconomyManager.js";
import StationManager from "./StationManager.js";
import TrainManager from "./TrainManager.js";
import Renderer from "./Renderer.js";
import { GRID, TILE_COLORS, TILE_TYPES, PRODUCTION_TIMING, COSTS } from "./constants.js";
import { setupHUD, getToolCost } from "./ui.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
    this.activeTool = "rail";
    this.isPanning = false;
    this.panStart = null;
    this.tileSprites = [];
    this.pendingRoute = { start: null, end: null };
  }

  create() {
    this.grid = new GridManager(GRID.cols, GRID.rows, GRID.tileSize);
    this.economy = new EconomyManager();
    this.stationManager = new StationManager();
    this.trainManager = new TrainManager(this, this.grid, this.economy);
    this.renderer = new Renderer(this);

    this.renderer.createTextures();
    this.drawInitialGrid();
    this.setupCamera();
    this.setupInput();
    this.setupProductionLoop();
    this.bootstrapDemo();
    setupHUD(this);
  }

  drawInitialGrid() {
    this.tileSprites = Array.from({ length: GRID.rows }, () => Array(GRID.cols).fill(null));
    for (let y = 0; y < GRID.rows; y += 1) {
      for (let x = 0; x < GRID.cols; x += 1) {
        const image = this.add.image(
          x * GRID.tileSize + GRID.tileSize / 2,
          y * GRID.tileSize + GRID.tileSize / 2,
          TILE_TYPES.grass
        );
        image.setDisplaySize(GRID.tileSize, GRID.tileSize);
        this.tileSprites[y][x] = image;
      }
    }

    this.grid.onChange((x, y) => this.redrawTile(x, y));
  }

  redrawTile(x, y) {
    const tile = this.grid.getTile(x, y);
    const sprite = this.tileSprites[y]?.[x];
    if (!tile || !sprite) return;
    sprite.setTexture(tile.type);
    if (tile.type === TILE_TYPES.grass) {
      sprite.setTint(TILE_COLORS.grass);
    } else {
      sprite.clearTint();
    }
  }

  setupCamera() {
    const { width, height } = this.scale;
    this.cameras.main.setBounds(0, 0, GRID.cols * GRID.tileSize, GRID.rows * GRID.tileSize);
    this.cameras.main.centerOn(width / 2, height / 2);

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      const zoom = Phaser.Math.Clamp(this.cameras.main.zoom - deltaY * 0.001, 0.5, 2.5);
      this.cameras.main.setZoom(zoom);
    });
  }

  setupInput() {
    this.input.on("pointerdown", (pointer) => {
      this.isPanning = false;
      this.panStart = {
        x: pointer.x,
        y: pointer.y,
        camX: this.cameras.main.scrollX,
        camY: this.cameras.main.scrollY,
      };
    });

    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown) return;
      const dragDistance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.panStart.x, this.panStart.y);
      if (dragDistance > 6 || this.isPanning) {
        this.isPanning = true;
        const dragX = (this.panStart.x - pointer.x) / this.cameras.main.zoom;
        const dragY = (this.panStart.y - pointer.y) / this.cameras.main.zoom;
        this.cameras.main.scrollX = this.panStart.camX + dragX;
        this.cameras.main.scrollY = this.panStart.camY + dragY;
      }
    });

    this.input.on("pointerup", (pointer) => {
      if (this.isPanning) return;
      if (pointer.leftButtonDown()) {
        this.handlePlacement(pointer, pointer.event.shiftKey);
      }
    });
  }

  setupProductionLoop() {
    this.time.addEvent({
      delay: PRODUCTION_TIMING.tickMs,
      loop: true,
      callback: () => this.stationManager.tickProduction(),
    });
  }

  bootstrapDemo() {
    const railPoints = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
      { x: 12, y: 5 },
      { x: 13, y: 5 },
      { x: 14, y: 5 },
      { x: 15, y: 5 },
      { x: 16, y: 5 },
      { x: 17, y: 5 },
      { x: 18, y: 5 },
      { x: 19, y: 5 },
      { x: 20, y: 5 },
      { x: 20, y: 6 },
      { x: 20, y: 7 },
      { x: 20, y: 8 },
      { x: 20, y: 9 },
      { x: 20, y: 10 },
      { x: 20, y: 11 },
      { x: 20, y: 12 },
      { x: 20, y: 13 },
      { x: 20, y: 14 },
      { x: 20, y: 15 },
    ];
    railPoints.forEach((point) => this.grid.setTile(point.x, point.y, TILE_TYPES.rail));

    this.placeStation({ x: 5, y: 5 });
    this.placeFactory({ x: 12, y: 5 });
    this.placeCity({ x: 20, y: 15 });
    this.pendingRoute = { start: { x: 5, y: 5 }, end: { x: 20, y: 15 } };
    this.events.emit("route-updated", this.pendingRoute);

    this.trainManager.addTrain(this.pendingRoute.start, this.pendingRoute.end);
    this.events.emit("trains-updated", this.trainManager.trains.length);
    this.events.emit("stations-updated", this.stationManager.stations.length);
  }

  handlePlacement(pointer, isRouting) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const gridX = Math.floor(worldPoint.x / GRID.tileSize);
    const gridY = Math.floor(worldPoint.y / GRID.tileSize);
    if (!this.grid.inBounds(gridX, gridY)) return;

    if (isRouting) {
      this.handleRoutingSelection({ x: gridX, y: gridY });
      return;
    }

    if (this.activeTool === "train") {
      this.purchaseTrain(worldPoint);
      return;
    }

    const tile = this.grid.getTile(gridX, gridY);
    if (!tile || tile.type !== TILE_TYPES.grass) return;

    const cost = getToolCost(this.activeTool);
    if (!this.economy.canAfford(cost)) return;

    if (this.activeTool === "rail") {
      this.grid.setTile(gridX, gridY, TILE_TYPES.rail);
    } else if (this.activeTool === "station") {
      this.placeStation({ x: gridX, y: gridY });
    } else if (this.activeTool === "factory") {
      this.placeFactory({ x: gridX, y: gridY });
    } else if (this.activeTool === "city") {
      this.placeCity({ x: gridX, y: gridY });
    }

    this.economy.spend(cost);
    this.spawnCostText(worldPoint.x, worldPoint.y, -cost);
  }

  handleRoutingSelection(tile) {
    const station = this.stationManager.getStationAt(tile);
    const city = this.stationManager.getCityAt(tile);
    if (station) {
      this.pendingRoute.start = station.tile;
    }
    if (city) {
      this.pendingRoute.end = city.tile;
    }

    if (this.pendingRoute.start && this.pendingRoute.end) {
      this.events.emit("route-updated", this.pendingRoute);
    }
  }

  purchaseTrain(worldPoint) {
    if (!this.economy.canAfford(COSTS.train)) return;
    if (!this.pendingRoute.start || !this.pendingRoute.end) return;

    this.economy.spend(COSTS.train);
    this.trainManager.addTrain(this.pendingRoute.start, this.pendingRoute.end);
    this.events.emit("trains-updated", this.trainManager.trains.length);
    this.spawnCostText(worldPoint.x, worldPoint.y, -COSTS.train);
  }

  placeStation(tile) {
    this.grid.setTile(tile.x, tile.y, TILE_TYPES.station);
    this.stationManager.addStation(tile);
    this.events.emit("stations-updated", this.stationManager.stations.length);
  }

  placeFactory(tile) {
    this.grid.setTile(tile.x, tile.y, TILE_TYPES.factory);
    this.stationManager.addFactory(tile);
  }

  placeCity(tile) {
    this.grid.setTile(tile.x, tile.y, TILE_TYPES.city);
    this.stationManager.addCity(tile);
  }

  spawnCostText(x, y, amount) {
    const text = this.add.text(x, y, `${amount}`, {
      fontSize: "16px",
      color: amount < 0 ? "#f87171" : "#34d399",
      fontStyle: "bold",
    });
    text.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: text,
      y: y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => text.destroy(),
    });
  }

  update(time, delta) {
    this.trainManager.update(delta);
  }
}
