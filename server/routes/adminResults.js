const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const Admin = require("../models/admin");
const Election = require("../models/election");
const Constituency = require("../models/constituency");
const Candidate = require("../models/candidate");

router.use(authenticate, authorizeAdmin);

router.get("/", async (req, res) => {
    try {

        const admin = await Admin.findOne({
    userId: req.user.userId,
})
.populate("electionId")
.populate("constituencyId");

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const election = admin.electionId;
        const constituency = admin.constituencyId;

        if (!election || !constituency) {
            return res.status(400).json({
                message: "Admin is not assigned to an election or constituency."
            });
        }

        if (!election.resultVisible) {
            return res.status(403).json({
                message: "Results have not been published yet."
            });
        }

        const candidates = await Candidate.find({
            electionId: election._id,
            constituencyId: constituency._id
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
                constituencyNumber: constituency.constituencyNumber,
                constituencyName: constituency.constituencyName
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