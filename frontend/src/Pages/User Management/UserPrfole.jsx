import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../../Components/NavBar/NavBar';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    faculty: '',
    profileImage: ''
  });

  const [isLoading, setIsLoading]   = useState(true);
  const [isEditing, setIsEditing]   = useState(false);
  const [message,   setMessage]     = useState({ text: '', type: '' });
  const [facultyName, setFacultyName] = useState('');

  const navigate = useNavigate();
  const userId      = localStorage.getItem('userId');
  const userFaculty = localStorage.getItem('userFaculty')?.trim() ?? '';

  // ── Fetch profile + faculty name on mount ─────────────────────────────
  useEffect(() => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      localStorage.clear();
      navigate('/login');
      return;
    }
    fetchUserProfile();
    if (userFaculty) fetchFacultyName(userFaculty);
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res  = await fetch(`http://localhost:5000/api/auth/users/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setFormData({
          fullName:     data.fullName     || '',
          email:        data.email        || '',
          phoneNumber:  data.phoneNumber  || '',
          faculty:      data.faculty      || '',
          profileImage: (data.profileImage && data.profileImage !== 'undefined')
                          ? data.profileImage : ''
        });
      } else {
        setMessage({ text: 'Failed to load user data.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Server connection error.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacultyName = async (facultyId) => {
    try {
      const res  = await fetch(`http://localhost:5000/api/faculties/${facultyId}`);
      const data = await res.json();
      if (res.ok) setFacultyName(data.name ?? data.data?.name ?? '');
    } catch {
      setFacultyName('');
    }
  };

  // ── Editable fields only ───────────────────────────────────────────────
  const [editData, setEditData] = useState({ fullName: '', phoneNumber: '', profileImage: '' });

  const startEdit = () => {
    setEditData({
      fullName:     formData.fullName,
      phoneNumber:  formData.phoneNumber,
      profileImage: formData.profileImage
    });
    setMessage({ text: '', type: '' });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setMessage({ text: '', type: '' });
  };

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setEditData({ ...editData, profileImage: reader.result });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Saving changes...', type: 'loading' });
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          fullName:     editData.fullName,
          phoneNumber:  editData.phoneNumber,
          profileImage: editData.profileImage
        })
      });
      if (res.ok) {
        setFormData(prev => ({ ...prev, ...editData }));
        if (editData.profileImage) localStorage.setItem('profileImage', editData.profileImage);
        localStorage.setItem('userName', editData.fullName);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => { setIsEditing(false); setMessage({ text: '', type: '' }); }, 1500);
      } else {
        const err = await res.json();
        setMessage({ text: err.message || 'Failed to update profile', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Network error occurred.', type: 'error' });
    }
  };

  const displayImage = () => {
    const img = isEditing ? editData.profileImage : formData.profileImage;
    if (img && img !== '') return img;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'User')}&background=3949AB&color=fff&size=150`;
  };

  // ── Loading ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#F0F4F8' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
          style={{ borderColor: '#E8EAF6', borderTopColor: '#3949AB' }} />
        <p className="font-bold" style={{ color: '#3949AB' }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F0F4F8' }}>
      <StudentNavbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="rounded-3xl overflow-hidden" style={{ background: '#FFFFFF', border: '1.5px solid #C5CAE9' }}>

          {/* Banner */}
          <div className="h-36 w-full"
            style={{ background: 'linear-gradient(135deg, #1A237E 0%, #3949AB 50%, #7986CB 100%)' }} />

          <div className="px-8 pb-10 pt-0">

            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <img
                  src={displayImage()}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                  style={{ border: '4px solid #FFFFFF', boxShadow: '0 4px 24px rgba(57,73,171,0.18)' }}
                />
                {/* Camera button only visible in edit mode */}
                {isEditing && (
                  <label className="absolute bottom-1 right-1 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer"
                    style={{ background: '#3949AB', border: '2px solid #FFFFFF' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Name + subtitle */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold" style={{ color: '#1A237E' }}>
                {formData.fullName || 'LearnBuddy User'}
              </h1>
              <p className="text-sm mt-1" style={{ color: '#90A4AE' }}>
                {isEditing ? 'Edit your personal information' : 'Your personal information'}
              </p>
            </div>

            {/* Alert */}
            {message.text && (
              <div className="mb-6 p-4 rounded-xl text-sm text-center font-semibold"
                style={{
                  background: message.type === 'success' ? '#E8F5E9' : message.type === 'loading' ? '#E8EAF6' : '#FFEBEE',
                  color:      message.type === 'success' ? '#2E7D32' : message.type === 'loading' ? '#3949AB'  : '#C62828',
                  border: `1px solid ${message.type === 'success' ? '#A5D6A7' : message.type === 'loading' ? '#C5CAE9' : '#EF9A9A'}`
                }}>
                {message.text}
              </div>
            )}

            {/* ── VIEW MODE ──────────────────────────────────────────── */}
            {!isEditing && (
              <>
                <div className="flex flex-col gap-4 mb-8">
                  {[
                    { label: 'Full Name',     value: formData.fullName,    icon: '👤' },
                    { label: 'Email Address', value: formData.email,        icon: '✉️',  locked: true },
                    { label: 'Phone Number',  value: formData.phoneNumber,  icon: '📞' },
                    { label: 'Faculty',       value: facultyName || '—',    icon: '🏛',  locked: true },
                  ].map(({ label, value, icon, locked }) => (
                    <div key={label} className="flex items-center gap-4 px-5 py-4 rounded-2xl"
                      style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9' }}>
                      <span className="text-xl w-8 text-center">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold mb-0.5" style={{ color: '#90A4AE' }}>{label}</p>
                        <p className="text-sm font-semibold truncate" style={{ color: '#37474F' }}>{value || '—'}</p>
                      </div>
                      {locked && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ background: '#EDE7F6', color: '#5E35B1' }}>
                          🔒 Fixed
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Edit button */}
                <button onClick={startEdit}
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
                  style={{ background: '#3949AB' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1A237E'}
                  onMouseLeave={e => e.currentTarget.style.background = '#3949AB'}>
                  ✏️ Edit Profile
                </button>
              </>
            )}

            {/* ── EDIT MODE ──────────────────────────────────────────── */}
            {isEditing && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Full Name — editable */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#546E7A' }}>
                    Full Name
                  </label>
                  <input type="text" name="fullName" value={editData.fullName} onChange={handleChange} required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                    style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9', color: '#37474F' }}
                    onFocus={e => e.target.style.border = '1.5px solid #3949AB'}
                    onBlur={e  => e.target.style.border = '1.5px solid #C5CAE9'} />
                </div>

                {/* Email — read only */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1 flex items-center gap-1" style={{ color: '#546E7A' }}>
                    Email Address <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-1" style={{ background: '#EDE7F6', color: '#5E35B1' }}>🔒 Fixed</span>
                  </label>
                  <input type="email" value={formData.email} readOnly
                    className="w-full px-4 py-3 text-sm rounded-xl outline-none cursor-not-allowed"
                    style={{ background: '#F0F0F0', border: '1.5px solid #E0E0E0', color: '#9E9E9E' }} />
                </div>

                {/* Phone — editable */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#546E7A' }}>
                    Phone Number
                  </label>
                  <input type="text" name="phoneNumber" value={editData.phoneNumber} onChange={handleChange} required
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                    style={{ background: '#F8F9FF', border: '1.5px solid #C5CAE9', color: '#37474F' }}
                    onFocus={e => e.target.style.border = '1.5px solid #3949AB'}
                    onBlur={e  => e.target.style.border = '1.5px solid #C5CAE9'} />
                </div>

                {/* Faculty — read only */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 ml-1 flex items-center gap-1" style={{ color: '#546E7A' }}>
                    Faculty <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-1" style={{ background: '#EDE7F6', color: '#5E35B1' }}>🔒 Fixed</span>
                  </label>
                  <input type="text" value={facultyName || '—'} readOnly
                    className="w-full px-4 py-3 text-sm rounded-xl outline-none cursor-not-allowed"
                    style={{ background: '#F0F0F0', border: '1.5px solid #E0E0E0', color: '#9E9E9E' }} />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={cancelEdit}
                    className="flex-1 py-3.5 px-6 rounded-xl text-sm font-bold transition-all"
                    style={{ background: '#F5F5F5', color: '#546E7A', border: '1.5px solid #C5CAE9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ECEFF1'}
                    onMouseLeave={e => e.currentTarget.style.background = '#F5F5F5'}>
                    Cancel
                  </button>
                  <button type="submit" disabled={message.type === 'loading'}
                    className="flex-1 py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: message.type === 'loading' ? '#7986CB' : '#3949AB', cursor: message.type === 'loading' ? 'not-allowed' : 'pointer' }}
                    onMouseEnter={e => { if (message.type !== 'loading') e.currentTarget.style.background = '#1A237E' }}
                    onMouseLeave={e => { if (message.type !== 'loading') e.currentTarget.style.background = '#3949AB' }}>
                    {message.type === 'loading' ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;