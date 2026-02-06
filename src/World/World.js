import Environment from "./Environment.js";
import Grid from "./Grid.js";
import Train from "./Train.js";

export default class World {
  constructor(experience) {
    this.experience = experience;

    // TODO: Instantiate all game world systems.
    this.environment = new Environment(experience);
    this.grid = new Grid(experience);
    this.train = new Train(experience);
  }
}
