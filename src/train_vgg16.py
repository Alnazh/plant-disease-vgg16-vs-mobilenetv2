"""
train_vgg16.py

Training model klasifikasi penyakit daun tanaman menggunakan arsitektur
VGG16 dengan pendekatan transfer learning (ImageNet weights, base model
dibekukan, hanya melatih classification head).
"""

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input

from data_loader import get_datasets, IMG_SIZE

EPOCHS = 15
LEARNING_RATE = 1e-4
MODEL_NAME = "vgg16"


def build_model(num_classes, img_size=IMG_SIZE):
    base_model = VGG16(
        weights="imagenet",
        include_top=False,
        input_shape=(*img_size, 3),
    )
    base_model.trainable = False  # freeze base model untuk feature extraction

    inputs = tf.keras.Input(shape=(*img_size, 3))
    x = preprocess_input(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    return model


def main():
    train_ds, val_ds, class_names = get_datasets()
    num_classes = len(class_names)
    print(f"Training VGG16 untuk {num_classes} kelas")

    model = build_model(num_classes)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            f"{MODEL_NAME}_best.keras",
            save_best_only=True,
            monitor="val_accuracy",
            mode="max",
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=4,
            restore_best_weights=True,
        ),
        tf.keras.callbacks.CSVLogger(f"{MODEL_NAME}_history.csv"),
    ]

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks,
    )

    model.save(f"{MODEL_NAME}_final.keras")
    print("Training selesai. Model dan history tersimpan.")

    return history


if __name__ == "__main__":
    main()
