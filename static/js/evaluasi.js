async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

Chart.defaults.color = "#9ea3b5";
Chart.defaults.borderColor = "rgba(255, 255, 255, 0.1)";

function getThemeColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    vgg: style.getPropertyValue("--vgg-accent").trim(),
    mobile: style.getPropertyValue("--mobile-accent").trim(),
  };
}

function renderLineChart(canvasId, title, dataKey, vggData, mobileData, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !vggData || !mobileData) return;

  new Chart(canvas, {
    type: "line",
    data: {
      labels: vggData.epoch.map((e) => `Epoch ${e}`),
      datasets: [
        { label: `VGG16 ${title}`, data: vggData[dataKey], borderColor: colors.vgg, tension: 0.25 },
        { label: `MobileNetV2 ${title}`, data: mobileData[dataKey], borderColor: colors.mobile, tension: 0.25 },
      ],
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } },
  });
}

function renderComparisonChart(comparison, colors) {
  const canvas = document.getElementById("chart-comparison");
  if (!canvas || !comparison) return;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: comparison.labels,
      datasets: [
        { label: "VGG16", data: comparison.vgg16, backgroundColor: colors.vgg },
        { label: "MobileNetV2", data: comparison.mobilenetv2, backgroundColor: colors.mobile },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 1 } },
      plugins: { legend: { position: "bottom" } },
    },
  });
}

async function initEvaluasiCharts() {
  const colors = getThemeColors();

  const vggHistory = await fetchJson("/api/history/vgg16");
  const mobileHistory = await fetchJson("/api/history/mobilenetv2");
  renderLineChart("chart-accuracy", "Val Accuracy", "val_accuracy", vggHistory, mobileHistory, colors);
  renderLineChart("chart-loss", "Val Loss", "val_loss", vggHistory, mobileHistory, colors);

  const comparison = await fetchJson("/api/comparison");
  renderComparisonChart(comparison, colors);
}

document.addEventListener("DOMContentLoaded", initEvaluasiCharts);
