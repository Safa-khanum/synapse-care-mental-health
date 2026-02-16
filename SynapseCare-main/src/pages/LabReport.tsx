import { useState } from "react";

interface LabReportProps {
  onNavigate: (page: string) => void;
}

export default function LabReport({ onNavigate }: LabReportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ------------------------
  // TEXT-TO-SPEECH FUNCTION
  // ------------------------
  const speakReport = async (lang: string) => {
    if (!result) return;

    const summaryText = JSON.stringify(result.summary);

    const payload = new URLSearchParams();
    payload.append("text", summaryText);
    payload.append("lang", lang);

    try {
      const res = await fetch("http://127.0.0.1:5000/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
      });

      const data = await res.json();

      if (data.ok) {
        const audio = document.getElementById("audioPlayer") as HTMLAudioElement;

        audio.src = data.url;
        audio.load();
        audio.style.display = "block";
        audio.play();
      } else {
        alert("Error generating speech");
      }
    } catch (err) {
      console.error(err);
      alert("Could not contact server");
    }
  };

  // ------------------------
  // UPLOAD + ANALYZE FUNCTION
  // ------------------------
  const upload = async () => {
    if (!file) return alert("Please upload a file first!");

    const formData = new FormData();
    formData.append("report", file);

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Lab Report Analyzer</h1>

      <div className="bg-white p-6 shadow rounded mb-6">
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={upload}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze Report"}
        </button>
      </div>

      {result && (
        <div className="p-6 bg-gray-100 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Report Summary</h2>

          <pre className="bg-white p-4 rounded border overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>

          <div className="mt-5 p-4 bg-white rounded shadow border">
            <h3 className="text-xl font-semibold mb-3">Hear My Report</h3>

            <button
              onClick={() => speakReport("en")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
            >
              🔊 Hear in English
            </button>

            <button
              onClick={() => speakReport("hi")}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              🗣️ Hear in Hindi
            </button>

            <audio id="audioPlayer" controls style={{ display: "none" }}></audio>
          </div>
        </div>
      )}
    </div>
  );
}
