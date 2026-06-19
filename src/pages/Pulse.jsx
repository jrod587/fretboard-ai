import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const signatures = {
  4: {
    beats: 4,
    title: "The March (4/4 Time)",
    text: "This is the bedrock of modern music. It feels like a steady, relentless march. When musicians say a song is in '4/4', they just mean there's a heavy pulse every 4 beats. It's the groove you already know by heart.",
    examples: [
      "Smells Like Teen Spirit (Nirvana)",
      "Knockin' on Heaven's Door (Bob Dylan)",
      "Almost everything else on the radio"
    ],
    practice: "Try strumming a simple G chord on the '1' of every cycle."
  },
  3: {
    beats: 3,
    title: "The Circle (3/4 Time)",
    text: "Notice how this feels like it's spinning? It has a natural, rolling sway to it that makes you want to rock back and forth. This is the classic 'waltz' feel.",
    examples: [
      "Piano Man (Billy Joel)",
      "Hallelujah (Leonard Cohen)",
      "Manic Depression (Jimi Hendrix)"
    ],
    practice: "Try picking the bass note on the '1', and strumming the rest of the chord on '2' and '3'."
  },
  6: {
    beats: 6,
    title: "The Sway (6/8 Time)",
    text: "This pulls you side to side. It feels a lot like the waltz (3/4), but it's heavier and drags a bit more. It's usually felt as two big, sweeping motions. It feels like a heartbeat in a dark room.",
    examples: [
      "House of the Rising Sun (The Animals)",
      "We Are The Champions (Queen)",
      "Nothing Else Matters (Metallica)"
    ],
    practice: "Arpeggiate a chord: pick the bass note on the '1', then pluck two other strings on '2' and '3'."
  },
  5: {
    beats: 5,
    title: "The Tension (5/4 Time)",
    text: "It feels like walking with a limp. It never quite resolves when your brain expects it to, which keeps the listener constantly on edge. It's built by slamming a 3-beat groove and a 2-beat groove together.",
    examples: [
      "Take Five (Dave Brubeck)",
      "Mission Impossible Theme",
      "15 Step (Radiohead)"
    ],
    practice: "Strum your chord firmly on the '1', let it ring for 3 beats, then do a quick mute scratch on the 2-beat turnaround."
  }
};

export default function Pulse() {
  const [currentSig, setCurrentSig] = useState(4);
  const [bpm, setBpm] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const audioCtxRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerIDRef = useRef(null);
  const bpmRef = useRef(bpm);
  const currentSigRef = useRef(currentSig);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    bpmRef.current = bpm;
    currentSigRef.current = currentSig;
  }, [isPlaying, bpm, currentSig]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    nextNoteTimeRef.current += secondsPerBeat;
    currentStepRef.current++;
    if (currentStepRef.current >= signatures[currentSigRef.current].beats) {
      currentStepRef.current = 0;
    }
  };

  const playTone = (time, isDownbeat) => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    if (isDownbeat) {
      osc.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.8, time);
    } else {
      osc.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.4, time);
    }
    
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    
    osc.start(time);
    osc.stop(time + 0.1);
  };

  const scheduler = () => {
    if (!audioCtxRef.current || !isPlayingRef.current) return;

    const lookahead = 25.0; 
    const scheduleAheadTime = 0.1; 

    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
      const stepToHighlight = currentStepRef.current;
      const timeToPlay = nextNoteTimeRef.current;
      const timeMs = (timeToPlay - audioCtxRef.current.currentTime) * 1000;
      
      setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentStep(stepToHighlight);
        }
      }, Math.max(0, timeMs));

      playTone(timeToPlay, currentStepRef.current === 0);
      nextNote();
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  };

  const togglePlay = () => {
    initAudio();
    if (!isPlaying) {
      setIsPlaying(true);
      currentStepRef.current = 0;
      setCurrentStep(0);
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      scheduler();
    } else {
      setIsPlaying(false);
      window.clearTimeout(timerIDRef.current);
      setCurrentStep(0);
    }
  };

  useEffect(() => {
    return () => {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
    };
  }, []);

  const data = signatures[currentSig];
  const beatsArray = Array.from({ length: data.beats });

  return (
    <div style={{fontFamily:"'Outfit', system-ui, sans-serif",background:"#080808",minHeight:"100vh",color:"#e0d8c0",display:"flex",flexDirection:"column",padding:"32px"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"16px",borderBottom:"1px solid #333"}}>
        <Link to="/" style={{fontSize:16,fontWeight:700,color:"#c8b87a",letterSpacing:3,textDecoration:"none"}}>TONECRAFTED</Link>
        <button style={{fontSize:"10px",letterSpacing:2,color:"#a0a0a0",border:"1px solid #333",padding:"4px 10px",borderRadius:20,background:"transparent",cursor:"pointer"}}>COPY LINK</button>
      </header>
      
      <main style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"48px",paddingTop:"32px"}}>
        <div>
          <div style={{fontSize:"12px",letterSpacing:4,color:"#8a7a50",marginBottom:12}}>MASTER THE GROOVE</div>
          <h1 style={{fontSize:48,fontWeight:700,marginBottom:18}}>Everything is just a <em style={{color:"#c8b87a",fontStyle:"normal"}}>pulse</em>.</h1>
          <p style={{fontSize:15,color:"#a0a0a0",lineHeight:1.6,marginBottom:44,maxWidth:480}}>
            Don't let the math intimidate you. Before you worry about fractions, just listen to the engine. Feel how the groove pulls you, and you'll naturally understand what musicians mean when they talk about "time signatures".
          </p>

          <div>
            <h2 style={{fontSize:24,color:"#e0d8c0",marginBottom:12}}>{data.title}</h2>
            <p style={{fontSize:14,color:"#a0a0a0",lineHeight:1.7,marginBottom:24}}>{data.text}</p>
            <div style={{fontSize:"10px",letterSpacing:2,color:"#777",marginBottom:12,fontWeight:700}}>ICONIC EXAMPLES</div>
            <ul style={{listStyle:"none",padding:0,margin:0,marginBottom:24,display:"flex",flexDirection:"column",gap:8}}>
              {data.examples.map((ex, i) => <li key={i} style={{fontSize:13,color:"#e0d8c0",display:"flex",gap:8}}><span style={{color:"#c8b87a"}}>›</span> {ex}</li>)}
            </ul>
            <div style={{fontSize:13,color:"#e0d8c0",background:"rgba(255,255,255,0.03)",padding:"16px",borderRadius:4,borderLeft:"3px solid #c8b87a"}}>
              <strong>PRACTICE:</strong> {data.practice}
            </div>
          </div>
        </div>

        <div>
          <div style={{background:"#111",border:"1px solid #333",borderRadius:8,padding:"32px",display:"flex",flexDirection:"column",alignItems:"center",position:"sticky",top:32}}>
            <div style={{fontSize:"10px",letterSpacing:2,color:"#777",marginBottom:24}}>THE METRONOME</div>
            
            <div style={{display:"flex",gap:16,marginBottom:32,justifyContent:"center",minHeight:60}}>
              {beatsArray.map((_, i) => (
                <div key={i} style={{
                  width: i===0?24:18, height: i===0?24:18, borderRadius:"50%",
                  background: isPlaying && currentStep === i ? "#c8b87a" : "#1a1a1a",
                  transition: "background 0.1s ease",
                  border: i===0 ? "2px solid #333" : "none",
                  alignSelf: "center"
                }} />
              ))}
            </div>

            <button onClick={togglePlay} style={{
              width:"100%",padding:"14px",fontSize:"16px",fontWeight:700,letterSpacing:4,cursor:"pointer",borderRadius:4,border:"none",
              background: isPlaying ? "#333" : "#c8b87a", color: isPlaying ? "#e0d8c0" : "#111"
            }}>
              {isPlaying ? "STOP" : "PLAY"}
            </button>

            <div style={{width:"100%",marginTop:32}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#a0a0a0",marginBottom:16}}>
                <span>TEMPO: {bpm} BPM</span>
              </div>
              <input type="range" min="40" max="200" value={bpm} onChange={e=>setBpm(parseInt(e.target.value))} style={{width:"100%"}} />
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,width:"100%",marginTop:32}}>
              {[4,3,6,5].map(sig => (
                <button key={sig} onClick={()=>{setCurrentSig(sig);setCurrentStep(0);}} style={{
                  padding:"12px",background:currentSig===sig?"rgba(200,184,122,0.1)":"#080808",
                  border:currentSig===sig?"1px solid #c8b87a":"1px solid #333",color:currentSig===sig?"#c8b87a":"#777",
                  cursor:"pointer",borderRadius:4,fontSize:14,fontFamily:"inherit"
                }}>
                  {sig}/4 Time
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
