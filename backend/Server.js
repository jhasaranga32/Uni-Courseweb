const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();  // MUST be at the very top

const cors = require('cors');
const connectDB = require('./db');
const authRoutes    = require('./Routes/User Management/UserRoute.js');
const facultyRoutes = require('./Routes/Module Management/FacultyRoutes');
const superAdminRoutes = require('./Routes/User Management/SuperAdminRoutes'); // ✅ added route    
const semesterRoutes = require('./Routes/Module Management/SemesterRoutes');
const moduleRoutes  = require('./Routes/Module Management/ModuleRoutes');
const lessonRoutes  = require('./Routes/Module Management/LessonRoutes'); // ✅ fixed name
const announcementRoutes = require('./Routes/Announcement/AnnouncementRoutes');
const savedModuleRoute = require('./Routes/Module Management/SavedmoduleRoute') // ✅ added route
const supportRoutes = require('./Routes/Support/SupportRoutes') // ✅ added route

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static('uploads')); // ✅ moved above routes

app.get('/', (req, res) => res.send('LearnBuddy API is running...'));

app.use('/api/auth',      authRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/modules',   moduleRoutes);
app.use('/api',           lessonRoutes); // ✅ fixed variable name
app.use('/api/announcements', announcementRoutes);
app.use('/api/saved-modules', savedModuleRoute)
app.use('/api/lecturers', supportRoutes) // ✅ added route
app.use('/api/superadmin', superAdminRoutes); // ✅ added route



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));