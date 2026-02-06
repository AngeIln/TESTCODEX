import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Loop from "./Loop.js";
import World from "../World/World.js";
import Sizes from "../Utils/Sizes.js";
import Time from "../Utils/Time.js";

let instance = null;

export default class Experience {
  constructor({ canvas }) {
    if (instance) {
      return instance;
    }

    instance = this;

    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();

    // TODO: Add Three.js scene, resource manager, and debug utilities.
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.world = new World(this);
    this.loop = new Loop(this);
  }
}
