from functools import lru_cache

import cv2
import numpy as np
from insightface.app import FaceAnalysis

from config.settings import AI_MODEL_NAME, AI_MODEL_PROVIDERS


class FaceServiceError(Exception):
    pass


@lru_cache(maxsize=1)
def get_face_analyzer() -> FaceAnalysis:
    try:
        analyzer = FaceAnalysis(name=AI_MODEL_NAME, providers=AI_MODEL_PROVIDERS)
        analyzer.prepare(ctx_id=0 if 'CUDAExecutionProvider' in AI_MODEL_PROVIDERS else -1, det_size=(640, 640))
        return analyzer
    except Exception as exc:
        raise FaceServiceError('Face recognition model could not be loaded') from exc


def extract_embedding(image_bytes: bytes) -> list[float]:
    image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError('Corrupt image or unsupported format')

    faces = get_face_analyzer().get(image)
    if len(faces) == 0:
        raise LookupError('No face detected')
    if len(faces) > 1:
        raise RuntimeError('Multiple faces detected')

    embedding = faces[0].normed_embedding
    if embedding is None or embedding.size == 0:
        raise FaceServiceError('Unable to generate facial embedding')
    return embedding.astype(float).tolist()
