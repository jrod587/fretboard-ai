import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';



  const MAJOR_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
  const MINOR_KEYS = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "Bbm", "Fm", "Cm", "Gm", "Dm"];

  const DIATONIC_CHORDS = {
    "C": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
    "G": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
    "D": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
    "A": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
    "E": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
    "B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
    "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
    "Db": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
    "Ab": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
    "Eb": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
    "Bb": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
    "F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  };

  const CHORD_FINGERINGS = {
    "C": [
      { name: "Open", frets: [-1, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
      { name: "A-Shape", frets: [-1, 3, 5, 5, 5, 3], fingers: [null, 1, 3, 3, 3, 1] }
    ],
    "G": [
      { name: "Open", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3] },
      { name: "E-Shape", frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1] }
    ],
    "D": [
      { name: "Open", frets: [-1, -1, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },
      { name: "A-Shape", frets: [-1, 5, 7, 7, 7, 5], fingers: [null, 1, 3, 3, 3, 1] }
    ],
    "A": [
      { name: "Open", frets: [-1, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] },
      { name: "E-Shape", frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1] }
    ],
    "E": [
      { name: "Open", frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] },
      { name: "A-Shape", frets: [-1, 7, 9, 9, 9, 7], fingers: [null, 1, 3, 3, 3, 1] }
    ],
    "Am": [
      { name: "Open", frets: [-1, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
      { name: "E-Shape", frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1] }
    ],
    "Em": [
      { name: "Open", frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
      { name: "A-Shape", frets: [-1, 7, 9, 9, 8, 7], fingers: [null, 1, 3, 4, 2, 1] }
    ],
    "Dm": [
      { name: "Open", frets: [-1, -1, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
      { name: "A-Shape", frets: [-1, 5, 7, 7, 6, 5], fingers: [null, 1, 3, 4, 2, 1] }
    ],
    "F": [
      { name: "E-Shape", frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
      { name: "A-Shape", frets: [-1, 8, 10, 10, 10, 8], fingers: [null, 1, 3, 3, 3, 1] }
    ],
    "Bm": [
      { name: "A-Shape", frets: [-1, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 4, 2, 1] },
      { name: "E-Shape", frets: [7, 9, 9, 7, 7, 7], fingers: [1, 3, 4, 1, 1, 1] }
    ],
    "B": [
      { name: "A-Shape", frets: [-1, 2, 4, 4, 4, 2], fingers: [null, 1, 3, 3, 3, 1] },
      { name: "E-Shape", frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1] }
    ],
    "F#m": [
      { name: "E-Shape", frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
      { name: "A-Shape", frets: [-1, 9, 11, 11, 10, 9], fingers: [null, 1, 3, 4, 2, 1] }
    ],
    "C#m": [
      { name: "A-Shape", frets: [-1, 4, 6, 6, 5, 4], fingers: [null, 1, 3, 4, 2, 1] },
      { name: "E-Shape", frets: [9, 11, 11, 9, 9, 9], fingers: [1, 3, 4, 1, 1, 1] }
    ],
    "G#m": [
      { name: "E-Shape", frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1] },
      { name: "A-Shape", frets: [-1, 11, 13, 13, 12, 11], fingers: [null, 1, 3, 4, 2, 1] }
    ]
  };

  const playChord = (frets) => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const stringFreqs = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    frets.forEach((fret, stringIdx) => {
      if (fret === -1) return;
      const freq = stringFreqs[stringIdx] * Math.pow(2, fret / 12);
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now + stringIdx * 0.03);
      gain.gain.linearRampToValueAtTime(0.5, now + stringIdx * 0.03 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stringIdx * 0.03 + 2.0);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + stringIdx * 0.03);
      osc.stop(now + stringIdx * 0.03 + 2.0);
    });
  };

  function MiniFretboard({ chordName }) {
    const [voicingIdx, setVoicingIdx] = useState(0);
    const voicings = CHORD_FINGERINGS[chordName];
    
    useEffect(() => setVoicingIdx(0), [chordName]);

    if (!voicings || !voicings[voicingIdx]) return <div style={{padding: "20px", color: "#888", fontSize: "12px", textAlign:"center"}}>Fingering data coming soon...</div>;

    const data = voicings[voicingIdx];
    const strings = ["E", "A", "D", "G", "B", "e"];
    
    const activeFrets = data.frets.filter(f => f > 0);
    const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 1;
    const isHighNeck = minFret > 3;
    const startFret = isHighNeck ? minFret - 1 : 1;
    const displayFrets = [0,1,2,3,4].map(i => startFret + i);
    
    return (
      <div style={{display:"flex", flexDirection:"column", gap: 8, padding: "10px 0"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 12}}>
          <div style={{display:"flex", gap:4}}>
            {voicings.map((v, i) => (
              <button 
                key={i} 
                onClick={() => setVoicingIdx(i)}
                style={{
                  padding:"4px 8px", background: voicingIdx===i ? "rgba(200,184,122,0.1)" : "transparent",
                  border: voicingIdx===i ? "1px solid #c8b87a" : "1px solid #333",
                  color: voicingIdx===i ? "#c8b87a" : "#888", borderRadius: 4, cursor:"pointer", fontSize: 10
                }}
              >
                {v.name}
              </button>
            ))}
          </div>
          <button 
            onClick={() => playChord(data.frets)}
            style={{
              padding:"4px 10px", background: "#c8b87a", border: "none", color: "#111", 
              borderRadius: 4, cursor:"pointer", fontSize: 11, fontWeight:700, display:"flex", alignItems:"center", gap:4
            }}
          >
            <span>▶</span> PLAY
          </button>
        </div>

        <div style={{display:"flex", alignItems:"center", marginBottom: 10, fontSize:12, color:"#888"}}>
          <div style={{width:20}}></div>
          <div style={{display:"flex", flex:1, justifyContent:"space-around"}}>
            {displayFrets.map(f => <span key={f}>Fr {f}</span>)}
          </div>
        </div>

        {strings.map((stringName, stringIdx) => {
          const fret = data.frets[stringIdx];
          const finger = data.fingers[stringIdx];
          
          return (
            <div key={stringIdx} style={{display:"flex", alignItems:"center", height: 20}}>
              <div style={{width: 20, fontSize: 11, color: "#aaa", fontWeight:700}}>{stringName}</div>
              <div style={{flex:1, position:"relative", display:"flex", alignItems:"center"}}>
                <div style={{width:"100%", height: 2, background: stringIdx<2 ? "#444" : "#333"}} />
                
                {!isHighNeck && <div style={{position:"absolute", left:0, width:4, height:24, background:"#222", top:-11}} />}
                {displayFrets.map((f, i) => (
                  <div key={f} style={{position:"absolute", left:`${((i+1)/5)*100}%`, width:2, height:24, background:"#222", top:-11}} />
                ))}

                {fret > 0 && fret >= startFret && fret <= startFret + 4 && (
                  <div style={{
                    position:"absolute", 
                    left:`${((fret - startFret + 0.5) / 5) * 100}%`, 
                    width: 18, height: 18, 
                    borderRadius: 9, 
                    background: "#c8b87a",
                    transform: "translate(-50%, 0)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color: "#000", fontSize: 10, fontWeight: 700, zIndex: 2
                  }}>
                    {finger}
                  </div>
                )}
                {fret === 0 && <div style={{position:"absolute", left:-10, fontSize:10, color:"#c8b87a"}}>O</div>}
                {fret === -1 && <div style={{position:"absolute", left:-10, fontSize:10, color:"#888"}}>X</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function App() {
    const [activeKeyIdx, setActiveKeyIdx] = useState(0); // Default C Major
    const [activeChord, setActiveChord] = useState("C");

    const activeKey = MAJOR_KEYS[activeKeyIdx];
    const relMinor = MINOR_KEYS[activeKeyIdx];
    const chords = DIATONIC_CHORDS[activeKey];
    
    const ivIdx = (activeKeyIdx + 11) % 12;
    const vIdx = (activeKeyIdx + 1) % 12;

    const progressions = [
      { name: "Pop Punk / Modern", chords: [chords[0], chords[4], chords[5], chords[3]] },
      { name: "Classic Rock", chords: [chords[0], chords[3], chords[4], chords[0]] },
      { name: "Jazz / R&B", chords: [chords[1], chords[4], chords[0], chords[0]] }
    ];

    const playProgression = (progChords) => {
      progChords.forEach((chordName, i) => {
        setTimeout(() => {
          const voicings = CHORD_FINGERINGS[chordName];
          if (voicings && voicings[0]) {
            playChord(voicings[0].frets);
            setActiveChord(chordName);
          }
        }, i * 1500);
      });
    };

    return (
      <div className="app-container">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px 8px",borderBottom:"1px solid #181818",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <a href="https://tonecrafted.com" style={{fontSize:16,fontWeight:700,color:"#c8b87a",letterSpacing:2,textDecoration:"none"}}>TONECRAFTED</a>
            <span style={{fontSize:"11px",color:"#bbb",letterSpacing:1,fontFamily:"system-ui,-apple-system,sans-serif"}}>Path & Theory</span>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <a href="/index.html" style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"transparent",color:"#999",fontSize:"11px",textDecoration:"none"}}>Scale Explorer</a>
            <a href="/local_copilot.html" style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"transparent",color:"#999",fontSize:"11px",textDecoration:"none"}}><span>🎸</span>Song Copilot</a>
            <Link to="/pulse" style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"transparent",color:"#999",fontSize:"11px",textDecoration:"none"}}><span>🥁</span>Pulse</Link>
            <Link to="/ladder" style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"transparent",color:"#999",fontSize:"11px",textDecoration:"none"}}><span>🪜</span>Ladder</Link>
            <button style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"#c8b87a",color:"#111",fontSize:"11px",fontWeight:700}}><span>⭕</span>Path</button>
          </div>
        </div>

        <div className="main-content">
          <div className="left-panel">
            <h2 style={{fontSize:20, fontWeight:300, marginBottom: 8, letterSpacing: 2}}>PATH</h2>
            <p style={{fontSize:12, color:"#888", textAlign:"center", marginBottom: 12}}>
              Path helps you hear and see how notes relate, so scales stop feeling random. Start on one string, then watch the pattern appear across the neck.
            </p>
            <p style={{fontSize:11, color:"#666", textAlign:"center", marginBottom: 30}}>
              Need rhythm? <Link to="/pulse" style={{color:"#c8b87a", textDecoration:"none"}}>Go to Pulse</Link>. Need note drilling? <a href="/index.html" style={{color:"#c8b87a", textDecoration:"none"}}>Go to Fretboard AI</a>.
            </p>
            
            <svg width="300" height="300" viewBox="-150 -150 300 300" style={{transform: "rotate(-90deg)"}}>
              {MAJOR_KEYS.map((key, i) => {
                const angle = (i * 30);
                const isActive = i === activeKeyIdx;
                const isIV = i === ivIdx;
                const isV = i === vIdx;
                
                let fill = "#111";
                if (isActive) fill = "rgba(200, 184, 122, 0.2)";
                else if (isIV) fill = "rgba(200, 184, 122, 0.05)";
                else if (isV) fill = "rgba(200, 184, 122, 0.08)";

                let stroke = isActive ? "#c8b87a" : "#222";

                const startAngle = (angle - 15) * Math.PI / 180;
                const endAngle = (angle + 15) * Math.PI / 180;
                
                const x1 = 140 * Math.cos(startAngle);
                const y1 = 140 * Math.sin(startAngle);
                const x2 = 140 * Math.cos(endAngle);
                const y2 = 140 * Math.sin(endAngle);
                
                const ix1 = 70 * Math.cos(startAngle);
                const iy1 = 70 * Math.sin(startAngle);
                const ix2 = 70 * Math.cos(endAngle);
                const iy2 = 70 * Math.sin(endAngle);

                const majorPath = `M ${ix1} ${iy1} L ${x1} ${y1} A 140 140 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A 70 70 0 0 0 ${ix1} ${iy1} Z`;
                
                const mx1 = 30 * Math.cos(startAngle);
                const my1 = 30 * Math.sin(startAngle);
                const mx2 = 30 * Math.cos(endAngle);
                const my2 = 30 * Math.sin(endAngle);
                const minorPath = `M ${mx1} ${my1} L ${ix1} ${iy1} A 70 70 0 0 1 ${ix2} ${iy2} L ${mx2} ${my2} A 30 30 0 0 0 ${mx1} ${my1} Z`;

                return (
                  <g key={i} className="slice" onClick={() => {setActiveKeyIdx(i); setActiveChord(MAJOR_KEYS[i])}}>
                    <path d={majorPath} fill={fill} stroke={stroke} strokeWidth="1" />
                    <text 
                      x={105 * Math.cos(angle * Math.PI / 180)} 
                      y={105 * Math.sin(angle * Math.PI / 180)} 
                      transform={`rotate(90, ${105 * Math.cos(angle * Math.PI / 180)}, ${105 * Math.sin(angle * Math.PI / 180)})`}
                      fill={isActive ? "#c8b87a" : "#aaa"} 
                      fontSize="16" fontWeight="600" textAnchor="middle" dominantBaseline="middle"
                    >
                      {key}
                    </text>
                    
                    <path d={minorPath} fill={isActive ? "rgba(200, 184, 122, 0.1)" : "#0c0c0c"} stroke={stroke} strokeWidth="1" />
                    <text 
                      x={50 * Math.cos(angle * Math.PI / 180)} 
                      y={50 * Math.sin(angle * Math.PI / 180)} 
                      transform={`rotate(90, ${50 * Math.cos(angle * Math.PI / 180)}, ${50 * Math.sin(angle * Math.PI / 180)})`}
                      fill={isActive ? "#c8b87a" : "#666"} 
                      fontSize="12" textAnchor="middle" dominantBaseline="middle"
                    >
                      {MINOR_KEYS[i]}
                    </text>
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="30" fill="#080808" stroke="#222" strokeWidth="1" />
            </svg>
            
            <div style={{marginTop: 30, display:"flex", flexDirection:"column", gap: 10, width:"100%"}}>
              <div style={{fontSize:11, color:"#888", letterSpacing:1}}>KEY SIGNATURE</div>
              <div style={{background:"#111", padding:"12px", borderRadius:6, border:"1px solid #222", color:"#ccc", fontSize:14}}>
                <strong>{activeKey} Major</strong> / <strong>{relMinor}</strong>
              </div>
            </div>

            {/* Soloing Guide */}
            <div style={{marginTop: 16, display:"flex", flexDirection:"column", gap: 10, width:"100%"}}>
              <div style={{fontSize:11, color:"#888", letterSpacing:1}}>SOLOING GUIDE</div>
              <div style={{background:"rgba(200,184,122,0.05)", padding:"16px", borderRadius:6, border:"1px solid rgba(200,184,122,0.2)", color:"#ccc", fontSize:13, lineHeight:1.5}}>
                To solo over this progression, try using the <strong>{activeKey} Major Scale</strong> for a happy, melodic sound, or the <strong>{relMinor} Minor Pentatonic</strong> for a bluesy, aggressive feel.
                <br/><br/>
                <a href={`/index.html?key=${activeKey}&scale=pentatonic_minor`} style={{color:"#c8b87a", textDecoration:"none", fontWeight:600, display:"inline-flex", alignItems:"center", gap:4}}>
                  Open in Scale Explorer <span>→</span>
                </a>
              </div>
            </div>

          </div>

          <div className="right-panel">
            <h2 style={{fontSize:28, fontWeight:400, color:"#e8e0d0", marginBottom: 4}}>Diatonic Chords in {activeKey}</h2>
            <p style={{fontSize:14, color:"#888", marginBottom: 24}}>These are the chords that naturally occur in the key of {activeKey} Major. Click any chord to view its fretboard fingering.</p>
            
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(100px, 1fr))", gap:12, marginBottom: 40}}>
              {chords.map((chord, i) => (
                <div 
                  key={i} 
                  className={`chord-card ${activeChord === chord ? 'active' : ''}`}
                  onClick={() => {
                    setActiveChord(chord);
                    if(CHORD_FINGERINGS[chord]) playChord(CHORD_FINGERINGS[chord][0].frets);
                  }}
                >
                  <div style={{fontSize:10, color:activeChord===chord?"#c8b87a":"#666", marginBottom:4, fontFamily:"monospace"}}>
                    {['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'][i]}
                  </div>
                  <div style={{fontSize:20, fontWeight:600, color:activeChord===chord?"#fff":"#ccc"}}>{chord}</div>
                </div>
              ))}
            </div>

            <div style={{display:"flex", gap: 30, flexWrap: "wrap"}}>
              <div style={{flex: 1, minWidth: 300}}>
                <h3 style={{fontSize:16, fontWeight:500, color:"#e8e0d0", marginBottom: 16, borderBottom:"1px solid #222", paddingBottom:8}}>Common Progressions</h3>
                <div style={{display:"flex", flexDirection:"column", gap:12}}>
                  {progressions.map((prog, i) => (
                    <div key={i} style={{background:"rgba(255,255,255,0.02)", border:"1px solid #1a1a1a", borderRadius:8, padding:16}}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
                        <div style={{fontSize:11, color:"#888", textTransform:"uppercase", letterSpacing:1}}>{prog.name}</div>
                        <button onClick={() => playProgression(prog.chords)} style={{background:"transparent", border:"1px solid #444", color:"#ccc", padding:"2px 8px", borderRadius:4, fontSize:10, cursor:"pointer"}}>
                          ▶ PLAY
                        </button>
                      </div>
                      <div style={{display:"flex", gap:8}}>
                        {prog.chords.map((c, j) => (
                          <div 
                            key={j} 
                            onClick={() => {
                              setActiveChord(c);
                              if(CHORD_FINGERINGS[c]) playChord(CHORD_FINGERINGS[c][0].frets);
                            }}
                            style={{padding:"6px 12px", background:"#111", border: c===activeChord ? "1px solid #c8b87a" : "1px solid #333", borderRadius:4, color: c===activeChord ? "#fff" : "#aaa", fontSize:14, fontWeight:600, cursor:"pointer"}}
                          >
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{width: 320}}>
                <h3 style={{fontSize:16, fontWeight:500, color:"#e8e0d0", marginBottom: 16, borderBottom:"1px solid #222", paddingBottom:8}}>Finger Placement</h3>
                <div style={{background:"#111", border:"1px solid #222", borderRadius:8, padding:20}}>
                  <div style={{fontSize:24, fontWeight:700, color:"#c8b87a", marginBottom: 16}}>{activeChord}</div>
                  <MiniFretboard chordName={activeChord} />
                  <div style={{fontSize:11, color:"#666", marginTop:16, textAlign:"center"}}>
                    Numbers = Fingers (1=Index, 4=Pinky)<br/>O = Open String, X = Don't Play
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }export default App;
