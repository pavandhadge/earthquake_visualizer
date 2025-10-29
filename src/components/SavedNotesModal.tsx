// src/components/SavedNotesModal.tsx
import { db } from "../db";
import { useEffect, useState } from "react";
import type { Note } from "../db";

interface Props {
  onClose: () => void;
  onSelect: (title: string, content: string) => void;
}

export function SavedNotesModal({ onClose, onSelect }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    setLoading(true);
    const result = await db.notes.orderBy("timestamp").reverse().toArray();
    setNotes(result);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id: number) => {
    await db.notes.delete(id);
    loadNotes();
  };

  const exportNotes = async () => {
    const result = await db.notes.toArray();
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earthquake-notes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in-up">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Saved Notes</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportNotes}
            className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Export All
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No saved notes found.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-lg p-3 group hover:bg-blue-50 hover:border-blue-400 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onSelect(note.title, note.content)}
                  >
                    <h3 className="font-semibold text-sm text-gray-800 group-hover:text-blue-700">
                      {note.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id!);
                    }}
                    className="text-gray-400 hover:text-red-600 text-xs ml-4 p-1 rounded-md hover:bg-red-50 opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
