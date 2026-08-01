module.exports = async function syncElectionStatus(election) {
  if (!election) return null;

  const now = new Date();

  const startDate = election.startDate
    ? new Date(election.startDate)
    : null;

  const endDate = election.endDate
    ? new Date(election.endDate)
    : null;

  let changed = false;

  // Draft → Active
  if (
    election.status === "Draft" &&
    startDate &&
    endDate &&
    now >= startDate &&
    now < endDate
  ) {
    election.status = "Active";
    changed = true;
  }

  // Active → Completed
  if (
    election.status === "Active" &&
    endDate &&
    now >= endDate
  ) {
    election.status = "Completed";
    changed = true;
  }

  if (changed) {
    await election.save();
  }

  return election;
};