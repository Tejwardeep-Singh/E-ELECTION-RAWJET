const fs = require("fs/promises");
const path = require("path");

async function processPhoto(epicNumber, photoFileName) {
    const sourcePath = path.join(
    __dirname,
    "../../imports/photos",
    photoFileName
);

    const extension = path.extname(photoFileName);

    const newFileName = `${epicNumber}${extension}`;

    const destinationPath = path.join(
        __dirname,
        "../../storage/original",
        newFileName
    );

    await fs.copyFile(sourcePath, destinationPath);

    return {
    original: `storage/original/${newFileName}`,
    processed: "",
    uploadedAt: new Date(),
};
}

module.exports = processPhoto;