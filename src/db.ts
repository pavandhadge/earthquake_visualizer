// src/db.ts
import Dexie from "dexie";

// EXPORT THE INTERFACE
export interface Note {
  id?: number;
  title: string;
  content: string;
  timestamp: Date;
}

export class NotesDB extends Dexie {
  notes!: Dexie.Table<Note>;

  constructor() {
    super("EarthquakeNotesDB");
    this.version(1).stores({
      notes: "++id, title, content, timestamp",
    });
  }
}

export const db = new NotesDB();
