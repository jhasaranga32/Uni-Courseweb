import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'


export default function LessonList() {
  const { moduleId } = useParams()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => { load() }, [moduleId])

  const handleDelete = async (lesson) => {
    if (!window.confirm(`Delete "${lesson.title}"?`)) return
    try {
      await axios.delete(`http://localhost:5000/api/lessons/${lesson._id}`)
      toast.success('Lesson deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="p-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage lessons for this module</p>
        </div>
        <Link
          to={`/modules/${moduleId}/lessons/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add Lesson
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-sm text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            Loading lessons...
          </div>
        ) : lessons.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-2 text-center">
            <span className="text-5xl">📖</span>
            <p className="font-semibold text-gray-600 mt-2">No lessons yet</p>
            <p className="text-sm text-gray-400">Click "Add Lesson" to create the first one</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['#', 'Title', 'Description', 'Resources', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lessons.map((lesson, i) => (
                <tr key={lesson._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-400 w-10">{i + 1}</td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/lessons/${lesson._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 text-sm transition-colors"
                    >
                      {lesson.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">{lesson.description || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {lesson.resources.filter(r => r.type === 'pdf').length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          📄 {lesson.resources.filter(r => r.type === 'pdf').length} PDF
                        </span>
                      )}
                      {lesson.resources.filter(r => r.type === 'link').length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          🔗 {lesson.resources.filter(r => r.type === 'link').length} Link
                        </span>
                      )}
                      {lesson.resources.length === 0 && <span className="text-xs text-gray-400">None</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/lessons/${lesson._id}`}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        to={`/lessons/${lesson._id}/edit`}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(lesson)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}