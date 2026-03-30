import { NavLink,Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// ── Permission map ────────────────────────────────────────────
const ROLE_ACCESS = {
  Admin:      ['/admin-dashboard', '/faculties', '/semesters', '/modules', '/announcements'],
  Employee:   ['/announcements', '/admin-lecturers', '/users'],
  SuperAdmin: ['/admin-dashboard', '/faculties', '/semesters', '/modules', '/announcements', '/admin-lecturers', '/users', '/employees'],
};

const canAccess = (role, path) => {
  const allowed = ROLE_ACCESS[role] || [];
  return allowed.some(p => path.startsWith(p));
};
// ─────────────────────────────────────────────────────────────

export default function Sidebar() {
  const navigate     = useNavigate();
  const location     = useLocation();
  const userName     = localStorage.getItem("userName")     || "Admin";
  const userRole     = localStorage.getItem("userRole")     || "";
  const profileImage = localStorage.getItem("profileImage");

  const isSuperAdmin = userRole === "SuperAdmin";

  const NAV = [
    { to: "/admin-dashboard", label: "Dashboard",     icon: "📊" },
    { to: "/faculties",       label: "Faculties",     icon: "🏛"  },
    { to: "/semesters",       label: "Semesters",     icon: "📅" },
    { to: "/modules",         label: "Modules",       icon: "📚" },
    { to: "/announcements",   label: "Announcements", icon: "📢" },
    { to: "/users",           label: "Users",         icon: "👥" },
     { to: "/admin-lecturers", label: "Lecturers",     icon: "👨‍🏫" },
    { to: "/employees/new",       label: "Employees",     icon: "👷" },
   
  ];

  // Role badge style
  const roleBadge = {
    SuperAdmin: { bg: '#FCE4EC', color: '#B71C1C', label: 'Super Admin' },
    Admin:      { bg: '#E8EAF6', color: '#1A237E', label: 'Admin'       },
    Employee:   { bg: '#E8F5E9', color: '#1B5E20', label: 'Employee'    },
  }[userRole] ?? { bg: '#F5F5F5', color: '#546E7A', label: userRole };

  const handleNavClick = (e, to) => {
    if (!canAccess(userRole, to)) {
      e.preventDefault();
      toast.error(`Your role (${userRole}) cannot access this page.`, { duration: 2500 });
    }
  };

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="w-64 p-4 text-center">
          <p className="text-lg font-semibold mb-3">Are you sure you want to logout?</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => { localStorage.clear(); navigate("/login"); toast.dismiss(t.id); }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >Yes</button>
            <button onClick={() => toast.dismiss(t.id)} className="bg-gray-300 px-4 py-2 rounded-lg">No</button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30 flex flex-col justify-between">

      {/* TOP */}
      <div>
       
        {/* Profile */}
        <div className="pt-5 pb-3 flex flex-col items-center">
  <Link to={`/users/${localStorage.getItem('userId')}`} className="relative group cursor-pointer">
    <img
      src={profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
      alt="profile"
      className="w-14 h-14 rounded-full object-cover border group-hover:border-indigo-400 group-hover:shadow-md transition-all duration-200"
    />
    {/* Hover overlay */}
    <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16H8v-2a2 2 0 01.586-1.414z" />
      </svg>
    </div>
  </Link>
  <p className="mt-2 text-sm font-semibold text-gray-700">{userName}</p>
          {/* Role Badge */}
          <span
            className="mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{ background: roleBadge.bg, color: roleBadge.color }}
          >
            {roleBadge.label}
          </span>
          
        </div>
       
        {/* Nav */}
        <nav className="px-3 pt-3 space-y-1">
          {NAV.map(({ to, label, icon }) => {
            const hasAccess = canAccess(userRole, to);
            const isActive  = location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                onClick={(e) => handleNavClick(e, to)}
                className={() =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !hasAccess
                      ? 'text-gray-300 cursor-not-allowed hover:bg-gray-50'
                      : isActive
                        ? isSuperAdmin
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {/* Icon + Label */}
                <div className="flex items-center gap-2.5">
                  <span className={!hasAccess ? 'opacity-30' : ''}>{icon}</span>
                  <span>{label}</span>
                </div>

                {/* 🔒 Lock icon if no access */}
                {!hasAccess && (
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-gray-300 flex-shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* LOGOUT */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white text-sm py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}