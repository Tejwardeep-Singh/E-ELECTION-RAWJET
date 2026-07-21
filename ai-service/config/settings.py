import os

AI_MODEL_NAME = os.getenv('INSIGHTFACE_MODEL', 'buffalo_l')
AI_MODEL_PROVIDERS = [
    provider.strip()
    for provider in os.getenv('ONNX_PROVIDERS', 'CPUExecutionProvider').split(',')
    if provider.strip()
]
DOWNLOAD_TIMEOUT_SECONDS = float(os.getenv('IMAGE_DOWNLOAD_TIMEOUT_SECONDS', '10'))
MAX_IMAGE_BYTES = int(os.getenv('MAX_IMAGE_BYTES', str(5 * 1024 * 1024)))
