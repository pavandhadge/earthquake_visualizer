// src/context/NotesContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { db } from "../db";
import type { Note } from "../db";

// Defines the possible states for the notes panel UI.
type PanelState = "open" | "minimized" | "closed";

// Defines the shape of the context data and functions.
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

// Create the React context.
const NotesContext = createContext<NotesContextType | undefined>(undefined);

/**
 * The provider component that wraps the application to make notes state available.
 * It manages the state of the notes panel, the content of the current note,
 * and provides functions to interact with the state.
 */
export function NotesProvider({ children }: { children: ReactNode }) {
  // State for the panel's visibility (open, minimized, or closed).
  const [state, setState] = useState<PanelState>("closed");
  // State for the content of the note currently being edited.
  const [notes, setNotes] = useState("");
  // State for the title of the note currently being edited.
  const [title, setTitle] = useState("");

  // On initial load, fetch the most recent note to populate the editor.
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

  /**
   * Saves the current note (title and content) to the IndexedDB database.
   * Does not save if the note content is empty.
   */
  const saveNote = async () => {
    if (!notes.trim()) return; // Don't save empty notes
    try {
      await db.notes.add({
        title: title || "Untitled", // Default title if none is provided
        content: notes,
        timestamp: new Date(),
      });
      alert("Note saved!"); // Provide user feedback
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Error: Could not save note.");
    }
  };

  // Action functions to update the panel's state.
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

/**
 * Custom hook to easily access the NotesContext from any component.
 * Throws an error if used outside of a NotesProvider.
 */
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
