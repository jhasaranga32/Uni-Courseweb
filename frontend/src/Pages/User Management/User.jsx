import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/ModuleManagement/Sidebar';

const User = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Create Admin Modal
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    fullName: '', email: '', phoneNumber: '',
    password: '', confirmPassword: ''
  })
  const [adminError,   setAdminError]   = useState('')
  const [adminSuccess, setAdminSuccess] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  // Create SuperAdmin Modal
  const [isCreateSuperAdminOpen, setIsCreateSuperAdminOpen] = useState(false);
  const [superAdminForm, setSuperAdminForm] = useState({
    fullName: '', email: '', phoneNumber: '',
    password: '', confirmPassword: '', secretKey: ''
  })
  const [superAdminError,   setSuperAdminError]   = useState('')
  const [superAdminSuccess, setSuperAdminSuccess] = useState('')
  const [superAdminLoading, setSuperAdminLoading] = useState(false)

  // ✅ Create Student Modal
  const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    fullName: '', email: '', phoneNumber: '', faculty: '',
    password: '', confirmPassword: ''
  });
  const [studentError,   setStudentError]   = useState('');
  const [studentSuccess, setStudentSuccess] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);

  const [faculties, setFaculties] = useState([]);

useEffect(() => { fetchFaculties(); }, []);

const fetchFaculties = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/faculties');
    const data     = await response.json();
    setFaculties(data.data || []);
  } catch (error) {
    console.error('Error fetching faculties:', error);
  }
};

  const currentUserRole = localStorage.getItem('userRole')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users')
      const data = await response.json()
      setUsers(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/users/${id}`, { method: 'DELETE' })
        if (response.ok) setUsers(users.filter(user => user._id !== id))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  // ── Create Admin ──
  const handleAdminFormChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value })
    setAdminError('')
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setAdminError('')
    setAdminSuccess('')

    if (adminForm.password !== adminForm.confirmPassword) {
      setAdminError('Passwords do not match')
      return
    }
    if (adminForm.password.length < 6) {
      setAdminError('Password must be at least 6 characters')
      return
    }

    setAdminLoading(true)
    try {
      const token = localStorage.getItem('token')
      const isSuperAdmin = currentUserRole === 'SuperAdmin'

      const url  = isSuperAdmin
        ? 'http://localhost:5000/api/superadmin/admins'
        : 'http://localhost:5000/api/auth/signup'

      const body = isSuperAdmin
        ? {
            fullName:    adminForm.fullName,
            email:       adminForm.email,
            phoneNumber: adminForm.phoneNumber,
            password:    adminForm.password,
          }
        : {
            fullName:     adminForm.fullName,
            email:        adminForm.email,
            phoneNumber:  adminForm.phoneNumber,
            password:     adminForm.password,
            faculty:      'Admin',
            role:         'Admin',
            captchaToken: 'admin-bypass',
          }

      const headers = { 'Content-Type': 'application/json' }
      if (isSuperAdmin) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(url, {
        method: 'POST', headers, body: JSON.stringify(body)
      })
      const data = await response.json()

      if (!response.ok) {
        setAdminError(data.message || 'Failed to create admin')
      } else {
        setAdminSuccess('Admin created successfully!')
        fetchUsers()
        setAdminForm({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' })
        setTimeout(() => { setIsCreateAdminOpen(false); setAdminSuccess('') }, 1500)
      }
    } catch (err) {
      setAdminError('Network error. Is the server running?')
    } finally {
      setAdminLoading(false)
    }
  }

  // ── Create SuperAdmin ──
  const handleSuperAdminFormChange = (e) => {
    setSuperAdminForm({ ...superAdminForm, [e.target.name]: e.target.value })
    setSuperAdminError('')
  }

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault()
    setSuperAdminError('')
    setSuperAdminSuccess('')

    if (superAdminForm.password !== superAdminForm.confirmPassword) {
      setSuperAdminError('Passwords do not match')
      return
    }
    if (superAdminForm.password.length < 6) {
      setSuperAdminError('Password must be at least 6 characters')
      return
    }
    if (!superAdminForm.secretKey) {
      setSuperAdminError('Secret key is required')
      return
    }

    setSuperAdminLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/create-superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:    superAdminForm.fullName,
          email:       superAdminForm.email,
          phoneNumber: superAdminForm.phoneNumber,
          password:    superAdminForm.password,
          secretKey:   superAdminForm.secretKey,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.message === 'A SuperAdmin already exists') {
          setSuperAdminError('A SuperAdmin already exists. Only one SuperAdmin is allowed.')
        } else {
          setSuperAdminError(data.message || 'Failed to create SuperAdmin')
        }
      } else {
        setSuperAdminSuccess('SuperAdmin created successfully!')
        fetchUsers()
        setSuperAdminForm({
          fullName: '', email: '', phoneNumber: '',
          password: '', confirmPassword: '', secretKey: ''
        })
        setTimeout(() => {
          setIsCreateSuperAdminOpen(false)
          setSuperAdminSuccess('')
        }, 1500)
      }
    } catch (err) {
      setSuperAdminError('Network error. Is the server running?')
    } finally {
      setSuperAdminLoading(false)
    }
  }

  // ✅ Create Student
  const handleStudentFormChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    setStudentError('');
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setStudentError('');
    setStudentSuccess('');

    if (studentForm.password !== studentForm.confirmPassword) {
      setStudentError('Passwords do not match');
      return;
    }
    if (studentForm.password.length < 6) {
      setStudentError('Password must be at least 6 characters');
      return;
    }
    if (!studentForm.faculty) {
      setStudentError('Please select a faculty');
      return;
    }

    setStudentLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:     studentForm.fullName,
          email:        studentForm.email,
          phoneNumber:  studentForm.phoneNumber,
          faculty:      studentForm.faculty,
          password:     studentForm.password,
          role:         'Student',
          captchaToken: 'admin-bypass',
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStudentError(data.message || 'Failed to create student');
      } else {
        setStudentSuccess('Student created successfully!');
        fetchUsers();
        setStudentForm({ fullName: '', email: '', phoneNumber: '', faculty: '', password: '', confirmPassword: '' });
        setTimeout(() => { setIsCreateStudentOpen(false); setStudentSuccess(''); }, 1500);
      }
    } catch (err) {
      setStudentError('Network error. Is the server running?');
    } finally {
      setStudentLoading(false);
    }
  };

  // Filter
  const filteredUsers = users
    .filter(u => roleFilter === 'All' ? true : u.role === roleFilter)
    .filter(u =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const adminCount      = users.filter(u => u.role === 'Admin').length
  const studentCount    = users.filter(u => u.role === 'Student').length
  const superAdminCount = users.filter(u => u.role === 'SuperAdmin').length

  const filterTabs = [
    { label: 'All',     count: users.length,  color: '#1A237E', bg: '#E8EAF6' },
    { label: 'Student', count: studentCount,  color: '#1565C0', bg: '#E3F2FD' },
    { label: 'Admin',   count: adminCount,    color: '#4527A0', bg: '#EDE7F6' },
  ]

  const roleBadge = (role) => {
    const map = {
      Admin:   { bg: '#EDE7F6', color: '#4527A0' },
      Student: { bg: '#E3F2FD', color: '#1565C0' },
    }
    const s = map[role] ?? { bg: '#F5F5F5', color: '#546E7A' }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold"
        style={{ background: s.bg, color: s.color }}>
        {role}
      </span>
    )
  }

  // ✅ Check if current filtered view is Student tab
  const isStudentTab = roleFilter === 'Student';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="ml-56 flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              User Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage all registered users and roles across the platform.
            </p>
          </div>

          <div className="flex gap-2">

            {/* ✅ Create Student button — only on Student tab */}
            {isStudentTab && (
              <button
                onClick={() => { setIsCreateStudentOpen(true); setStudentError(''); setStudentSuccess(''); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
                style={{ background: '#1565C0' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1976D2'}
                onMouseLeave={e => e.currentTarget.style.background = '#1565C0'}
              >
                + Create Student
              </button>
            )}

            {/* ✅ Create Admin — only on Admin tab, for Admin/SuperAdmin roles */}
            {!isStudentTab && roleFilter === 'Admin' &&
              (currentUserRole === 'Admin' || currentUserRole === 'SuperAdmin') && (
              <button
                onClick={() => { setIsCreateAdminOpen(true); setAdminError(''); setAdminSuccess('') }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
                style={{ background: '#1A237E' }}
                onMouseEnter={e => e.currentTarget.style.background = '#3949AB'}
                onMouseLeave={e => e.currentTarget.style.background = '#1A237E'}
              >
                + Create Admin
              </button>
            )}

          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filterTabs.map(({ label, count, color, bg }) => (
            <button
              key={label}
              onClick={() => setRoleFilter(label)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                background: roleFilter === label ? bg    : '#FFFFFF',
                color:      roleFilter === label ? color : '#90A4AE',
                border:     `1.5px solid ${roleFilter === label ? color : '#E0E0E0'}`,
                fontWeight: roleFilter === label ? 700 : 500,
              }}
            >
              {label}
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: roleFilter === label ? color  : '#F5F5F5',
                  color:      roleFilter === label ? '#fff' : '#90A4AE',
                }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact Details</th>
                  {/* ✅ Faculty column only on Student tab */}
                  {isStudentTab && <th className="px-6 py-4">Faculty</th>}
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt="profile"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{user.fullName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{user.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{user.phoneNumber}</p>
                    </td>
                    {/* ✅ Faculty value only on Student tab */}
                    {isStudentTab && (
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ background: '#E3F2FD', color: '#1565C0' }}
                        >
                          {user.faculty || '—'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center py-16 gap-3">
                <span className="text-5xl">👥</span>
                <p className="font-semibold text-slate-500">
                  No {roleFilter === 'All' ? '' : roleFilter} users found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CREATE STUDENT MODAL ── */}
      {isCreateStudentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setIsCreateStudentOpen(false); }}
        >
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1.5px solid #BBDEFB' }}>

            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: '#1565C0' }}>
              <div>
                <h2 className="text-lg font-bold text-white">Create Student</h2>
                <p className="text-xs mt-0.5" style={{ color: '#90CAF9' }}>
                  New student account will be registered
                </p>
              </div>
              <button onClick={() => setIsCreateStudentOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}>✕</button>
            </div>

            <form onSubmit={handleCreateStudent} className="px-6 py-5 flex flex-col gap-4">
              {studentError && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A' }}>
                  {studentError}
                </div>
              )}
              {studentSuccess && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                  {studentSuccess}
                </div>
              )}

              {[
                { label: 'Full Name',    name: 'fullName',    type: 'text',  placeholder: 'John Doe' },
                { label: 'Email',        name: 'email',       type: 'email', placeholder: 'student@example.com' },
                { label: 'Phone Number', name: 'phoneNumber', type: 'text',  placeholder: '+1 234 567 8900' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                    {label}
                  </label>
                  <input type={type} name={name} required placeholder={placeholder}
                    value={studentForm[name]} onChange={handleStudentFormChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                    style={{ background: '#F0F7FF', border: '1.5px solid #BBDEFB', color: '#37474F' }}
                    onFocus={e => e.target.style.border = '1.5px solid #1565C0'}
                    onBlur={e  => e.target.style.border = '1.5px solid #BBDEFB'}
                  />
                </div>
              ))}

              {/* Faculty Dropdown */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                  Faculty <span style={{ color: '#E53935' }}>*</span>
                </label>
                <select
                  name="faculty" required value={studentForm.faculty} onChange={handleStudentFormChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                  style={{ background: '#F0F7FF', border: '1.5px solid #BBDEFB', color: '#37474F' }}
                  onFocus={e => e.target.style.border = '1.5px solid #1565C0'}
                  onBlur={e  => e.target.style.border = '1.5px solid #BBDEFB'}
                >
                  <option value="">Select a faculty</option>
{faculties.length === 0 && (
  <option disabled value="">No faculties available</option>
)}
{faculties.map(f => (
  <option key={f._id} value={f._id}>{f.name}</option>
))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Password', name: 'password' },
                  { label: 'Confirm',  name: 'confirmPassword' },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                      {label}
                    </label>
                    <input type="password" name={name} required placeholder="••••••••"
                      value={studentForm[name]} onChange={handleStudentFormChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                      style={{ background: '#F0F7FF', border: '1.5px solid #BBDEFB', color: '#37474F' }}
                      onFocus={e => e.target.style.border = '1.5px solid #1565C0'}
                      onBlur={e  => e.target.style.border = '1.5px solid #BBDEFB'}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{ background: '#E3F2FD', border: '1px solid #BBDEFB', color: '#1565C0' }}>
                <span className="mt-0.5">🎓</span>
                <span>This account will be created with the <strong>Student</strong> role and assigned to the selected faculty.</span>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsCreateStudentOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                  style={{ background: '#F5F5F5', border: '1.5px solid #E0E0E0', color: '#546E7A' }}>
                  Cancel
                </button>
                <button type="submit" disabled={studentLoading}
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl"
                  style={{ background: studentLoading ? '#64B5F6' : '#1565C0', cursor: studentLoading ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (!studentLoading) e.currentTarget.style.background = '#1976D2'; }}
                  onMouseLeave={e => { if (!studentLoading) e.currentTarget.style.background = '#1565C0'; }}>
                  {studentLoading ? 'Creating...' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE ADMIN MODAL ── */}
      {isCreateAdminOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setIsCreateAdminOpen(false) }}
        >
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1.5px solid #C5CAE9' }}>

            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: '#1A237E' }}>
              <div>
                <h2 className="text-lg font-bold text-white">Create Admin</h2>
                <p className="text-xs mt-0.5" style={{ color: '#9FA8DA' }}>
                  New admin will have full system access
                </p>
              </div>
              <button onClick={() => setIsCreateAdminOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}>✕</button>
            </div>

            <form onSubmit={handleCreateAdmin} className="px-6 py-5 flex flex-col gap-4">
              {adminError && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A' }}>
                  {adminError}
                </div>
              )}
              {adminSuccess && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                  {adminSuccess}
                </div>
              )}

              {[
                { label: 'Full Name',     name: 'fullName',    type: 'text',  placeholder: 'John Doe' },
                { label: 'Email',         name: 'email',       type: 'email', placeholder: 'admin@example.com' },
                { label: 'Phone Number',  name: 'phoneNumber', type: 'text',  placeholder: '+1 234 567 8900' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                    {label}
                  </label>
                  <input type={type} name={name} required placeholder={placeholder}
                    value={adminForm[name]} onChange={handleAdminFormChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                    style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9', color: '#37474F' }}
                    onFocus={e => e.target.style.border = '1.5px solid #3949AB'}
                    onBlur={e => e.target.style.border = '1.5px solid #C5CAE9'}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Password', name: 'password' },
                  { label: 'Confirm',  name: 'confirmPassword' },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                      {label}
                    </label>
                    <input type="password" name={name} required placeholder="••••••••"
                      value={adminForm[name]} onChange={handleAdminFormChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                      style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9', color: '#37474F' }}
                      onFocus={e => e.target.style.border = '1.5px solid #3949AB'}
                      onBlur={e => e.target.style.border = '1.5px solid #C5CAE9'}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{ background: '#FFF8E1', border: '1px solid #FFCC80', color: '#E65100' }}>
                <span className="mt-0.5">⚠️</span>
                <span>This account will have full Admin access including user management, module control, and system settings.</span>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsCreateAdminOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                  style={{ background: '#F5F5F5', border: '1.5px solid #E0E0E0', color: '#546E7A' }}>
                  Cancel
                </button>
                <button type="submit" disabled={adminLoading}
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl"
                  style={{ background: adminLoading ? '#7986CB' : '#1A237E', cursor: adminLoading ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (!adminLoading) e.currentTarget.style.background = '#3949AB' }}
                  onMouseLeave={e => { if (!adminLoading) e.currentTarget.style.background = '#1A237E' }}>
                  {adminLoading ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE SUPERADMIN MODAL (unchanged) ── */}
      {isCreateSuperAdminOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setIsCreateSuperAdminOpen(false) }}
        >
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1.5px solid #FFCDD2' }}>

            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: '#B71C1C' }}>
              <div>
                <h2 className="text-lg font-bold text-white">Create SuperAdmin</h2>
                <p className="text-xs mt-0.5" style={{ color: '#FFCDD2' }}>
                  Highest privilege — handle with care
                </p>
              </div>
              <button onClick={() => setIsCreateSuperAdminOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}>✕</button>
            </div>

            <form onSubmit={handleCreateSuperAdmin} className="px-6 py-5 flex flex-col gap-4">
              {superAdminError && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A' }}>
                  {superAdminError}
                </div>
              )}
              {superAdminSuccess && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                  {superAdminSuccess}
                </div>
              )}

              {[
                { label: 'Full Name',    name: 'fullName',    type: 'text',  placeholder: 'John Doe' },
                { label: 'Email',        name: 'email',       type: 'email', placeholder: 'super@example.com' },
                { label: 'Phone Number', name: 'phoneNumber', type: 'text',  placeholder: '+1 234 567 8900' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                    {label}
                  </label>
                  <input type={type} name={name} required placeholder={placeholder}
                    value={superAdminForm[name]} onChange={handleSuperAdminFormChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                    style={{ background: '#FFF8F8', border: '1.5px solid #FFCDD2', color: '#37474F' }}
                    onFocus={e => e.target.style.border = '1.5px solid #B71C1C'}
                    onBlur={e => e.target.style.border = '1.5px solid #FFCDD2'}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Password', name: 'password' },
                  { label: 'Confirm',  name: 'confirmPassword' },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                      {label}
                    </label>
                    <input type="password" name={name} required placeholder="••••••••"
                      value={superAdminForm[name]} onChange={handleSuperAdminFormChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                      style={{ background: '#FFF8F8', border: '1.5px solid #FFCDD2', color: '#37474F' }}
                      onFocus={e => e.target.style.border = '1.5px solid #B71C1C'}
                      onBlur={e => e.target.style.border = '1.5px solid #FFCDD2'}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#B71C1C' }}>
                  🔑 Secret Key
                </label>
                <input type="password" name="secretKey" required placeholder="Enter server secret key"
                  value={superAdminForm.secretKey} onChange={handleSuperAdminFormChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                  style={{ background: '#FFF8F8', border: '1.5px solid #EF9A9A', color: '#37474F' }}
                  onFocus={e => e.target.style.border = '1.5px solid #B71C1C'}
                  onBlur={e => e.target.style.border = '1.5px solid #EF9A9A'}
                />
                <p className="text-xs mt-1 ml-1" style={{ color: '#E57373' }}>
                  Must match SUPERADMIN_SECRET in server .env
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#B71C1C' }}>
                <span className="mt-0.5">🚨</span>
                <span>SuperAdmin has unrestricted access to the entire system including creating/deleting other admins. Only one SuperAdmin can exist.</span>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsCreateSuperAdminOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                  style={{ background: '#F5F5F5', border: '1.5px solid #E0E0E0', color: '#546E7A' }}>
                  Cancel
                </button>
                <button type="submit" disabled={superAdminLoading}
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl"
                  style={{ background: superAdminLoading ? '#EF9A9A' : '#B71C1C', cursor: superAdminLoading ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (!superAdminLoading) e.currentTarget.style.background = '#D32F2F' }}
                  onMouseLeave={e => { if (!superAdminLoading) e.currentTarget.style.background = '#B71C1C' }}>
                  {superAdminLoading ? 'Creating...' : 'Create SuperAdmin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default User;