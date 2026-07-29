const XLSX = require("xlsx");
const path = require("path");

const readExcel = (filePath) => {
    try {
        const workbook = XLSX.readFile(path.resolve(filePath));

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
            raw: false
        });

        return data.map((row, index) => ({
            rowNumber: index + 2,

            epicNumber: row["EPIC Number"]?.toString().trim(),

            name: row["Name"]?.toString().trim(),

            gender: row["Gender"]?.toString().trim(),

            dob: row["Date of Birth"]?.toString().trim(),

            guardianName: row["Father/Husband Name"]?.toString().trim(),

            mobile: row["Mobile Number"]?.toString().trim(),

            state: row["State"]?.toString().trim(),

            district: row["District"]?.toString().trim(),

            city: row["City"]?.toString().trim(),

            municipal: row["Municipal Constituency"]?.toString().trim(),

            assembly: row["Assembly Constituency"]?.toString().trim(),

            lokSabha: row["Lok Sabha Constituency"]?.toString().trim(),

            houseNo: row["House No"]?.toString().trim(),

            street: row["Street"]?.toString().trim(),

            pincode: row["Pincode"]?.toString().trim(),

            photo: row["Photo File Name"]?.toString().trim(),

            status: row["Status"]?.toString().trim().toLowerCase()
        }));
    } catch (error) {
        throw new Error(`Failed to read Excel file: ${error.message}`);
    }
};

module.exports = readExcel;