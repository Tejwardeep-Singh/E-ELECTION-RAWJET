import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

EMBEDDING_DIR = os.path.join(
    BASE_DIR,
    "storage",
    "embeddings"
)

os.makedirs(EMBEDDING_DIR, exist_ok=True)

def load_embedding(epic):

    filename = f"{epic}.npy"

    filepath = os.path.join(
        EMBEDDING_DIR,
        filename
    )

    if not os.path.exists(filepath):
        return None

    return np.load(filepath)

def save_embedding(epic, embedding):
    filename = f"{epic}.npy"

    filepath = os.path.join(
        EMBEDDING_DIR,
        filename
    )

    np.save(filepath, embedding)

    return filename