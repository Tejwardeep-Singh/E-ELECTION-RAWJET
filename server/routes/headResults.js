const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const authorizeHead = require("../middlewares/authorizeHead");

const Election = require("../models/election");
const Constituency = require("../models/constituency");
const Candidate = require("../models/candidate");

router.use(authenticate, authorizeHead);


router.get("/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        message: "Election not found",
      });
    }

    const constituencies = await Constituency.find({
      electionId,
    })
      .select("_id constituencyNumber constituencyName")
      .sort({ constituencyNumber: 1 });

    const candidates = await Candidate.find({
      electionId,
    }).select("voteCount constituencyId");

    const totalVotes = candidates.reduce(
      (sum, candidate) => sum + (candidate.voteCount || 0),
      0
    );

    res.json({
      election: {
        _id: election._id,
        title: election.title,
        type: election.type,
        status: election.status,
        resultVisible: election.resultVisible,
        resultPublishedAt: election.resultPublishedAt,
      },

      statistics: {
        totalVotes,
        totalCandidates: candidates.length,
        totalConstituencies: constituencies.length,
      },

      constituencies,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });

  }
});
router.get("/:electionId/:constituencyId", async (req, res) => {
    try {

        const { electionId, constituencyId } = req.params;

        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        const constituency = await Constituency.findById(constituencyId);

        if (!constituency) {
            return res.status(404).json({
                message: "Constituency not found"
            });
        }

        const candidates = await Candidate.find({
            electionId,
            constituencyId
        }).sort({ voteCount: -1 });

        const totalVotes = candidates.reduce(
            (sum, c) => sum + (c.voteCount || 0),
            0
        );

        const winner = candidates[0] || null;

        const runnerUp = candidates[1] || null;

        const winningMargin =
            winner && runnerUp
                ? winner.voteCount - runnerUp.voteCount
                : winner
                ? winner.voteCount
                : 0;

        res.json({

            election: {
                _id: election._id,
                title: election.title,
                type: election.type,
                status: election.status
            },

            constituency: {
                _id: constituency._id,
                constituencyNumber:
                    constituency.constituencyNumber,
                constituencyName:
                    constituency.constituencyName
            },

            statistics: {
                totalVotes,
                candidateCount: candidates.length,
                winningMargin
            },

            winner,

            runnerUp,

            candidates

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });

    }
});

module.exports = router;