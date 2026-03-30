import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/ModuleManagement/Sidebar';

const EmployeePage = () => {
  const [employees, setEmployees]               = useState([]);
  const [isLoading, setIsLoading]               = useState(true);
  const [searchQuery, setSearchQuery]           = useState('');
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    fullName: '', email: '', phoneNumber: '', faculty: '', password: '', confirmPassword: ''
  });
  const [employeeError,   setEmployeeError]   = useState('');
  const [employeeSuccess, setEmployeeSuccess] = useState('');
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const faculties = [
    'Faculty of Engineering',
    'Faculty of Business',
    'Faculty of Science',
    'Faculty of Arts',
    'Faculty of Medicine',
    'N/A',
  ];

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users');
      const data     = await response.json();
      setEmployees(data.filter(u => u.role === 'Employee'));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token    = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) setEmployees(employees.filter(e => e._id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleFormChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
    setEmployeeError('');
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setEmployeeError('');
    setEmployeeSuccess('');

    if (employeeForm.password !== employeeForm.confirmPassword) {
      setEmployeeError('Passwords do not match');
      return;
    }
    if (employeeForm.password.length < 6) {
      setEmployeeError('Password must be at least 6 characters');
      return;
    }

    setEmployeeLoading(true);
    try {
      const token    = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/superadmin/employees', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName:    employeeForm.fullName,
          email:       employeeForm.email,
          phoneNumber: employeeForm.phoneNumber,
          faculty:     employeeForm.faculty || 'N/A',
          password:    employeeForm.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setEmployeeError(data.message || 'Failed to create employee');
      } else {
        setEmployeeSuccess('Employee created successfully!');
        fetchEmployees();
        setEmployeeForm({ fullName: '', email: '', phoneNumber: '', faculty: '', password: '', confirmPassword: '' });
        setTimeout(() => { setIsCreateEmployeeOpen(false); setEmployeeSuccess(''); }, 1500);
      }
    } catch (err) {
      setEmployeeError('Network error. Is the server running?');
    } finally {
      setEmployeeLoading(false);
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="ml-56 flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Employee Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage all employees across the platform.
            </p>
          </div>

          <button
            onClick={() => { setIsCreateEmployeeOpen(true); setEmployeeError(''); setEmployeeSuccess(''); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
            style={{ background: '#1A237E' }}
            onMouseEnter={e => e.currentTarget.style.background = '#3949AB'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A237E'}
          >
            + Create Employee
          </button>
        </div>

        {/* STATS CARD */}
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: '#E8EAF6', border: '1.5px solid #C5CAE9' }}
          >
            <span className="text-2xl">👷</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#7986CB' }}>Total Employees</p>
              <p className="text-2xl font-extrabold" style={{ color: '#1A237E' }}>{employees.length}</p>
            </div>
          </div>
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
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4">Faculty</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-400 text-sm font-semibold">
                      Loading employees...
                    </td>
                  </tr>
                ) : filteredEmployees.map(emp => (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {emp.profileImage ? (
                          <img src={emp.profileImage} alt="profile"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            {emp.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{emp.fullName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">ID: {emp._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{emp.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{emp.phoneNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{emp.faculty || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                        Employee
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(emp._id)}
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

            {!isLoading && filteredEmployees.length === 0 && (
              <div className="flex flex-col items-center py-16 gap-3">
                <span className="text-5xl">👷</span>
                <p className="font-semibold text-slate-500">No employees found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CREATE EMPLOYEE MODAL ── */}
      {isCreateEmployeeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setIsCreateEmployeeOpen(false); }}
        >
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1.5px solid #C5CAE9' }}>

            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: '#1A237E' }}>
              <div>
                <h2 className="text-lg font-bold text-white">Create Employee</h2>
                <p className="text-xs mt-0.5" style={{ color: '#9FA8DA' }}>
                  New employee account will be created
                </p>
              </div>
              <button onClick={() => setIsCreateEmployeeOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}>✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateEmployee} className="px-6 py-5 flex flex-col gap-4">

              {employeeError && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A' }}>
                  {employeeError}
                </div>
              )}
              {employeeSuccess && (
                <div className="p-3 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                  {employeeSuccess}
                </div>
              )}

              {/* Text Fields */}
              {[
                { label: 'Full Name',    name: 'fullName',    type: 'text',  placeholder: 'John Doe' },
                { label: 'Email',        name: 'email',       type: 'email', placeholder: 'employee@example.com' },
                { label: 'Phone Number', name: 'phoneNumber', type: 'text',  placeholder: '+1 234 567 8900' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                    {label}
                  </label>
                  <input
                    type={type} name={name} required placeholder={placeholder}
                    value={employeeForm[name]} onChange={handleFormChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                    style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9', color: '#37474F' }}
                    onFocus={e => e.target.style.border = '1.5px solid #3949AB'}
                    onBlur={e  => e.target.style.border = '1.5px solid #C5CAE9'}
                  />
                </div>
              ))}

              {/* Faculty Dropdown */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                  Faculty <span style={{ color: '#90A4AE', fontWeight: 400 }}>(optional)</span>
                </label>
                <select
                  name="faculty" value={employeeForm.faculty} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                  style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9', color: '#37474F' }}
                  onFocus={e => e.target.style.border = '1.5px solid #3949AB'}
                  onBlur={e  => e.target.style.border = '1.5px solid #C5CAE9'}
                >
                  <option value="">Select a faculty</option>
                  {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Password', name: 'password' },
                  { label: 'Confirm',  name: 'confirmPassword' },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#546E7A' }}>
                      {label}
                    </label>
                    <input
                      type="password" name={name} required placeholder="••••••••"
                      value={employeeForm[name]} onChange={handleFormChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                      style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9', color: '#37474F' }}
                      onFocus={e => e.target.style.border = '1.5px solid #3949AB'}
                      onBlur={e  => e.target.style.border = '1.5px solid #C5CAE9'}
                    />
                  </div>
                ))}
              </div>

              {/* Info Banner */}
              <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#2E7D32' }}>
                <span className="mt-0.5">👷</span>
                <span>This account will be created with the <strong>Employee</strong> role with standard access permissions.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsCreateEmployeeOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                  style={{ background: '#F5F5F5', border: '1.5px solid #E0E0E0', color: '#546E7A' }}>
                  Cancel
                </button>
                <button type="submit" disabled={employeeLoading}
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl"
                  style={{
                    background: employeeLoading ? '#7986CB' : '#1A237E',
                    cursor: employeeLoading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={e => { if (!employeeLoading) e.currentTarget.style.background = '#3949AB'; }}
                  onMouseLeave={e => { if (!employeeLoading) e.currentTarget.style.background = '#1A237E'; }}>
                  {employeeLoading ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;