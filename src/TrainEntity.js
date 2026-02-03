import Pathfinder from "./Pathfinder.js";
import { TRAIN_CONFIG } from "./constants.js";

export default class TrainEntity {
  constructor(scene, grid, economy, startTile, targetTile) {
    this.scene = scene;
    this.grid = grid;
    this.economy = economy;
    this.state = "IDLE";
    this.currentTile = { ...startTile };
    this.targetTile = { ...targetTile };
    this.path = [];
    this.pathIndex = 0;
    this.speed = 0;
    this.cargo = { wood: 0, iron: 0, planks: 0 };
    this.sprite = scene.add.image(0, 0, "train");
    this.sprite.setDisplaySize(
      grid.tileSize * TRAIN_CONFIG.sizeRatio,
      grid.tileSize * TRAIN_CONFIG.sizeRatio
    );
    this.sprite.setOrigin(0.5, 0.5);
    this.updateWorldPosition();
    this.recalculatePath();

    grid.onChange(() => this.recalculatePath());
  }

  updateWorldPosition() {
    const worldX = this.currentTile.x * this.grid.tileSize + this.grid.tileSize / 2;
    const worldY = this.currentTile.y * this.grid.tileSize + this.grid.tileSize / 2;
    this.sprite.setPosition(worldX, worldY);
  }

  recalculatePath() {
    this.path = Pathfinder.findPath(this.grid, this.currentTile, this.targetTile);
    this.pathIndex = 0;
    this.state = this.path.length > 1 ? "MOVING_TO_LOAD" : "IDLE";
  }

  setRoute(startTile, targetTile) {
    this.currentTile = { ...startTile };
    this.targetTile = { ...targetTile };
    this.recalculatePath();
    this.updateWorldPosition();
  }

  update(delta) {
    if (this.state === "IDLE") return;

    if (this.pathIndex >= this.path.length - 1) {
      this.arriveAtDestination();
      return;
    }

    const nextTile = this.path[this.pathIndex + 1];
    const targetX = nextTile.x * this.grid.tileSize + this.grid.tileSize / 2;
    const targetY = nextTile.y * this.grid.tileSize + this.grid.tileSize / 2;

    const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, targetX, targetY);
    const stoppingDistance = (this.speed * this.speed) / (2 * TRAIN_CONFIG.deceleration);
    if (distance < stoppingDistance) {
      this.speed = Math.max(0, this.speed - TRAIN_CONFIG.deceleration * (delta / 1000));
    } else {
      this.speed = Math.min(TRAIN_CONFIG.maxSpeed, this.speed + TRAIN_CONFIG.acceleration * (delta / 1000));
    }

    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, targetX, targetY);
    const move = Math.min(distance, this.speed * (delta / 1000));
    this.sprite.x += Math.cos(angle) * move;
    this.sprite.y += Math.sin(angle) * move;
    this.sprite.rotation = angle;

    if (distance <= 2) {
      this.currentTile = { ...nextTile };
      this.pathIndex += 1;
      this.updateWorldPosition();
    }
  }

  arriveAtDestination() {
    if (this.state === "MOVING_TO_LOAD") {
      this.state = "LOADING";
      this.scene.time.delayedCall(500, () => {
        this.loadCargo();
        this.state = "MOVING_TO_UNLOAD";
        this.reverseRoute();
      });
      return;
    }

    if (this.state === "MOVING_TO_UNLOAD") {
      this.state = "UNLOADING";
      this.scene.time.delayedCall(500, () => {
        this.unloadCargo();
        this.state = "MOVING_TO_LOAD";
        this.reverseRoute();
      });
    }
  }

  reverseRoute() {
    if (this.path.length === 0) return;
    const newTarget = { ...this.path[0] };
    this.path = this.path.slice().reverse();
    this.pathIndex = 0;
    this.targetTile = newTarget;
  }

  loadCargo() {
    const station = this.scene.stationManager.getStationAt(this.currentTile);
    if (station) {
      const loadedWood = Math.min(2, station.storage.wood);
      const loadedIron = Math.min(1, station.storage.iron);
      station.storage.wood -= loadedWood;
      station.storage.iron -= loadedIron;
      this.cargo.wood += loadedWood;
      this.cargo.iron += loadedIron;
    }

    const factory = this.scene.stationManager.getFactoryAt(this.currentTile);
    if (factory) {
      const loadedPlanks = Math.min(2, factory.storage.planks);
      factory.storage.planks -= loadedPlanks;
      this.cargo.planks += loadedPlanks;
    }
  }

  unloadCargo() {
    const factory = this.scene.stationManager.getFactoryAt(this.currentTile);
    if (factory && this.cargo.wood > 0) {
      factory.storage.wood += this.cargo.wood;
      this.cargo.wood = 0;
      return;
    }

    const city = this.scene.stationManager.getCityAt(this.currentTile);
    if (city) {
      const payout = this.cargo.planks * 45 + this.cargo.iron * 65;
      city.storage.planks += this.cargo.planks;
      city.storage.iron += this.cargo.iron;
      this.cargo.planks = 0;
      this.cargo.iron = 0;
      if (payout > 0) {
        this.economy.earn(payout);
      }
    }
  }
}
