const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function enrollFace(epicNumber, imagePath) {

    const form = new FormData();
    const absoluteImagePath = path.join(
    __dirname,
    "..",
    "..",
    imagePath
);

    form.append("epic", epicNumber);
console.log("Image Path:", absoluteImagePath);
    form.append(
    "file",
    fs.createReadStream(absoluteImagePath)
);

    const { data } = await axios.post(

        "http://127.0.0.1:8000/enroll",

        form,

        {
            headers: form.getHeaders(),
        }

    );

    return data;

}

module.exports = enrollFace;