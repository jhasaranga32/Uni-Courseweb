import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import Sidebar from "../../../Components/ModuleManagement/Sidebar.jsx";

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [lessonLoading, setLessonLoading] = useState(true);

  useEffect(() => {
    loadModule();
    loadLessons();
  }, [id]);

  const loadModule = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/modules/${id}`);
      setModule(data.data ?? data);
    } catch {
      toast.error("Failed to load module");
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async () => {
    try {
      setLessonLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/modules/${id}/lessons`);
      setLessons(data.data ?? data);
    } catch {
      toast.error("Failed to load lessons");
    } finally {
      setLessonLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!window.confirm(`Delete "${module?.moduleName}"?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/modules/${id}`);
      toast.success("Module deleted");
      navigate("/modules");
    } catch {
      toast.error("Delete failed");
    }
  };

  const deleteLesson = async (lesson) => {
    if (!window.confirm(`Delete "${lesson.title}"?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/lessons/${lesson._id}`);
      toast.success("Lesson deleted");
      loadLessons();
    } catch {
      toast.error("Delete failed");
    }
  };

  const typeLabel = (type = "") => {
    const map = { pdf: "PDF", video: "VID", link: "LNK", doc: "DOC" };
    return map[type.toLowerCase()] ?? type.toUpperCase().slice(0, 3);
  };

  const typeBg = (type = "") => {
    const map = {
      pdf:   { bg: "#FFF3E0", color: "#E65100" },
      video: { bg: "#EDE7F6", color: "#4527A0" },
      link:  { bg: "#E0F2F1", color: "#00695C" },
      doc:   { bg: "#E3F2FD", color: "#1565C0" },
    };
    return map[type.toLowerCase()] ?? { bg: "#F5F5F5", color: "#616161" };
  };

  if (loading)
    return <div className="flex items-center justify-center py-20">Loading...</div>;
  if (!module) return <p>Module not found</p>;

  const sem = module.semester;

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F0F4F8" }}>
      <Sidebar />

      <div className="ml-56 p-8">

        {/* BREADCRUMB */}
        <div className="flex gap-2 text-sm mb-6" style={{ color: "#90A4AE" }}>
          <Link to="/modules" style={{ color: "#90A4AE" }}>Modules</Link>
          <span>/</span>
          <span style={{ color: "#546E7A" }}>{module.moduleName}</span>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A237E" }}>
              {module.moduleName}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#78909C" }}>
              {module.description}
            </p>
          </div>

          {/* ── uniform Edit / Delete buttons ── */}
          <div className="flex gap-2">
            <Link
              to={`/modules/${id}/edit`}
              className="inline-flex items-center justify-center text-sm font-medium rounded-lg"
              style={{
                width: "90px", height: "36px",
                background: "#E8EAF6", color: "#3949AB",
              }}
            >
              ✏️ Edit
            </Link>
            <button
              onClick={handleDeleteModule}
              className="inline-flex items-center justify-center text-sm font-medium rounded-lg"
              style={{
                width: "90px", height: "36px",
                background: "#FFEBEE", color: "#C62828",
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Module No", value: module.moduleNumber, accent: "#1A237E" },
            { label: "Faculty",   value: module.faculty?.code, accent: "#00695C" },
            ...(sem ? [
              { label: "Year",     value: sem.year,     accent: "#4527A0" },
              { label: "Semester", value: sem.semester, accent: "#E65100" },
            ] : []),
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className="p-4 rounded-xl"
              style={{ background: "#FFFFFF", borderLeft: `4px solid ${accent}` }}
            >
              <p className="text-xs mb-1" style={{ color: "#90A4AE" }}>{label}</p>
              <p className="font-bold text-base" style={{ color: accent }}>{value}</p>
            </div>
          ))}
        </div>

        {/* LESSONS PANEL */}
        <div className="rounded-xl p-6" style={{ background: "#FFFFFF" }}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold" style={{ color: "#1A237E" }}>Lessons</h2>
            <Link
              to={`/modules/${id}/lessons/new`}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white"
              style={{ background: "#3949AB" }}
            >
              + Add Lesson
            </Link>
          </div>

          {lessonLoading ? (
            <p className="text-sm" style={{ color: "#90A4AE" }}>Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p className="text-sm" style={{ color: "#90A4AE" }}>No lessons yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {lessons.map((lesson, i) => (
                <div
                  key={lesson._id}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid #E8EAF6" }}
                >
                  {/* Lesson header */}
                  <div
                    className="flex justify-between items-center px-4 py-3"
                    style={{ background: "#E8EAF6" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center"
                        style={{ background: "#3949AB", color: "#fff" }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-semibold text-sm" style={{ color: "#1A237E" }}>
                        {lesson.title}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs font-medium">
                      <Link
                        to={`/lessons/${lesson._id}`}
                        style={{ color: "#3949AB" }}
                      >
                        View
                      </Link>
                      <Link
                        to={`/lessons/${lesson._id}/edit`}
                        style={{ color: "#546E7A" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteLesson(lesson)}
                        style={{ color: "#C62828" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="px-4 py-3 flex flex-col gap-2" style={{ background: "#FAFAFA" }}>
                    {!lesson.resources || lesson.resources.length === 0 ? (
                      <p className="text-xs" style={{ color: "#B0BEC5" }}>
                        No materials uploaded yet
                      </p>
                    ) : (
                      lesson.resources.map((res, j) => {
                        const { bg, color } = typeBg(res.type);
                        return (
                          <div
                            key={j}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg"
                            style={{ background: "#FFFFFF", border: "1px solid #ECEFF1" }}
                          >
                            <span
                              className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: bg, color }}
                            >
                              {typeLabel(res.type)}
                            </span>
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#37474F" }}>
                                {res.title ?? res.name ?? "Untitled"}
                              </p>
                              <p className="text-xs capitalize" style={{ color: "#90A4AE" }}>
                                {res.type ?? "Resource"}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BACK */}
        <div className="mt-6">
          <Link to="/modules" className="text-sm" style={{ color: "#78909C" }}>
            ← Back to modules
          </Link>
        </div>

      </div>
    </div>
  );
}