const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now, // auto date
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);