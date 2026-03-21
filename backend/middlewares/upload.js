const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "eternal_uploads",
      resource_type: "image",
      allowed_formats: ["jpg", "png", "jpeg", "webp"] // 🔥 ADD THIS
    };
  }
});

const upload = multer({ storage });

module.exports = upload;