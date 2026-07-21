const Constituency = require('../models/constituency');
const Election = require('../models/election');

async function getConstituencyForElection(electionId, constituencyId) {
  if (!electionId || !constituencyId) return null;
  return Constituency.findOne({ _id: constituencyId, electionId });
}

async function validateElectionAssignment(electionId, constituencyId) {
  const [election, constituency] = await Promise.all([
    Election.findById(electionId),
    getConstituencyForElection(electionId, constituencyId),
  ]);
  if (!election) throw new Error('Election not found');
  if (!constituency) throw new Error('Constituency does not belong to the selected election');
  if (election.status === 'Archived') throw new Error('Archived elections are read-only');
  return { election, constituency };
}

function scopeForAdmin(admin) {
  return { electionId: admin.electionId, constituencyId: admin.constituencyId };
}

module.exports = { getConstituencyForElection, validateElectionAssignment, scopeForAdmin };
