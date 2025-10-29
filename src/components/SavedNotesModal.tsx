// src/components/SavedNotesModal.tsx
import { db } from "../db";
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  onSelect: (title: string, content: string) => void;
}

export function SavedNotesModal({ onClose, onSelect }: Props) {
  const [notes, setNotes] = useState<any[]>([]);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-blue-900">Saved Notes</h2>
          <div className="flex gap-2">
            <button
              onClick={exportNotes}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Export
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-500">No saved notes.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border rounded-lg p-3 hover:bg-blue-50 cursor-pointer transition"
                  onClick={() => {
                    onSelect(note.title, note.content);
                    onClose();
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {note.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {note.content.substring(0, 120)}
                        {note.content.length > 120 ? "..." : ""}
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
      </div>
    </div>
  );
}
