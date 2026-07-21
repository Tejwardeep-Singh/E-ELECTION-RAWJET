from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from config.settings import AI_MODEL_NAME, MAX_IMAGE_BYTES
from services.face_service import FaceServiceError, extract_embedding
from services.image_loader import download_image

router = APIRouter()


@router.post('/enroll')
async def enroll_face(image: UploadFile | None = File(default=None), image_url: str | None = Form(default=None)):
    if image is None and not image_url:
        raise HTTPException(status_code=400, detail='An image upload or image_url is required')
    if image is not None and image_url:
        raise HTTPException(status_code=400, detail='Provide either an image upload or image_url, not both')

    try:
        if image is not None:
            if image.content_type and not image.content_type.startswith('image/'):
                raise ValueError('Unsupported image format')
            image_bytes = await image.read(MAX_IMAGE_BYTES + 1)
            if len(image_bytes) > MAX_IMAGE_BYTES:
                raise ValueError('Image exceeds the maximum supported size')
        else:
            image_bytes = download_image(image_url)

        embedding = extract_embedding(image_bytes)
    except LookupError as exc:
        raise HTTPException(status_code=400, detail='No face detected') from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail='Multiple faces detected') from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except FaceServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    finally:
        if image is not None:
            await image.close()

    return {
        'success': True,
        'embedding': embedding,
        'model': AI_MODEL_NAME,
        'dimensions': len(embedding),
    }
