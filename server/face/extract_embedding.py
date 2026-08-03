from insightface.app import FaceAnalysis

# Load the model once when the server starts
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0)

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