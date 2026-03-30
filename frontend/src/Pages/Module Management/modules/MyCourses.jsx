import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../../Components/NavBar/NavBar.jsx'
import toast from 'react-hot-toast'

export default function MyCourses() {
  const [saved,   setSaved]   = useState([])
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)

  // Get JWT token from localStorage (set during login)
  const token = localStorage.getItem('token')
  const authHeader = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('http://localhost:5000/api/saved-modules', {
          headers: authHeader,
        })
        setSaved(data.data ?? [])
      } catch (err) {
        toast.error('Failed to load saved courses')
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [])

  const handleRemove = async (moduleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/saved-modules/${moduleId}`, {
        headers: authHeader,
      })
      setSaved(prev => prev.filter(m => m._id !== moduleId))
      toast.success('Removed from My Courses')
    } catch {
      toast.error('Failed to remove module')
    }
  }

  const filtered = saved.filter(m =>
    m.moduleName?.toLowerCase().includes(search.toLowerCase()) ||
    m.moduleNumber?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F0F4F8' }}>
      <Navbar />

      <div className="p-8">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: '#3949AB' }}>
              My Learning
            </p>
            <h1 className="text-3xl font-bold" style={{ color: '#1A237E' }}>
              My Courses
            </h1>
            <p className="text-sm mt-1" style={{ color: '#78909C' }}>
              All modules you've saved for quick access
            </p>
          </div>

          {saved.length > 0 && (
            <div
              className="flex flex-col items-center justify-center rounded-xl px-5 py-3"
              style={{ background: '#E8EAF6', minWidth: '100px' }}
            >
              <span className="text-2xl font-bold" style={{ color: '#3949AB' }}>
                {saved.length}
              </span>
              <span className="text-xs mt-1" style={{ color: '#7986CB' }}>saved</span>
            </div>
          )}
        </div>

        {/* SEARCH */}
        {saved.length > 0 && (
          <div className="mb-6">
            <input
              className="w-full max-w-xs px-4 py-2.5 text-sm rounded-xl focus:outline-none"
              style={{
                background: '#FFFFFF',
                border: '1px solid #C5CAE9',
                color: '#37474F',
              }}
              placeholder="Search saved courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-sm" style={{ color: '#90A4AE' }}>
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            Loading your courses...
          </div>
        ) : saved.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center py-32 gap-4 text-center">
            <span className="text-7xl">🔖</span>
            <p className="text-xl font-bold mt-2" style={{ color: '#546E7A' }}>
              No saved courses yet
            </p>
            <p className="text-sm" style={{ color: '#90A4AE' }}>
              Browse modules and click the bookmark icon to save them here
            </p>
            <Link
              to="/student/faculties"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white"
              style={{ background: '#3949AB' }}
            >
              Browse Modules →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <span className="text-6xl">🔍</span>
            <p className="font-semibold mt-2" style={{ color: '#546E7A' }}>
              No courses match your search
            </p>
            <p className="text-sm" style={{ color: '#90A4AE' }}>Try a different keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((m) => {
              const savedDate = m.savedAt
                ? new Date(m.savedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })
                : null

              return (
                <Link
                  key={m._id}
                  to={`/student/faculties/${m.facultyId}/semesters/${m.semesterId}/modules/${m._id}/lessons`}
                  className="rounded-2xl p-5 flex items-center justify-between gap-4 transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #C5CAE9',
                    textDecoration: 'none',
                    display: 'flex',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1.5px solid #7986CB'
                    e.currentTarget.style.background = '#FAFBFF'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1.5px solid #C5CAE9'
                    e.currentTarget.style.background = '#FFFFFF'
                  }}
                >
                  {/* Left — icon + info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: '#E8EAF6' }}
                    >
                      📘
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background: '#FFF8E1', color: '#F57F17' }}
                        >
                          {m.moduleNumber}
                        </span>
                        {savedDate && (
                          <span className="text-xs" style={{ color: '#B0BEC5' }}>
                            Saved {savedDate}
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-base leading-snug" style={{ color: '#1A237E' }}>
                        {m.moduleName}
                      </p>

                      {m.description && (
                        <p
                          className="text-sm mt-0.5 truncate"
                          style={{ color: '#78909C', maxWidth: '500px' }}
                        >
                          {m.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right — remove button */}
                  <button
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemove(m._id)
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-lg flex-shrink-0 transition-all"
                    style={{
                      background: '#FFF3E0',
                      border: '1.5px solid #FFCC80',
                      color: '#E65100',
                    }}
                    onMouseEnter={e => {
                      e.stopPropagation()
                      e.currentTarget.style.background = '#FFE0B2'
                    }}
                    onMouseLeave={e => {
                      e.stopPropagation()
                      e.currentTarget.style.background = '#FFF3E0'
                    }}
                    title="Remove from My Courses"
                  >
                    🗑
                  </button>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}