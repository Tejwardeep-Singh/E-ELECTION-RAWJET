const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const Voter = require('../models/voter');
const { upload } = require('../config/cloudinaryUpload');
const authenticate = require('../middlewares/authenticate');
const allowHeadOrAdmin = require('../middlewares/allowHeadOrAdmin');

const scopeFor = (req) => req.user.role === 'admin'
  ? {
      'address.state': req.admin.address.state,
      'address.city': req.admin.address.city,
      'address.area': req.admin.address.area,
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
    const address = req.user.role === 'admin' ? req.admin.address : parseAddress(req.body.address);
    const candidateImage = req.files?.candidateImage?.[0]?.path;
    const partyImage = req.files?.partyImage?.[0]?.path;

    if (!id || !name || !address?.state || !address?.city || !address?.area || !candidateImage || !partyImage) {
      return res.status(400).json({ error: 'Candidate details, jurisdiction, and both images are required' });
    }

    await new Candidate({ id, name, address, candidateImage, partyImage, criminalCase: criminalCase || '', voteCount: 0 }).save();
    res.status(201).json({ message: 'Candidate added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.code === 11000 ? 'Candidate ID already exists' : 'Internal Server Error' });
  }
});

router.get('/candidate/view', async (req, res) => {
  try {
    res.json(await Candidate.find(scopeFor(req)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
    res.json(await Voter.find(scopeFor(req)).select('-password'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/voter/edit/:id', async (req, res) => {
  try {
    const update = { name: req.body.name, status: req.body.status };
    if (req.user.role === 'head' && req.body.address) update.address = parseAddress(req.body.address);
    const voter = await Voter.findOneAndUpdate({ _id: req.params.id, ...scopeFor(req) }, update, { new: true, runValidators: true });
    if (!voter) return res.status(404).json({ message: 'Voter not found in your jurisdiction' });
    res.json({ message: 'Voter updated successfully', voter });
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
