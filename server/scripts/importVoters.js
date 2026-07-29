const path = require("path");

const readExcel = require("./helpers/readExcel");
const validateBasic = require("./helpers/validateBasic");
const validateDatabase = require("./helpers/validateDatabase");
const generateDefaultPassword = require("./utils/generateDefaultPassword");
const hashPassword = require("./helpers/hashPassword");

const excelPath = path.join(__dirname, "../imports/voters.xlsx");
const photoFolder = path.join(__dirname, "../imports/photos");

const voters = readExcel(excelPath);
const defaultPassword = generateDefaultPassword(
    voter.epicNumber,
    voter.dateOfBirth
);

const hashedPassword = await hashPassword(defaultPassword);

console.log(`\nLoaded ${voters.length} voters\n`);

const errors = validateBasic(voters, photoFolder);

if (errors.length > 0) {

    console.log("====================================");
    console.log("VALIDATION FAILED");
    console.log("====================================\n");

    errors.forEach(error => {

        console.log(`Row ${error.row}`);

        error.errors.forEach(err => {
            console.log(`   ❌ ${err}`);
        });

        console.log("");

    });

    console.log(`Total Errors : ${errors.length}`);

    process.exit();

}

console.log("✅ Basic Validation Passed");

console.log("✅ Basic Validation Passed");

const dbErrors = await validateDatabase(voters);

if (dbErrors.length > 0) {

    console.log("\n==================================");
    console.log("DATABASE VALIDATION FAILED");
    console.log("==================================\n");

    dbErrors.forEach((error) => {

        console.log(`Row ${error.row}`);

        error.errors.forEach((err) => {
            console.log(`   ❌ ${err}`);
        });

        console.log("");

    });

    console.log(`Total Errors : ${dbErrors.length}`);

    process.exit();

}

console.log("✅ Database Validation Passed");