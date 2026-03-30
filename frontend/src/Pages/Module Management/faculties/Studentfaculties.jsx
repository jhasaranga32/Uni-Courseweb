import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

import Navbar from '../../../Components/NavBar/NavBar.jsx'

export default function StudentFaculties() {
  const [faculties, setFaculties] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [lockedId,  setLockedId]  = useState(null)   // which faculty is being "denied"

  // ── Read the logged-in student's faculty from localStorage ──────────────
  const userFaculty = localStorage.getItem('userFaculty')?.trim() ?? ''
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    axios.get('http://localhost:5000/api/faculties')
      .then(({ data }) => setFaculties(data.data ?? data))
      .catch(() => toast.error('Failed to load faculties'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = faculties.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase())
  )

  // ── Decide if a faculty card is the student's own ───────────────────────
  const isMyFaculty = (f) => String(f._id).trim() === userFaculty

  // ── Handle click on a locked card ───────────────────────────────────────
  const handleLockedClick = (f) => {
    setLockedId(f._id)
    toast.error(`You are not enrolled in "${f.name}"`, { duration: 3000 })
    setTimeout(() => setLockedId(null), 600)   // brief shake, then reset
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Browse</p>
          <h1 className="text-3xl font-bold text-gray-900">Faculties</h1>
          <p className="text-sm text-gray-500 mt-1">Select a faculty to explore its semesters and modules</p>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-sm">
          <input
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            placeholder="Search faculties..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-sm text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            Loading faculties...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <span className="text-6xl">🏛</span>
            <p className="font-semibold text-gray-600 mt-2">No faculties found</p>
            <p className="text-sm text-gray-400">{search ? 'Try a different search term' : 'No faculties available yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(f => {
              const mine   = isMyFaculty(f)
              const locked = lockedId === f._id

              // ── MY faculty → normal clickable Link ──────────────────────
              if (mine) {
                return (
                  <Link
                    key={f._id}
                    to={`/student/faculties/${f._id}/semesters`}
                    className="group bg-white border-2 border-blue-400 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500 transition-all relative"
                  >
                    {/* "Your Faculty" badge */}
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow">
                      ✓ Your Faculty
                    </span>

                    <div className="flex items-start justify-between mb-4 mt-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                        🏛
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                        {f.code}
                      </span>
                    </div>

                    <h2 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug mb-1">
                      {f.name}
                    </h2>

                    {f.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{f.description}</p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {new Date(f.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        View Semesters →
                      </span>
                    </div>
                  </Link>
                )
              }

              // ── OTHER faculties → locked, non-navigable div ──────────────
              return (
                <div
                  key={f._id}
                  onClick={() => handleLockedClick(f)}
                  className={`
                    relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm
                    cursor-not-allowed opacity-60 select-none
                    transition-all
                    ${locked ? 'animate-[shake_0.4s_ease-in-out]' : ''}
                  `}
                >
                  {/* Lock overlay badge */}
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                    🔒 Restricted
                  </span>

                  <div className="flex items-start justify-between mb-4 mt-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl grayscale">
                      🏛
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                      {f.code}
                    </span>
                  </div>

                  <h2 className="font-bold text-gray-400 text-base leading-snug mb-1">
                    {f.name}
                  </h2>

                  {f.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">{f.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-300">
                      {new Date(f.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      Not Enrolled
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Shake keyframe (inline, no extra CSS file needed) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}