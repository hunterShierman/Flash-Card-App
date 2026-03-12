import { useState, useRef } from "react";
import Home from "./Home.jsx";
import Deck from "./Deck.jsx";

const SAMPLE_DATA = [
];

const faceStyle = {
  position: "absolute", width: "100%", height: "100%",
  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
  borderRadius: 20, display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", padding: "40px 48px",
  boxSizing: "border-box",
};

function btn(bg, color, border) {
  return {
    background: bg, color, border: border || "none", borderRadius: 10,
    padding: "11px 22px", fontSize: 14, cursor: "pointer",
    fontFamily: "'Georgia', serif", letterSpacing: 0.5,
    transition: "all 0.15s",
  };
}

export default function App() {
  const [cards, setCards] = useState(SAMPLE_DATA);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [unknown, setUnknown] = useState(new Set());
  const [showImport, setShowImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [done, setDone] = useState(false);
  const fileRef = useRef();
  const [page, setPage] = useState("home");

  const current = cards[index];
  const progress = cards.length > 0 ? ((known.size + unknown.size) / cards.length) * 100 : 0;

  function mark(type) {
    const newKnown = type === "known" ? new Set([...known, current.id]) : known;
    const newUnknown = type === "unknown" ? new Set([...unknown, current.id]) : unknown;
    if (type === "known") setKnown(newKnown);
    else setUnknown(newUnknown);
    setFlipped(false);
    const next = cards.find(c => !newKnown.has(c.id) && !newUnknown.has(c.id));
    if (!next) { setDone(true); return; }
    setIndex(cards.indexOf(next));
  }

  function reset() {
    setKnown(new Set()); setUnknown(new Set());
    setIndex(0); setFlipped(false); setDone(false);
  }

  function retryUnknown() {
    const flagged = cards.filter(c => unknown.has(c.id));
    setCards(flagged);
    setKnown(new Set()); setUnknown(new Set());
    setIndex(0); setFlipped(false); setDone(false);
  }

  function loadJson() {
    setJsonError("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array");
      if (!parsed.every(c => "id" in c && "front" in c && "back" in c))
        throw new Error('Each card needs "id", "front", and "back" fields');
      setCards(parsed);
      setKnown(new Set()); setUnknown(new Set());
      setIndex(0); setFlipped(false); setDone(false);
      setShowImport(false); setJsonInput("");
    } catch (e) { setJsonError(e.message); }
  }

  function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setJsonInput(ev.target.result);
    reader.readAsText(file);
  }

  if (page === "home") return <Home onStart={() => setPage("app")} />;

  if (page === "deck") return (
  <Deck
    onBack={() => setPage("app")}
    onLoad={(parsed) => {
      setCards(parsed);
      reset();
      setPage("app");
    }}
  />
);


  return (

    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #2a4a6b 0%, #1a6e94 40%, #2a7f9a 70%, #1a5a7c 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Georgia', serif", padding: "40px 20px", color: "#ffffff",
    }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 700, marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Study Tool</div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#ffffff", letterSpacing: -0.5 }}>Flashcards</h1>
          </div>
            <button
              onClick={() => setPage("deck")}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff",
                padding: "8px 18px", borderRadius: 10, cursor: "pointer",
                fontSize: 13, letterSpacing: 1, fontFamily: "'Georgia', serif",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
              New Deck
            </button>
        </div>

        {/* Back button */}
        <div style={{ width: "100%", maxWidth: 700, marginBottom: 20 }}>
          <button
            onClick={() => setPage("home")}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#ffffff", padding: "8px 18px",
              borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontFamily: "'Georgia', serif",
              letterSpacing: 0.5,
            }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.1)"}
          >
            ← Home
          </button>
        </div>

        {/* Header */}
        <div style={{ width: "100%", maxWidth: 700, marginBottom: 36 }}></div>

        {/* Progress */}
        <div style={{ marginTop: 22, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "rgba(255,255,255,0.8)",
            borderRadius: 2, transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 18, color: "rgba(255,255,255,0.6)" }}>
          <span>{cards.length} cards loaded</span>
          <span>
            <span style={{ color: "#7effa0" }}>{known.size} known</span>
            &nbsp;·&nbsp;
            <span style={{ color: "#ffb3b3" }}>{unknown.size} flagged</span>
          </span>
        </div>
      </div>

      {/* Import Panel */}
      {showImport && (
        <div style={{
          width: "100%", maxWidth: 700, marginBottom: 28,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 16, padding: 24,
        }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            Expected format:&nbsp;
            <code style={{ color: "#7effa0" }}>[{`{"id":1,"front":"...","back":"..."}`}, ...]</code>
          </div>
          <textarea
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder='[{"id": 1, "front": "Question", "back": "Answer"}]'
            style={{
              width: "100%", height: 130,
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8,
              color: "#ffffff", fontFamily: "monospace", fontSize: 13,
              padding: 12, resize: "vertical", outline: "none",
            }}
          />
          {jsonError && <div style={{ color: "#ffb3b3", fontSize: 13, marginTop: 8 }}>{jsonError}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={loadJson} style={btn("rgba(255,255,255,0.9)", "#1a4731")}>Load Cards</button>
            <button onClick={() => fileRef.current.click()} style={btn("rgba(255,255,255,0.15)", "#ffffff", "1px solid rgba(255,255,255,0.3)")}>Upload .json File</button>
            <input ref={fileRef} type="file" accept=".json" onChange={onFile} style={{ display: "none" }} />
          </div>
        </div>
      )}

      {/* Complete */}
      {done ? (
        <div style={{
          width: "100%", maxWidth: 700, textAlign: "center",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 20, padding: "64px 40px",
        }}>
          <div style={{ fontSize: 52, marginBottom: 18 }}>🎉</div>
          <h2 style={{ margin: "0 0 10px", fontSize: 26, color: "#ffffff" }}>Deck Complete</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 36, fontSize: 15 }}>
            You knew <span style={{ color: "#7effa0", fontWeight: 600 }}>{known.size}</span> cards
            and flagged <span style={{ color: "#ffb3b3", fontWeight: 600 }}>{unknown.size}</span> for review.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <button onClick={reset} style={btn("rgba(255,255,255,0.15)", "#ffffff", "1px solid rgba(255,255,255,0.3)")}>Restart All</button>
            {unknown.size > 0 && (
              <button onClick={retryUnknown} style={btn("rgba(255,255,255,0.9)", "#1a4731")}>
                Retry {unknown.size} Flagged
              </button>
            )}
          </div>
        </div>

      ) : current ? (
        <>
          <div style={{ width: "100%", maxWidth: 700, marginBottom: 10, fontSize: 20, color: "rgb(255, 255, 255)", textAlign: "right" }}>
            {index + 1} / {cards.length}
          </div>

          {/* Card */}
          <div
            onClick={() => setFlipped(f => !f)}
            style={{ width: "100%", maxWidth: 700, height: 440, perspective: 1200, cursor: "pointer", marginBottom: 26 }}
          >
            <div style={{
              width: "100%", height: "100%", position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}>
              {/* Front */}
              <div style={{ ...faceStyle, background: "#ffffff", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
                <div style={{ fontSize: 15, letterSpacing: 3, textTransform: "uppercase", color: "#2d8a57", marginBottom: 22 }}>Question</div>
                <div style={{ fontSize: 25, lineHeight: 1.65, color: "#1a3a2a", textAlign: "center", maxWidth: 520 }}>{current.front}</div>
                <div style={{ position: "absolute", bottom: 22, fontSize: 11, color: "#a0c4b0", letterSpacing: 2 }}>CLICK TO REVEAL</div>
              </div>
              {/* Back */}
              <div style={{ ...faceStyle, background: "#f0faf4", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", transform: "rotateY(180deg)", borderTop: "4px solid #2d8a57" }}>
                <div style={{ fontSize: 15, letterSpacing: 3, textTransform: "uppercase", color: "#2d8a57", marginBottom: 22 }}>Answer</div>
                <div style={{ fontSize: 25, lineHeight: 1.75, color: "#1a3a2a", textAlign: "center", maxWidth: 540 }}>{current.back}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {flipped ? (
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => mark("unknown")} style={btn("rgba(255,100,100,0.2)", "#ffb3b3", "1px solid rgba(255,100,100,0.4)")}>
                ✗ &nbsp; Still Learning
              </button>
              <button onClick={() => mark("known")} style={btn("rgba(100,255,150,0.2)", "#7effa0", "1px solid rgba(100,255,150,0.4)")}>
                ✓ &nbsp; Got It
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => { setIndex((index - 1 + cards.length) % cards.length); setFlipped(false); }}
                style={btn("rgba(255,255,255,0.15)", "#ffffff", "1px solid rgba(255,255,255,0.25)")}
              >← Prev</button>
              <button
                onClick={() => { setIndex((index + 1) % cards.length); setFlipped(false); }}
                style={btn("rgba(255,255,255,0.15)", "#ffffff", "1px solid rgba(255,255,255,0.25)")}
              >Next →</button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
