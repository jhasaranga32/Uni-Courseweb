import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LessonForm() {
  const { moduleId, id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ title: '', description: '', order: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:5000/api/lessons/${id}`)
        .then(({ data }) => setForm({
          title: data.data.title,
          description: data.data.description || '',
          order: data.data.order || 0,
        }))
        .catch(() => toast.error('Failed to load lesson'))
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')
    try {
      setSaving(true)
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/lessons/${id}`, form)
        toast.success('Lesson updated')
        navigate(`/lessons/${id}`)
      } else {
        const { data } = await axios.post(`http://localhost:5000/api/modules/${moduleId}/lessons`, form)
        toast.success('Lesson created')
        navigate(`/lessons/${data.data._id}`)
      }
    } catch {
      toast.error('Failed to save lesson')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-12 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Lesson' : 'New Lesson'}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isEdit ? 'Update lesson details' : 'Add a new lesson to this module'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Introduction to Arrays"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Brief description of this lesson..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Order</label>
          <input
            type="number"
            value={form.order}
            onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
            className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Controls display order in the lesson list</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Lesson' : 'Create Lesson'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}