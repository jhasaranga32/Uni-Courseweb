import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Sidebar from '../../Components/ModuleManagement/Sidebar.jsx'



const API = 'http://localhost:5000/api/lecturers'
const BASE = 'http://localhost:5000'

const emptyForm = { name: '', email: '', image: null }

export default function LecturerAdmin() {
  const [lecturers, setLecturers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)   // lecturer object when editing
  const [form,      setForm]      = useState(emptyForm)
  const [preview,   setPreview]   = useState('')
  const [saving,    setSaving]    = useState(false)
  const [search,    setSearch]    = useState('')
  const fileRef = useRef()

  const load = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(API)
      setLecturers(data.data ?? [])
    } catch {
      toast.error('Failed to load lecturers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setPreview('')
    setShowModal(true)
  }

  const openEdit = (l) => {
    setEditing(l)
    setForm({ name: l.name, email: l.email, image: null })
    setPreview(l.image ? `${BASE}${l.image}` : '')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm(emptyForm)
    setPreview('')
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm(f => ({ ...f, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    try {
      setSaving(true)
      const fd = new FormData()
      fd.append('name',  form.name.trim())
      fd.append('email', form.email.trim())
      if (form.image) fd.append('image', form.image)

      if (editing) {
        await axios.put(`${API}/${editing._id}`, fd)
        toast.success('Lecturer updated!')
      } else {
        await axios.post(API, fd)
        toast.success('Lecturer added!')
      }
      closeModal()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (l) => {
    if (!window.confirm(`Delete "${l.name}"?`)) return
    try {
      await axios.delete(`${API}/${l._id}`)
      toast.success('Lecturer deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = lecturers.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
   <div className="min-h-screen bg-slate-50 font-sans">  
  
   
        <Sidebar />
   
           <div className="flex w-full">
         
          <div className="ml-56 flex-1 p-9">
            

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lecturers</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage lecturer profiles</p>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Add Lecturer
            </button>
          </div>

          {/* Search */}
          <div className="mb-5">
            <input
              className="w-full max-w-xs px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-sm text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                Loading lecturers...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-2 text-center">
                <span className="text-5xl">👨‍🏫</span>
                <p className="font-semibold text-gray-600 mt-2">No lecturers found</p>
                <p className="text-sm text-gray-400">Click "Add Lecturer" to get started</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['#', 'Photo', 'Name', 'Email', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((l, i) => (
                    <tr key={l._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-400 w-10">{i + 1}</td>
                      <td className="px-5 py-4">
                        {l.image ? (
                          <img
                            src={`${BASE}${l.image}`}
                            alt={l.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {l.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800 text-sm">{l.name}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{l.email}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(l)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(l)}
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
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Lecturer' : 'Add Lecturer'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Image Upload */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                  onClick={() => fileRef.current.click()}
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📷</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {preview ? 'Change Photo' : 'Upload Photo'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Dr. John Smith"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. john@university.edu"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Lecturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}