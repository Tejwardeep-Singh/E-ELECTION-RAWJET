from fastapi import FastAPI, UploadFile, File
from fastapi import Form
from utils import save_embedding, load_embedding
from compare_faces import cosine_similarity
from PIL import Image
import numpy as np
import cv2

from extract_embedding import extract_embedding

app = FastAPI(title="Bharat Ballot Face Service")


@app.get("/")
def home():
    return {
        "status": "running"
    }


@app.post("/enroll")
async def enroll(

    epic: str = Form(...),

    file: UploadFile = File(...)

):

    image = Image.open(file.file).convert("RGB")

    image = np.array(image)

    image = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2BGR
    )

    embedding, face = extract_embedding(image)

    if embedding is None:

        return {

            "success": False,

            "message": "No face detected"

        }

    filepath = save_embedding(
        epic,
        embedding
    )

    return {

        "success": True,

        "embeddingFile": filepath

    }

@app.post("/verify")
async def verify(

    epic: str = Form(...),

    file: UploadFile = File(...)

):

    # Convert uploaded image
    image = Image.open(file.file).convert("RGB")

    image = np.array(image)

    image = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2BGR
    )

    # Generate embedding from uploaded image
    live_embedding, face = extract_embedding(image)

    if live_embedding is None:

        return {
            "success": False,
            "message": "No face detected"
        }

    # Load stored embedding
    stored_embedding = load_embedding(epic)

    if stored_embedding is None:

        return {
            "success": False,
            "message": "Biometric not enrolled"
        }

    # Compare
    confidence = cosine_similarity(
        live_embedding,
        stored_embedding
    )

    THRESHOLD = 0.60

    return {

        "success": True,

        "match": confidence >= THRESHOLD,

        "confidence": round(confidence, 4)

    }