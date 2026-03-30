const express = require("express");
const router = express.Router();

const upload = require("../../Middleware/Upload");

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
} = require("../../Controller/Announcement/AnnouncementController");


// add
router.post(
  "/add",
  upload.single("image"),
  createAnnouncement
);

// get
router.get("/", getAnnouncements);

// delete
router.delete("/:id", deleteAnnouncement);

// update
router.put(
  "/:id",
  upload.single("image"),
  updateAnnouncement
);

module.exports = router;