// src/context/NotesContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { db } from "../db"; // ← Import Note here
import type { Note } from "../db";
type PanelState = "open" | "minimized" | "closed";

interface NotesContextType {
  state: PanelState;
  notes: string;
  setNotes: (text: string) => void;
  title: string;
  setTitle: (title: string) => void;
  saveNote: () => Promise<void>;
  open: () => void;
  minimize: () => void;
  close: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PanelState>("closed");
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    db.notes
      .orderBy("timestamp")
      .reverse()
      .limit(1)
      .first()
      .then((note: Note | undefined) => {
        if (note) {
          setTitle(note.title);
          setNotes(note.content);
        }
      })
      .catch(console.error);
  }, []);

  // In saveNote function — ONLY CLEAR INPUT, DON'T MINIMIZE
  // src/context/NotesContext.tsx
  const saveNote = async () => {
    if (!notes.trim()) return;
    try {
      await db.notes.add({
        title: title || "Untitled",
        content: notes,
        timestamp: new Date(),
      });
      // DO NOT CLEAR INPUT
      // setNotes("");
      // setTitle("");
      // Just show success
      alert("Note saved!");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };
  const open = () => setState("open");
  const minimize = () => setState("minimized");
  const close = () => setState("closed");

  return (
    <NotesContext.Provider
      value={{
        state,
        notes,
        setNotes,
        title,
        setTitle,
        saveNote,
        open,
        minimize,
        close,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within NotesProvider");
  return context;
};
