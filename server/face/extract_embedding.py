from insightface.app import FaceAnalysis
print("Loading InsightFace model...")

# Load the model once when the server starts
app = FaceAnalysis(name="buffalo_l")
print("Preparing model...")
app.prepare(ctx_id=0)
print("Model ready!")
def extract_embedding(image):
    """
    Accepts an OpenCV image (numpy array)
    Returns:
        embedding -> numpy array
        face -> detected face object
    """

    faces = app.get(image)

    if len(faces) == 0:
        return None, None

    # Largest / first detected face
    face = faces[0]

    return face.embedding, face