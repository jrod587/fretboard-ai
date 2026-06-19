import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';


const NOTES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const OPEN=[4,11,7,2,9,4];
const SNAMES=["e","B","G","D","A","E"];
const SCALES={"Pentatonic Minor":[0,3,5,7,10],"Pentatonic Major":[0,2,4,7,9],"Blues":[0,3,5,6,7,10],"Major":[0,2,4,5,7,9,11],"Natural Minor":[0,2,3,5,7,8,10],"Dorian":[0,2,3,5,7,9,10],"Mixolydian":[0,2,4,5,7,9,10]};
const CHORD_IVS={"Pentatonic Minor":[0,3,7],"Blues":[0,3,7],"Natural Minor":[0,3,7],"Dorian":[0,3,7],"Pentatonic Major":[0,4,7],"Major":[0,4,7],"Mixolydian":[0,4,10]};
const CHORD_LABEL={"Pentatonic Minor":"m","Blues":"m","Natural Minor":"m","Dorian":"m","Pentatonic Major":"","Major":"","Mixolydian":"7"};
const THEMES=[
  {id:"ebony",name:"Ebony",swatch:"#c8b87a",accent:"#c8b87a",scaleFg:"#c0f0d4",scaleBg:"#0e2016",scaleBorder:"#1e4028",natFg:"#d0a850",natBg:"#1e1508",sharpFg:"#5878b8",sharpBg:"#0e1228",desc:"dark wood · gold hardware"},
  {id:"ocean",name:"Ocean",swatch:"#48b0e0",accent:"#48b0e0",scaleFg:"#a8dcf8",scaleBg:"#071428",scaleBorder:"#183858",natFg:"#7090b8",natBg:"#0a1220",sharpFg:"#405898",sharpBg:"#080e1c",desc:"deep blue · electric"},
  {id:"ember",name:"Ember",swatch:"#e07040",accent:"#e07040",scaleFg:"#f5c890",scaleBg:"#1e0c04",scaleBorder:"#502808",natFg:"#c89060",natBg:"#1c1008",sharpFg:"#906040",sharpBg:"#140e08",desc:"dark wood · warm orange"},
  {id:"amethyst",name:"Amethyst",swatch:"#b070e0",accent:"#b070e0",scaleFg:"#d8aafc",scaleBg:"#100820",scaleBorder:"#381858",natFg:"#9080c0",natBg:"#100c1c",sharpFg:"#504098",sharpBg:"#0c0818",desc:"deep purple · electric"},
];
const ni=(r,iv)=>NOTES[(NOTES.indexOf(r)+iv)%12];
const COACH_TIPS={
  "Pentatonic Minor":[
    r=>`${r} Minor Pentatonic — your b3 is ${ni(r,3)} and b7 is ${ni(r,10)}. Those two intervals carry all the blues tension. Bend up into them from a half-step below.`,
    r=>`${r} Minor Pentatonic shares every note with ${ni(r,3)} Major Pentatonic. Switching mid-phrase gives instant light/dark contrast with zero extra learning.`,
    r=>`Root (${r}), b3 (${ni(r,3)}), b7 (${ni(r,10)}) are your resolve tones. Land phrases on them and everything sounds intentional. The AI trainer tracks which you overuse.`,
    r=>`All 5 CAGED boxes tile the full neck in ${r}. Most players only know Box 1. The trainer maps which boxes you're weakest in and drills those first.`,
  ],
  "Pentatonic Major":[
    r=>`${r} Major Pentatonic — the 2 (${ni(r,2)}) and 6 (${ni(r,9)}) give it that bright country feel. Those notes don't exist in the minor version — lean on them.`,
    r=>`${r} Major Pentatonic is the relative major of ${ni(r,9)} Minor Pentatonic. Same 5 notes, different root emphasis. Borrow licks across both.`,
    r=>`In ${r} Major Pentatonic, the major 3rd (${ni(r,4)}) is your signature note — it's what separates major from minor tonality. Emphasize it over the I chord.`,
    r=>`${r} Major Pentatonic works over ${r}, ${ni(r,5)}, and ${ni(r,7)} chords. The AI trainer builds backing tracks in each key so you hear the difference live.`,
  ],
  "Blues":[
    r=>`${r} Blues Scale adds the b5 (${ni(r,6)}) to minor pentatonic. That one note — the blue note — creates all the dissonance blues is built on. Use it as a passing tone.`,
    r=>`The b5 (${ni(r,6)}) sounds best as a bent approach to the 5th (${ni(r,7)}). Start the bend on ${ni(r,6)}, resolve to ${ni(r,7)}. That's 100 years of blues in one move.`,
    r=>`In ${r} Blues, tension notes are ${ni(r,6)} (b5) and ${ni(r,3)} (b3). Resolve notes are ${r} and ${ni(r,7)}. The AI trainer scores your tension/resolve balance in real time.`,
    r=>`${r} Blues sits entirely inside ${r} Minor Pentatonic — just add ${ni(r,6)}. All your existing pentatonic licks work; you're adding one chromatic color.`,
  ],
  "Major":[
    r=>`${r} Major — 7 notes, 7 chord positions. The IV (${ni(r,5)}) wants to move to I (${r}). The V (${ni(r,7)}) creates the strongest pull back home. Learn to hear those resolutions.`,
    r=>`In ${r} Major, the 7th degree (${ni(r,11)}) is your leading tone — a half step below the root, wants to resolve upward. The most directional note in the key.`,
    r=>`${r} Major contains ${ni(r,9)} Natural Minor as its relative — same notes, different emotional center. The AI trainer teaches you to shift between them mid-solo.`,
    r=>`The 3rd (${ni(r,4)}) and 7th (${ni(r,11)}) are the guide tones of ${r} Major. They define chord quality more than any other notes — target them over the I chord.`,
  ],
  "Natural Minor":[
    r=>`${r} Natural Minor — the b6 (${ni(r,8)}) separates it from Dorian. That one note gives it a darker, more final quality. Lean on it over the iv chord.`,
    r=>`${r} Natural Minor's relative major is ${ni(r,3)} Major. Same neck positions, but resolving to ${r} instead of ${ni(r,3)} shifts the entire emotional weight.`,
    r=>`In ${r} Natural Minor, the v chord is minor (not dominant). No leading tone pulling to the root — that's why it sounds less tense than blues or Mixolydian.`,
    r=>`${r} Natural Minor's characteristic tones: b3 (${ni(r,3)}), b6 (${ni(r,8)}), b7 (${ni(r,10)}). The AI trainer builds custom lick libraries around each for your key.`,
  ],
  "Dorian":[
    r=>`${r} Dorian is minor with a raised 6th (${ni(r,9)} instead of ${ni(r,8)}). That single change brightens the whole mode — more hopeful than ${r} Natural Minor.`,
    r=>`The raised 6th (${ni(r,9)}) in ${r} Dorian creates a major IV chord (${ni(r,5)} major). Resolve phrases there and you'll hear the Dorian color — it's Santana's signature move.`,
    r=>`${r} Dorian is the 2nd mode of ${ni(r,10)} Major. Same notes, but centering on ${r} shifts the gravity. The trainer helps you hear the modal difference, not just memorize it.`,
    r=>`Compare the 6th (${ni(r,9)}) against the natural minor's b6 (${ni(r,8)}). Play both over a ${r}m chord and you'll instantly hear why jazz defaulted to Dorian.`,
  ],
  "Mixolydian":[
    r=>`${r} Mixolydian is major with a b7 (${ni(r,10)} instead of ${ni(r,11)}). That one note creates a dominant 7th sound without any chord change. The whole blues-rock vocabulary lives there.`,
    r=>`In ${r} Mixolydian, b7 (${ni(r,10)}) clashes beautifully against the major 3rd (${ni(r,4)}). That tritone tension is what makes dominant 7th riffs feel electric — Hendrix used it constantly.`,
    r=>`${r} Mixolydian is the 5th mode of ${ni(r,5)} Major. Same notes, different root. The trainer builds exercises to help you hear the dominant pull rather than just map positions.`,
    r=>`${r} Major vs ${r} Mixolydian: one note differs — ${ni(r,11)} (maj7) becomes ${ni(r,10)} (b7). Same lick with each: the Mixolydian version sounds immediately more open and rootsy.`,
  ],
};
const getCoachTip=(root,scale)=>{
  const tips=COACH_TIPS[scale];
  if(!tips) return "";
  return tips[NOTES.indexOf(root)%tips.length](root);
};
const NUM_FRETS=24,FW=46,SH=40;
const DOT=new Set([3,5,7,9,12,15,17,19,21,24]);
const NATURALS=new Set(["A","B","C","D","E","F","G"]);
const SUPABASE_URL="https://gupqljxigtwzmqcptols.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cHFsanhpZ3R3em1xY3B0b2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDk2MzksImV4cCI6MjA5MzA4NTYzOX0.nKXxPltNCJvRm0VowZrS1uCHW0XKq7d-SbqMHhQ8YGA";
const noteAt=(si,f)=>NOTES[(OPEN[si]+f)%12];
const noteSet=(root,ivs)=>new Set(ivs.map(i=>NOTES[(NOTES.indexOf(root)+i)%12]));
const rFE=root=>(NOTES.indexOf(root)-4+12)%12;
const IV_LABELS=["R","b2","2","b3","3","4","b5","5","b6","6","b7","7"];
const getInterval=(note,root)=>IV_LABELS[(NOTES.indexOf(note)-NOTES.indexOf(root)+12)%12];

const FEATURED_SONGS = [
  {
    title: "12-Bar Blues in G",
    artist: "Royalty-Free Progression",
    key: "G",
    scaleName: "Blues",
    essence: "The foundational framework of rock and blues. This 12-bar cycle moves through the I, IV, and V chords (G7, C7, D7). By utilizing dominant 7th shapes, it creates a crunchy, soulful momentum that is perfect for pentatonic scale workouts.",
    why: "Unlike simple triads, dominant 7th chords include the flat 7th interval (e.g. F in G7, Bb in C7, C in D7). This creates a dissonant 'tritone' tension that pulls naturally into the next chord. Soloing over these changes with the G Blues Scale lets you target chord tones dynamically.",
    tips: [
      "Practice slide entries: slide up a half-step into the major 3rd of the G7 chord (B) or the C7 chord (E). This is the key to that authentic blues flavor.",
      "The 'blue note' is the flat 5th (Db). Use it as a passing tone when moving between the 4th (C) and 5th (D) degrees of the scale.",
      "Use dominant 9th shapes for the V chord (D9) to add a modern, jazzy funk texture to your rhythm playing."
    ],
    chords: [
      {
        name: "G7 (Dominant 7th)",
        notes: [
          { string: 5, fret: 3, label: "T" },
          { string: 3, fret: 3, label: "1" },
          { string: 2, fret: 4, label: "2" },
          { string: 1, fret: 3, label: "1" }
        ]
      },
      {
        name: "C7 (Dominant 7th)",
        notes: [
          { string: 4, fret: 3, label: "1" },
          { string: 3, fret: 5, label: "3" },
          { string: 2, fret: 3, label: "1" },
          { string: 1, fret: 5, label: "4" }
        ]
      },
      {
        name: "D9 (Funk V Chord)",
        notes: [
          { string: 4, fret: 5, label: "2" },
          { string: 3, fret: 4, label: "1" },
          { string: 2, fret: 5, label: "3" },
          { string: 1, fret: 5, label: "4" }
        ]
      }
    ],
    qa: [
      {
        q: "What scale should I use to solo over this progression?",
        a: "The most versatile choice is the G Blues Scale (G, Bb, C, Db, D, F). It works over all three dominant chords. To take it to the next level, mix the G Minor Pentatonic (dark/gritty) with the G Major Pentatonic (bright/country)—switch to Major over the G7 chord, and Minor over the C7 and D7 chords."
      },
      {
        q: "Why are the chords written as 7ths instead of standard major chords?",
        a: "Dominant 7th chords contain both a major 3rd and a flat 7th. The interval between these two notes is a diminished fifth (tritone), which is highly unstable and tense. This tension is the core signature of the blues—it drives the progression forward, wanting to resolve to the next chord."
      }
    ]
  },
  {
    title: "Jazz ii-V-I in C",
    artist: "Standard Progression",
    key: "C",
    scaleName: "Major",
    essence: "The cornerstone of jazz harmony. This progression modulates smoothly from the ii (Dm7) to the V (G7) and resolves home to the I (Cmaj7). It is the perfect tool for practicing voice leading and modal connections across the fretboard.",
    why: "The progression works because of 'guide tones'—the 3rd and 7th degrees of each chord. As the chords change, these guide tones resolve by half-steps or whole-steps, creating a seamless, rolling harmony that guides the ear home to C.",
    tips: [
      "Locate the guide tones. When moving from Dm7 to G7, the 7th of Dm7 (C) falls a half-step to become the 3rd of G7 (B). That single note change defines the chord transition.",
      "Play modal scales: use D Dorian over Dm7, G Mixolydian over G7, and C Major (Ionian) over Cmaj7.",
      "Use 'shell voicings' (playing only root, 3rd, and 7th) to keep your rhythm playing clean and leave space for a soloist."
    ],
    chords: [
      {
        name: "D Minor 7 (ii Chord)",
        notes: [
          { string: 4, fret: 5, label: "2" },
          { string: 3, fret: 7, label: "4" },
          { string: 2, fret: 5, label: "1" },
          { string: 1, fret: 6, label: "3" }
        ]
      },
      {
        name: "G7 (V Chord)",
        notes: [
          { string: 5, fret: 3, label: "T" },
          { string: 3, fret: 3, label: "1" },
          { string: 2, fret: 4, label: "2" },
          { string: 1, fret: 3, label: "1" }
        ]
      },
      {
        name: "C Major 7 (I Chord)",
        notes: [
          { string: 4, fret: 3, label: "1" },
          { string: 3, fret: 5, label: "3" },
          { string: 2, fret: 4, label: "2" },
          { string: 1, fret: 5, label: "4" }
        ]
      }
    ],
    qa: [
      {
        q: "What are 'guide tones' and how do I target them?",
        a: "Guide tones are the 3rd and 7th intervals of a chord. They define whether a chord is major, minor, or dominant. In a ii-V-I progression, target these notes on the downbeat of chord changes. For example, play the note B (3rd of G7) right when the chord switches from Dm7—it sounds incredibly melodic because it resolves the previous C note by a half-step."
      },
      {
        q: "How does D Dorian differ from C Major if they have the same notes?",
        a: "D Dorian and C Major share the exact same seven notes, but they have different 'gravitational centers'. In D Dorian, the root note is D. The minor 3rd (F) and natural 6th (B) give Dorian its distinct hopeful-minor character. Shifting the center from D to C shifts the key resolution entirely."
      }
    ]
  },
  {
    title: "House of the Rising Sun",
    artist: "Traditional Folk Ballad",
    key: "A",
    scaleName: "Natural Minor",
    essence: "A traditional folk masterpiece in 6/8 time. The progression rotates through Am, C, D, F, then resolves back to Am, E, and Am. It is a masterclass in minor-key voice leading and classical-style fingerstyle arpeggios.",
    why: "The song moves from A natural minor (with a flat 7th, G) into the major V chord (E major, which uses a sharp 7th, G#). This G# note acts as the 'leading tone', pulling the harmony strongly back home to the A minor root.",
    tips: [
      "Hold down the full chord shapes and arpeggiate every string from low to high and back, letting all the notes ring out together.",
      "The transition from D major to F major is tricky—use your pinky to fret the C string or target the common root shifts to make it smooth.",
      "Pay attention to the 6/8 swing. Count 1-2-3-4-5-6, accenting beats 1 and 4."
    ],
    chords: [
      {
        name: "A Minor",
        notes: [
          { string: 4, fret: 0, label: "O" },
          { string: 3, fret: 2, label: "2" },
          { string: 2, fret: 2, label: "3" },
          { string: 1, fret: 1, label: "1" }
        ]
      },
      {
        name: "C Major",
        notes: [
          { string: 4, fret: 3, label: "3" },
          { string: 3, fret: 2, label: "2" },
          { string: 2, fret: 0, label: "O" },
          { string: 1, fret: 1, label: "1" }
        ]
      },
      {
        name: "D Major",
        notes: [
          { string: 3, fret: 0, label: "O" },
          { string: 2, fret: 2, label: "1" },
          { string: 1, fret: 3, label: "3" },
          { string: 0, fret: 2, label: "2" }
        ]
      },
      {
        name: "F Major (Mini Shape)",
        notes: [
          { string: 3, fret: 3, label: "3" },
          { string: 2, fret: 2, label: "2" },
          { string: 1, fret: 1, label: "1" },
          { string: 0, fret: 1, label: "1" }
        ]
      },
      {
        name: "E Major (V Chord)",
        notes: [
          { string: 5, fret: 0, label: "O" },
          { string: 4, fret: 2, label: "2" },
          { string: 3, fret: 2, label: "3" },
          { string: 2, fret: 1, label: "1" }
        ]
      }
    ],
    qa: [
      {
        q: "Why does the E major chord sound so tense compared to the minor chords?",
        a: "The E major chord is the major V chord in the key of A minor. It contains the note G#, which is the 'leading tone' of the key. G# is not in the natural A minor scale (which has G natural), so it sounds surprising and tense, pulling your ear strongly upward by a half-step to resolve to the A root."
      },
      {
        q: "How do I play the arpeggios smoothly?",
        a: "Anchor your right-hand thumb on the bass strings, and use your index (G string), middle (B string), and ring (e string) fingers to pluck the higher strings. Try not to lift your fretting hand fingers until you absolutely must change to the next chord shape."
      }
    ]
  }
];

const WAITLIST_FEATURES=[{icon:"🧠",label:"AI practice plans"},{icon:"🔥",label:"Progress + streaks"},{icon:"🎵",label:"Jam track suggestions"},{icon:"⚙️",label:"Custom scales & chords"}];

function WaitlistStrip({accent}){
  const [email,setEmail]=useState("");
  const [status,setStatus]=useState("idle");
  async function submit(e){
    e.preventDefault();
    if(!email.trim()) return;
    setStatus("loading");
    try{
      const res=await fetch(`${SUPABASE_URL}/rest/v1/waitlist`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({email:email.trim(),product:"fretboard-ai",source:"app"})});
      if(res.status===409){setStatus("dupe");return;}
      if(!res.ok){setStatus("error");return;}
      setStatus("success");
    }catch{setStatus("error");}
  }
  return (
    <div style={{borderTop:"1px solid #141414",padding:"8px 20px 10px",background:"#080808",flexShrink:0}}>
      <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
        <span style={{fontSize:"10px",color:"#aaa",letterSpacing:2,fontFamily:"'Courier New',monospace",whiteSpace:"nowrap"}}>COMING SOON</span>
        {WAITLIST_FEATURES.map((f,i)=>(
          <span key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:"11px",color:"#999",fontFamily:"system-ui,-apple-system,sans-serif",whiteSpace:"nowrap"}}>
            <span style={{fontSize:"12px"}}>{f.icon}</span>{f.label}
          </span>
        ))}
      </div>
      {status==="success"?(
        <div style={{fontSize:"11px",color:accent,fontFamily:"system-ui,-apple-system,sans-serif",letterSpacing:"0.5px",opacity:0.9}}>✓ You're on the list. We'll reach out when it's ready.</div>
      ):(
        <>
          <form onSubmit={submit} style={{display:"flex",gap:6,alignItems:"center"}}>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="get early access" disabled={status==="loading"} style={{flex:1,background:"#0d0d0d",border:`1px solid ${status==="error"?"#6b2020":"#2a2a2a"}`,borderRadius:2,color:"#bbb",padding:"5px 10px",fontSize:"11px",fontFamily:"system-ui,-apple-system,sans-serif",outline:"none",minWidth:0}}/>
            <button type="submit" disabled={status==="loading"} style={{padding:"5px 12px",borderRadius:2,border:`1px solid ${accent}55`,background:"transparent",color:accent,fontSize:"10px",cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:1,flexShrink:0,opacity:status==="loading"?0.5:1}}>{status==="loading"?"···":"NOTIFY ME"}</button>
            {status==="dupe"&&<span style={{fontSize:"10px",color:"#888",fontFamily:"system-ui,-apple-system,sans-serif",flexShrink:0}}>already on the list</span>}
            {status==="error"&&<span style={{fontSize:"10px",color:"#c05040",fontFamily:"system-ui,-apple-system,sans-serif",flexShrink:0}}>try again</span>}
          </form>
          <div style={{marginTop:2,fontSize:"10px",color:"#777",fontFamily:"system-ui,-apple-system,sans-serif"}}>No spam. Unsubscribe anytime.</div>
        </>
      )}
    </div>
  );
}

function WaitlistModal({onClose,accent}){
  const [wlEmail,setWlEmail]=useState("");
  const [wlStatus,setWlStatus]=useState("idle");
  async function wlSubmit(e){
    e.preventDefault();
    if(!wlEmail.trim()) return;
    setWlStatus("loading");
    try{
      const res=await fetch(`${SUPABASE_URL}/rest/v1/waitlist`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({email:wlEmail.trim(),product:"fretboard-ai",source:"modal"})});
      if(res.status===409){setWlStatus("dupe");return;}
      if(!res.ok){setWlStatus("error");return;}
      setWlStatus("success");
    }catch{setWlStatus("error");}
  }
  const features=["AI practice plans that adapt to YOUR weak spots — not generic exercises","Real-time feedback as you play, not after","Custom lick & solo generation in any key, any scale","Progress tracking, streaks, and jam track pairings"];
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(8px)"}}>
      <div style={{background:"rgba(12,10,8,0.98)",border:`1px solid ${accent}50`,borderRadius:16,padding:"32px 36px",maxWidth:460,width:"100%",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:14,background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:18,lineHeight:1,padding:"2px 6px"}}>✕</button>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:6}}>🌱</div>
          <div style={{display:"inline-block",background:`${accent}22`,border:`1px solid ${accent}55`,color:accent,fontSize:"9px",letterSpacing:2,fontWeight:700,padding:"3px 10px",borderRadius:20,fontFamily:"'Courier New',monospace"}}>JOIN THE WAITLIST</div>
        </div>
        <div style={{fontSize:20,fontWeight:700,color:"#e8e0d0",textAlign:"center",marginBottom:8,lineHeight:1.25}}>Upcoming Features</div>
        <p style={{color:"#bbb",lineHeight:1.7,textAlign:"center",marginBottom:20,fontSize:13,fontFamily:"system-ui,-apple-system,sans-serif"}}>Be the first to access our new tools by joining the waitlist.</p>
        <div style={{marginBottom:22,padding:"14px 16px",background:"rgba(255,255,255,0.03)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)"}}>
          {features.map((f,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:i<features.length-1?8:0,alignItems:"flex-start"}}>
              <span style={{color:accent,fontWeight:700,flexShrink:0,marginTop:1}}>✓</span>
              <span style={{color:"#aaa",fontSize:12,lineHeight:1.5,fontFamily:"system-ui,-apple-system,sans-serif"}}>{f}</span>
            </div>
          ))}
        </div>
        {wlStatus==="success"?(
          <div style={{textAlign:"center",padding:"16px",marginBottom:12}}>
            <div style={{fontSize:28,marginBottom:8}}>🌱</div>
            <div style={{fontSize:14,fontWeight:700,color:"#e8e0d0",marginBottom:4}}>You're in.</div>
            <div style={{fontSize:12,color:"#aaa",fontFamily:"system-ui,-apple-system,sans-serif"}}>We'll reach out the moment it drops. No spam — ever.</div>
          </div>
        ):(
          <form onSubmit={wlSubmit} style={{marginBottom:12}}>
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
              <input type="email" value={wlEmail} onChange={e=>setWlEmail(e.target.value)} placeholder="your email — lock in early access" disabled={wlStatus==="loading"} required style={{flex:1,background:"#0d0d0d",border:`1px solid ${wlStatus==="error"?"#6b2020":"#2a2a2a"}`,borderRadius:4,color:"#d4c9a8",padding:"10px 14px",fontSize:"11px",fontFamily:"'Courier New',monospace",outline:"none",minWidth:0}}/>
              <button type="submit" disabled={wlStatus==="loading"} style={{padding:"10px 16px",borderRadius:4,border:`1px solid ${accent}`,background:accent,color:"#111",fontSize:"11px",cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:1,flexShrink:0,fontWeight:700,opacity:wlStatus==="loading"?0.5:1}}>{wlStatus==="loading"?"···":"JOIN →"}</button>
            </div>
            {wlStatus==="dupe"&&<div style={{fontSize:"10px",color:"#888",fontFamily:"'Courier New',monospace",textAlign:"center"}}>Already on the list. You're good. ✓</div>}
            {wlStatus==="error"&&<div style={{fontSize:"10px",color:"#7a2020",fontFamily:"'Courier New',monospace",textAlign:"center"}}>Something went wrong — try again.</div>}
            <div style={{marginTop:6,fontSize:"11px",color:"#777",fontFamily:"system-ui,-apple-system,sans-serif",textAlign:"center"}}>No spam. Unsubscribe anytime. Your email is never shared.</div>
          </form>
        )}
        <div style={{textAlign:"center"}}><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#888",fontSize:12,fontFamily:"system-ui,-apple-system,sans-serif"}}>Continue with free fretboard</button></div>
      </div>
    </div>
  );
}

function PrivacyModal({onClose}){
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(8px)"}}>
      <div style={{background:"rgba(12,10,8,0.98)",border:"1px solid #2a2a2a",borderRadius:12,padding:"28px 32px",maxWidth:480,width:"100%",position:"relative",maxHeight:"80vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:14,background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:18,lineHeight:1,padding:"2px 6px"}}>✕</button>
        <div style={{fontSize:15,fontWeight:700,color:"#f0ead6",marginBottom:16,fontFamily:"'Courier New',monospace",letterSpacing:2}}>PRIVACY POLICY</div>
        <div style={{fontSize:13,color:"#aaa",lineHeight:1.8,fontFamily:"system-ui,-apple-system,sans-serif"}}>
          <p style={{marginBottom:12}}><span style={{color:"#aaa",fontWeight:700}}>What we collect:</span> Only your email address when you join the waitlist. Nothing else — no tracking, no analytics, no cookies.</p>
          <p style={{marginBottom:12}}><span style={{color:"#aaa",fontWeight:700}}>How we use it:</span> Solely to notify you when the AI trainer launches. We will never sell, rent, or share your email with any third party.</p>
          <p style={{marginBottom:12}}><span style={{color:"#aaa",fontWeight:700}}>Unsubscribe:</span> Reply to any email from us with "unsubscribe" and we'll remove you immediately.</p>
          <p style={{marginBottom:12}}><span style={{color:"#aaa",fontWeight:700}}>Data storage:</span> Emails are stored in Supabase (US-based). No payment data is collected on this site.</p>
          <p><span style={{color:"#aaa",fontWeight:700}}>Contact:</span> Questions? Reach us at <span style={{color:"#c8b87a"}}>hello@tonecrafted.com</span></p>
        </div>
        <div style={{marginTop:20,textAlign:"center"}}><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#888",fontSize:12,fontFamily:"system-ui,-apple-system,sans-serif"}}>Close</button></div>
      </div>
    </div>
  );
}

function GuitarApp(){
  const params = new URLSearchParams(window.location.search);
  const initialRoot = params.get("key") || "E";
  const initialScaleParam = params.get("scale");
  let initialScale = null;
  if (initialScaleParam === "major") initialScale = "Major";
  else if (initialScaleParam === "pentatonic_minor") initialScale = "Pentatonic Minor";
  else if (initialScaleParam === "pentatonic_major") initialScale = "Pentatonic Major";
  else if (initialScaleParam === "blues") initialScale = "Blues";
  else if (initialScaleParam === "minor") initialScale = "Minor";

  const [tab,setTab]=useState("scale");
  const [showAdvanced,setShowAdvanced]=useState(false);
  const [root,setRoot]=useState(initialRoot);
  const [scale,setSc]=useState(initialScale);
  const [names,setNm]=useState(true);
  const [noteView,setNV]=useState(initialScaleParam ? null : "natural");
  const [themeIdx,setTheme]=useState(0);
  const [showIv,setIv]=useState(false);
  const [showPremium,setPremium]=useState(false);
  const [showPrivacy,setPrivacy]=useState(false);

  // Song Copilot States
  const [activeChord,setActiveChord]=useState(null);
  const [selectedSong,setSelectedSong]=useState(FEATURED_SONGS[0]);
  const [searchQuery,setSearchQuery]=useState("");
  const [searching,setSearching]=useState(false);
  const [searchStatus,setSearchStatus]=useState("idle");
  const [chatHistory,setChatHistory]=useState([
    { sender: "coach", text: "Hey! I'm your Song Copilot. Let's deconstruct the 12-Bar Blues in G. Ask me anything about the chords, scales, or techniques!" }
  ]);
  const [chatInput,setChatInput]=useState("");

  const t=THEMES[themeIdx];
  const SITE_URL="https://tonecrafted.com";
  const rootIdx=NOTES.indexOf(root);
  const ivs=scale?(SCALES[scale]||[]):[];
  const sNotes=noteSet(root,ivs);

  function getDotStyle(si,fret){
    const note=noteAt(si,fret),inSc=sNotes.has(note),isRoot=note===root;
    const label=showIv?getInterval(note,root):note;
    let bg="transparent",fg="transparent",ring="none",size=24,shape="circle";

    // Check if there is an active chord overlay
    if (tab === "copilot" && activeChord) {
      const chordNote = activeChord.notes.find(n => n.string === si && n.fret === fret);
      if (chordNote) {
        const interval = getInterval(note, root);
        const dispLabel = showIv ? interval : chordNote.label;
        return {
          bg: t.accent,
          fg: "#111",
          ring: `2px solid #fff`,
          size: 26,
          shape: "circle",
          label: dispLabel
        };
      }
      // Dim the surrounding scale notes
      if (inSc) {
        return {
          bg: "transparent",
          fg: t.scaleFg + "30",
          ring: `1.5px dashed ${t.scaleBorder}44`,
          size: 22,
          shape: "circle",
          label: showIv ? getInterval(note, root) : note
        };
      }
      return {bg,fg,ring,size,shape,label:""};
    }

    if(noteView==="bare") return {bg,fg,ring,size,shape,label};
    if(noteView&&(tab==="scale"||tab==="copilot")){
      const isNat=NATURALS.has(note),show=noteView==="all"||(noteView==="natural"&&isNat);
      if(show){
        if(isRoot){bg=t.accent;fg="#111";size=26;}
        else if(isNat){bg=t.natBg;fg=t.natFg;ring=`1px solid ${t.natFg}60`;size=24;}
        else{bg=t.sharpBg;fg=t.sharpFg;ring=`1px solid ${t.sharpFg}50`;size=22;}
      }
      return {bg,fg,ring,size,shape,label};
    }
    if(tab==="scale"||tab==="copilot"){
      if(isRoot){bg=t.accent;fg="#111";size=24;}
      else if(inSc){bg=t.scaleBg;fg=t.scaleFg;ring=`1px solid ${t.scaleBorder}`;}
      else if(names){fg="#252525";}
    }
    return {bg,fg,ring,size,shape,label};
  }

  const [searchLoadingText, setSearchLoadingText] = useState("Deconstructing harmonics...");

  function handleSearch(q) {
    if (!q) return;
    setSearching(true);
    setSearchStatus("loading");
    setSearchLoadingText("Deconstructing harmonics...");
    
    // Cycle text
    setTimeout(() => {
      setSearchLoadingText("Mapping chord positions...");
    }, 1200);
    setTimeout(() => {
      setSearchLoadingText("Extracting technique tips...");
    }, 2400);
    setTimeout(() => {
      setSearching(false);
      setSearchStatus("waitlist");
    }, 3600);
  }

  function handleQuickQuestion(q, a) {
    const history = [...chatHistory, { sender: "user", text: q }];
    setChatHistory(history);
    
    setTimeout(() => {
      const box = document.getElementById("copilot-chat-box");
      if (box) box.scrollTop = box.scrollHeight;
    }, 50);

    setTimeout(() => {
      setChatHistory([...history, { sender: "coach", text: a }]);
      setTimeout(() => {
        const box = document.getElementById("copilot-chat-box");
        if (box) box.scrollTop = box.scrollHeight;
      }, 50);
    }, 800);
  }

  function handleCustomQuestion(q) {
    setChatInput("");
    const history = [...chatHistory, { sender: "user", text: q }];
    setChatHistory(history);
    
    setTimeout(() => {
      const box = document.getElementById("copilot-chat-box");
      if (box) box.scrollTop = box.scrollHeight;
    }, 50);

    setTimeout(() => {
      setChatHistory([...history, { sender: "system", text: "LIVE AI CONNECTION LOCKED. Join the waitlist to unlock full conversational deconstruction." }]);
      setTimeout(() => {
        const box = document.getElementById("copilot-chat-box");
        if (box) box.scrollTop = box.scrollHeight;
      }, 50);
    }, 700);
  }

  const coachText=scale?getCoachTip(root,scale):"Select a scale to see coaching tips.";

  return (
    <div style={{fontFamily:"'Courier New',monospace",background:"#0a0a0a",minHeight:"100vh",color:"#d4c9a8",display:"flex",flexDirection:"column"}}>
      {showPremium&&<WaitlistModal onClose={()=>setPremium(false)} accent={t.accent}/>}
      {showPrivacy&&<PrivacyModal onClose={()=>setPrivacy(false)}/>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px 8px",borderBottom:"1px solid #181818",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <a href={SITE_URL} style={{fontSize:16,fontWeight:700,color:t.accent,letterSpacing:2,textDecoration:"none"}}>FRETBOARD AI</a>
          <span style={{fontSize:"11px",color:"#bbb",letterSpacing:1,fontFamily:"system-ui,-apple-system,sans-serif"}}>Standard Tuning · E A D G B e</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            {THEMES.map((th,i)=>(
              <button key={th.id} onClick={()=>setTheme(i)} title={`${th.name} — ${th.desc}`} style={{width:14,height:14,borderRadius:7,border:"none",cursor:"pointer",background:th.swatch,outline:themeIdx===i?"2px solid #fff":"2px solid transparent",outlineOffset:1,opacity:themeIdx===i?1:0.5}}/>
            ))}
            <span style={{fontSize:"10px",color:"#888",marginLeft:2,fontFamily:"system-ui,-apple-system,sans-serif"}}>{t.name}</span>
          </div>
          <div style={{width:1,height:12,background:"#222"}}/>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <button onClick={()=>{setTab("scale"); setActiveChord(null);}} style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:tab==="scale"?t.accent:"transparent",color:tab==="scale"?"#111":"#999",fontSize:"11px",fontFamily:"inherit",fontWeight:tab==="scale"?700:400}}>Scale Explorer</button>
            <button onClick={()=>{setTab("copilot"); if(FEATURED_SONGS && FEATURED_SONGS[0]){setSelectedSong(FEATURED_SONGS[0]); setRoot(FEATURED_SONGS[0].key); setSc(FEATURED_SONGS[0].scaleName);}}} style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:tab==="copilot"?t.accent:"transparent",color:tab==="copilot"?"#111":"#999",fontSize:"11px",fontFamily:"inherit",fontWeight:tab==="copilot"?700:400,display:"flex",alignItems:"center",gap:4}}><span>🎸</span>Song Copilot</button>
            <Link to="/pulse" style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"transparent",color:"#999",fontSize:"11px",fontFamily:"inherit",fontWeight:400,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}><span>🥁</span>Pulse</Link>
            <Link to="/ladder" style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"transparent",color:"#999",fontSize:"11px",fontFamily:"inherit",fontWeight:400,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}><span>🪜</span>Ladder</Link>
            <Link to="/harmony" style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:3,background:"transparent",color:"#999",fontSize:"11px",fontFamily:"inherit",fontWeight:400,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}><span>⭕</span>Path</Link>
          </div>
        </div>
      </div>

{tab==="scale"&&(
        <div style={{padding:"12px 20px 10px",borderBottom:"1px solid #141414",flexShrink:0, display:"flex", justifyContent:"space-between", gap:"20px", alignItems:"flex-start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:8, flex:1}}>
            <div>
              <div style={{fontSize:"11px",color:"#ddd",letterSpacing:2,marginBottom:4}}>KEY</div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",maxWidth:500}}>
                {NOTES.map(n=>(
                  <button key={n} onClick={()=>setRoot(n)} style={{width:27,height:27,borderRadius:2,border:"none",cursor:"pointer",background:root===n?t.accent:"#141414",color:root===n?"#111":"#bbb",fontSize:n.includes("#")?"9px":"11px",fontWeight:root===n?700:400,fontFamily:"inherit"}}>{n}</button>
                ))}
              </div>
            </div>
            
            {!showAdvanced && (
              <div style={{marginTop: 12}}>
                <button onClick={() => setShowAdvanced(true)} style={{padding:"6px 12px",border:"1px solid #333",background:"transparent",color:"#888",cursor:"pointer",borderRadius:3,fontSize:"11px",fontFamily:"inherit"}}>Show Advanced Tools (Scales, Intervals, Premium)</button>
              </div>
            )}
            
            {showAdvanced && (
              <>
                <div>
                  <div style={{fontSize:"11px",color:"#ddd",letterSpacing:2,marginBottom:4}}>SCALE{scale===null&&<span style={{color:"#888",fontWeight:400,letterSpacing:0,fontSize:"10px"}}> · none selected</span>}</div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {Object.keys(SCALES).map(s=>(
                      <button key={s} onClick={()=>setSc(s===scale?null:s)} style={{padding:"2px 8px",border:"none",cursor:"pointer",borderRadius:2,background:scale===s?t.scaleBg:"#141414",color:scale===s?t.scaleFg:"#bbb",fontSize:"11px",fontFamily:"inherit",fontWeight:scale===s?700:400,outline:scale===s?`1px solid ${t.scaleBorder}`:"none"}}>{s}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"}}>
                  <button onClick={()=>setNm(x=>!x)} style={{padding:"2px 8px",border:`1px solid ${names?t.accent+"44":"#222"}`,background:"transparent",color:names?t.accent:"#aaa",cursor:"pointer",borderRadius:2,fontSize:"10px",fontFamily:"inherit",letterSpacing:1,whiteSpace:"nowrap"}}>{names?"NAMES ON":"NAMES OFF"}</button>
                  <button onClick={()=>setIv(x=>!x)} style={{padding:"2px 8px",border:`1px solid ${showIv?t.accent+"44":"#222"}`,background:"transparent",color:showIv?t.accent:"#aaa",cursor:"pointer",borderRadius:2,fontSize:"10px",fontFamily:"inherit",letterSpacing:1,whiteSpace:"nowrap"}}>INTERVALS {showIv?"ON":"OFF"}</button>
                  <button onClick={()=>setPremium(true)} style={{padding:"2px 8px",border:"1px solid #333",background:"transparent",color:"#888",cursor:"pointer",borderRadius:2,fontSize:"10px",fontFamily:"inherit",letterSpacing:1,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>CAGED BOXES 🔒</button>
                  <button onClick={()=>setPremium(true)} style={{padding:"2px 8px",border:"1px solid #333",background:"transparent",color:"#888",cursor:"pointer",borderRadius:2,fontSize:"10px",fontFamily:"inherit",letterSpacing:1,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>CHORD MAP 🔒</button>
                  <div style={{width:"100%",height:1,background:"#1a1a1a",margin:"1px 0"}}/>
                  <button onClick={()=>setNV(v=>v==="all"?null:"all")} style={{padding:"2px 8px",border:`1px solid ${noteView==="all"?t.natFg+"44":"#222"}`,background:noteView==="all"?t.natBg:"transparent",color:noteView==="all"?t.natFg:"#aaa",cursor:"pointer",borderRadius:2,fontSize:"10px",fontFamily:"inherit",letterSpacing:1,whiteSpace:"nowrap"}}>ALL NOTES</button>
                  <button onClick={()=>setNV(v=>v==="natural"?null:"natural")} style={{padding:"2px 8px",border:`1px solid ${noteView==="natural"?t.natFg+"44":"#222"}`,background:noteView==="natural"?t.natBg:"transparent",color:noteView==="natural"?t.natFg:"#aaa",cursor:"pointer",borderRadius:2,fontSize:"10px",fontFamily:"inherit",letterSpacing:1,whiteSpace:"nowrap"}}>NATURALS</button>
                  <button onClick={()=>setNV(v=>v==="bare"?null:"bare")} style={{padding:"2px 8px",border:`1px solid ${noteView==="bare"?"#55555544":"#222"}`,background:noteView==="bare"?"#111":"transparent",color:noteView==="bare"?"#bbb":"#aaa",cursor:"pointer",borderRadius:2,fontSize:"10px",fontFamily:"inherit",letterSpacing:1,whiteSpace:"nowrap"}}>BARE</button>
                </div>
              </>
            )}
          </div>
          <div style={{width: "300px", fontSize:"12px", color:"#bbb", lineHeight: 1.5, textAlign: "right", flexShrink: 0, marginTop: 4}}>
            Learn the notes on your guitar neck one small area at a time. Start by learning the open strings and first few frets.<br/>
            <span style={{fontSize:"11px", color:"#888"}}>Next step: <Link to="/harmony" style={{color:t.accent, textDecoration:"none"}}>Use Path to see how notes connect to form chords →</Link></span>
          </div>
        </div>
      )}

      {(tab==="scale"||tab==="copilot")&&(
        <div style={{padding:"3px 20px",fontSize:"10px",color:"#bbb",letterSpacing:"0.8px",flexShrink:0,display:"flex",justifyContent:"space-between",fontFamily:"system-ui,-apple-system,sans-serif"}}>
          <span>← scroll for full 24-fret neck · O = open · gold bar = NUT</span>
          {tab==="copilot" && activeChord && <span style={{color:t.accent, fontWeight:700}}>CHORD VIEW: {activeChord.name} ({showIv ? "INTERVALS" : "FINGERINGS"})</span>}
          {tab==="scale" && noteView==="all"&&<span style={{color:"#6aaa6a"}}>ALL NOTES — gold=root · green=natural · blue=sharp/flat</span>}
          {tab==="scale" && noteView==="natural"&&<span style={{color:"#6aaa6a"}}>NATURALS — A B C D E F G only · gold=root</span>}
          {tab==="scale" && noteView==="bare"&&<span style={{color:"#777"}}>BARE — fretboard only</span>}
        </div>
      )}

      <div style={{overflow:"auto"}}>
        {(tab==="scale"||tab==="copilot")&&(
          <div style={{overflowX:"auto",padding:"4px 20px 6px"}}>
            <div style={{minWidth:(NUM_FRETS+1)*FW+44,position:"relative"}}>
              <div style={{display:"flex",paddingLeft:40,marginBottom:3}}>
                {Array.from({length:NUM_FRETS+1},(_,f)=>(
                  <div key={f} style={{width:FW,flexShrink:0,textAlign:"center",fontSize:"10px",color:DOT.has(f)?"#c8b87a":"#ccc",fontWeight:DOT.has(f)?700:400}}>{f===0?"○":f}</div>
                ))}
              </div>
              {OPEN.map((_,si)=>(
                <div key={si} style={{display:"flex",alignItems:"center",height:SH}}>
                  <div style={{width:40,fontSize:"12px",color:"#ddd",textAlign:"right",paddingRight:8,flexShrink:0,letterSpacing:1}}>{SNAMES[si]}</div>
                  {Array.from({length:NUM_FRETS+1},(_,fret)=>{
                    const {bg,fg,ring,size,shape,label}=getDotStyle(si,fret);
                    const br=shape==="square"?3:size/2;
                    return (
                      <div key={fret} style={{width:FW,height:SH,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",borderRight:fret===0?`2px solid #c8b87a45`:"1px solid #161616"}}>
                        {fret>0&&<div style={{position:"absolute",left:0,right:0,height:0.6+si*0.22,background:`hsl(0,0%,${10+si*1.4}%)`,zIndex:0}}/>}
                        <div style={{width:size,height:size,borderRadius:br,zIndex:2,position:"relative",background:bg,color:fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:label&&label.length>2?"6px":label?.includes("#")?"7px":"9px",fontWeight:700,border:ring,boxSizing:"border-box",fontFamily:"inherit",overflow:"hidden"}}>
                          {fg!=="transparent"?label:""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              {[3,5,7,9,12,15,17,19,21,24].flatMap(f=>{
                const x=40+f*FW+FW/2-3,isDbl=f===12||f===24;
                const ds=top=>({position:"absolute",left:x,top,width:6,height:6,borderRadius:3,background:"#282828",zIndex:4,pointerEvents:"none"});
                return isDbl?[<div key={`a${f}`} style={ds(90)}/>,<div key={`b${f}`} style={ds(170)}/>]:[<div key={f} style={ds(130)}/>];
              })}
            </div>
          </div>
        )}
      </div>

      {tab==="scale"&&(
        <>
          <div style={{borderTop:"1px solid #141414",padding:"7px 20px",display:"flex",gap:10,alignItems:"flex-start",background:"#080808",flexShrink:0,minHeight:36}}>
            <div style={{fontSize:"10px",color:"#ccc",letterSpacing:2,paddingTop:2,flexShrink:0,fontFamily:"'Courier New',monospace",minWidth:40}}>COACH</div>
            <div style={{fontSize:"13px",color:"#e0dcd0",lineHeight:1.6,fontStyle:"italic",fontFamily:"system-ui,-apple-system,sans-serif"}}>{coachText}</div>
          </div>

          <WaitlistStrip accent={t.accent}/>

          <div style={{borderTop:"1px solid #141414",padding:"8px 20px",background:"#080808",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><span style={{fontSize:"10px",color:"#aaa",letterSpacing:2,fontFamily:"'Courier New',monospace"}}>TRAINER TIP </span><span style={{fontSize:"10px",color:"#888",fontFamily:"system-ui,-apple-system,sans-serif"}}>· AI-powered</span></div>
            <button onClick={()=>setPremium(true)} style={{padding:"3px 10px",borderRadius:20,border:`1px solid ${t.accent}55`,background:"transparent",color:t.accent,cursor:"pointer",fontSize:"11px",fontFamily:"'Courier New',monospace",letterSpacing:"0.5px"}}>🔒 Unlock tips</button>
          </div>

          <div style={{background:"#060606",borderTop:"1px solid #181818",padding:"6px 12px 8px",flexShrink:0}}>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>
              {[`Explain CAGED for ${root}`,`${root} ${scale||"Pentatonic Minor"} lick ideas`,"Chord tones vs passing tones","Connect the 5 boxes"].map((p,i)=>(
                <button key={i} onClick={()=>setPremium(true)} style={{padding:"2px 7px",border:"1px solid #333",borderRadius:2,background:"transparent",color:"#999",cursor:"pointer",fontSize:"10px",fontFamily:"system-ui,-apple-system,sans-serif",letterSpacing:"0.3px",whiteSpace:"nowrap"}}>{p}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <div onClick={()=>setPremium(true)} style={{flex:1,background:"#0e0e0e",border:"1px solid #2a2a2a",borderRadius:2,color:"#999",padding:"7px 13px",fontSize:13,cursor:"pointer",fontFamily:"system-ui,-apple-system,sans-serif",userSelect:"none"}}>
                Ask the coach about {root} {scale||"scales"}...
              </div>
              <button onClick={()=>setPremium(true)} style={{padding:"7px 13px",borderRadius:2,border:`1px solid ${t.accent}55`,cursor:"pointer",background:"transparent",color:t.accent,fontSize:"11px",fontWeight:700,fontFamily:"inherit",letterSpacing:1,flexShrink:0}}>🔒 ASK</button>
            </div>
          </div>
        </>
      )}

      {tab==="copilot"&&(
        <div className="workspace-split" style={{borderTop:"1px solid #141414"}}>
          {/* Left Panel: Search & Select */}
          <div className="left-panel">
            <div>
              <div style={{fontSize:"11px",color:"#ddd",letterSpacing:2,marginBottom:8,fontWeight:700,fontFamily:"'Courier New',monospace"}}>SEARCH SONG</div>
              <div style={{position:"relative"}}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  onKeyDown={(e)=>{
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleSearch(searchQuery.trim());
                    }
                  }}
                  placeholder="e.g. Purple Rain, Sultans..."
                  style={{width:"100%",background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:4,color:"#bbb",padding:"8px 12px",fontSize:"12px",fontFamily:"inherit",outline:"none"}}
                />
                <button 
                  onClick={()=>searchQuery.trim() && handleSearch(searchQuery.trim())}
                  style={{position:"absolute",right:8,top:6,background:"none",border:"none",color:t.accent,fontSize:"12px",cursor:"pointer",fontWeight:700,fontFamily:"'Courier New',monospace"}}
                >
                  GO
                </button>
              </div>
            </div>

            {searching && (
              <div style={{padding:"14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:6,textAlign:"center"}}>
                <div style={{fontSize:"18px",marginBottom:6}}>⚡</div>
                <div style={{fontSize:"11px",color:t.accent,fontFamily:"'Courier New',monospace",letterSpacing:1}}>{searchLoadingText}</div>
              </div>
            )}

            {searchStatus === "waitlist" && (
              <div style={{padding:"14px",background:"rgba(200,184,122,0.04)",border:`1px solid ${t.accent}33`,borderRadius:6}}>
                <div style={{fontSize:"12px",fontWeight:700,color:"#e8e0d0",marginBottom:6}}>Song Waitlisted</div>
                <p style={{fontSize:"11px",color:"#aaa",lineHeight:1.5,fontFamily:"system-ui,-apple-system,sans-serif",marginBottom:10}}>
                  We are indexing and mapping the fretboard harmonics for <strong>"{searchQuery}"</strong>. Join the waitlist to get notified when the AI finishes analysis!
                </p>
                <button 
                  onClick={()=>setPremium(true)}
                  style={{width:"100%",padding:"6px 12px",background:t.accent,border:"none",borderRadius:4,color:"#111",fontSize:"10px",fontWeight:700,cursor:"pointer",fontFamily:"'Courier New',monospace"}}
                >
                  🚀 JOIN WAITLIST
                </button>
              </div>
            )}

            <div>
              <div style={{fontSize:"11px",color:"#ddd",letterSpacing:2,marginBottom:8,fontWeight:700,fontFamily:"'Courier New',monospace"}}>FEATURED DEMOS</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {FEATURED_SONGS.map(song=>(
                  <div 
                    key={song.title} 
                    onClick={()=>{
                      setSelectedSong(song);
                      setRoot(song.key);
                      setSc(song.scaleName);
                      setActiveChord(null);
                      setSearchStatus("idle");
                      setChatHistory([
                        { sender: "coach", text: `Hey! I'm your Song Copilot. Let's break down ${song.title} by ${song.artist}. Ask me anything about the chords, scales, or techniques!` }
                      ]);
                    }}
                    style={{
                      padding:"12px 14px",
                      background:selectedSong?.title===song.title?"rgba(255,255,255,0.03)":"#101010",
                      border:`1px solid ${selectedSong?.title===song.title?t.accent+"66":"#1c1c1c"}`,
                      borderRadius:6,
                      cursor:"pointer",
                      transition:"border-color 0.2s"
                    }}
                  >
                    <div style={{fontSize:"13px",fontWeight:700,color:"#e8e0d0"}}>{song.title}</div>
                    <div style={{fontSize:"11px",color:"#888",marginTop:2}}>{song.artist}</div>
                    <div style={{display:"flex",gap:4,marginTop:6}}>
                      <span style={{fontSize:"9px",background:"#1b1b1b",padding:"2px 6px",borderRadius:4,color:"#ccc"}}>{song.key} {song.scaleName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{marginTop:"auto",padding:"10px",background:"rgba(255,255,255,0.01)",borderRadius:6,border:"1px solid #1a1a1a"}}>
              <div style={{fontSize:"10px",color:t.accent,letterSpacing:1,fontWeight:700,marginBottom:4,fontFamily:"'Courier New',monospace"}}>COPILOT TIP</div>
              <p style={{fontSize:"10px",color:"#888",lineHeight:1.4,fontFamily:"system-ui,-apple-system,sans-serif"}}>
                Click chord buttons in the workspace to highlight shapes. Toggle <strong>INTERVALS ON</strong> above to see chord scale functions.
              </p>
            </div>
          </div>

          {/* Right Panel: Deconstruction Workspace */}
          <div className="right-panel">
            {selectedSong && (
              <>
                <div style={{borderBottom:"1px solid #1c1c1c",paddingBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8}}>
                    <h2 style={{fontSize:22,fontWeight:700,color:"#e8e0d0"}}>{selectedSong.title}</h2>
                    <span style={{fontSize:13,color:"#888"}}>by {selectedSong.artist}</span>
                  </div>
                  <div style={{fontSize:11,color:t.accent,fontStyle:"italic",marginTop:6,letterSpacing:"0.5px"}}>
                    "Knowing the notes is different from understanding how to play."
                  </div>
                </div>

                {/* The Essence */}
                <div>
                  <div style={{fontSize:"10px",color:"#888",letterSpacing:2,fontWeight:700,marginBottom:6,fontFamily:"'Courier New',monospace"}}>THE ESSENCE</div>
                  <p style={{fontSize:"13px",color:"#d4c9a8",lineHeight:1.6,fontFamily:"system-ui,-apple-system,sans-serif"}}>
                    {selectedSong.essence}
                  </p>
                </div>

                {/* The Why */}
                <div>
                  <div style={{fontSize:"10px",color:"#888",letterSpacing:2,fontWeight:700,marginBottom:6,fontFamily:"'Courier New',monospace"}}>THE THEORY ("THE WHY")</div>
                  <p style={{fontSize:"13px",color:"#bbb",lineHeight:1.6,fontFamily:"system-ui,-apple-system,sans-serif"}}>
                    {selectedSong.why}
                  </p>
                </div>

                {/* Interactive Chord Overlays */}
                <div>
                  <div style={{fontSize:"10px",color:"#888",letterSpacing:2,fontWeight:700,marginBottom:2,fontFamily:"'Courier New',monospace"}}>INTERACTIVE CHORDS (Click to highlight)</div>
                  <div className="chords-grid">
                    {selectedSong.chords.map(chord=>(
                      <button 
                        key={chord.name}
                        onClick={()=>{
                          if (activeChord?.name === chord.name) {
                            setActiveChord(null);
                          } else {
                            setActiveChord(chord);
                          }
                        }}
                        style={{
                          border: activeChord?.name === chord.name ? `1px solid ${t.accent}` : "1px solid rgba(255,255,255,0.06)",
                          background: activeChord?.name === chord.name ? `${t.accent}12` : "rgba(255,255,255,0.02)",
                          boxShadow: activeChord?.name === chord.name ? `0 0 10px ${t.accent}11` : "none"
                        }}
                        className="chord-btn"
                      >
                        <span style={{color: activeChord?.name === chord.name ? t.accent : "#ccc"}}>{chord.name}</span>
                        <span style={{fontSize:"9px",fontWeight:400,color:"#666"}}>
                          {activeChord?.name === chord.name ? "✓ Highlighted" : "Click to view"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technique Checklist */}
                <div>
                  <div style={{fontSize:"10px",color:"#888",letterSpacing:2,fontWeight:700,marginBottom:8,fontFamily:"'Courier New',monospace"}}>COACH TECHNIQUE CHECKLIST</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {selectedSong.tips.map((tip,i)=>(
                      <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",background:"rgba(255,255,255,0.01)",padding:"10px 12px",borderRadius:6,border:"1px solid #161616"}}>
                        <span style={{color:t.accent,fontWeight:700,fontFamily:"'Courier New',monospace"}}>0{i+1}.</span>
                        <span style={{fontSize:"12px",color:"#aaa",lineHeight:1.5,fontFamily:"system-ui,-apple-system,sans-serif"}}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Copilot Chat */}
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                    <span style={{fontSize:"10px",color:"#888",letterSpacing:2,fontWeight:700,fontFamily:"'Courier New',monospace"}}>INTERACTIVE DECONSTRUCTION CHAT</span>
                    <span style={{fontSize:"9px",color:"#666",fontFamily:"system-ui,-apple-system,sans-serif"}}>Powered by Fretboard AI</span>
                  </div>
                  <div className="chat-container">
                    <div className="chat-messages" id="copilot-chat-box">
                      {chatHistory.map((msg,idx)=>(
                        <div 
                          key={idx} 
                          className={`chat-bubble ${msg.sender}`}
                          style={{
                            background: msg.sender === "user" ? t.accent : undefined
                          }}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    
                    {/* Quick Questions */}
                    <div style={{borderTop:"1px solid #161616",padding:"8px 12px",background:"#080808",display:"flex",gap:6,overflowX:"auto",flexShrink:0}}>
                      {(selectedSong.qa || []).map((qa,i)=>(
                        <button 
                          key={i}
                          onClick={()=>handleQuickQuestion(qa.q, qa.a)}
                          style={{
                            padding:"4px 10px",
                            background:"transparent",
                            border:"1px solid #333",
                            borderRadius:20,
                            color:"#999",
                            fontSize:"10px",
                            cursor:"pointer",
                            whiteSpace:"nowrap",
                            fontFamily:"system-ui,-apple-system,sans-serif"
                          }}
                        >
                          {qa.q}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div style={{borderTop:"1px solid #1c1c1c",padding:6,display:"flex",gap:6,alignItems:"center",background:"#060606",flexShrink:0}}>
                      <input 
                        type="text"
                        value={chatInput}
                        onChange={(e)=>setChatInput(e.target.value)}
                        onKeyDown={(e)=>{
                          if (e.key === "Enter" && chatInput.trim()) {
                            handleCustomQuestion(chatInput.trim());
                          }
                        }}
                        placeholder={`Ask about ${selectedSong.title} scales, chords or solos...`}
                        style={{
                          flex:1,
                          background:"#0d0d0d",
                          border:"1px solid #2a2a2a",
                          borderRadius:4,
                          color:"#bbb",
                          padding:"6px 12px",
                          fontSize:"12px",
                          fontFamily:"system-ui,-apple-system,sans-serif",
                          outline:"none"
                        }}
                      />
                      <button 
                        onClick={()=>chatInput.trim() && handleCustomQuestion(chatInput.trim())}
                        style={{
                          padding:"6px 14px",
                          background:"transparent",
                          border:`1px solid ${t.accent}66`,
                          borderRadius:4,
                          color:t.accent,
                          fontSize:"10px",
                          cursor:"pointer",
                          fontWeight:700,
                          fontFamily:"'Courier New',monospace"
                        }}
                      >
                        SEND
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{textAlign:"center",padding:"5px 0 6px",borderTop:"1px solid #0e0e0e",background:"#080808",display:"flex",justifyContent:"center",alignItems:"center",gap:12}}>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" style={{fontSize:"11px",color:"#888",textDecoration:"none",letterSpacing:1,fontFamily:"'Courier New',monospace"}}>Created by JRod</a>
        <span style={{color:"#555",fontSize:"11px"}}>·</span>
        <button onClick={()=>setPrivacy(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"11px",color:"#999",fontFamily:"'Courier New',monospace",letterSpacing:1,padding:0}}>Privacy</button>
      </div>
    </div>
  );
}

export default GuitarApp;