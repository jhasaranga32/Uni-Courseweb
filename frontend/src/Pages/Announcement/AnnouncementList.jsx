import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/ModuleManagement/Sidebar.jsx";
export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => { setAnnouncements(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    setDeletingId(id);
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    setDeletingId(null);
  };

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    
    <div className="min-h-screen bg-slate-50 pl-40">
      <Sidebar />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      
      
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Announcements</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage all announcements</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/announcements/new")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Announcement
          </button>
        </div>
      
      

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Search + count row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 whitespace-nowrap">
            <span className="font-bold text-slate-700">{filtered.length}</span>
            <span>{filtered.length !== 1 ? "results" : "result"}</span>
            {search && <span className="text-indigo-500 ml-1">for "{search}"</span>}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="h-44 bg-slate-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-lg animate-pulse w-full" />
                  <div className="h-3 bg-slate-100 rounded-lg animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold mb-1">No announcements found</p>
            <p className="text-slate-400 text-sm mb-5">
              {search ? "Try a different keyword" : "Create your first announcement to get started"}
            </p>
            {!search && (
              <button
                onClick={() => navigate("/announcements/new")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                Create Announcement
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <div
                key={a._id}
                className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  {a.image ? (
                    <img
                      src={`/uploads/images/${a.image}`}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-50 to-indigo-50">
                      <svg className="w-9 h-9 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-slate-300 font-medium">No image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                    {new Date(a.date || a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {a.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/announcements/${a._id}`)}
                      className="flex-1 text-center text-xs font-semibold py-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>  navigate(`/announcements/${a._id}/edit`)}
                      className="flex-1 text-center text-xs font-semibold py-2 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      disabled={deletingId === a._id}
                      className="flex-1 text-center text-xs font-semibold py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-40"
                    >
                      {deletingId === a._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}