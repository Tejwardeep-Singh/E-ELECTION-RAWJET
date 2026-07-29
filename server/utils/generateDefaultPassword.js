function generateDefaultPassword(epicNumber, dobString) {
    const prefix = epicNumber.substring(0, 5).toUpperCase();

    const separator = dobString.includes("/") ? "/" : "-";

    const [day, month, year] = dobString.split(separator);

    return `${prefix}${day}${month}${year}`;
}

module.exports = generateDefaultPassword;