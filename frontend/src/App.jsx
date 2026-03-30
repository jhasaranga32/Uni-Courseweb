import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './Components/Home/Home';
import Signin from './Components/Signin/Signin';
import Signup from './Components/Signup/Signup';
import User from './Pages/User Management/User';
import UserProfile from './Pages/User Management/UserPrfole.jsx';
import ForgotPassword from './Pages/User Management/ForgotPassword.jsx';

import StudentDashboard from './Pages/User Management/StudentDashboard.jsx';
import AdminDashboard from './Pages/User Management/AdminDashboard.jsx';

import FacultyList from './Pages/Module Management/faculties/FacultyList.jsx';
import FacultyForm from './Pages/Module Management/faculties/FacultyForm.jsx';
import FacultyDetail from './Pages/Module Management/faculties/FacultyDetails.jsx';

import SemesterList from './Pages/Module Management/semesters/SemesterList.jsx';
import SemesterForm from './Pages/Module Management/semesters/SemesterForm.jsx';
import SemesterDetail from './Pages/Module Management/semesters/SemesterDetails.jsx';

import ModuleList from './Pages/Module Management/modules/ModuleList.jsx';
import ModuleForm from './Pages/Module Management/modules/ModuleForm.jsx';
import ModuleDetail from './Pages/Module Management/modules/ModuleDetails.jsx';

import StudentFaculties from './Pages/Module Management/faculties/Studentfaculties.jsx';
import StudentSemesters from './Pages/Module Management/modules/Studentsemesters.jsx';
import StudentModules from './Pages/Module Management/semesters/Studentmodules.jsx';

import LessonList from './Pages/Module Management/lessons/LessonList.jsx';
import LessonForm from './Pages/Module Management/lessons/LessonForm.jsx';
import LessonView from './Pages/Module Management/lessons/LessonView.jsx';  
import StudentLessonList from './Pages/Module Management/lessons/StudentModule.jsx';
import MyCourses from './Pages/Module Management/modules/MyCourses.jsx';
import AnnouncementList from './Pages/Announcement/AnnouncementList.jsx';
import AnnouncementCreate from './Pages/Announcement/AnnouncementCreate.jsx';
import AnnouncementDetail  from './Pages/Announcement/Announcementdetail.jsx';
import AnnouncementEdit from './Pages/Announcement/Announcementedit.jsx';
import StudentAnnouncements from './Pages/Announcement/Studentannouncements.jsx';

import LecturerAdmin from './Pages/Support/Support.jsx';
import LecturerStudent from './Pages/Support/StudentSupport.jsx';
import CreateEmployeeModal from './Pages/User Management/Employee.jsx';


function App() {
  return (
    <Router>
      {/* Toast notifications added from incoming branch */}
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/users" element={<User />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/employee/users" element={<User />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Faculties */}
        <Route path="/faculties" element={<FacultyList />} />
        <Route path="/faculties/new" element={<FacultyForm />} />
        <Route path="/faculties/:id" element={<FacultyDetail />} />
        <Route path="/faculties/:id/edit" element={<FacultyForm />} />

        {/* Semesters */}
        <Route path="/semesters" element={<SemesterList />} />
        <Route path="/semesters/new" element={<SemesterForm />} />
        <Route path="/semesters/:id" element={<SemesterDetail />} />
        <Route path="/semesters/:id/edit" element={<SemesterForm />} />

        {/* Modules */}
        <Route path="/modules" element={<ModuleList />} />
        <Route path="/modules/new" element={<ModuleForm />} />
        <Route path="/modules/:id" element={<ModuleDetail />} />
        <Route path="/modules/:id/edit" element={<ModuleForm />} />
        <Route path="/student/faculties" element={<StudentFaculties />} />
        <Route path="/student/faculties/:facultyId/semesters" element={<StudentSemesters />} />
        <Route path="/student/faculties/:facultyId/semesters/:semesterId/modules" element={<StudentModules />} />

<Route path="/student/my-courses" element={<MyCourses />} />

     
<Route path="/modules/:moduleId/lessons"        element={<LessonList />} />
<Route path="/modules/:moduleId/lessons/new"    element={<LessonForm />} />
<Route path="/lessons/:id"                      element={<LessonView />} />
<Route path="/lessons/:id/edit"                 element={<LessonForm />} />
import StudentLessonList from './Pages/Module Management/lessons/StudentLessonList.jsx'

<Route path="/announcements" element={<AnnouncementList />} />
<Route path="/announcements/new" element={<AnnouncementCreate />} />
<Route path="/announcements/:id" element={<AnnouncementDetail />} />
<Route path="/announcements/:id/edit" element={<AnnouncementEdit />} />
<Route path="/student/announcements" element={<StudentAnnouncements />} />


<Route path="/admin-lecturers" element={<LecturerAdmin />} />
<Route path="/student-lecturers" element={<LecturerStudent />} />
<Route path="/employees/new" element={<CreateEmployeeModal />} />

<Route
  path="/student/faculties/:facultyId/semesters/:semesterId/modules/:moduleId/lessons"
  element={<StudentLessonList />}
/>      

      </Routes>
    </Router>
  );
}

export default App;