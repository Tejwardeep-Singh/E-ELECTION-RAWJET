function createVoter({
    voter,
    password,
    photo
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

            municipal: voter.municipalDoc._id,
            assembly: voter.assemblyDoc._id,
            lokSabha: voter.lokSabhaDoc._id,

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

        photo,
        biometric: {

            enrolled: false,

            faceEmbeddingPath: "",

            modelVersion: "InsightFace-v1",

            enrolledAt: null,

        },

        lastVerification: {

            success: false,

            confidence: 0,

            time: null,

            method: "face",

        },

        status: voter.status.toLowerCase(),

    };

}

module.exports = createVoter;