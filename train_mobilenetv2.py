import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from data_loader import get_datasets, IMG_SIZE

EPOCHS = 15
LEARNING_RATE = 1e-4
MODEL_NAME = "mobilenetv2"


def build_model(num_classes, img_size=IMG_SIZE):
    # Base model dibekukan, hanya classification head yang dilatih
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(*img_size, 3))
    base_model.trainable = False

    inputs = tf.keras.Input(shape=(*img_size, 3))
    x = preprocess_input(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    return models.Model(inputs, outputs)


def main():
    train_ds, val_ds, class_names = get_datasets()
    num_classes = len(class_names)
    print(f"Training MobileNetV2 untuk {num_classes} kelas")

    model = build_model(num_classes)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    # Simpan model terbaik, hentikan lebih awal jika tidak ada perbaikan, catat history
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(f"models/{MODEL_NAME}_best.keras", save_best_only=True, monitor="val_accuracy", mode="max"),
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=4, restore_best_weights=True),
        tf.keras.callbacks.CSVLogger(f"models/{MODEL_NAME}_history.csv"),
    ]

    model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS, callbacks=callbacks)
    model.save(f"models/{MODEL_NAME}_final.keras")
    print("Training selesai. Model dan history tersimpan di folder models/")


if __name__ == "__main__":
    main()
