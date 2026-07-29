function createVoter({
    voter,
    password,
    electionId,
    municipal,
    assembly,
    lokSabha,
    photoPath,
}) {

    const [day, month, year] = voter.dob.split("/");

    return {

        epicNumber: voter.epicNumber,

        userId: voter.epicNumber,

        name: voter.name,

        gender: voter.gender,

        guardianName: voter.guardianName,

        mobile: voter.mobile,

        dateOfBirth: new Date(year, month - 1, day),

        constituencies: {

            municipal: municipal._id,

            assembly: assembly._id,

            lokSabha: lokSabha._id,

        },

        address: {

            state: voter.state,

            district: voter.district,

            city: voter.city,

            houseNo: voter.houseNo,

            street: voter.street,

            pincode: voter.pincode,

        },

        password,

        mustChangePassword: true,

        photo: {

            original: photoPath,

            processed: "",

            uploadedAt: new Date(),

        },

        biometric: {

            enrolled: false,

            faceEmbeddingPath: "",

            modelVersion: "InsightFace-v1",

            enrolledAt: null,

        },

        votingStatus: "not_voted",

        lastVerification: {

            success: false,

            confidence: 0,

            time: null,

            method: "face",

        },

        status: voter.status.toLowerCase(),

        electionId,

    };

}

module.exports = createVoter;