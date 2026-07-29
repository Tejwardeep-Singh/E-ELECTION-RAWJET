function generateDefaultPassword(epicNumber, dob) {
    const prefix = epicNumber.substring(0, 5).toUpperCase();

    const day = String(dob.getDate()).padStart(2, "0");
    const month = String(dob.getMonth() + 1).padStart(2, "0");
    const year = dob.getFullYear();

    return `${prefix}${day}${month}${year}`;
}

module.exports = generateDefaultPassword;