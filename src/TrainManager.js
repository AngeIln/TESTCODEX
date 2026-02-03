import TrainEntity from "./TrainEntity.js";

export default class TrainManager {
  constructor(scene, grid, economy) {
    this.scene = scene;
    this.grid = grid;
    this.economy = economy;
    this.trains = [];
  }

  addTrain(startTile, targetTile) {
    const train = new TrainEntity(this.scene, this.grid, this.economy, startTile, targetTile);
    this.trains.push(train);
    return train;
  }

  update(delta) {
    this.trains.forEach((train) => train.update(delta));
  }
}
