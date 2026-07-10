# Analisis Perbandingan Kinerja Arsitektur VGG16 dan MobileNetV2 untuk Klasifikasi Penyakit Daun Tanaman

## Deskripsi Proyek

Proyek ini merupakan capstone project mata kuliah Kecerdasan Buatan dengan fokus studi Computer Vision. Penelitian ini membandingkan performa dua arsitektur Convolutional Neural Network, yaitu VGG16 dan MobileNetV2, dalam tugas klasifikasi penyakit pada daun tanaman.

Kedua arsitektur dipilih karena mewakili dua pendekatan desain yang berbeda. VGG16 dikenal sebagai arsitektur yang dalam dengan jumlah parameter besar sehingga cenderung menghasilkan akurasi tinggi namun berat secara komputasi. MobileNetV2 dirancang dengan pendekatan depthwise separable convolution sehingga lebih ringan dan efisien, cocok untuk perangkat dengan sumber daya terbatas seperti smartphone. Perbandingan ini relevan untuk kasus nyata deteksi penyakit tanaman di lapangan, di mana aplikasi biasanya dijalankan pada perangkat mobile milik petani, bukan pada server dengan kapasitas komputasi besar.

## Rumusan Masalah

1. Bagaimana perbandingan akurasi klasifikasi penyakit daun tanaman antara arsitektur VGG16 dan MobileNetV2?
2. Bagaimana perbandingan efisiensi komputasi (waktu training dan waktu inferensi) antara kedua arsitektur tersebut?
3. Arsitektur mana yang lebih sesuai untuk implementasi pada perangkat dengan sumber daya terbatas?

## Dataset

Dataset yang digunakan adalah New Plant Diseases Dataset (Augmented), yang merupakan versi augmentasi dari PlantVillage Dataset.

Sumber: https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset

Dataset ini terdiri dari 38 kelas yang mencakup berbagai spesies tanaman dalam kondisi sehat maupun terserang penyakit, dan sudah terbagi ke dalam folder `train` dan `valid`.

Catatan: setelah diekstrak, struktur folder dataset ini biasanya ter-nested dua kali. Sesuaikan path pada `src/data_loader.py` dengan lokasi hasil ekstraksi di komputer kamu.

## Struktur Repository

```
.
├── data/                   # dataset (tidak diunggah ke GitHub, lihat .gitignore)
├── notebooks/              # notebook eksplorasi data dan evaluasi
├── src/
│   ├── data_loader.py      # pemuatan dataset ke format tf.data
│   ├── train_vgg16.py      # training model VGG16
│   └── train_mobilenetv2.py # training model MobileNetV2
├── requirements.txt        # daftar dependensi
└── README.md
```

## Cara Menjalankan

1. Clone repository ini
2. Buat environment baru dan install dependensi:
   ```
   pip install -r requirements.txt
   ```
3. Unduh dataset dari tautan Kaggle di atas, letakkan di folder `data/`
4. Jalankan notebook di folder `notebooks/` secara berurutan

## Metrik Evaluasi

Akurasi, precision, recall, F1-score, serta perbandingan waktu training dan inferensi antar kedua model.

## Status

Progress proyek dicatat melalui commit history repository ini.

## Referensi

Daftar referensi lengkap akan dicantumkan pada laporan ilmiah dan diperbarui secara berkala di sini.
