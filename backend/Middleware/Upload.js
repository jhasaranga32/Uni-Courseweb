const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "uploads";

    // different folders for different types
    if (req.baseUrl.includes("lecturers")) {
      dir = "uploads/lecturers";
    } else if (file.mimetype.startsWith("image")) {
      dir = "uploads/images";
    } else if (file.mimetype === "application/pdf") {
      dir = "uploads/lessons";
    }

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Image or PDF allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = upload;