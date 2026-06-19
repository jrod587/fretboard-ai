import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SUPABASE_URL = "https://gupqljxigtwzmqcptols.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cHFsanhpZ3R3em1xY3B0b2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDk2MzksImV4cCI6MjA5MzA4NTYzOX0.nKXxPltNCJvRm0VowZrS1uCHW0XKq7d-SbqMHhQ8YGA";

export default function Landing() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: 'No spam. Early access only. Unsubscribe anytime.' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitWaitlist = async () => {
    if (!email || !email.includes("@")) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email, product: "fretboard-ai", source: "landing" }),
      });

      if (res.status === 409) {
        setStatus({ type: 'dupe', message: "You're already on the list — we'll be in touch." });
        setIsSubmitting(false);
        return;
      }
      if (!res.ok) throw new Error("non-2xx");

      setStatus({ type: 'success', message: "✓ You're on the list. We'll reach out before public launch." });
      setEmail('');
    } catch {
      setStatus({ type: 'error', message: "Something went wrong — try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",color:"#e0d8c0",fontFamily:"Outfit, system-ui, sans-serif"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 32px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{fontSize:18,fontWeight:700,letterSpacing:3,color:"#c8b87a"}}>FRETBOARD AI</div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <Link to="/pulse" style={{color:"#888",textDecoration:"none",fontSize:13,textTransform:"uppercase",letterSpacing:1,fontWeight:500}}>Pulse</Link>
          <Link to="/harmony" style={{color:"#888",textDecoration:"none",fontSize:13,textTransform:"uppercase",letterSpacing:1,fontWeight:500}}>Path</Link>
          <div style={{background:"rgba(200,184,122,0.1)",color:"#c8b87a",padding:"4px 8px",borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:1}}>COMING SOON</div>
        </div>
      </header>

      <main style={{maxWidth:800,margin:"0 auto",padding:"80px 24px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
        
        <div style={{fontSize:12,color:"#8a7a50",letterSpacing:4,fontWeight:600,marginBottom:24}}>THE INTELLIGENT FRETBOARD TRAINER</div>
        
        <h1 style={{fontSize:64,fontWeight:800,lineHeight:1.1,marginBottom:32,letterSpacing:"-0.02em"}}>
          Learn the neck.<br/>
          <span style={{color:"#c8b87a",fontStyle:"italic"}}>Know why it works.</span>
        </h1>

        <p style={{fontSize:18,color:"#999",lineHeight:1.6,maxWidth:600,marginBottom:48}}>
          Fretboard AI is an interactive guitar trainer that adapts to how you actually play.
          Not static diagrams. Not generic exercises.
          A system that builds your theory knowledge from the fretboard up.
        </p>

        {status.type === 'success' ? (
          <div style={{padding:"16px 24px",background:"rgba(200,184,122,0.1)",border:"1px solid rgba(200,184,122,0.3)",borderRadius:6,color:"#c8b87a",fontWeight:500,marginBottom:64}}>
            {status.message}
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",maxWidth:400,marginBottom:64}}>
            <div style={{display:"flex",width:"100%",gap:8}}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitWaitlist()}
                placeholder="your@email.com"
                style={{flex:1,padding:"14px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#fff",fontSize:16,outline:"none"}}
              />
              <button
                onClick={submitWaitlist}
                disabled={isSubmitting}
                style={{padding:"0 24px",background:"#c8b87a",color:"#000",border:"none",borderRadius:6,fontWeight:600,cursor:isSubmitting?"default":"pointer",opacity:isSubmitting?0.7:1}}
              >
                {isSubmitting ? "···" : "JOIN"}
              </button>
            </div>
            <div style={{marginTop:12,fontSize:13,color:status.type==='error'?"#ef4444":status.type==='dupe'?"#c8b87a":"#666"}}>
              {status.message}
            </div>
          </div>
        )}

        <hr style={{width:"100%",border:"none",borderTop:"1px solid rgba(255,255,255,0.05)",marginBottom:64}} />

        <div style={{width:"100%",textAlign:"left"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"#666",marginBottom:16}}>AVAILABLE NOW</div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:"32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:20,fontWeight:600,color:"#fff",marginBottom:8}}>Interactive Fretboard Visualizer</div>
              <div style={{color:"#888",fontSize:15}}>Learn the notes on the neck, visualize scales, and find your way around — free, no account required.</div>
            </div>
            <Link to="/" style={{background:"#fff",color:"#000",padding:"12px 24px",borderRadius:4,textDecoration:"none",fontWeight:600,fontSize:14,flexShrink:0}}>TRY IT NOW →</Link>
          </div>
        </div>

      </main>
    </div>
  );
}
