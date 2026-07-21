# Bharat Ballot AI Service

This stateless FastAPI service performs Phase 1 facial enrollment only. It does
not contain a database, verification endpoint, liveness detection, or camera
integration.

## Start

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate  # Windows PowerShell
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

`GET /health` returns `{ "status": "ok" }`.

`POST /enroll` accepts either a multipart `image` upload or a multipart
`image_url` field. The Express backend uses `image_url` after Cloudinary has
stored the voter photo. The endpoint requires exactly one face and returns a
normalized InsightFace embedding; it does not persist data.
