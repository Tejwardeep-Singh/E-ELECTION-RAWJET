from urllib.parse import urlparse

import requests

from config.settings import DOWNLOAD_TIMEOUT_SECONDS, MAX_IMAGE_BYTES


def download_image(image_url: str) -> bytes:
    parsed_url = urlparse(image_url)
    if parsed_url.scheme not in {'http', 'https'} or not parsed_url.netloc:
        raise ValueError('image_url must be a valid HTTP(S) URL')

    try:
        response = requests.get(image_url, timeout=DOWNLOAD_TIMEOUT_SECONDS, stream=True)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise ValueError('Cloudinary image download failed') from exc

    content_type = response.headers.get('content-type', '').lower()
    if content_type and not content_type.startswith('image/'):
        raise ValueError('Unsupported image format')

    content = bytearray()
    try:
        for chunk in response.iter_content(chunk_size=64 * 1024):
            content.extend(chunk)
            if len(content) > MAX_IMAGE_BYTES:
                raise ValueError('Image exceeds the maximum supported size')
    finally:
        response.close()

    if not content:
        raise ValueError('Downloaded image is empty')
    return bytes(content)
