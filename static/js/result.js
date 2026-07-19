const resultContent = document.getElementById("result-content");
const resultEmpty = document.getElementById("result-empty");
const resultImage = document.getElementById("result-image");
const backButton = document.getElementById("back-button");

const modelStats = JSON.parse(document.getElementById("model-stats").textContent);

const labelColorMap = {
  "Blight (Hawar Daun)": "--blight",
  "Common Rust (Karat Daun)": "--rust",
  "Gray Leaf Spot (Bercak Daun Abu-abu)": "--gray-spot",
  "Healthy (Sehat)": "--healthy",
};

function colorForLabel(label) {
  const variable = labelColorMap[label] || "--healthy";
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function renderModelResult(prefix, result) {
  document.getElementById(`${prefix}-class`).textContent = result.predicted_class;
  document.getElementById(`${prefix}-confidence`).textContent = `Keyakinan ${result.confidence}%`;
  document.getElementById(`${prefix}-recommendation`).innerHTML = `<strong>Rekomendasi:</strong> ${result.recommendation}`;

  const barsContainer = document.getElementById(`${prefix}-bars`);
  barsContainer.innerHTML = "";

  result.probabilities.forEach((item) => {
    const color = colorForLabel(item.label);
    const row = document.createElement("div");
    row.className = "prob-bar-row";
    row.innerHTML = `
      <span class="prob-bar-label"><span class="dot" style="background:${color}"></span>${item.label}</span>
      <span class="prob-bar-value">${item.value}%</span>
      <div class="prob-bar-track">
        <div class="prob-bar-fill" style="width:${item.value}%;background:${color}"></div>
      </div>
    `;
    barsContainer.appendChild(row);
  });
}

function renderVerdict(vgg16Result, mobilenetv2Result) {
  const badge = document.getElementById("agreement-badge");
  const heading = document.getElementById("summary-heading");
  const note = document.getElementById("summary-note");

  if (vgg16Result.predicted_class === mobilenetv2Result.predicted_class) {
    const average = ((vgg16Result.confidence + mobilenetv2Result.confidence) / 2).toFixed(2);
    badge.textContent = "Kedua Model Sepakat";
    badge.className = "agreement-badge agree";
    heading.textContent = vgg16Result.predicted_class;
    note.textContent = `VGG16 dan MobileNetV2 memberikan hasil yang sama dengan rata-rata keyakinan ${average}%. Kesepakatan dua arsitektur berbeda ini memperkuat keyakinan bahwa hasil prediksi cukup dapat diandalkan.`;
  } else {
    badge.textContent = "Model Berbeda Pendapat";
    badge.className = "agreement-badge disagree";
    heading.textContent = "Hasil Bervariasi Antar Model";
    note.textContent = `VGG16 mendeteksi ${vgg16Result.predicted_class} (${vgg16Result.confidence}%), sedangkan MobileNetV2 mendeteksi ${mobilenetv2Result.predicted_class} (${mobilenetv2Result.confidence}%). Perbedaan ini wajar terjadi karena kedua arsitektur memiliki kepekaan berbeda terhadap tekstur dan warna daun.`;
  }
}

function trustScore(confidence, historicalAccuracy) {
  const accuracyPart = historicalAccuracy !== null ? historicalAccuracy * 100 : confidence;
  return confidence * 0.6 + accuracyPart * 0.4;
}

function renderRecommendation(vgg16Result, mobilenetv2Result) {
  const winnerBadge = document.getElementById("recommendation-winner");
  const body = document.getElementById("recommendation-body");

  const vggScore = trustScore(vgg16Result.confidence, modelStats.vgg16_accuracy);
  const mobileScore = trustScore(mobilenetv2Result.confidence, modelStats.mobilenetv2_accuracy);

  if (vgg16Result.predicted_class === mobilenetv2Result.predicted_class) {
    winnerBadge.textContent = "Keduanya Sejalan";
    body.textContent = "Karena kedua model memberi kelas yang sama, keduanya sama-sama layak dipercaya untuk gambar ini. Silakan lihat detail probabilitas di bawah untuk memastikan tingkat keyakinannya.";
    return;
  }

  const vggWins = vggScore >= mobileScore;
  const winnerName = vggWins ? "VGG16" : "MobileNetV2";
  const winnerResult = vggWins ? vgg16Result : mobilenetv2Result;
  const winnerHistorical = vggWins ? modelStats.vgg16_accuracy : modelStats.mobilenetv2_accuracy;
  const historicalText = winnerHistorical !== null ? `${(winnerHistorical * 100).toFixed(2)}%` : "belum tersedia";

  winnerBadge.textContent = `Cenderung ${winnerName}`;
  body.textContent = `${winnerName} memberikan keyakinan ${winnerResult.confidence}% pada gambar ini dan memiliki akurasi historis ${historicalText} pada data validasi, kombinasi keduanya sedikit lebih tinggi dibanding model satunya. Meski begitu, perbedaan pendapat antar model tetap sebaiknya dikonfirmasi ke ahli pertanian jika keputusan penanganan bersifat penting.`;
}

function loadResult() {
  const stored = sessionStorage.getItem("cornleaf_result");

  if (!stored) {
    resultEmpty.hidden = false;
    return;
  }

  const data = JSON.parse(stored);

  renderModelResult("vgg16", data.vgg16);
  renderModelResult("mobilenetv2", data.mobilenetv2);
  renderVerdict(data.vgg16, data.mobilenetv2);
  renderRecommendation(data.vgg16, data.mobilenetv2);

  resultImage.src = data.imageDataUrl;
  document.getElementById("meta-filename").textContent = data.filename;
  document.getElementById("meta-size").textContent = data.fileSize;
  document.getElementById("meta-time").textContent = data.analyzedAt;
  resultImage.onload = () => {
    document.getElementById("meta-dimensions").textContent = `${resultImage.naturalWidth} x ${resultImage.naturalHeight} px`;
  };

  resultContent.hidden = false;
}

backButton.addEventListener("click", () => {
  sessionStorage.removeItem("cornleaf_result");
  window.location.href = "/prediksi";
});

document.addEventListener("DOMContentLoaded", loadResult);
