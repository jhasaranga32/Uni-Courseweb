import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/learnbuddy-logo.jpg';

const NavLink = ({ to, children, onClick, className = '' }) => {
  const baseClasses = "text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none";
  return to ? (
    <Link to={to} className={`${baseClasses} ${className}`}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

const DropdownArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// ✅ Logout Confirmation Modal
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal Box */}
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5 border border-white/20">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Logout</h2>
        <p className="text-slate-500 text-sm mt-1">Are you sure you want to logout?</p>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold text-sm hover:from-red-600 hover:to-rose-600 shadow-md hover:shadow-red-200 transition-all duration-200"
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
);

const StudentNavbar = () => {
  const navigate = useNavigate();
  const profileImage = localStorage.getItem('profileImage');
  const userId = localStorage.getItem('userId') || '';

  // ✅ State for modal visibility
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear(); // or remove specific keys
    navigate('/login');
  };

  return (
    <>
      {/* ✅ Render modal outside nav to avoid z-index issues */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <nav className="w-full backdrop-blur-md bg-white/70 px-6 py-2.5 flex justify-between items-center sticky top-0 z-50 border-b border-white/20 shadow-lg">

        {/* Left Side: Logo & Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/student-dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/student-dashboard')}
        >
          <img
            src={logo}
            alt="LearnBuddy"
            className="w-10 h-10 rounded-full border-2 border-white/50 shadow-md group-hover:border-indigo-300 transition-all duration-200 object-cover"
          />
          <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-700 to-teal-600 bg-clip-text text-transparent hidden sm:block group-hover:opacity-80 transition-opacity">
            Mc Wallace University
          </span>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/student-dashboard">Home</NavLink>
          <NavLink to="/student/faculties">Faculties</NavLink>
          <NavLink to="/student/my-courses">My Courses</NavLink>
          <NavLink to="/student-lecturers">Support</NavLink>
          <NavLink to="/student/announcements">Announcements</NavLink>

        </div>

        {/* Right Side: Profile + Logout */}
        <div className="flex items-center gap-3 border-l border-white/20 pl-4 sm:pl-6">

          {/* Profile */}
          <Link
            to={userId ? `/users/${userId}` : "#"}
            className="relative group cursor-pointer block"
            aria-label="My Profile"
          >
            {profileImage && profileImage !== 'undefined' ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50 group-hover:border-indigo-500 group-hover:shadow-md transition-all duration-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100/90 to-teal-100/90 backdrop-blur-sm flex items-center justify-center text-indigo-700 font-bold text-lg border-2 border-white/50 group-hover:border-indigo-500 group-hover:shadow-md transition-all duration-200">
                U
              </div>
            )}
            <span className="absolute top-12 left-1/2 -translate-x-1/2 backdrop-blur-md bg-slate-800/90 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-white/10">
              My Profile
            </span>
          </Link>

          {/* ✅ Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="relative group flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-white hover:bg-red-500 px-4 py-2.5 rounded-xl border border-red-200 hover:border-red-500 transition-all duration-200"
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:block">Logout</span>
          </button>

        </div>
      </nav>
    </>
  );
};

export default StudentNavbar;