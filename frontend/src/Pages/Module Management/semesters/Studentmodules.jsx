import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../../../Components/NavBar/NavBar.jsx'

export default function StudentModules() {
  const { facultyId, semesterId } = useParams()
  const [faculty,  setFaculty]  = useState(null)
  const [semester, setSemester] = useState(null)
  const [modules,  setModules]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [saved,    setSaved]    = useState([])

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:5000/api/faculties/${facultyId}`),
      axios.get(`http://localhost:5000/api/semesters/${semesterId}`),
      axios.get('http://localhost:5000/api/modules', { params: { semester: semesterId } }),
    ])
      .then(([{ data: fd }, { data: sd }, { data: md }]) => {
        setFaculty(fd.data ?? fd)
        setSemester(sd.data ?? sd)
        setModules(md.data ?? md)
      })
      .catch(() => toast.error('Failed to load modules'))
      .finally(() => setLoading(false))

    // Load saved modules from localStorage
    axios.get("http://localhost:5000/api/saved-modules", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
}).then(res => {
  setSaved(res.data.data)
})
  }, [facultyId, semesterId])

const toggleSave = async (module) => {
  try {
    const token = localStorage.getItem("token") // if you use auth

    const alreadySaved = saved.find(m => m._id === module._id)

    if (alreadySaved) {
      // DELETE
      await axios.delete(
        `http://localhost:5000/api/saved-modules/${module._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSaved(saved.filter(m => m._id !== module._id))
      toast.success("Removed from My Courses")

    } else {
      // POST
      await axios.post(
        "http://localhost:5000/api/saved-modules",
        { moduleId: module._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSaved([...saved, module])
      toast.success("Saved to My Courses")
    }

  } catch (err) {
    console.log(err)
    toast.error("Save failed")
  }
}

  const isSaved = (moduleId) => saved.some(m => m._id === moduleId)

  const filtered = modules.filter(m =>
    m.moduleName.toLowerCase().includes(search.toLowerCase()) ||
    m.moduleNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F0F4F8' }}>
      <Navbar />

      <div className="p-8">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm mb-6 flex-wrap" style={{ color: '#90A4AE' }}>
          <Link to="/student/faculties" style={{ color: '#90A4AE' }}
            className="hover:underline">Faculties</Link>
          <span>/</span>
          <Link
            to={`/student/faculties/${facultyId}/semesters`}
            style={{ color: '#90A4AE' }}
            className="hover:underline"
          >
            {faculty?.name ?? 'Semesters'}
          </Link>
          <span>/</span>
          <span style={{ color: '#546E7A', fontWeight: 500 }}>
            {semester ? `Year ${semester.year} — Sem ${semester.semester}` : 'Modules'}
          </span>
        </div>

        {/* HEADER */}
        {semester && faculty && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: '#3949AB' }}>Modules</p>
            <h1 className="text-3xl font-bold" style={{ color: '#1A237E' }}>
              Year {semester.year} — Semester {semester.semester}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#FFF8E1', color: '#F57F17' }}
              >
                {faculty.code}
              </span>
              <span className="text-sm" style={{ color: '#78909C' }}>{faculty.name}</span>
            </div>
          </div>
        )}

        {/* STATS + SEARCH */}
        {!loading && modules.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl px-4 py-2"
                style={{ background: '#FFFFFF', border: '1px solid #C5CAE9' }}
              >
                <span className="text-xs" style={{ color: '#90A4AE' }}>Total modules</span>
                <p className="text-xl font-bold" style={{ color: '#1A237E' }}>{modules.length}</p>
              </div>
              <div
                className="rounded-xl px-4 py-2"
                style={{ background: '#FFFFFF', border: '1px solid #C5CAE9' }}
              >
                <span className="text-xs" style={{ color: '#90A4AE' }}>Saved</span>
                <p className="text-xl font-bold" style={{ color: '#3949AB' }}>
                  {saved.length}
                </p>
              </div>
            </div>
            <input
              className="w-full max-w-xs px-4 py-2.5 text-sm rounded-xl focus:outline-none"
              style={{
                background: '#FFFFFF',
                border: '1px solid #C5CAE9',
                color: '#37474F',
              }}
              placeholder="Search modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-sm"
            style={{ color: '#90A4AE' }}>
            <div
              className="w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: '#E8EAF6', borderTopColor: '#3949AB' }}
            />
            Loading modules...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <span className="text-6xl">📚</span>
            <p className="font-semibold mt-2" style={{ color: '#546E7A' }}>
              {search ? 'No modules match your search' : 'No modules yet'}
            </p>
            <p className="text-sm" style={{ color: '#90A4AE' }}>
              {search ? 'Try a different keyword' : 'This semester has no modules added yet'}
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #C5CAE9' }}
          >
            <table className="w-full">
              <thead style={{ background: '#E8EAF6', borderBottom: '1px solid #C5CAE9' }}>
                <tr>
                  {['#', 'Module No.', 'Module Name', 'Description', 'Save'].map(h => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3"
                      style={{ color: '#7986CB' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr
                    key={m._id}
                    style={{ borderTop: i !== 0 ? '1px solid #EEF0FB' : 'none' }}
                  >
                    <td className="px-5 py-4 text-sm w-10" style={{ color: '#90A4AE' }}>
                      {i + 1}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: '#FFF8E1', color: '#F57F17' }}
                      >
                        {m.moduleNumber}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/student/faculties/${facultyId}/semesters/${semesterId}/modules/${m._id}/lessons`}
                        className="font-semibold text-sm hover:underline"
                        style={{ color: '#1A237E' }}
                      >
                        {m.moduleName}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm max-w-xs" style={{ color: '#78909C' }}>
                      {m.description || <span style={{ color: '#CFD8DC' }}>—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleSave(m)}
                        title={isSaved(m._id) ? 'Remove from My Courses' : 'Save to My Courses'}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                        style={{
                          background: isSaved(m._id) ? '#E8EAF6' : '#F5F5F5',
                          border: `1.5px solid ${isSaved(m._id) ? '#7986CB' : '#CFD8DC'}`,
                          fontSize: '18px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#E8EAF6'}
                        onMouseLeave={e => e.currentTarget.style.background = isSaved(m._id) ? '#E8EAF6' : '#F5F5F5'}
                      >
                        {isSaved(m._id) ? (
  <svg xmlns="http://www.w3.org/2000/svg" style={{width:'20px',height:'20px'}} fill="#3949AB" viewBox="0 0 24 24" stroke="#3949AB" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" style={{width:'20px',height:'20px'}} fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BACK */}
        <div className="mt-8">
          <Link
            to={`/student/faculties/${facultyId}/semesters`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl"
            style={{ background: '#FFFFFF', border: '1px solid #C5CAE9', color: '#546E7A' }}
          >
            ← Back to Semesters
          </Link>
        </div>
      </div>
    </div>
  )
}