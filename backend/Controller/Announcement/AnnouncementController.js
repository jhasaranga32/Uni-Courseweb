const Announcement = require("../../Model/Announcement/AnnouncmentModel");


// CREATE
exports.createAnnouncement = async (req, res) => {
  try {

    const { title, description } = req.body;

    const image = req.file ? req.file.path : "";

    const newAnnouncement = new Announcement({
      title,
      description,
      image,
    });

    await newAnnouncement.save();

    res.json(newAnnouncement);

  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ALL
exports.getAnnouncements = async (req, res) => {
  try {
    const data = await Announcement.find().sort({ date: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};


// DELETE
exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};


// UPDATE
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const updateData = {
      title,
      description,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
};