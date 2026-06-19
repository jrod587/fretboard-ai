import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const INTERVAL_DATA = [
  { iv: 0, name: "Root", feeling: "The home base. Solid, grounded, and stable." },
  { iv: 1, name: "Minor 2nd", feeling: "Extremely tense, dark, and dissonant. Wants to resolve immediately." },
  { iv: 2, name: "Major 2nd", feeling: "Open, slightly tense, expectant. Used in suspended chords." },
  { iv: 3, name: "Minor 3rd", feeling: "Sad, melancholic, dark. Defines the minor chord." },
  { iv: 4, name: "Major 3rd", feeling: "Bright, uplifting, happy. Defines the major chord." },
  { iv: 5, name: "Perfect 4th", feeling: "Spacious, suspended, open. Common in rock and power chords." },
  { iv: 6, name: "Flat 5th / Tritone", feeling: "The 'Devil in Music'. Very tense, uneasy, 'bluesy' when used right." },
  { iv: 7, name: "Perfect 5th", feeling: "Powerful, hollow, rock-solid. The backbone of power chords." },
  { iv: 8, name: "Minor 6th", feeling: "Tragic, sorrowful, dramatic. Pulls strongly down to the 5th." },
  { iv: 9, name: "Major 6th", feeling: "Sweet, playful, nostalgic. The 'country' or 'Dorian' sound." },
  { iv: 10, name: "Minor 7th", feeling: "Bluesy, funky, restless. Defines the dominant 7th chord." },
  { iv: 11, name: "Major 7th", feeling: "Dreamy, floaty, romantic. Wants to resolve up to the root." },
  { iv: 12, name: "Octave", feeling: "The root, but higher. Complete resolution." }
];

const THEMES = [
  {id:"ebony",name:"Ebony",swatch:"#c8b87a",accent:"#c8b87a",scaleFg:"#c0f0d4",scaleBg:"#0e2016",scaleBorder:"#1e4028",natFg:"#d0a850",natBg:"#1e1508",sharpFg:"#5878b8",sharpBg:"#0e1228",desc:"dark wood · gold hardware"}
];

function Ladder() {
  const [root, setRoot] = useState("C");
  const [activeIv, setActiveIv] = useState(4); // Default to Major 3rd
  const t = THEMES[0];
  const SITE_URL = "https://tonecrafted.com";

  const playInterval = (note1, note2) => {
    // In a full implementation, we'd trigger a Web Audio Synth here.
    // console.log("Playing", note1, note2);
  };

  const handleIvClick = (ivIndex) => {
    setActiveIv(ivIndex);
    const rootNote = root;
    const ivNote = NOTES[(NOTES.indexOf(root) + ivIndex) % 12];
    playInterval(rootNote, ivNote);
  };

  const activeData = INTERVAL_DATA[activeIv];
  const activeNote = NOTES[(NOTES.indexOf(root) + activeIv) % 12];

  // Helper for single string fretboard
  const renderMiniFretboard = () => {
    const NUM_FRETS = 15;
    const FW = 46;
    const SH = 40;
    const DOTS = new Set([3,5,7,9,12,15]);

    return (
      <div style={{ overflowX: "auto", padding: "10px 0", marginTop: "20px" }}>
        <div style={{ minWidth: (NUM_FRETS + 1) * FW, position: "relative" }}>
          {/* Fret Numbers */}
          <div style={{ display: "flex", marginBottom: 3 }}>
            {Array.from({ length: NUM_FRETS + 1 }, (_, f) => (
              <div key={f} style={{ width: FW, flexShrink: 0, textAlign: "center", fontSize: "10px", color: DOTS.has(f) ? "#c8b87a" : "#666", fontWeight: DOTS.has(f) ? 700 : 400 }}>{f === 0 ? "NUT" : f}</div>
            ))}
          </div>
          {/* The String */}
          <div style={{ display: "flex", alignItems: "center", height: SH, position: "relative" }}>
            {Array.from({ length: NUM_FRETS + 1 }, (_, fret) => {
              const isRoot = fret === 0;
              const isActive = fret === activeIv;
              
              let bg = "transparent", fg = "transparent", ring = "none", size = 24, label = "";
              
              if (isRoot) {
                bg = t.accent; fg = "#111"; label = root;
              } else if (isActive) {
                bg = "#48b0e0"; fg = "#111"; ring = "2px solid #fff"; size = 26; label = activeNote; // oceanic blue for interval
              }

              return (
                <div key={fret} style={{ width: FW, height: SH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderRight: fret === 0 ? `3px solid #c8b87a` : "1px solid #333" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "#888", zIndex: 0 }} />
                  <div style={{ width: size, height: size, borderRadius: size / 2, zIndex: 2, position: "relative", background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, border: ring, fontFamily: "inherit" }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Dots below string */}
          {[3,5,7,9,12,15].flatMap(f => {
            const x = f * FW + FW / 2 - 3;
            const ds = top => ({ position: "absolute", left: x, top, width: 6, height: 6, borderRadius: 3, background: "#333", zIndex: 4, pointerEvents: "none" });
            return f === 12 ? [<div key={`a${f}`} style={ds(60)} />] : [<div key={f} style={ds(60)} />];
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "#d4c9a8", display: "flex", flexDirection: "column" }}>
      
      {/* Top Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px 8px", borderBottom: "1px solid #181818", flexShrink: 0, fontFamily: "'Courier New', monospace" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <a href={SITE_URL} style={{ fontSize: 16, fontWeight: 700, color: t.accent, letterSpacing: 2, textDecoration: "none" }}>TONECRAFTED</a>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/" style={{ padding: "4px 10px", color: "#999", textDecoration: "none", fontSize: "11px" }}>Fretboard AI</Link>
          <Link to="/ladder" style={{ padding: "4px 10px", color: "#111", background: t.accent, borderRadius: 3, textDecoration: "none", fontSize: "11px", fontWeight: 700 }}>Ladder</Link>
          <Link to="/pulse" style={{ padding: "4px 10px", color: "#999", textDecoration: "none", fontSize: "11px" }}>Pulse</Link>
          <Link to="/harmony" style={{ padding: "4px 10px", color: "#999", textDecoration: "none", fontSize: "11px" }}>Path</Link>
        </div>
      </div>

      {/* Main Content Area - Single Lesson */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
        
        {/* Hero */}
        <div style={{ textAlign: "center", maxWidth: 600, marginBottom: 40 }}>
          <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#fff", marginBottom: "16px", letterSpacing: "-0.5px" }}>Understand the space between notes.</h1>
          <p style={{ fontSize: "16px", color: "#aaa", lineHeight: 1.6, marginBottom: "16px" }}>An interval is the distance between two notes. That distance is what makes music feel bright, tense, sad, open, or resolved.</p>
          <p style={{ fontSize: "14px", color: t.accent, fontWeight: 500 }}>Pick a root note, then click a step to hear and see how that distance feels on the guitar.</p>
        </div>

        {/* Root Selector */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>Choose a root note:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {["C","G","D","A","E","B","F"].map(n => (
              <button 
                key={n} 
                onClick={() => setRoot(n)} 
                style={{ width: 40, height: 40, borderRadius: 20, border: "none", cursor: "pointer", background: root === n ? t.accent : "#1a1a1a", color: root === n ? "#111" : "#bbb", fontSize: "14px", fontWeight: root === n ? 700 : 500 }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* The Interval Rail & Insight Card */}
        <div style={{ width: "100%", maxWidth: 800, position: "relative" }}>
          
          {/* Insight Card */}
          <div style={{ minHeight: 120, display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: "20px", width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", transition: "all 0.3s ease" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{activeData.name}</div>
              <div style={{ fontSize: "13px", color: t.accent, marginBottom: 12, fontFamily: "'Courier New', monospace" }}>{activeIv} frets from the root</div>
              <div style={{ fontSize: "15px", color: "#ddd", lineHeight: 1.5, marginBottom: 16 }}>{activeData.feeling}</div>
              <div style={{ fontSize: "13px", color: "#888", borderTop: "1px solid #222", paddingTop: 12 }}>
                If your root is <strong style={{color:"#fff"}}>{root}</strong>, this note is <strong style={{color:"#fff"}}>{activeNote}</strong>
              </div>
            </div>
          </div>

          {/* Horizontal Rail */}
          <div style={{ position: "relative", height: 60, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 20, right: 20, height: 4, background: "#222", borderRadius: 2, zIndex: 0 }} />
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", zIndex: 1 }}>
              {INTERVAL_DATA.map((iv, idx) => {
                const isActive = activeIv === idx;
                const isRoot = idx === 0;
                let bg = "#1a1a1a";
                let size = 20;
                let border = "2px solid #333";
                
                if (isActive) {
                  bg = "#48b0e0"; size = 28; border = "2px solid #fff";
                } else if (isRoot) {
                  bg = t.accent; size = 24; border = "2px solid #111";
                }

                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: 40 }} onClick={() => handleIvClick(idx)}>
                    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, border: border, transition: "all 0.2s ease" }} />
                    <div style={{ fontSize: "10px", color: isActive ? "#fff" : "#666", marginTop: 8, fontFamily: "'Courier New', monospace", fontWeight: isActive ? 700 : 400 }}>{idx}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Fretboard Anchor */}
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: "11px", color: "#666", letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Courier New', monospace", textAlign: "center" }}>
              How it looks on a single string
            </div>
            {renderMiniFretboard()}
          </div>

        </div>
      </div>

      {/* Ecosystem Strip */}
      <div style={{ borderTop: "1px solid #181818", padding: "16px 20px", background: "#050505", textAlign: "center", fontSize: "12px", color: "#888", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Master the fretboard step-by-step:{' '}
        <Link to="/pulse" style={{ color: "#aaa", textDecoration: "none", margin: "0 8px" }}>Pulse (Rhythm)</Link> →{' '}
        <span style={{ color: "#fff", fontWeight: 600, margin: "0 8px" }}>Ladder (Distance)</span> →{' '}
        <Link to="/harmony" style={{ color: "#aaa", textDecoration: "none", margin: "0 8px" }}>Path (Shapes)</Link> →{' '}
        <Link to="/" style={{ color: "#aaa", textDecoration: "none", margin: "0 8px" }}>Fretboard AI (Fluency)</Link>
      </div>

    </div>
  );
}

export default Ladder;
