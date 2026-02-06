import "./style.css";
import Experience from "./Core/Experience.js";

const canvas = document.querySelector("canvas.webgl");

if (canvas) {
  // TODO: Pass initial configuration (seed, scenario, locale) if needed.
  new Experience({ canvas });
}
