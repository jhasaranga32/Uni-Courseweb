const Announcement = require("../../Model/Announcement/AnnouncmentModel");
const User = require("../../Model/User Management/UserModel");
const nodemailer = require("nodemailer");

// Setup Nodemailer transporter 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

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

    // Send email to all registered users
    const users = await User.find({}, "email");
    const emailList = users.map(user => user.email);

    if (emailList.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailList.join(","), // Send as BCC for privacy if preferred, but here joined string is fine for small/medium lists
        subject: `New Announcement: ${title}`,
        text: `Hello,\n\nA new announcement has been posted:\n\nTitle: ${title}\nDescription: ${description}\n\nCheck it out on the portal!\n\nBest regards,\nLearnBuddy Team`,
        html: `
          <h3>New Announcement Posted</h3>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p>Check it out on the <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/announcements">portal</a>!</p>
          <br/>
          <p>Best regards,<br/>LearnBuddy Team</p>
        `
      };

      // Use BCC for privacy in production if needed
      // mailOptions.bcc = emailList;
      // mailOptions.to = process.env.EMAIL_USER;

      transporter.sendMail(mailOptions).catch(err => console.error("Email sending failed:", err));
    }

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