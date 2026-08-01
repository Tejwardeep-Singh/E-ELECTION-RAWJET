const { JWT_KEY } = require('../config/keys.js');
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');
const Candidate = require('../models/candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { voterUpload } = require("../config/cloudinaryUpload");
const { enrollVoterFace } = require('../services/faceEnrollment');
const Election = require("../models/election");
const Constituency = require("../models/constituency");
const Participation = require("../models/participation");
const syncElectionStatus = require("../services/syncElectionStatus");

const uploadVoterImage = (req, res, next) => {

  voterUpload.single("photoUrl")(req, res, (error) => {

    

    if (error) {
      console.error(error);
      return res.status(400).json({
        message: error.message
      });
    }

    next();
  });
};

const parseAddress = (value) => {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  return value;
};

const getUploadedImageUrl = (file) => file?.path || file?.secure_url;

// Register voter
router.post('/register', uploadVoterImage, async (req, res) => {
  try {
    const { epicNumber, userId, name, password } = req.body;
    const address = parseAddress(req.body.address);
    const normalizedEpicNumber = epicNumber?.trim().toUpperCase();
    const photoUrl = getUploadedImageUrl(req.file);

    if (!normalizedEpicNumber || !userId || !name || !password || !address?.area) {
      return res.status(400).json({ message: 'Please provide all required voter details' });
    }

    const existing = await Voter.findOne({ $or: [{ epicNumber: normalizedEpicNumber }, { userId }] });
    if (existing) return res.status(400).json({ message: 'Voter already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVoter = new Voter({
      epicNumber: normalizedEpicNumber,
      userId,
      name,
      address,
      password: hashedPassword,
      photoUrl: photoUrl || ''
    });

    await newVoter.save();

    // Registration is deliberately resilient: the voter is retained even if
    // the independent AI service is unavailable or rejects the image.
    if (photoUrl) {
      try {
        await enrollVoterFace(newVoter, photoUrl);
      } catch (enrollmentError) {
        console.error(`Face enrollment failed for voter ${newVoter._id}:`, enrollmentError.message);
      }
    }

    res.status(201).json({ message: 'Voter registered successfully' });
  } catch (err) {
    console.error('Error registering voter:', err);
    if (err instanceof SyntaxError || err.name === 'ValidationError' || err.code === 11000) {
      return res.status(400).json({ message: err.code === 11000 ? 'Voter already exists' : err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/login', async (req, res) => {
    const { userId, password } = req.body;
  
    try {
      const voter = await Voter.findOne({ userId });
      if (!voter) return res.status(401).json({ message: 'Invalid user ID' });
  
      const isMatch = await bcrypt.compare(password, voter.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
  
      const token = jwt.sign({ role:"voter", voterId: voter._id }, JWT_KEY, { expiresIn: '2h' });
      res.json({ token, voterId: voter._id });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  function authenticateVoter(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      req.voterId = decoded.voterId;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
router.get("/me", authenticateVoter, async (req, res) => {
    try {

        const voter = await Voter.findById(req.voterId)
            .populate("constituencies.municipal", "constituencyName type")
            .populate("constituencies.assembly", "constituencyName type")
            .populate("constituencies.lokSabha", "constituencyName type")
            .select("-password -faceEmbedding");

        if (!voter)
            return res.status(404).json({ message: "Voter not found" });
          
        res.json(voter);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/vote/:candidateId", authenticateVoter, async (req, res) => {
  try {
    // Find voter
    const voter = await Voter.findById(req.voterId);

    if (!voter) {
      return res.status(404).json({
        message: "Voter not found",
      });
    }

    



    // Find candidate and populate election
    const candidate = await Candidate.findById(req.params.candidateId)
      .populate("electionId");

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found.",
      });
    }

    const election = candidate.electionId;

    if (!election) {
      return res.status(404).json({
        message: "Election not found.",
      });
    }
const alreadyVoted =
await Participation.exists({
    voterId: voter._id,
    electionId: election._id
});

if(alreadyVoted){
    return res.status(400).json({
        message:
        "You have already voted in this election."
    });
}
    const now = new Date();

    // Election must be Active
    if (election.status !== "Active") {
      return res.status(403).json({
        message: "Voting is not available because the election is not active.",
      });
    }

    // Voting has not started
    if (election.startDate && now < election.startDate) {
      return res.status(403).json({
        message: "Voting has not started yet.",
      });
    }

    // Voting has ended
    if (election.endDate && now > election.endDate) {
      return res.status(403).json({
        message: "Voting has already ended.",
      });
    }

    // Increase vote count
    const session = await mongoose.startSession();

try {
    session.startTransaction();

    // Increase vote count
    candidate.voteCount = (candidate.voteCount || 0) + 1;
    await candidate.save({ session });

    // Record participation
    await Participation.create(
        [
            {
                voterId: voter._id,
                electionId: election._id,
            },
        ],
        { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
        message: "Vote recorded successfully.",
    });

} catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
}

  } catch (err) {
    console.error("Vote Error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get("/results/:electionId", authenticateVoter, async (req, res) => {
  try {
    const { electionId } = req.params;

    // -------------------------
    // Logged-in voter
    // -------------------------

    const voter = await Voter.findById(req.voterId);

    if (!voter) {
      return res.status(404).json({
        message: "Voter not found",
      });
    }

    // -------------------------
    // Election
    // -------------------------

    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        message: "Election not found",
      });
    }

    // Automatically update status if required
    await syncElectionStatus(election);

    // Results must be published first
    if (!election.resultVisible) {
      return res.status(403).json({
        message: "Election results have not been published yet.",
      });
    }

    // -------------------------
    // Find voter's constituency
    // -------------------------

    let constituencyId = null;

    switch (election.type) {
      case "Lok Sabha":
        constituencyId = voter.constituencies?.lokSabha;
        break;

      case "Assembly":
        constituencyId = voter.constituencies?.assembly;
        break;

      case "Municipal":
        constituencyId = voter.constituencies?.municipal;
        break;

      default:
        return res.status(400).json({
          message: `Unsupported election type: ${election.type}`,
        });
    }

    if (!constituencyId) {
      return res.status(404).json({
        message:
          "You are not assigned to a constituency for this election.",
      });
    }

    // -------------------------
    // Candidates
    // -------------------------

    const electionConstituency = await Constituency.findOne({
    electionId: election._id,
    masterConstituencyId: constituencyId,
});

if (!electionConstituency) {
    return res.status(404).json({
        message: "Constituency not found for this election."
    });
}

const candidates = await Candidate.find({
    electionId: election._id,
    constituencyId: electionConstituency._id,
})
.select(
    "name voteCount candidateImage partyImage criminalCase constituencyId"
)
.sort({ voteCount: -1 });

    // -------------------------
    // Statistics
    // -------------------------

    const totalVotes = candidates.reduce(
      (sum, candidate) => sum + (candidate.voteCount || 0),
      0
    );

    const rankedCandidates = candidates.map((candidate, index) => ({
      ...candidate.toObject(),

      rank: index + 1,

      percentage:
        totalVotes > 0
          ? Number(
              (
                (candidate.voteCount / totalVotes) *
                100
              ).toFixed(2)
            )
          : 0,
    }));

    const winner =
      rankedCandidates.length > 0
        ? rankedCandidates[0]
        : null;

    const runnerUp =
      rankedCandidates.length > 1
        ? rankedCandidates[1]
        : null;

    const winnerMargin =
      winner && runnerUp
        ? winner.voteCount - runnerUp.voteCount
        : winner
        ? winner.voteCount
        : 0;

    // -------------------------
    // Response
    // -------------------------

    res.json({
      election: {
        _id: election._id,
        title: election.title,
        description: election.description,
        type: election.type,
        status: election.status,

        state: election.state,
        district: election.district,
        city: election.city,

        startDate: election.startDate,
        endDate: election.endDate,

        resultVisible: election.resultVisible,
        resultPublishedAt:
          election.resultPublishedAt,
      },

      statistics: {
        totalVotes,
        candidateCount:
          rankedCandidates.length,
        winnerMargin,
      },

      winner,

      runnerUp,

      candidates: rankedCandidates,
    });
  } catch (err) {
    console.error("Error fetching results:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// GET /api/voter/elections
router.get("/elections", authenticateVoter, async (req, res) => {
  try {
    const elections = await Election.find({
  $or: [
    {
      status: {
        $in: ["Draft", "Active"]
      }
    },
    {
      status: "Completed",
      resultVisible: true
    }
  ]
})
      .select(
        "_id title type status startTime endTime state district city createdAt"
      )
      .sort({ createdAt: -1 });
      await Promise.all(
    elections.map(syncElectionStatus)
);

    res.status(200).json(elections);

  } catch (err) {
    console.error("Error fetching elections:", err);

    res.status(500).json({
      message: "Failed to fetch elections.",
    });
  }
});
router.get("/candidates/:electionId", authenticateVoter, async (req, res) => {
  try {
    const voter = await Voter.findById(req.voterId);

    if (!voter) {
      return res.status(404).json({
        message: "Voter not found",
      });
    }

    const election = await Election.findById(req.params.electionId);
    await syncElectionStatus(election);
    const alreadyVoted = await Participation.exists({
  voterId: voter._id,
  electionId: election._id,
});

    if (!election) {
      return res.status(404).json({
        message: "Election not found",
      });
    }

    let constituencyId = null;

    switch (election.type) {
      case "Lok Sabha":
        constituencyId = voter.constituencies?.lokSabha;
        break;

      case "Assembly":
        constituencyId = voter.constituencies?.assembly;
        break;

      case "Municipal":
        constituencyId = voter.constituencies?.municipal;
        break;

      default:
        return res.status(400).json({
          message: "Unsupported election type",
        });
    }

    if (!constituencyId) {
      return res.status(404).json({
        message: "Constituency not assigned.",
      });
    }
    

    const electionConstituency = await Constituency.findOne({
  electionId: election._id,
  masterConstituencyId: constituencyId,
});

if (!electionConstituency) {
  return res.status(404).json({
    message: "Constituency not found for this election.",
  });
}

const candidates = await Candidate.find({
  electionId: election._id,
  constituencyId: electionConstituency._id,
})
  .populate(
    "constituencyId",
    "constituencyName constituencyNumber"
  )
  .sort({ name: 1 });
    res.json({
      election,
      alreadyVoted: !!alreadyVoted,
      candidates,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});
router.put(
  '/update-photo',
  authenticateVoter,
  uploadVoterImage,

  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          message: "Profile image is required"
        });
      }

      const voter = await Voter.findById(req.voterId);

      if (!voter) {
        return res.status(404).json({
          message: "Voter not found"
        });
      }

      const photoUrl = getUploadedImageUrl(req.file);
      if (!photoUrl) {
        return res.status(500).json({ message: 'Profile image URL was not returned by storage' });
      }

      voter.photoUrl = photoUrl;

      await voter.save();

      res.json({
        message: "Photo updated successfully",
        photoUrl: voter.photoUrl
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: "Server error"
      });
    }
});
module.exports = router;
