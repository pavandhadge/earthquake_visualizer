// src/components/NoteViewer.tsx
// import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  content: string;
  timestamp: string;
  onBack: () => void;
}

export function NoteViewer({ title, content, timestamp, onBack }: Props) {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          ← Back to Notes
        </button>

        {/* Note Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            {title || "Untitled Note"}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {new Date(timestamp).toLocaleString()}
          </p>
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
