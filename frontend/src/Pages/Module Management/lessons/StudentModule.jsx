import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../../../Components/NavBar/NavBar.jsx'

export default function StudentLessonList() {
  const { moduleId, facultyId, semesterId } = useParams()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    load()
    const saved = JSON.parse(localStorage.getItem(`completed_${moduleId}`) || '{}')
    setCompleted(saved)
  }, [moduleId])

  const load = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`http://localhost:5000/api/modules/${moduleId}/lessons`)
      setLessons(data.data ?? data)
    } catch {
      toast.error('Failed to load lessons')
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = (lessonId) => {
    const updated = { ...completed, [lessonId]: !completed[lessonId] }
    setCompleted(updated)
    localStorage.setItem(`completed_${moduleId}`, JSON.stringify(updated))
  }

  const handlePdfDownload = (res) => {
    if (!res.url) return toast.error('No file available')
    const a = document.createElement('a')
    a.href = res.url
    a.download = res.title ?? res.name ?? 'document.pdf'
    a.target = '_blank'
    a.click()
  }

  const handleLinkOpen = (url) => {
    if (!url) return toast.error('No link available')
    const full = url.startsWith('http') ? url : `https://${url}`
    window.open(full, '_blank', 'noopener,noreferrer')
  }

  const filtered = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase())
  )

  const completedCount = lessons.filter(l => completed[l._id]).length
  const progressPct = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F0F4F8' }}>
      <Navbar />

      <div className="p-8">

        {/* BREADCRUMB */}
        <div className="flex gap-2 text-sm mb-6 flex-wrap" style={{ color: '#90A4AE' }}>
          <Link to="/student/faculties" style={{ color: '#90A4AE' }}>Faculties</Link>
          <span>/</span>
          <Link to={`/student/faculties/${facultyId}/semesters`} style={{ color: '#90A4AE' }}>
            Semesters
          </Link>
          <span>/</span>
          <Link
            to={`/student/faculties/${facultyId}/semesters/${semesterId}/modules`}
            style={{ color: '#90A4AE' }}
          >
            Modules
          </Link>
          <span>/</span>
          <span style={{ color: '#546E7A' }}>Lessons</span>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#3949AB' }}>
              Lessons
            </p>
            <h1 className="text-2xl font-bold" style={{ color: '#1A237E' }}>
              Your Lessons
            </h1>
            <p className="text-sm mt-1" style={{ color: '#78909C' }}>
              Track your progress and access all materials below
            </p>
          </div>

          {/* Progress badge */}
          <div
            className="flex flex-col items-center justify-center rounded-xl px-5 py-3"
            style={{ background: '#E8EAF6', minWidth: '110px' }}
          >
            <span className="text-2xl font-bold" style={{ color: '#3949AB' }}>
              {progressPct}%
            </span>
            <span className="text-xs mt-1" style={{ color: '#7986CB' }}>completed</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="rounded-xl p-5 mb-6" style={{ background: '#FFFFFF' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold" style={{ color: '#1A237E' }}>
              Your Progress
            </span>
            <span className="text-sm" style={{ color: '#78909C' }}>
              {completedCount} / {lessons.length} lessons completed
            </span>
          </div>
          <div className="w-full rounded-full" style={{ background: '#E8EAF6', height: '10px' }}>
            <div
              className="rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                height: '10px',
                background: progressPct === 100 ? '#00695C' : '#3949AB',
              }}
            />
          </div>
          {progressPct === 100 && (
            <p className="text-xs mt-2 font-medium" style={{ color: '#00695C' }}>
              🎉 You've completed all lessons!
            </p>
          )}
        </div>

        {/* SEARCH */}
        {!loading && lessons.length > 0 && (
          <div className="mb-5">
            <input
              className="w-full max-w-xs px-4 py-2.5 text-sm rounded-xl border focus:outline-none"
              style={{ background: '#FFFFFF', border: '1px solid #C5CAE9', color: '#37474F' }}
              placeholder="Search lessons..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* LESSON CARDS */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-sm" style={{ color: '#90A4AE' }}>
            <div
              className="w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: '#E8EAF6', borderTopColor: '#3949AB' }}
            />
            Loading lessons...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <span className="text-6xl">📖</span>
            <p className="font-semibold mt-2" style={{ color: '#546E7A' }}>
              {search ? 'No lessons match your search' : 'No lessons available yet'}
            </p>
            <p className="text-sm" style={{ color: '#90A4AE' }}>
              {search ? 'Try a different keyword' : 'Check back later'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((lesson, i) => {
              const done = !!completed[lesson._id]
              const pdfs  = lesson.resources?.filter(r => r.type === 'pdf')  ?? []
              const links = lesson.resources?.filter(r => r.type === 'link') ?? []
              const videos = lesson.resources?.filter(r => r.type === 'video') ?? []
              const others = lesson.resources?.filter(
                r => !['pdf', 'link', 'video'].includes(r.type)
              ) ?? []

              return (
                <div
                  key={lesson._id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: '#FFFFFF',
                    border: `1.5px solid ${done ? '#A5D6A7' : '#C5CAE9'}`,
                    transition: 'border-color 0.3s',
                  }}
                >
                  {/* ── Lesson header ── */}
                  <div
                    className="flex justify-between items-center px-5 py-4"
                    style={{ background: done ? '#F1F8E9' : '#E8EAF6' }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Complete toggle */}
                      <button
                        onClick={() => toggleComplete(lesson._id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all"
                        style={{
                          background: done ? '#388E3C' : '#FFFFFF',
                          border: `2px solid ${done ? '#388E3C' : '#9FA8DA'}`,
                          color: done ? '#fff' : 'transparent',
                          fontSize: '16px',
                        }}
                        title={done ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        ✓
                      </button>

                      {/* Number */}
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: done ? '#A5D6A7' : '#C5CAE9',
                          color: done ? '#1B5E20' : '#1A237E',
                        }}
                      >
                        {i + 1}
                      </span>

                      <div>
                        <span
                          className="font-bold text-base"
                          style={{ color: done ? '#2E7D32' : '#1A237E' }}
                        >
                          {lesson.title}
                        </span>
                        {lesson.description && (
                          <p className="text-xs mt-0.5" style={{ color: '#78909C' }}>
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      {done && (
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-full font-semibold ml-1"
                          style={{ background: '#C8E6C9', color: '#2E7D32' }}
                        >
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Materials body ── */}
                  <div className="px-5 py-4 flex flex-col gap-5" style={{ background: '#FAFAFA' }}>

                    {lesson.resources?.length === 0 || !lesson.resources ? (
                      <p className="text-sm" style={{ color: '#B0BEC5' }}>
                        No materials uploaded yet
                      </p>
                    ) : (
                      <>

                        {/* PDF section */}
                        {pdfs.length > 0 && (
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-widest mb-3"
                              style={{ color: '#E65100' }}
                            >
                              📄 PDF Documents
                            </p>
                            <div className="flex flex-col gap-2">
                              {pdfs.map((res, j) => (
                                <button
                                  key={j}
                                  onClick={() => handlePdfDownload(res)}
                                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all"
                                  style={{
                                    background: '#FFF8F1',
                                    border: '1.5px solid #FFCC80',
                                    cursor: 'pointer',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#FFF3E0'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#FFF8F1'}
                                >
                                  {/* PDF icon */}
                                  <div
                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                                    style={{ background: '#FF8A65', color: '#fff' }}
                                  >
                                    PDF
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="font-semibold text-base"
                                      style={{ color: '#BF360C' }}
                                    >
                                      {res.title ?? res.name ?? 'Untitled Document'}
                                    </p>
                                    {res.url && (
                                      <p
                                        className="text-xs mt-0.5 truncate"
                                        style={{ color: '#FF8A65' }}
                                      >
                                        {res.url}
                                      </p>
                                    )}
                                  </div>
                                  <div
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                                    style={{ background: '#E65100', color: '#fff' }}
                                  >
                                    ↓ Download
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Links section */}
                        {links.length > 0 && (
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-widest mb-3"
                              style={{ color: '#00695C' }}
                            >
                              🔗 Links
                            </p>
                            <div className="flex flex-col gap-2">
                              {links.map((res, j) => (
                                <button
                                  key={j}
                                  onClick={() => handleLinkOpen(res.url)}
                                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all"
                                  style={{
                                    background: '#F1FBF8',
                                    border: '1.5px solid #80CBC4',
                                    cursor: 'pointer',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#E0F2F1'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#F1FBF8'}
                                >
                                  {/* Link icon */}
                                  <div
                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                                    style={{ background: '#26A69A', color: '#fff' }}
                                  >
                                    URL
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="font-semibold text-base"
                                      style={{ color: '#004D40' }}
                                    >
                                      {res.title ?? res.name ?? 'External Link'}
                                    </p>
                                    {res.url && (
                                      <p
                                        className="text-sm mt-0.5 break-all"
                                        style={{ color: '#00897B' }}
                                      >
                                        {res.url.startsWith('http') ? res.url : `https://${res.url}`}
                                      </p>
                                    )}
                                  </div>
                                  <div
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                                    style={{ background: '#00695C', color: '#fff' }}
                                  >
                                    Open →
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos section */}
                        {videos.length > 0 && (
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-widest mb-3"
                              style={{ color: '#4527A0' }}
                            >
                              🎬 Videos
                            </p>
                            <div className="flex flex-col gap-2">
                              {videos.map((res, j) => (
                                <button
                                  key={j}
                                  onClick={() => handleLinkOpen(res.url)}
                                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all"
                                  style={{
                                    background: '#F3F0FD',
                                    border: '1.5px solid #CE93D8',
                                    cursor: 'pointer',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#EDE7F6'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#F3F0FD'}
                                >
                                  <div
                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                                    style={{ background: '#7E57C2', color: '#fff' }}
                                  >
                                    VID
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-base" style={{ color: '#311B92' }}>
                                      {res.title ?? res.name ?? 'Video'}
                                    </p>
                                    {res.url && (
                                      <p className="text-sm mt-0.5 break-all" style={{ color: '#7E57C2' }}>
                                        {res.url.startsWith('http') ? res.url : `https://${res.url}`}
                                      </p>
                                    )}
                                  </div>
                                  <div
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                                    style={{ background: '#4527A0', color: '#fff' }}
                                  >
                                    Watch →
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Other resources */}
                        {others.length > 0 && (
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-widest mb-3"
                              style={{ color: '#546E7A' }}
                            >
                              📎 Other Resources
                            </p>
                            <div className="flex flex-col gap-2">
                              {others.map((res, j) => (
                                <button
                                  key={j}
                                  onClick={() => handleLinkOpen(res.url)}
                                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left"
                                  style={{
                                    background: '#F5F5F5',
                                    border: '1.5px solid #CFD8DC',
                                  }}
                                >
                                  <div
                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs"
                                    style={{ background: '#78909C', color: '#fff' }}
                                  >
                                    {res.type?.toUpperCase().slice(0, 3) ?? 'DOC'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-base" style={{ color: '#37474F' }}>
                                      {res.title ?? res.name ?? 'Resource'}
                                    </p>
                                    {res.url && (
                                      <p className="text-sm mt-0.5 break-all" style={{ color: '#78909C' }}>
                                        {res.url}
                                      </p>
                                    )}
                                  </div>
                                  <div
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                                    style={{ background: '#546E7A', color: '#fff' }}
                                  >
                                    Open →
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* BACK */}
        <div className="mt-8">
          <Link
            to={`/student/faculties/${facultyId}/semesters/${semesterId}/modules`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl"
            style={{ background: '#FFFFFF', border: '1px solid #C5CAE9', color: '#546E7A' }}
          >
            ← Back to Modules
          </Link>
        </div>

      </div>
    </div>
  )
}