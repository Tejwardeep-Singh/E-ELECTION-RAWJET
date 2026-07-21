const FaceProfile = require('../models/faceProfile');

const DEFAULT_TIMEOUT_MS = 10_000;
const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

class EnrollmentError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'EnrollmentError';
    this.status = status;
  }
}

async function requestEmbedding(photoUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_SERVICE_TIMEOUT_MS);

  try {
    const response = await fetch(`${AI_SERVICE_URL}/enroll`, {
      method: 'POST',
      body: (() => { const form = new FormData(); form.append('image_url', photoUrl); return form; })(),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      throw new EnrollmentError(payload.detail || payload.message || 'AI enrollment failed', response.status);
    }

    if (!Array.isArray(payload.embedding) || !payload.embedding.length || !payload.model || !Number.isInteger(payload.dimensions)) {
      throw new EnrollmentError('AI service returned an invalid enrollment response', 502);
    }

    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new EnrollmentError(`AI enrollment timed out after ${AI_SERVICE_TIMEOUT_MS}ms`, 504);
    }
    if (error instanceof EnrollmentError) throw error;
    throw new EnrollmentError(`AI enrollment request failed: ${error.message}`, 502);
  } finally {
    clearTimeout(timeout);
  }
}

async function enrollVoterFace(voter, photoUrl) {
  const enrollment = await requestEmbedding(photoUrl);

  await FaceProfile.findOneAndUpdate(
    { voterId: voter._id },
    {
      voterId: voter._id,
      embedding: enrollment.embedding,
      model: enrollment.model,
      embeddingVersion: process.env.FACE_EMBEDDING_VERSION || '1',
      photoUrl,
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  voter.faceEnrolled = true;
  await voter.save();
}

module.exports = { enrollVoterFace, EnrollmentError };
