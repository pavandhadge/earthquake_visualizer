// src/components/NotesDashboard.tsx
import { useState, useEffect } from "react";
import { db } from "../db";

interface Note {
  id: number;
  title: string;
  content: string;
  timestamp: string;
}

export function NotesDashboard({ onBack }: { onBack: () => void }) {
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
    loadNotes();
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          ← Back to Home
        </button>
        <h2 className="text-xl font-bold text-blue-900">Saved Notes</h2>
        <div className="w-24" />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Notes List */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
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
                  className={`p-4 cursor-pointer transition-all ${
                    selected?.id === note.id
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900">
                        {note.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {note.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id!);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs ml-2"
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
              <h1 className="text-3xl font-bold text-blue-900 mb-4">
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
              <p className="text-lg">Select a note to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
