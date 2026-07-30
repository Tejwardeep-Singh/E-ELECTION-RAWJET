const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const Admin = require("../models/Admin");
const { upload } = require("../config/cloudinaryUpload");
const multer=require("multer");

// Add candidate
router.post(
  "/candidate/add",
  upload.fields([
    { name: "candidateImage", maxCount: 1 },
    { name: "partyImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id, name, criminalCase } = req.body;

      const candidateImage = req.files?.candidateImage?.[0]?.path;
      const partyImage = req.files?.partyImage?.[0]?.path;

      if (!candidateImage || !partyImage) {
        return res.status(400).json({
          message: "Both candidate and party images are required.",
        });
      }

      // Get logged-in admin
      const admin = await Admin.findById(req.user.mongoId);

      if (!admin) {
        return res.status(404).json({
          message: "Admin not found.",
        });
      }

      if (!admin.electionId || !admin.constituencyId) {
        return res.status(400).json({
          message: "Admin is not assigned to an election or constituency.",
        });
      }

      // Prevent duplicate candidate ID within the same election
      const existingCandidate = await Candidate.findOne({
        id,
        electionId: admin.electionId,
      });

      if (existingCandidate) {
        return res.status(400).json({
          message: "Candidate ID already exists for this election.",
        });
      }

      const candidate = new Candidate({
        id,
        name,
        criminalCase: criminalCase || "",

        candidateImage,
        partyImage,

        electionId: admin.electionId,
        constituencyId: admin.constituencyId,

        voteCount: 0,
      });

      await candidate.save();

      res.status(201).json({
        message: "Candidate added successfully.",
        candidate,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);
router.get('/candidate/by-area/:area', async (req, res) => {
  try {
    const candidates = await Candidate.find({ area: req.params.area });
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching candidates by area:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// View all candidates
router.get("/candidate/view", authenticate, loadAdmin, async (req, res) => {
  try {
    console.log("===== CANDIDATE VIEW ROUTE HIT =====");
    const candidates = await Candidate.find({
      electionId: req.admin.electionId,
      constituencyId: req.admin.constituencyId,
    })
      .populate(
        "constituencyId",
        "constituencyName constituencyNumber state district city"
      )
      .populate("electionId", "title type");
      console.log(JSON.stringify(candidates, null, 2));

    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to load candidates",
    });
  }
});
// Edit candidate
router.put('/candidate/edit/:id', upload.single('candidateImage'), async (req, res) => {
  try {
    const update = {
      name: req.body.name,
      area: req.body.area,
      crimminalCase: req.body.crimminalCase,
    };

    if (req.file) {
      update.candidateImage = req.file.path;
    }

    if (req.body.partyImageUrl) {
      update.partyImage = req.body.partyImageUrl; // From frontend if party image not updated
    }

    await Candidate.findByIdAndUpdate(req.params.id, update);
    res.json({ message: "Candidate updated successfully" });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ error: err.message });
  }
});
// Delete candidate
router.delete('/candidate/delete/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
