require("dotenv").config();

const path = require("path");
const mongoose = require("mongoose");
const readExcel = require("./helpers/readExcel");
const validateBasic = require("./helpers/validateBasic");
const validateDatabase = require("./helpers/validateDatabase");
const processPhoto = require("./helpers/processPhoto");
const createVoter = require("./helpers/createVoter");
const hashPassword = require("./helpers/hashPassword");
const generateDefaultPassword = require("../utils/generateDefaultPassword");
const Voter = require("../models/Voter");
const enrollFace = require("./helpers/enrollFace");


async function importVoters() {
    await mongoose.connect(process.env.MONGO_URI);
    const session = await mongoose.startSession();
    try {
        const photoFolder = path.join(
    __dirname,
    "../imports/photos"
);
        const excelPath = path.join(
            __dirname,
            "../imports/voters.xlsx"
        );
        const voters = readExcel(excelPath);
        const basicErrors = validateBasic(voters,photoFolder);
        if (basicErrors.length > 0) {
            console.table(basicErrors);
            return;
        }
        const dbErrors = await validateDatabase(voters);
        if (dbErrors.length > 0) {
            console.table(dbErrors);

            return;
        }
        const votersToInsert = [];
        for (const voter of voters) {
            const defaultPassword = generateDefaultPassword(
                voter.epicNumber,
                voter.dob
            );
            const hashedPassword =
                await hashPassword(defaultPassword);
            const photo =
                await processPhoto(
                    voter.epicNumber,
                    voter.photo
                );
                const enrollment =
    await enrollFace(
        voter.epicNumber,
        photo.original
    );
            const document =
                createVoter({
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

} else {

    throw new Error(
        `Face enrollment failed for ${voter.epicNumber}: ${enrollment.message}`
    );

}
            votersToInsert.push(document);
        }
        session.startTransaction();
        await Voter.insertMany(
            votersToInsert,
            {
                session,
            }
        );
        await session.commitTransaction();
        session.endSession();
    }
    catch (err) {
         if (session.inTransaction()) {
        await session.abortTransaction();
    }

    console.error("Import Failed:");
    console.error(err);
    }
    finally {
        session.endSession();
        await mongoose.disconnect();
    }
}

importVoters();