const XLSX = require("xlsx");
const path = require("path");

function formatDate(value) {
    if (!value) return "";

    // Excel Date Object
    if (value instanceof Date) {
        const day = String(value.getDate()).padStart(2, "0");
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const year = value.getFullYear();

        return `${day}/${month}/${year}`;
    }

    // Already a string
    if (typeof value === "string") {
        const str = value.trim();

        // Matches dd-mm-yyyy or dd/mm/yyyy
        if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(str)) {
            const [d, m, y] = str.split(/[/-]/);

            return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
        }

        // Matches mm/dd/yy (Excel US format)
        if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(str)) {
            let [m, d, y] = str.split("/");

            y = Number(y);

            // Adjust century
            y = y < 30 ? 2000 + y : 1900 + y;

            return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
        }

        return str;
    }

    return value.toString();
}

const readExcel = (filePath) => {
    try {
        const workbook = XLSX.readFile(path.resolve(filePath));

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: ""
        });

        return data.map((row, index) => ({
            rowNumber: index + 2,

            epicNumber: row["EPIC Number"]?.toString().trim(),

            name: row["Name"]?.toString().trim(),

            gender: row["Gender"]?.toString().trim(),

            dob: formatDate(row["Date of Birth"]),

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