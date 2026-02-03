import { COSTS } from "./constants.js";

export function setupHUD(scene) {
  const walletEl = document.getElementById("wallet");
  const activeToolEl = document.getElementById("active-tool");
  const routeInfoEl = document.getElementById("route-info");
  const stationsCountEl = document.getElementById("stations-count");
  const trainsCountEl = document.getElementById("trains-count");

  scene.economy.onChange((money) => {
    walletEl.textContent = `$${money}`;
  });
  scene.economy.notify();

  const toolButtons = document.querySelectorAll(".tool");
  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toolButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      scene.activeTool = button.dataset.tool;
      activeToolEl.textContent = labelTool(scene.activeTool);
    });
  });

  const railButton = document.querySelector(".tool[data-tool='rail']");
  if (railButton) {
    railButton.classList.add("active");
  }
  activeToolEl.textContent = labelTool(scene.activeTool);

  scene.events.on("route-updated", (route) => {
    if (!route) {
      routeInfoEl.textContent = "Choisissez une gare et une ville";
      return;
    }
    routeInfoEl.textContent = `${route.start.x},${route.start.y} → ${route.end.x},${route.end.y}`;
  });

  scene.events.on("stations-updated", (count) => {
    stationsCountEl.textContent = `${count}`;
  });

  scene.events.on("trains-updated", (count) => {
    trainsCountEl.textContent = `${count}`;
  });

  scene.events.emit("stations-updated", scene.stationManager.stations.length);
  scene.events.emit("trains-updated", scene.trainManager.trains.length);
}

export function getToolCost(tool) {
  return COSTS[tool];
}

function labelTool(tool) {
  const labels = {
    rail: "Rail",
    station: "Gare",
    factory: "Usine",
    city: "Ville",
    train: "Train",
  };
  return labels[tool] ?? tool;
}
