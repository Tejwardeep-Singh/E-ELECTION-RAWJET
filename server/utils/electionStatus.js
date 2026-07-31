function canVote(election) {
    const now = new Date();

    return (
        election.status === "Active" &&
        (!election.startDate || now >= election.startDate) &&
        (!election.endDate || now <= election.endDate)
    );
}

module.exports = { canVote };