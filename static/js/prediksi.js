const fileInput = document.getElementById("file-input");
const dropzone = document.getElementById("dropzone");
const dropzoneEmpty = document.getElementById("dropzone-empty");
const preview = document.getElementById("preview");
const predictButton = document.getElementById("predict-button");
const statusText = document.getElementById("status-text");
const loadingOverlay = document.getElementById("loading-overlay");

let selectedFile = null;
let selectedFileDataUrl = null;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  selectedFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    selectedFileDataUrl = e.target.result;
    preview.src = selectedFileDataUrl;
    preview.hidden = false;
    dropzoneEmpty.hidden = true;
  };
  reader.readAsDataURL(file);

  predictButton.disabled = false;
  statusText.textContent = "Gambar siap, klik Klasifikasikan Daun";
}

fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("drag-active");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("drag-active");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("drag-active");
  handleFile(e.dataTransfer.files[0]);
});

predictButton.addEventListener("click", async () => {
  if (!selectedFile) return;

  loadingOverlay.hidden = false;
  predictButton.disabled = true;
  statusText.textContent = "";

  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const response = await fetch("/predict", { method: "POST", body: formData });
    const data = await response.json();

    if (data.error) {
      loadingOverlay.hidden = true;
      predictButton.disabled = false;
      statusText.textContent = data.error;
      return;
    }

    const resultPayload = {
      vgg16: data.vgg16,
      mobilenetv2: data.mobilenetv2,
      imageDataUrl: selectedFileDataUrl,
      filename: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      analyzedAt: new Date().toLocaleTimeString("id-ID"),
    };
    sessionStorage.setItem("cornleaf_result", JSON.stringify(resultPayload));
    window.location.href = "/hasil";
  } catch (error) {
    loadingOverlay.hidden = true;
    predictButton.disabled = false;
    statusText.textContent = "Terjadi kesalahan saat menghubungi server";
  }
});
