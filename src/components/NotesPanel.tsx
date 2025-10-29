// src/components/NotesPanel.tsx
import { useNotes } from "../context/NotesContext";
import { SavedNotesModal } from "./SavedNotesModal";
import { useState } from "react";

// SVG Icons (inline, no deps)
const MinimizeIcon = () => (
  <svg
    className="w-4.5 h-4.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-4.5 h-4.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const SaveIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const FolderOpenIcon = () => (
  <svg
    className="w-4.5 h-4.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" />
  </svg>
);

const FileTextIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export function NotesPanel() {
  const {
    state,
    notes,
    setNotes,
    title,
    setTitle,
    saveNote,
    open,
    minimize,
    close,
  } = useNotes();

  const [showSaved, setShowSaved] = useState(false);

  const handleSelectNote = (title: string, content: string) => {
    setTitle(title);
    setNotes(content);
    setShowSaved(false);
  };

  if (state === "closed") return null;

  const displayTitle = title || "Untitled Note";

  return (
    <>
      {/* === MINIMIZED PANEL === */}
      {state === "minimized" && (
        <div
          onClick={open}
          className="fixed bottom-8 right-8 w-72 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl shadow-2xl cursor-pointer flex items-center justify-between z-500 transition-all hover:shadow-3xl hover:-translate-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileTextIcon />
            </div>
            <div>
              <p className="text-sm font-semibold truncate max-w-40">
                {displayTitle}
              </p>
              <p className="text-xs opacity-90">{notes.length} chars</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="p-1.5 hover:bg-white/20 rounded-lg transition"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      {/* === OPEN PANEL === */}
      {state === "open" && (
        <div className="fixed bottom-8 right-8 w-[420px] h-[520px] bg-white rounded-2xl shadow-3xl border border-gray-200 flex flex-col z-500 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-blue-900 text-lg">Notes</h3>
            </div>
            <div className="flex items-center gap-1.5">
              {/* View Saved */}
              <button
                onClick={() => setShowSaved(true)}
                className="p-2 text-gray-600 hover:bg-blue-100 rounded-lg transition group"
                title="View Saved Notes"
              >
                <FolderOpenIcon />
              </button>

              {/* Save */}
              <button
                onClick={saveNote}
                disabled={!notes.trim()}
                className={`p-2 rounded-lg transition-all flex items-center gap-1.5 font-medium text-sm ${
                  notes.trim()
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <SaveIcon />
                <span className="hidden sm:inline">Save</span>
              </button>

              {/* Minimize */}
              <button
                onClick={minimize}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Minimize"
              >
                <MinimizeIcon />
              </button>

              {/* Close */}
              <button
                onClick={close}
                className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
                title="Close"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Title Input */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title (optional)..."
            className="p-4 border-b border-gray-100 text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          />

          {/* Textarea */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your observations, patterns, or hypotheses..."
            className="flex-1 p-4 text-sm text-gray-700 resize-none focus:outline-none placeholder-gray-400"
            style={{ minHeight: "200px" }}
          />

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {notes.length} characters
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Saved locally</span>
            </div>
          </div>
        </div>
      )}

      {/* === SAVED NOTES MODAL === */}
      {showSaved && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
          <SavedNotesModal
            onClose={() => setShowSaved(false)}
            onSelect={handleSelectNote}
          />
        </div>
      )}
    </>
  );
}
