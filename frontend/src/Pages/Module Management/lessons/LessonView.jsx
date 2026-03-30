import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LessonView() {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  // PDF upload state
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfLabel, setPdfLabel] = useState('')
  const [uploading, setUploading] = useState(false)

  // Link state
  const [linkLabel, setLinkLabel] = useState('')
  const [linkUrl, setLinkUrl]     = useState('')
  const [addingLink, setAddingLink] = useState(false)

  const load = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/lessons/${id}`)
      setLesson(data.data)
    } catch {
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handlePdfUpload = async () => {
    if (!pdfFile) return toast.error('Select a PDF file')
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    formData.append('label', pdfLabel || pdfFile.name)
    try {
      setUploading(true)
      await axios.post(`http://localhost:5000/api/lessons/${id}/upload-pdf`, formData)
      toast.success('PDF uploaded')
      setPdfFile(null)
      setPdfLabel('')
      load()
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleAddLink = async () => {
    if (!linkLabel.trim() || !linkUrl.trim()) return toast.error('Label and URL required')
    try {
      setAddingLink(true)
      await axios.post(`http://localhost:5000/api/lessons/${id}/add-link`, { label: linkLabel, url: linkUrl })
      toast.success('Link added')
      setLinkLabel('')
      setLinkUrl('')
      load()
    } catch {
      toast.error('Failed to add link')
    } finally {
      setAddingLink(false)
    }
  }

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Remove this resource?')) return
    try {
      await axios.delete(`http://localhost:5000/api/lessons/${id}/resources/${resourceId}`)
      toast.success('Resource removed')
      load()
    } catch {
      toast.error('Failed to remove')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-sm text-gray-400">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      Loading...
    </div>
  )

  if (!lesson) return <div className="p-12 text-gray-500">Lesson not found.</div>

  const pdfs  = lesson.resources.filter(r => r.type === 'pdf')
  const links = lesson.resources.filter(r => r.type === 'link')

  return (
    <div className="p-12 max-w-3xl space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          {lesson.description && <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>}
        </div>
        <Link
          to={`/lessons/${id}/edit`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
        >
          Edit
        </Link>
      </div>

      {/* PDFs Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm">📄 PDF Materials</h2>
          <span className="text-xs text-gray-400">{pdfs.length} file{pdfs.length !== 1 ? 's' : ''}</span>
        </div>

        {pdfs.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {pdfs.map(r => (
              <li key={r._id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                <a href={r.url} target="_blank" rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium truncate max-w-xs">
                  {r.label}
                </a>
                <button onClick={() => handleDeleteResource(r._id)}
                  className="text-xs text-red-500 hover:text-red-700 ml-4 shrink-0">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Upload PDF */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload New PDF</p>
          <input
            type="text"
            placeholder="Label (optional)"
            value={pdfLabel}
            onChange={e => setPdfLabel(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setPdfFile(e.target.files[0])}
              className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-300 file:text-xs file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
            />
            <button
              onClick={handlePdfUpload}
              disabled={uploading || !pdfFile}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm">🔗 Reference Links</h2>
          <span className="text-xs text-gray-400">{links.length} link{links.length !== 1 ? 's' : ''}</span>
        </div>

        {links.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {links.map(r => (
              <li key={r._id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                <a href={r.url} target="_blank" rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium truncate max-w-xs">
                  {r.label}
                </a>
                <button onClick={() => handleDeleteResource(r._id)}
                  className="text-xs text-red-500 hover:text-red-700 ml-4 shrink-0">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Link */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Add New Link</p>
          <input
            type="text"
            placeholder="Label (e.g. W3Schools Arrays)"
            value={linkLabel}
            onChange={e => setLinkLabel(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-3">
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddLink}
              disabled={addingLink}
              className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shrink-0"
            >
              {addingLink ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}