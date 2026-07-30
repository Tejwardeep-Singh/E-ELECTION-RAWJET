const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const Voter = require('../models/voter');
const { upload } = require('../config/cloudinaryUpload');
const authenticate = require('../middlewares/authenticate');
const allowHeadOrAdmin = require('../middlewares/allowHeadOrAdmin');
const loadAdmin = require('../middlewares/loadAdmin');
const Admin = require('../models/admin');
const Election = require('../models/election');
const Constituency = require('../models/constituency');
const bcrypt = require('bcrypt');

router.get('/me', authenticate, loadAdmin, async (req, res) => {
  try {
    const [election, constituency] = await Promise.all([
      Election.findById(req.admin.electionId).select('title status'),
      Constituency.findById(req.admin.constituencyId).select('name'),
    ]);
    res.json({ ...req.admin.toObject(), election, constituency });
  } catch (error) { res.status(500).json({ message: 'Unable to load profile' }); }
});

router.put('/profile', authenticate, loadAdmin, async (req, res) => {
  try {
    const update = {};
    if (req.body.password) update.password = await bcrypt.hash(req.body.password, 10);
    if (req.body.profileImage) update.profileImage = req.body.profileImage;
    const admin = await Admin.findByIdAndUpdate(req.admin._id, update, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', admin });
  } catch (error) { res.status(400).json({ message: 'Unable to update profile' }); }
});

// Keep administrative voter responses deliberately allow-listed.  In
// particular, neither credentials nor biometric templates may leave the API.
const SAFE_VOTER_FIELDS = [
  'epicNumber',
  'userId',
  'name',
  'address',
  'photoUrl',
  'votingStatus',
  'status',
  'lastVerification',
  'createdAt',
  'updatedAt',
].join(' ');

const scopeFor = (req) => req.user.role === 'admin'
  ? {
      electionId: req.admin.electionId,
      constituencyId: req.admin.constituencyId,
    }
  : {};

const parseAddress = (value) => typeof value === 'string' ? JSON.parse(value) : value;

// Voters do not hold admin credentials. This read-only lookup preserves voting flow.
router.get('/candidate/by-area/:area', async (req, res) => {
  try {
    const filter = { 'address.area': req.params.area };
    if (req.query.city) filter['address.city'] = req.query.city;
    if (req.query.state) filter['address.state'] = req.query.state;
    res.json(await Candidate.find(filter));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.use('/candidate', authenticate, allowHeadOrAdmin);
router.use('/voter', authenticate, allowHeadOrAdmin);

router.post('/candidate/add', upload.fields([
  { name: 'candidateImage', maxCount: 1 },
  { name: 'partyImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const { id, name, criminalCase } = req.body;
    let constituency = null;
let election = null;

if (req.user.role === "admin") {
  [constituency, election] = await Promise.all([
    Constituency.findOne({
      _id: req.admin.constituencyId,
      electionId: req.admin.electionId,
    }),
    Election.findById(req.admin.electionId),
  ]);
}
    const address =
  req.user.role === "admin"
    ? {
        state: constituency?.state || null,
        district: constituency?.district || null,
        city: constituency?.city || null,
        area: constituency?.name || constituency?.constituencyName || null,
      }
    : parseAddress(req.body.address);
    const candidateImage = req.files?.candidateImage?.[0]?.path;
    const partyImage = req.files?.partyImage?.[0]?.path;

    if (!id || !name || !candidateImage || !partyImage) {
  return res.status(400).json({
    error: "Candidate ID, name and both images are required",
  });
}

if (!address?.state || !address?.area) {
  return res.status(400).json({
    error: "Unable to determine the assigned constituency.",
  });
}

if (election) {
  switch (election.type) {
    case "Municipal":
      if (!address.city) {
        return res.status(400).json({
          error: "Assigned constituency has no city.",
        });
      }
      break;

    case "District":
      if (!address.district) {
        return res.status(400).json({
          error: "Assigned constituency has no district.",
        });
      }
      break;

    case "Panchayat":
      if (!address.district || !address.city) {
        return res.status(400).json({
          error: "Assigned constituency is incomplete.",
        });
      }
      break;
  }
}

    await new Candidate({
  id,
  name,
  address,
  candidateImage,
  partyImage,
  criminalCase: criminalCase || "",
  voteCount: 0,
  electionId:
    req.user.role === "admin"
      ? req.admin.electionId
      : req.body.electionId,
  constituencyId:
    req.user.role === "admin"
      ? req.admin.constituencyId
      : req.body.constituencyId,
}).save();
    res.status(201).json({ message: 'Candidate added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.code === 11000 ? 'Candidate ID already exists' : 'Internal Server Error' });
  }
});

router.get(
  "/candidate/view",
  authenticate,
  allowHeadOrAdmin,
  async (req, res) => {
    try {
      if (req.user.role === "admin") {
        await loadAdmin(req, res, async () => {
          const candidates = await Candidate.find(scopeFor(req))
            .populate(
              "constituencyId",
              "constituencyName constituencyNumber state district city"
            )
            .populate("electionId", "title type");

          res.json(candidates);
        });
      } else {
        const candidates = await Candidate.find({})
          .populate(
            "constituencyId",
            "constituencyName constituencyNumber state district city"
          )
          .populate("electionId", "title type");

        res.json(candidates);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.put('/candidate/edit/:id', upload.single('candidateImage'), async (req, res) => {
  try {
    const update = { name: req.body.name, criminalCase: req.body.criminalCase };
    if (req.file) update.candidateImage = req.file.path;
    if (req.body.partyImageUrl) update.partyImage = req.body.partyImageUrl;
    if (req.user.role === 'head' && req.body.address) update.address = parseAddress(req.body.address);

    const candidate = await Candidate.findOneAndUpdate({ _id: req.params.id, ...scopeFor(req) }, update, { new: true, runValidators: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found in your jurisdiction' });
    res.json({ message: 'Candidate updated successfully', candidate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/candidate/delete/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndDelete({ _id: req.params.id, ...scopeFor(req) });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found in your jurisdiction' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/voter/view', async (req, res) => {
  try {
    res.json(await Voter.find(scopeFor(req)).select(SAFE_VOTER_FIELDS));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// A voter is loaded before the jurisdiction comparison so an administrator
// receives an explicit forbidden response when attempting to access a voter
// outside of their assigned state, city, and area.
router.get('/voters/:id', authenticate, allowHeadOrAdmin, async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id).select(SAFE_VOTER_FIELDS);
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    if (req.user.role === 'admin') {
      const voterAddress = voter.address || {};
      const isAssignedArea = String(voter.electionId) === String(req.admin.electionId)
        && String(voter.constituencyId) === String(req.admin.constituencyId);

      if (!isAssignedArea) {
        return res.status(403).json({
          message: 'Access denied: this voter is outside your assigned jurisdiction',
        });
      }
    }

    res.json(voter);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Voter not found' });
    }
    res.status(500).json({ message: 'Unable to retrieve voter details' });
  }
});

router.put('/voter/edit/:id', authenticate, allowHeadOrAdmin, async (req, res) => {
  try {
    const update = { name: req.body.name, status: req.body.status };
    if (req.user.role === 'head' && req.body.address) update.address = parseAddress(req.body.address);
    const voter = await Voter.findOneAndUpdate({ _id: req.params.id, ...scopeFor(req) }, update, { new: true, runValidators: true });
    if (!voter) return res.status(404).json({ message: 'Voter not found in your jurisdiction' });
    res.json({ message: 'Voter updated successfully', voter: await Voter.findById(voter._id).select(SAFE_VOTER_FIELDS) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/voter/delete/:id', async (req, res) => {
  try {
    const voter = await Voter.findOneAndDelete({ _id: req.params.id, ...scopeFor(req) });
    if (!voter) return res.status(404).json({ message: 'Voter not found in your jurisdiction' });
    res.json({ message: 'Voter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
