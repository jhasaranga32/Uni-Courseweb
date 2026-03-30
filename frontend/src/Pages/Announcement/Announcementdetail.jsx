import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((all) => {
        const found = all.find((a) => a._id === id);
        setAnnouncement(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this announcement? This action cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    navigate("/announcements");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap');`}</style>
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');`}</style>
        <div className="text-center bg-white rounded-2xl border border-slate-200 p-12 shadow-sm max-w-sm w-full mx-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-700 font-semibold mb-1">Announcement not found</p>
          <p className="text-slate-400 text-sm mb-5">This announcement may have been deleted.</p>
          <button
            onClick={() => navigate("/announcements")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/announcements")}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Announcement Detail</h1>
              <p className="text-xs text-slate-400 mt-0.5">View full content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/announcements/edit/${id}`)}
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Hero Image */}
          {announcement.image ? (
            <div className="h-72 overflow-hidden">
              <img
                src={`/uploads/images/${announcement.image}`}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">No image attached</span>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(announcement.date || announcement.createdAt).toLocaleDateString("en-US", {
                  weekday: "short", year: "numeric", month: "long", day: "numeric"
                })}
              </span>
              {announcement.updatedAt && announcement.updatedAt !== announcement.createdAt && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Updated {new Date(announcement.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-6">
              {announcement.title}
            </h2>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-slate-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Content */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
              <p className="text-slate-700 text-base leading-8 whitespace-pre-wrap">
                {announcement.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => navigate("/announcements")}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Announcements
              </button>
              <button
                onClick={() => navigate(`/announcements/edit/${id}`)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}