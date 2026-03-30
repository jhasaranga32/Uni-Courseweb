import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AnnouncementCreate() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (image) fd.append("image", image);

    try {
      const res = await fetch("/api/announcements/add", { method: "POST", body: fd });
      if (res.ok) navigate("/announcements");
      else setErrors({ global: "Failed to create announcement. Please try again." });
    } catch {
      setErrors({ global: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/announcements")}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">New Announcement</h1>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Global error */}
        {errors.global && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errors.global}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: "" }); }}
                placeholder="Enter announcement title..."
                className={`w-full border rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? "border-red-300 bg-red-50 focus:ring-red-200"
                    : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100 focus:bg-white"
                }`}
              />
              {errors.title && (
                <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: "" }); }}
                placeholder="Write the announcement content here..."
                rows={6}
                className={`w-full border rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none leading-relaxed ${
                  errors.description
                    ? "border-red-300 bg-red-50 focus:ring-red-200"
                    : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100 focus:bg-white"
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Image <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </label>

              {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={preview} alt="preview" className="w-full h-52 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer bg-white text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors shadow">
                      Replace
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <button
                      type="button"
                      onClick={() => { setImage(null); setPreview(null); }}
                      className="bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm font-medium group-hover:text-indigo-600 transition-colors">
                    Drop image here or <span className="text-indigo-600">browse</span>
                  </p>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 20MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-2" />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/announcements")}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Announcement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}