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


async function importVoters() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
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
        console.log(`Found ${voters.length} voters`);
        const basicErrors = validateBasic(voters,photoFolder);
        if (basicErrors.length > 0) {
            console.log("\n❌ Basic Validation Failed\n");
            console.table(basicErrors);
            return;
        }
        const dbErrors = await validateDatabase(voters);
        if (dbErrors.length > 0) {
            console.log("\n❌ Database Validation Failed\n");
            console.table(dbErrors);

            return;
        }
        const votersToInsert = [];
        for (const voter of voters) {
            console.log(`Processing ${voter.epicNumber}...`);
            console.log("EPIC:", voter.epicNumber);
console.log("DOB Value:", voter.dob);
console.log("DOB Type:", typeof voter.dob);
            const defaultPassword = generateDefaultPassword(
                voter.epicNumber,
                voter.dob
            );
            console.log("Generated:", defaultPassword);
            const hashedPassword =
                await hashPassword(defaultPassword);
            const photo =
                await processPhoto(
                    voter.epicNumber,
                    voter.photo
                );
            const document =
                createVoter({
                    voter,
                    password: hashedPassword,
                    photo,
                });
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
        console.log("\n====================================");
        console.log("✅ Import Successful");
        console.log("====================================");
        console.log(`Imported : ${votersToInsert.length}`);
        console.log("====================================\n");
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
        console.log("MongoDB Disconnected");
    }
}

importVoters();