const fs = require("fs");
const path = require("path");

const VALID_GENDERS = ["Male", "Female", "Other"];
const VALID_STATUS = ["active", "inactive"];

const EPIC_REGEX = /^[A-Z]{2,5}[0-9]{5,10}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;

function isAdult(dob) {
    const [day, month, year] = dob.split("/").map(Number);

    if (!day || !month || !year) return false;

    const birthDate = new Date(year, month - 1, day);

    if (isNaN(birthDate.getTime())) return false;

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age >= 18;
}

function validateBasic(voters, photoFolder) {

    const errors = [];
    const epicSet = new Set();

    for (const voter of voters) {

        const rowErrors = [];

        //-----------------------------
        // Required Fields
        //-----------------------------

        const requiredFields = {
            epicNumber: "EPIC Number",
            name: "Name",
            gender: "Gender",
            dob: "Date of Birth",
            guardianName: "Father/Husband Name",
            mobile: "Mobile Number",
            state: "State",
            district: "District",
            city: "City",
            municipal: "Municipal Constituency",
            assembly: "Assembly Constituency",
            lokSabha: "Lok Sabha Constituency",
            houseNo: "House No",
            street: "Street",
            pincode: "Pincode",
            photo: "Photo File Name",
            status: "Status"
        };

        for (const key in requiredFields) {
            if (!voter[key]) {
                rowErrors.push(`${requiredFields[key]} is required`);
            }
        }

        //-----------------------------
        // EPIC
        //-----------------------------

        if (
            voter.epicNumber &&
            !EPIC_REGEX.test(voter.epicNumber)
        ) {
            rowErrors.push("Invalid EPIC Number");
        }

        //-----------------------------
        // Duplicate EPIC
        //-----------------------------

        if (epicSet.has(voter.epicNumber)) {
            rowErrors.push("Duplicate EPIC in Excel");
        } else {
            epicSet.add(voter.epicNumber);
        }

        //-----------------------------
        // Gender
        //-----------------------------

        if (
            voter.gender &&
            !VALID_GENDERS.includes(voter.gender)
        ) {
            rowErrors.push("Invalid Gender");
        }

        //-----------------------------
        // Status
        //-----------------------------

        if (
            voter.status &&
            !VALID_STATUS.includes(voter.status.toLowerCase())
        ) {
            rowErrors.push("Invalid Status");
        }

        //-----------------------------
        // Mobile
        //-----------------------------

        if (
            voter.mobile &&
            !MOBILE_REGEX.test(voter.mobile)
        ) {
            rowErrors.push("Invalid Mobile Number");
        }

        //-----------------------------
        // Pincode
        //-----------------------------

        if (
            voter.pincode &&
            !PINCODE_REGEX.test(voter.pincode)
        ) {
            rowErrors.push("Invalid Pincode");
        }

        //-----------------------------
        // DOB
        //-----------------------------

        if (
            voter.dob &&
            !isAdult(voter.dob)
        ) {
            rowErrors.push("Voter must be at least 18 years old");
        }

        //-----------------------------
        // Photo Exists
        //-----------------------------

        if (voter.photo) {

            const photoPath = path.join(photoFolder, voter.photo);

            if (!fs.existsSync(photoPath)) {
                rowErrors.push(`Photo not found (${voter.photo})`);
            }

        }

        //-----------------------------
        // Save Errors
        //-----------------------------

        if (rowErrors.length > 0) {

            errors.push({
                row: voter.rowNumber,
                errors: rowErrors
            });

        }

    }

    return errors;
}

module.exports = validateBasic;