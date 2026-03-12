export default function Home({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #2a4a6b 0%, #1a6e94 40%, #2a7f9a 70%, #1a5a7c 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "'Georgia', serif",
      padding: "40px 20px", color: "#ffffff",
    }}>

      {/* Logo / Title */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>
          Study Tool
        </div>
        <h1 style={{ margin: 0, fontSize: 52, fontWeight: 700, letterSpacing: -1.5, color: "#ffffff" }}>
          Flashcards
        </h1>
        <p style={{ margin: "14px 0 0", fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 420, lineHeight: 1.6 }}>
          Load any set of cards, study at your own pace, and track what you know.
        </p>
      </div>

      {/* Steps */}
      <div style={{
        display: "flex", gap: 16, marginBottom: 52,
        flexWrap: "wrap", justifyContent: "center", maxWidth: 760,
      }}>
        {[
          { step: "1", title: "Import your cards", desc: "Paste JSON or upload a .json file. Each card needs an id, front, and back field." },
          { step: "2", title: "Flip to reveal", desc: "Click any card to flip it and see the answer on the back." },
          { step: "3", title: "Mark your progress", desc: "Hit Got It or Still Learning after each flip to track where you stand." },
          { step: "4", title: "Retry what you missed", desc: "When the deck is done, retry only the cards you flagged for review." },
        ].map(({ step, title, desc }) => (
          <div key={step} style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 16, padding: "24px 22px",
            width: 300, flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              color: "#1a4731", fontWeight: 700, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 14,
            }}>
              {step}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* JSON format hint */}
      <div style={{
        background: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 12, padding: "16px 24px",
        marginBottom: 44, maxWidth: 520, width: "100%",
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>
          Expected JSON format
        </div>
        <code style={{ fontSize: 13, color: "#7effa0", lineHeight: 1.7, display: "block" }}>
          {`[`}<br />
          &nbsp;&nbsp;{`{ "id": 1, "front": "Question", "back": "Answer" },`}<br />
          &nbsp;&nbsp;{`{ "id": 2, "front": "Question", "back": "Answer" }`}<br />
          {`]`}
        </code>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          background: "rgba(255,255,255,0.95)",
          color: "#1a4731", border: "none",
          padding: "16px 48px", borderRadius: 12,
          fontSize: 16, fontWeight: 700,
          fontFamily: "'Georgia', serif",
          cursor: "pointer", letterSpacing: 0.5,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(0,0,0,0.25)"; }}
        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
      >
        Get Started →
      </button>

    </div>
  );
}