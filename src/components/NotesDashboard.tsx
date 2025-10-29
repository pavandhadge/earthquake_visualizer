// src/components/NotesDashboard.tsx
import { useState, useEffect } from "react";
import { db } from "../db";
import type { Note } from "../db";

export function NotesDashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    setLoading(true);
    const result = await db.notes.orderBy("timestamp").reverse().toArray();
    setNotes(result);
    if (result.length > 0 && !selected) {
      setSelected(result[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id: number) => {
    await db.notes.delete(id);
    if (selected?.id === id) setSelected(null);
    loadNotes();
  };

  return (
    <div className="h-[calc(100vh-68px)] flex flex-col bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Notes List */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">All Notes</h2>
            <p className="text-sm text-gray-500">{notes.length} notes found</p>
          </div>
          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No notes yet.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelected(note)}
                  className={`p-4 cursor-pointer transition-all relative ${selected?.id === note.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  {selected?.id === note.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                  )}
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {note.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {note.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id!);
                      }}
                      className="text-gray-400 hover:text-red-600 text-xs ml-2 p-1 rounded-md hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Full Note */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selected ? (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selected.title || "Untitled Note"}
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                {new Date(selected.timestamp).toLocaleString()}
              </p>
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {selected.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg mt-4">Select a note to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
