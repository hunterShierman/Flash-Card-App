import { useState, useRef } from "react";

export default function Deck({ onLoad, onBack }) {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const fileRef = useRef();

  function loadJson() {
    setJsonError("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array");
      if (!parsed.every(c => "id" in c && "front" in c && "back" in c))
        throw new Error('Each card needs "id", "front", and "back" fields');
      onLoad(parsed);
    } catch (e) { setJsonError(e.message); }
  }

  function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setJsonInput(ev.target.result);
    reader.readAsText(file);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a2f47 0%, #0f4e6e 40%, #1a5f7a 70%, #0d3f5c 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Georgia', serif", padding: "40px 20px", color: "#ffffff",
    }}>

      {/* Back button */}
      <div style={{ width: "100%", maxWidth: 600, marginBottom: 32 }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#ffffff", padding: "8px 18px",
            borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontFamily: "'Georgia', serif", letterSpacing: 0.5,
          }}
          onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.1)"}
        >
          ← Back
        </button>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>
          New Deck
        </div>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, letterSpacing: -1, color: "#ffffff" }}>
          Load your cards
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
          Paste JSON below or upload a file to get started.
        </p>
      </div>

      {/* Import panel */}
      <div style={{
        width: "100%", maxWidth: 600,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 16, padding: 28,
      }}>

        {/* Format hint */}
        <div style={{
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "14px 18px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
            Expected format
          </div>
          <code style={{ fontSize: 12, color: "#7effa0", lineHeight: 1.7, display: "block" }}>
            {`[`}<br />
            &nbsp;&nbsp;{`{ "id": 1, "front": "Question", "back": "Answer" },`}<br />
            &nbsp;&nbsp;{`{ "id": 2, "front": "Question", "back": "Answer" }`}<br />
            {`]`}
          </code>
        </div>

        <textarea
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder='[{"id": 1, "front": "Question", "back": "Answer"}]'
          style={{
            width: "100%", height: 180,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10, color: "#ffffff",
            fontFamily: "monospace", fontSize: 13,
            padding: 14, resize: "vertical", outline: "none",
            boxSizing: "border-box",
          }}
        />

        {jsonError && (
          <div style={{ color: "#ffb3b3", fontSize: 13, marginTop: 10 }}>{jsonError}</div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button
            onClick={loadJson}
            style={{
              background: "rgba(255,255,255,0.95)", color: "#1a4731",
              border: "none", padding: "12px 28px", borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Georgia', serif", letterSpacing: 0.5,
            }}
            onMouseEnter={e => e.target.style.opacity = "0.9"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            Load Cards
          </button>
          <button
            onClick={() => fileRef.current.click()}
            style={{
              background: "rgba(255,255,255,0.1)", color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "12px 28px", borderRadius: 10,
              fontSize: 14, cursor: "pointer",
              fontFamily: "'Georgia', serif", letterSpacing: 0.5,
            }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.1)"}
          >
            Upload .json File
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={onFile} style={{ display: "none" }} />
        </div>
      </div>
    </div>
  );
}