const MasterConstituency = require("../../models/MasterConstituency");
const Voter = require("../../models/Voter");

async function validateDatabase(voters) {
    const errors = [];

    // ================================
    // Load all active constituencies
    // ================================

    const constituencies = await MasterConstituency.find({
        active: true,
    }).lean();

    // ================================
    // Load existing EPIC Numbers
    // ================================

    const existingVoters = await Voter.find(
        {},
        {
            epicNumber: 1,
            _id: 0,
        }
    ).lean();

    const existingEPICs = new Set(
        existingVoters.map((v) => v.epicNumber)
    );

    // ================================
    // Lookup Maps
    // ================================

    const stateSet = new Set();
    const districtSet = new Set();
    const citySet = new Set();

    const municipalMap = new Map();
    const assemblyMap = new Map();
    const lokSabhaMap = new Map();

    for (const c of constituencies) {

        if (c.state) {
            stateSet.add(c.state);
        }

        if (c.state && c.district) {
            districtSet.add(
                `${c.state}|${c.district}`
            );
        }

        if (c.state && c.district && c.city) {
            citySet.add(
                `${c.state}|${c.district}|${c.city}`
            );
        }

        switch (c.electionType) {

            case "Municipal":

                municipalMap.set(
    `${c.state}|${c.district}|${c.city}|${c.constituencyName}`,
    c
);

                break;

            case "Assembly":

                assemblyMap.set(
    `${c.state}|${c.constituencyName}`,
    c
)

                break;

            case "Lok Sabha":

                lokSabhaMap.set(
    `${c.state}|${c.constituencyName}`,
    c
);

                break;

        }
    }

    // ================================
    // Validate Every Voter
    // ================================

    for (const voter of voters) {

        const rowErrors = [];

        //--------------------------
        // Duplicate EPIC
        //--------------------------

        if (existingEPICs.has(voter.epicNumber)) {

            rowErrors.push(
                "EPIC Number already exists in database."
            );

        }

        //--------------------------
        // State
        //--------------------------

        if (
            !stateSet.has(voter.state)
        ) {

            rowErrors.push(
                "Invalid State."
            );

        }

        //--------------------------
        // District
        //--------------------------

        if (
            !districtSet.has(
                `${voter.state}|${voter.district}`
            )
        ) {

            rowErrors.push(
                "Invalid District."
            );

        }

        //--------------------------
        // City
        //--------------------------

        if (
            !citySet.has(
                `${voter.state}|${voter.district}|${voter.city}`
            )
        ) {

            rowErrors.push(
                "Invalid City."
            );

        }

        //--------------------------
        // Municipal Constituency
        //--------------------------

        if (
            !municipalMap.has(
                `${voter.state}|${voter.district}|${voter.city}|${voter.municipal}`
            )
        ) {

            rowErrors.push(
                "Municipal Constituency not found."
            );

        }

        //--------------------------
        // Assembly Constituency
        //--------------------------

        if (
            !assemblyMap.has(
                `${voter.state}|${voter.assembly}`
            )
        ) {

            rowErrors.push(
                "Assembly Constituency not found."
            );

        }

        //--------------------------
        // Lok Sabha Constituency
        //--------------------------

        if (
            !lokSabhaMap.has(
                `${voter.state}|${voter.lokSabha}`
            )
        ) {

            rowErrors.push(
                "Lok Sabha Constituency not found."
            );

        }

        //--------------------------
        // Save Errors
        //--------------------------

        if (rowErrors.length > 0) {

    errors.push({
        row: voter.rowNumber,
        errors: rowErrors,
    });

    continue;
}

// Save matched constituency documents

voter.municipalDoc = municipalMap.get(
    `${voter.state}|${voter.district}|${voter.city}|${voter.municipal}`
);

voter.assemblyDoc = assemblyMap.get(
    `${voter.state}|${voter.assembly}`
);

voter.lokSabhaDoc = lokSabhaMap.get(
    `${voter.state}|${voter.lokSabha}`
);

    }
    

    return errors;
}


module.exports = validateDatabase;