const express = require("express");
const router = express.Router();

const upload = require("../../Middleware/Upload");
const { protect, authorise } = require("../../Middleware/auth");

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
} = require("../../Controller/Announcement/AnnouncementController");


// add
router.post(
  "/add",
  protect,
  authorise('Admin', 'SuperAdmin', 'Employee'),
  upload.single("image"),
  createAnnouncement
);

// get
router.get("/", getAnnouncements);

// delete
router.delete(
  "/:id",
  protect,
  authorise('Admin', 'SuperAdmin', 'Employee'),
  deleteAnnouncement
);

// update
router.put(
  "/:id",
  protect,
  authorise('Admin', 'SuperAdmin', 'Employee'),
  upload.single("image"),
  updateAnnouncement
);

module.exports = router;