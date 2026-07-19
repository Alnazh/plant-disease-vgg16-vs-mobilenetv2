async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

Chart.defaults.color = "#9ea3b5";
Chart.defaults.borderColor = "rgba(255, 255, 255, 0.1)";

function getDiseaseColors() {
  const style = getComputedStyle(document.documentElement);
  return [
    style.getPropertyValue("--blight").trim(),
    style.getPropertyValue("--rust").trim(),
    style.getPropertyValue("--gray-spot").trim(),
    style.getPropertyValue("--healthy").trim(),
  ];
}

async function initDatasetChart() {
  const canvas = document.getElementById("chart-distribution");
  if (!canvas) return;

  const data = await fetchJson("/api/dataset-distribution");
  if (!data) return;

  new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: data.labels,
      datasets: [{ data: data.counts, backgroundColor: getDiseaseColors(), borderColor: "#1e2230", borderWidth: 2 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, padding: 12 } } },
    },
  });
}

function initSplitBar() {
  document.querySelectorAll("[data-pct]").forEach((el) => {
    el.style.width = `${el.dataset.pct}%`;
  });
}

document.addEventListener("DOMContentLoaded", initDatasetChart);
document.addEventListener("DOMContentLoaded", initSplitBar);
