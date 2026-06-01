const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Multer + CloudinaryStorage (Dynamic Folder Based on Field Name)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "miscImages"; // fallback
    if (file.fieldname === "candidateImage") folder = "candidateImages";
    if (file.fieldname === "partyImage") folder = "partyImages";

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${file.originalname.split('.')[0]}-${Date.now()}`
    };
  },
});
const voterStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "bharat-ballot/voters",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `voter-${Date.now()}`
    };
  }
});
const voterUpload = multer({
  storage: voterStorage,

  limits: {
    fileSize: 2 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  }
});

const upload = multer({ storage });

module.exports = {
   upload,
   voterUpload
};
