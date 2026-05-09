import { useState, useEffect } from "react";
import Navbar from '../../Components/NavBar/NavBar.jsx'
export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => { setAnnouncements(Array.isArray(data) ? data : []); setLoading(false); })

      .catch(() => setLoading(false));
  }, []);

  const filtered = announcements.filter((a) =>
    (a?.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (a?.description ?? "").toLowerCase().includes(search.toLowerCase())
  );


  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const timeAgo = (d) => {
    const diff = (Date.now() - new Date(d)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(d);
  };

  const isNew = (d) => (Date.now() - new Date(d)) / 1000 < 86400 * 3;

  return ( 
  <div className="min-h-screen font-sans" style={{ background: '#F0F4F8' }}>
      <Navbar />
     

     
      

      <main className="max-w-full mx-auto px-6 py-10">

      

  

        {/* ── Empty ── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-600 font-bold text-lg mb-1">No announcements found</p>
            <p className="text-slate-400 text-sm">
              {search ? `No results for "${search}"` : "Check back soon for updates!"}
            </p>
          </div>
        )}

        {/* ── Featured (first item) + rest grid ── */}
       
        {!loading && filtered.length > 0 && (
          <>
            {/* Featured card */}
            <div
              className="card-enter mb-6 bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              onClick={() => setSelected(filtered[0])}
            >
              <div className="sm:flex">
                <div className="sm:w-80 h-56 sm:h-auto bg-slate-100 flex-shrink-0 relative overflow-hidden">
                  {filtered[0].image ? (
                    <img src={`/uploads/images/${filtered[0].image}`} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e0e7ff, #f5f3ff)" }}>
                      <svg className="w-14 h-14 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full tracking-wide">
                    ✦ LATEST
                  </div>
                  {isNew(filtered[0].date || filtered[0].createdAt) && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</div>
                  )}
                </div>
                <div className="p-7 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    {timeAgo(filtered[0].date || filtered[0].createdAt)}
                  </p>
                  <h3 className="font-['Lora',serif] text-2xl font-semibold text-slate-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors">
                    {filtered[0].title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {filtered[0].description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-indigo-600 text-sm font-bold">
                    Read more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Rest of cards */}
            {filtered.length > 1 && (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {filtered.slice(1).map((a, i) => (
                  <div
                    key={a._id}
                    className="card-enter bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                    style={{ animationDelay: `${i * 80}ms` }}
                    onClick={() => setSelected(a)}
                  >
                    {/* Image */}
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      {a.image ? (
                        <img src={`/uploads/images/${a.image}`} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${["#e0e7ff,#f5f3ff", "#fce7f3,#fff1f2", "#d1fae5,#ecfdf5", "#fef3c7,#fffbeb"][i % 4]})` }}>
                          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                        </div>
                      )}
                      {isNew(a.date || a.createdAt) && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        {timeAgo(a.date || a.createdAt)}
                      </p>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {a.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-indigo-500 text-xs font-bold">
                        Read more
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </>
        )}
      </main>

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(15,15,30,0.6)", backdropFilter: "blur(6px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-enter bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal image */}
            {selected.image ? (
              <div className="h-60 flex-shrink-0 overflow-hidden relative">
                <img src={`/uploads/images/${selected.image}`} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-2">
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Modal content */}
            <div className="overflow-y-auto p-7 flex-1">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(selected.date || selected.createdAt)}
                </span>
                {isNew(selected.date || selected.createdAt) && (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">🟢 New</span>
                )}
              </div>

              <h2 className="font-['Lora',serif] text-2xl font-semibold text-slate-900 leading-snug mb-5">
                {selected.title}
              </h2>

              <div className="h-px bg-slate-100 mb-5" />

              <p className="text-slate-600 text-base leading-8 whitespace-pre-wrap">
                {selected.description}
              </p>
            </div>

            {/* Modal footer */}
            <div className="px-7 py-4 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}