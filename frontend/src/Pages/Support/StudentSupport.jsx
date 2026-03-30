import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../../Components/NavBar/NavBar.jsx'


const API  = 'http://localhost:5000/api/lecturers'
const BASE = 'http://localhost:5000'

const supportEmail = 'adminsupport@yourdomain.com'
const phone1 = '+94 71 123 4567'
const phone2 = '+94 77 987 6543'

export default function LecturerStudent() {
  const [lecturers, setLecturers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    axios.get(API)
      .then(({ data }) => setLecturers(data.data ?? []))
      .catch(() => toast.error('Failed to load lecturers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = lecturers.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F0F4F8' }}>
     <Navbar />

      <div className="p-8">

        {/* ── SUPPORT SECTION ── */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#3949AB' }}>
            Help Center
          </p>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#1A237E' }}>Support</h1>
          <p className="text-sm mb-6" style={{ color: '#78909C' }}>
            We're here to help you with any questions or issues
          </p>

          <div className="bg-white rounded-2xl p-6" style={{ border: '1.5px solid #C5CAE9' }}>
            <p className="text-sm text-gray-600 mb-6">
              For any administrative issues, assistance, or inquiries, please contact us:
            </p>

            <div className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F0F4F8', border: '1px solid #E8EAF6' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#E8EAF6' }}>
                  📧
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#78909C' }}>Email</p>
                  <a href={`mailto:${supportEmail}`} className="text-sm font-semibold hover:underline" style={{ color: '#3949AB' }}>
                    {supportEmail}
                  </a>
                </div>
              </div>

              {/* Phone 1 */}
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F0F4F8', border: '1px solid #E8EAF6' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#E8EAF6' }}>
                  📞
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#78909C' }}>Phone 1</p>
                  <a href={`tel:${phone1}`} className="text-sm font-semibold hover:underline" style={{ color: '#3949AB' }}>
                    {phone1}
                  </a>
                </div>
              </div>

              {/* Phone 2 */}
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F0F4F8', border: '1px solid #E8EAF6' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#E8EAF6' }}>
                  📞
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#78909C' }}>Phone 2</p>
                  <a href={`tel:${phone2}`} className="text-sm font-semibold hover:underline" style={{ color: '#3949AB' }}>
                    {phone2}
                  </a>
                </div>
              </div>

            </div>

            {/* Hours note */}
            <div className="mt-6 flex items-center gap-2 p-3 rounded-xl" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
              <span>🕐</span>
              <p className="text-xs font-medium" style={{ color: '#F57F17' }}>
                Our support team is available Monday to Friday, 9am to 5pm.
              </p>
            </div>
          </div>
        </div>

        {/* ── LECTURERS SECTION ── */}
        <div>

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#3949AB' }}>
                Our Team
              </p>
              <h2 className="text-3xl font-bold" style={{ color: '#1A237E' }}>Lecturers</h2>
              <p className="text-sm mt-1" style={{ color: '#78909C' }}>
                Meet the people behind your courses
              </p>
            </div>
            {lecturers.length > 0 && (
              <div
                className="flex flex-col items-center justify-center rounded-xl px-5 py-3"
                style={{ background: '#E8EAF6', minWidth: '100px' }}
              >
                <span className="text-2xl font-bold" style={{ color: '#3949AB' }}>{lecturers.length}</span>
                <span className="text-xs mt-1" style={{ color: '#7986CB' }}>lecturers</span>
              </div>
            )}
          </div>

          {/* Search */}
          {lecturers.length > 0 && (
            <div className="mb-6">
              <input
                className="w-full max-w-xs px-4 py-2.5 text-sm rounded-xl focus:outline-none"
                style={{ background: '#FFFFFF', border: '1px solid #C5CAE9', color: '#37474F' }}
                placeholder="Search lecturers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3 text-sm" style={{ color: '#90A4AE' }}>
              <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              Loading lecturers...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-32 gap-4 text-center">
              <span className="text-7xl">👨‍🏫</span>
              <p className="text-xl font-bold mt-2" style={{ color: '#546E7A' }}>No lecturers found</p>
              <p className="text-sm" style={{ color: '#90A4AE' }}>Try a different search keyword</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map(l => (
                <div
                  key={l._id}
                  className="rounded-2xl p-5 flex flex-col items-center text-center transition-all"
                  style={{ background: '#FFFFFF', border: '1.5px solid #C5CAE9' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1.5px solid #7986CB'
                    e.currentTarget.style.background = '#FAFBFF'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(57,73,171,0.10)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1.5px solid #C5CAE9'
                    e.currentTarget.style.background = '#FFFFFF'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Avatar */}
                  {l.image ? (
                    <img
                      src={`${BASE}${l.image}`}
                      alt={l.name}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                      style={{ border: '3px solid #E8EAF6' }}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3"
                      style={{ background: '#E8EAF6', color: '#3949AB', border: '3px solid #C5CAE9' }}
                    >
                      {l.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Name */}
                  <p className="font-bold text-base" style={{ color: '#1A237E' }}>{l.name}</p>

                  {/* Email */}
                  <a
                    href={`mailto:${l.email}`}
                    className="text-xs mt-1 truncate max-w-full hover:underline"
                    style={{ color: '#7986CB' }}
                  >
                    {l.email}
                  </a>

                  {/* Badge */}
                  <span
                    className="mt-3 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: '#E8EAF6', color: '#3949AB' }}
                  >
                    Lecturer
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}