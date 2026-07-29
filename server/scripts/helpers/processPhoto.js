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
    console.log(sourcePath);
console.log(await fs.access(sourcePath).then(() => "Exists").catch(() => "Not Found"));

    await fs.copyFile(sourcePath, destinationPath);

    return {
    original: `storage/original/${newFileName}`,
    processed: "",
    uploadedAt: new Date(),
};
}

module.exports = processPhoto;