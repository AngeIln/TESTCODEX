import { COSTS } from "./constants.js";

export function setupHUD(scene) {
  const walletEl = document.getElementById("wallet");
  const activeToolEl = document.getElementById("active-tool");
  const routeInfoEl = document.getElementById("route-info");
  const stationsCountEl = document.getElementById("stations-count");
  const trainsCountEl = document.getElementById("trains-count");
  const priceWoodEl = document.getElementById("price-wood");
  const priceIronEl = document.getElementById("price-iron");
  const pricePlanksEl = document.getElementById("price-planks");
  const stockWoodEl = document.getElementById("stock-wood");
  const stockIronEl = document.getElementById("stock-iron");
  const stockPlanksEl = document.getElementById("stock-planks");
  const demandWoodEl = document.getElementById("demand-wood");
  const demandIronEl = document.getElementById("demand-iron");
  const demandPlanksEl = document.getElementById("demand-planks");
  const chartContext = document.getElementById("market-chart");
  let marketChart;

  scene.economy.onChange((money) => {
    walletEl.textContent = `$${money}`;
    triggerPulse(walletEl);
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

  scene.events.on("market-updated", (market) => {
    priceWoodEl.textContent = `$${market.prices.wood.toFixed(2)}`;
    priceIronEl.textContent = `$${market.prices.iron.toFixed(2)}`;
    pricePlanksEl.textContent = `$${market.prices.planks.toFixed(2)}`;

    if (!marketChart && chartContext && window.Chart) {
      marketChart = new window.Chart(chartContext, {
        type: "line",
        data: {
          labels: market.history.wood.map((_, idx) => idx + 1),
          datasets: [
            {
              label: "Bois",
              data: market.history.wood,
              borderColor: "#fbbf24",
              backgroundColor: "rgba(251, 191, 36, 0.2)",
              tension: 0.3,
            },
            {
              label: "Fer",
              data: market.history.iron,
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.2)",
              tension: 0.3,
            },
            {
              label: "Planches",
              data: market.history.planks,
              borderColor: "#a78bfa",
              backgroundColor: "rgba(167, 139, 250, 0.2)",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { display: false },
            y: { ticks: { color: "#94a3b8" } },
          },
          plugins: {
            legend: {
              labels: { color: "#e2e8f0", boxWidth: 10 },
            },
          },
        },
      });
    }

    if (marketChart) {
      marketChart.data.labels = market.history.wood.map((_, idx) => idx + 1);
      marketChart.data.datasets[0].data = market.history.wood;
      marketChart.data.datasets[1].data = market.history.iron;
      marketChart.data.datasets[2].data = market.history.planks;
      marketChart.update();
    }

    updateMaterialTotals(scene, {
      stockWoodEl,
      stockIronEl,
      stockPlanksEl,
      demandWoodEl,
      demandIronEl,
      demandPlanksEl,
    });
  });

  scene.events.emit("stations-updated", scene.stationManager.stations.length);
  scene.events.emit("trains-updated", scene.trainManager.trains.length);
  updateMaterialTotals(scene, {
    stockWoodEl,
    stockIronEl,
    stockPlanksEl,
    demandWoodEl,
    demandIronEl,
    demandPlanksEl,
  });
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

function updateMaterialTotals(
  scene,
  { stockWoodEl, stockIronEl, stockPlanksEl, demandWoodEl, demandIronEl, demandPlanksEl }
) {
  const totals = scene.stationManager.getMaterialTotals();
  stockWoodEl.textContent = totals.stock.wood.toFixed(0);
  stockIronEl.textContent = totals.stock.iron.toFixed(0);
  stockPlanksEl.textContent = totals.stock.planks.toFixed(0);
  demandWoodEl.textContent = totals.demand.wood.toFixed(0);
  demandIronEl.textContent = totals.demand.iron.toFixed(0);
  demandPlanksEl.textContent = totals.demand.planks.toFixed(0);
  triggerPulse(stockWoodEl);
  triggerPulse(stockIronEl);
  triggerPulse(stockPlanksEl);
}

function triggerPulse(target) {
  if (!target) return;
  target.classList.remove("pulse");
  void target.offsetWidth;
  target.classList.add("pulse");
}
