// src/components/NotesPanel.tsx
import { useNotes } from "../context/NotesContext";
import { SavedNotesModal } from "./SavedNotesModal";
import { useState } from "react";

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
    setShowSaved(false); // Close modal after selecting
  };

  if (state === "closed") return null;

  return (
    <>
      {/* Minimized */}
      {state === "minimized" && (
        <div
          className="fixed bottom-6 right-6 w-64 bg-blue-600 text-white p-3 rounded-t-lg shadow-lg cursor-pointer flex items-center justify-between z-500"
          onClick={open}
        >
          <span className="text-sm font-medium">
            Notes ({notes.length} chars)
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="text-white hover:bg-blue-700 p-1 rounded"
          >
            Close
          </button>
        </div>
      )}
      {/* Open Panel */}
      {state === "open" && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl border flex flex-col z-500">
          <div className="flex items-center justify-between p-3 border-b bg-blue-50 rounded-t-lg">
            <h3 className="font-semibold text-blue-900">New Note</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setShowSaved(true)}
                className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                View Saved
              </button>
              <button
                onClick={saveNote}
                disabled={!notes.trim()}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  notes.trim()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Save
              </button>
              <button
                onClick={minimize}
                className="p-1 text-gray-600 hover:bg-gray-200 rounded text-sm"
              >
                Minimize
              </button>
              <button
                onClick={close}
                className="p-1 text-gray-600 hover:bg-gray-200 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title (optional)..."
            className="p-3 border-b text-sm focus:outline-none"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your observations..."
            className="flex-1 p-3 text-sm resize-none focus:outline-none"
          />
          <div className="p-2 border-t bg-gray-50 rounded-b-lg text-right">
            <span className="text-xs text-gray-500">{notes.length} chars</span>
          </div>
        </div>
      )}
      {/* SAVED NOTES MODAL — Z-INDEX 1000 */}
      {/*{showSaved && (*/}
      {/*// src/components/NotesPanel.tsx*/}
      {showSaved && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-100 bg-opacity-75">
          <SavedNotesModal
            onClose={() => setShowSaved(false)}
            onSelect={handleSelectNote}
          />
        </div>
      )}
      {/*)}*/}
    </>
  );
}
