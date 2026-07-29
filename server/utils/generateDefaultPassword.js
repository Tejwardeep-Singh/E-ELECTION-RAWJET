function generateDefaultPassword(epicNumber, dob) {
    const prefix = epicNumber.substring(0, 5).toUpperCase();

    const parts = dob.split(/[/-]/);

    if (parts.length !== 3) {
        throw new Error(`Invalid DOB format: ${dob}`);
    }

    const [day, month, year] = parts;

    return `${prefix}${day}${month}${year}`;
}

module.exports = generateDefaultPassword;