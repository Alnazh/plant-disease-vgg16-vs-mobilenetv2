import tensorflow as tf

# Path dataset dan konfigurasi utama
DATA_DIR = "dataset"
IMG_SIZE = (224, 224)
BATCH_SIZE = 16
VALIDATION_SPLIT = 0.2
SEED = 42


def get_datasets(img_size=IMG_SIZE, batch_size=BATCH_SIZE):
    # Split otomatis 80:20 karena dataset tidak punya folder train/valid terpisah
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="training",
        image_size=img_size,
        batch_size=batch_size,
        label_mode="categorical",
        shuffle=True,
        seed=SEED,
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="validation",
        image_size=img_size,
        batch_size=batch_size,
        label_mode="categorical",
        shuffle=False,
        seed=SEED,
    )

    class_names = train_ds.class_names

    # Prefetch saja, tanpa cache, untuk menghemat RAM
    autotune = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(buffer_size=autotune)
    val_ds = val_ds.prefetch(buffer_size=autotune)

    return train_ds, val_ds, class_names


if __name__ == "__main__":
    train_ds, val_ds, class_names = get_datasets()
    print(f"Jumlah kelas: {len(class_names)}")
    print(f"Nama kelas: {class_names}")
