const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorizeHead = require('../middlewares/authorizeHead');
const Election = require('../models/election');
const Constituency = require('../models/constituency');
const MasterConstituency = require('../models/masterConstituency');
const Admin = require('../models/admin');
const Candidate = require('../models/candidate');
const Voter = require('../models/voter');
const electionConfig = require("../config/electionConfig");
const syncElectionStatus = require("../services/syncElectionStatus");


router.use(authenticate, authorizeHead);

router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      state,
      district,
      city,
      startDate,
      endDate
    } = req.body;

    const config = electionConfig[type];

    if (!config) {
      return res.status(400).json({
        message: "Invalid election type"
      });
    }

    if (!title || !type) {
      return res.status(400).json({
        message: "Title and type are required"
      });
    }

    if (config.state && !state) {
      return res.status(400).json({
        message: "State is required"
      });
    }

    if (config.district && !district) {
      return res.status(400).json({
        message: "District is required"
      });
    }

    if (config.city && !city) {
      return res.status(400).json({
        message: "City is required"
      });
    }
    
    
    const election = await Election.create({ title, description, type, state, city: city || null,district: district || null, startDate: startDate || null, endDate: endDate || null, createdBy: req.user.mongoId, status: 'Draft' });

    const masterFilter = {
    electionType: type
};

if (config.state) {
    masterFilter.state = state;
}

if (config.district) {
    masterFilter.district = district;
}

if (config.city) {
    masterFilter.city = city;
}
    const masterConstituencies = await MasterConstituency.find(masterFilter).lean();




    if (masterConstituencies.length) {
      await Constituency.insertMany(
  masterConstituencies.map((master) => ({
    // NEW
    masterConstituencyId: master._id,

    // Existing
    electionId: election._id,
    election: election._id,

    name: master.constituencyName,

    state: master.state,
    district: master.district,
    city: master.city,

    constituencyNumber: master.constituencyNumber,
    constituencyName: master.constituencyName,

    active: master.active,
  }))
);
    }
    res.status(201).json(election);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.get('/', async (req, res) => {
  const elections = await Election.find().sort({ createdAt: -1 });
  await Promise.all(
    elections.map(syncElectionStatus)
);
  res.json(elections);
});

// router.get('/:electionId/dashboard', async (req, res) => {
//   try {
//     const election = await Election.findById(req.params.electionId);
//     await syncElectionStatus(election);
//     if (!election) return res.status(404).json({ message: 'Election not found' });
//     const [constituencies, admins, candidates, voters] = await Promise.all([
//       Constituency.countDocuments({ electionId: election._id }), Admin.countDocuments({ electionId: election._id }),
//       Candidate.countDocuments({ electionId: election._id }), Voter.countDocuments({ electionId: election._id }),
//     ]);
//     res.json({ election, statistics: { constituencies, admins, candidates, voters } });
//   } catch (error) { res.status(400).json({ message: 'Invalid election id' }); }
// });

router.get("/:electionId/dashboard", async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        message: "Election not found",
      });
    }

    await syncElectionStatus(election);

    // ----------------------------
    // Election Constituencies
    // ----------------------------

    const constituencies = await Constituency.find(
      { electionId: election._id },
      "masterConstituencyId"
    );

    const constituencyCount = constituencies.length;

    const masterIds = constituencies.map(
      (c) => c.masterConstituencyId
    );

    // ----------------------------
    // Voter Query
    // ----------------------------

    let voterQuery = {};

    switch (election.type) {
      case "Lok Sabha":
        voterQuery = {
          "constituencies.lokSabha": {
            $in: masterIds,
          },
        };
        break;

      case "Assembly":
        voterQuery = {
          "constituencies.assembly": {
            $in: masterIds,
          },
        };
        break;

      case "Municipal":
        voterQuery = {
          "constituencies.municipal": {
            $in: masterIds,
          },
        };
        break;

      default:
        voterQuery = {
          _id: null,
        };
    }

    // ----------------------------
    // Statistics
    // ----------------------------

    const [
      adminCount,
      candidateCount,
      voterCount,
    ] = await Promise.all([
      Admin.countDocuments({
        electionId: election._id,
      }),

      Candidate.countDocuments({
        electionId: election._id,
      }),

      Voter.countDocuments(voterQuery),
    ]);

    // ----------------------------
    // Response
    // ----------------------------

    res.json({
      election,
      statistics: {
        constituencies: constituencyCount,
        admins: adminCount,
        candidates: candidateCount,
        voters: voterCount,
      },
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });

  }
});
router.put('/:electionId', async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    await syncElectionStatus(election);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    if (election.status === 'Archived') return res.status(409).json({ message: 'Archived elections are read-only' });
    ['title', 'description', 'type', 'state', 'city', 'startDate', 'endDate'].forEach((field) => { if (req.body[field] !== undefined) election[field] = req.body[field]; });
    await election.save(); res.json(election);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.post('/:electionId/activate', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  await syncElectionStatus(election);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status === 'Archived') return res.status(409).json({ message: 'Archived elections are read-only' });
  const active = await Election.exists({ status: 'Active', _id: { $ne: election._id } });
  if (active) return res.status(409).json({ message: 'Another election is already active' });
  election.status = 'Active'; await election.save(); res.json(election);
});

// router.post('/:electionId/complete', async (req, res) => {
//   const election = await Election.findById(req.params.electionId);
//   if (!election) return res.status(404).json({ message: 'Election not found' });
//   if (election.status !== 'Active') return res.status(409).json({ message: 'Only an active election can be completed' });
//   election.status = 'Completed'; await election.save(); res.json(election);
// });

router.post('/:electionId/archive', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  await syncElectionStatus(election);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status !== 'Completed') return res.status(409).json({ message: 'Only a completed election can be archived' });
  election.status = 'Archived'; await election.save(); res.json(election);
});

router.delete('/:electionId', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  await syncElectionStatus(election);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status !== 'Draft') return res.status(409).json({ message: 'Only draft elections can be deleted' });
  await Constituency.deleteMany({ electionId: election._id }); await election.deleteOne(); res.sendStatus(204);
});

router.get('/:electionId/constituencies', async (req, res) => res.json(await Constituency.find({ electionId: req.params.electionId }).sort({ constituencyNumber: 1, constituencyName: 1 })));
router.post('/:electionId/constituencies', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  await syncElectionStatus(election);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  if (election.status === 'Archived') return res.status(409).json({ message: 'Archived elections are read-only' });
  try { res.status(201).json(await Constituency.create({ ...req.body, state: req.body.state || election.state, electionId: election._id, election: election._id })); }
  catch (error) { res.status(400).json({ message: error.code === 11000 ? 'Constituency name already exists in this election' : error.message }); }
});
router.put('/:electionId/constituencies/:constituencyId', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  await syncElectionStatus(election);
  if (!election || election.status === 'Archived') return res.status(409).json({ message: 'Election is unavailable for changes' });
  const constituency = await Constituency.findOneAndUpdate({ _id: req.params.constituencyId, electionId: election._id }, req.body, { new: true, runValidators: true });
  if (!constituency) return res.status(404).json({ message: 'Constituency not found' }); res.json(constituency);
});
router.delete('/:electionId/constituencies/:constituencyId', async (req, res) => {
  const election = await Election.findById(req.params.electionId);
  await syncElectionStatus(election);
  if (!election || election.status === 'Archived') return res.status(409).json({ message: 'Election is unavailable for changes' });
  const used = await Promise.all([Admin.exists({ constituencyId: req.params.constituencyId }), Candidate.exists({ constituencyId: req.params.constituencyId }), Voter.exists({ constituencyId: req.params.constituencyId })]);
  if (used.some(Boolean)) return res.status(409).json({ message: 'Cannot delete a constituency that has assigned records' });
  const result = await Constituency.deleteOne({ _id: req.params.constituencyId, electionId: election._id });
  if (!result.deletedCount) return res.status(404).json({ message: 'Constituency not found' }); res.sendStatus(204);
});
router.post("/:electionId/publish-results", async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);

    if (!election) {
      return res.status(404).json({
        message: "Election not found."
      });
    }

    if (election.status !== "Completed") {
      return res.status(400).json({
        message: "Only completed elections can have results published."
      });
    }

    if (election.resultVisible) {
      return res.status(400).json({
        message: "Results are already published."
      });
    }

    election.resultVisible = true;
    election.resultPublishedAt = new Date();

    await election.save();

    res.json({
      message: "Results published successfully.",
      election
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error."
    });

  }
});
module.exports = router;
