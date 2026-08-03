const processPhoto = require("../scripts/helpers/processPhoto");
const createVoter = require("../scripts/helpers/createVoter");
const hashPassword = require("../scripts/helpers/hashPassword");
const generateDefaultPassword = require("../utils/generateDefaultPassword");
const enrollFace = require("../scripts/helpers/enrollFace");
const Voter = require("../models/Voter");

async function registerVoter(voter) {

    const password = generateDefaultPassword(
        voter.epicNumber,
        voter.dob
    );

    const hashedPassword = await hashPassword(password);

    const photo = await processPhoto(
        voter.epicNumber,
        voter.photo.originalname
    );

    const enrollment = await enrollFace(
        voter.epicNumber,
        photo.original
    );

    const document = createVoter({
        voter,
        password: hashedPassword,
        photo,
    });

    if (enrollment.success) {

        document.biometric.enrolled = true;

        document.biometric.faceEmbeddingPath =
            enrollment.embeddingFile;

        document.biometric.enrolledAt =
            new Date();

    }

    return await Voter.create(document);

}

module.exports = registerVoter;