"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Upload a file first!");

    const formData = new FormData();
    formData.append("file", file);

    const ocrRes = await fetch("/api/ocr", {
      method: "POST",
      body: formData,
    });

    const ocrText = await ocrRes.text();
    setText(ocrText);

    const summaryRes = await fetch("/api/summarize", {
      method: "POST",
      body: JSON.stringify({ text: ocrText }),
      headers: { "Content-Type": "application/json" },
    });

    const summaryData = await summaryRes.text();
    setSummary(summaryData);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">📄 Upload Vet Record</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload & Summarize
      </button>

      {text && (
        <div className="mt-8 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-2">🧾 Extracted Text:</h2>
          <pre className="p-2 bg-gray-100 border rounded">{text}</pre>
        </div>
      )}

      {summary && (
        <div className="mt-8 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-2">✨ Summary:</h2>
          <pre className="p-2 bg-green-100 border rounded">{summary}</pre>
        </div>
      )}
    </main>
  );
}
