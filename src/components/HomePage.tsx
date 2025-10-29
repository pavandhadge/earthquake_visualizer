// src/components/HomePage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../db";
import { NoteViewer } from "./NoteViewer";

export function HomePage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

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

  // Show full note
  if (selectedNote) {
    return (
      <NoteViewer
        title={selectedNote.title}
        content={selectedNote.content}
        timestamp={selectedNote.timestamp}
        onBack={() => setSelectedNote(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Earthquake Visualizer
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Real-time data + local notes.
          </p>
          <Link
            to="/map"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Open Map
          </Link>
        </div>

        {/* Right */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Saved Notes</h2>
            <button
              onClick={exportNotes}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              Export
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-500">No notes yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="border p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {note.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {note.content.substring(0, 80)}
                        {note.content.length > 80 ? "..." : ""}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id!);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
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
    </div>
  );
}
