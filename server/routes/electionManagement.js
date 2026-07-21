const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorizeHead = require('../middlewares/authorizeHead');
const Election = require('../models/election');
const Constituency = require('../models/constituency');
const Admin = require('../models/admin');
const Candidate = require('../models/candidate');
const Voter = require('../models/voter');

router.use(authenticate, authorizeHead);

router.post('/', async (req, res) => {
  try {
    const { title, description, type, state, startDate, endDate } = req.body;
    if (!title || !type || !state) return res.status(400).json({ message: 'Title, type, and state are required' });
    const election = await Election.create({ title, description, type, state, startDate: startDate || null, endDate: endDate || null, createdBy: req.user.mongoId, status: 'Draft' });
    res.status(201).json(election);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.get('/', async (req, res) => {
  const elections = await Election.find().sort({ createdAt: -1 });
  res.json(elections);
});

router.get('/:electionId/dashboard', async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    const [constituencies, admins, candidates, voters] = await Promise.all([
      Constituency.countDocuments({ electionId: election._id }), Admin.countDocuments({ electionId: election._id }),
      Candidate.countDocuments({ electionId: election._id }), Voter.countDocuments({ electionId: election._id }),
    ]);
    res.json({ election, statistics: { constituencies, admins, candidates, voters } });
  } catch (error) { res.status(400).json({ message: 'Invalid election id' }); }
});

router.put('/:electionId', async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    if (election.status === 'Archived') return res.status(409).json({ message: 'Archived elections are read-only' });
    ['title', 'description', 'type', 'state', 'startDate', 'endDate'].forEach((field) => { if (req.body[field] !== undefined) election[field] = req.body[field]; });
    await election.save(); res.json(election);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.post('/:electionId/activate', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status === 'Archived') return res.status(409).json({ message: 'Archived elections are read-only' });
  const active = await Election.exists({ status: 'Active', _id: { $ne: election._id } });
  if (active) return res.status(409).json({ message: 'Another election is already active' });
  election.status = 'Active'; await election.save(); res.json(election);
});

router.post('/:electionId/complete', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status !== 'Active') return res.status(409).json({ message: 'Only an active election can be completed' });
  election.status = 'Completed'; await election.save(); res.json(election);
});

router.post('/:electionId/archive', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status !== 'Completed') return res.status(409).json({ message: 'Only a completed election can be archived' });
  election.status = 'Archived'; await election.save(); res.json(election);
});

router.delete('/:electionId', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status !== 'Draft') return res.status(409).json({ message: 'Only draft elections can be deleted' });
  await Constituency.deleteMany({ electionId: election._id }); await election.deleteOne(); res.sendStatus(204);
});

router.get('/:electionId/constituencies', async (req, res) => res.json(await Constituency.find({ electionId: req.params.electionId }).sort({ name: 1 })));
router.post('/:electionId/constituencies', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status === 'Archived') return res.status(409).json({ message: 'Archived elections are read-only' });
  try { res.status(201).json(await Constituency.create({ ...req.body, state: req.body.state || election.state, electionId: election._id })); }
  catch (error) { res.status(400).json({ message: error.code === 11000 ? 'Constituency name already exists in this election' : error.message }); }
});
router.put('/:electionId/constituencies/:constituencyId', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  if (!election || election.status === 'Archived') return res.status(409).json({ message: 'Election is unavailable for changes' });
  const constituency = await Constituency.findOneAndUpdate({ _id: req.params.constituencyId, electionId: election._id }, req.body, { new: true, runValidators: true });
  if (!constituency) return res.status(404).json({ message: 'Constituency not found' }); res.json(constituency);
});
router.delete('/:electionId/constituencies/:constituencyId', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  if (!election || election.status === 'Archived') return res.status(409).json({ message: 'Election is unavailable for changes' });
  const used = await Promise.all([Admin.exists({ constituencyId: req.params.constituencyId }), Candidate.exists({ constituencyId: req.params.constituencyId }), Voter.exists({ constituencyId: req.params.constituencyId })]);
  if (used.some(Boolean)) return res.status(409).json({ message: 'Cannot delete a constituency that has assigned records' });
  const result = await Constituency.deleteOne({ _id: req.params.constituencyId, electionId: election._id });
  if (!result.deletedCount) return res.status(404).json({ message: 'Constituency not found' }); res.sendStatus(204);
});

module.exports = router;
