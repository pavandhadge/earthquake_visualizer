// db/sqliteManager.ts
import initSqlJs, { Database, SqlJsStatic } from "sql.js";

interface Note {
  id: number;
  title: string | null;
  content: string;
  timestamp: string;
}

class SQLiteManager {
  private db: Database | null = null;
  private SQL: SqlJsStatic | null = null;
  private readonly DB_NAME = "earthquake-notes.db";
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._init();
    return this.initPromise;
  }

  private async _init(): Promise<void> {
    try {
      console.log("Initializing sql.js...");

      this.SQL = await initSqlJs({
        // Use local WASM file
        locateFile: () => "/sqljs/sql-wasm.wasm",
      });

      console.log("sql.js loaded");

      const saved = await this.loadFromIndexedDB();
      this.db = saved ? new this.SQL.Database(saved) : new this.SQL.Database();

      this.db.run(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await this.saveToIndexedDB();
      this.initialized = true;
      console.log("DB initialized successfully");
    } catch (err) {
      console.error("DB init failed:", err);
      // Fallback: in-memory DB
      if (!this.db && this.SQL) {
        this.db = new this.SQL.Database();
        this.db.run(
          `CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, timestamp TEXT);`,
        );
        this.initialized = true;
        console.log("Using in-memory fallback DB");
      }
    }
  }

  addNote(note: { title?: string; content: string }): void {
    if (!this.db) throw new Error("DB not initialized");
    this.db.run(`INSERT INTO notes (title, content) VALUES (?, ?)`, [
      note.title || null,
      note.content,
    ]);
    this.saveToIndexedDB().catch(console.error);
  }

  getNotes(): Note[] {
    if (!this.db) return [];
    try {
      const stmt = this.db.prepare(
        `SELECT * FROM notes ORDER BY timestamp DESC`,
      );
      const result: Note[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        result.push({
          id: row.id as number,
          title: row.title as string | null,
          content: row.content as string,
          timestamp: row.timestamp as string,
        });
      }
      stmt.free();
      return result;
    } catch (err) {
      console.error("getNotes failed:", err);
      return [];
    }
  }

  deleteNote(id: number): void {
    if (!this.db) return;
    this.db.run(`DELETE FROM notes WHERE id = ?`, [id]);
    this.saveToIndexedDB().catch(console.error);
  }

  async exportDB(): Promise<Blob> {
    if (!this.db) throw new Error("DB not initialized");
    const data = this.db.export();
    return new Blob([data], { type: "application/octet-stream" });
  }

  // --- IndexedDB ---
  private async saveToIndexedDB(): Promise<void> {
    if (!this.db) return;
    const data = this.db.export();
    const request = indexedDB.open("EarthquakeDB", 1);

    request.onupgradeneeded = (e) => {
      const db = (e.target as any).result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    };

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("files", "readwrite");
        const store = tx.objectStore("files");
        const putReq = store.put(data, this.DB_NAME);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async loadFromIndexedDB(): Promise<Uint8Array | null> {
    const request = indexedDB.open("EarthquakeDB", 1);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("files")) {
          resolve(null);
          return;
        }
        const tx = db.transaction("files", "readonly");
        const store = tx.objectStore("files");
        const getReq = store.get(this.DB_NAME);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => reject(getReq.error);
      };
      request.onerror = () => resolve(null); // Fallback
    });
  }
}

export default new SQLiteManager();
