import MainScene from "./MainScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-root",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#0f172a",
  scene: MainScene,
  physics: { default: "arcade" },
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
