import React, { useState } from 'react';
import { X, Sparkles, Loader } from 'lucide-react';
import { improveSnapshot } from '../groq';

export default function ImprovementsModal({ snapshot, apiKey, onClose }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await improveSnapshot(apiKey, snapshot);
      setSuggestions(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(6,8,15,0.88)',
      backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, animation:'fadeUp 0.2s ease' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-bright)',
        borderRadius:16, width:'100%', maxWidth:600, maxHeight:'80vh',
        display:'flex', flexDirection:'column', overflow:'hidden',
        boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.2em', color:'var(--accent-violet)',
              fontFamily:'var(--font-mono)', marginBottom:6 }}>AI REPRODUCIBILITY ADVISOR</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:18 }}>Improve This Snapshot</h3>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding:24, overflowY:'auto', flex:1 }}>
          {!suggestions && !loading && (
            <div style={{ textAlign:'center', padding:'32px 0' }}>
              <div style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:20, lineHeight:1.6 }}>
                Groq AI will analyze this snapshot and suggest concrete steps to increase its reproducibility score from <strong style={{ color:'var(--accent-amber)' }}>{snapshot.reproducibilityScore}</strong>.
              </div>
              <button onClick={fetchSuggestions} style={{
                display:'flex', alignItems:'center', gap:8, margin:'0 auto',
                background:'rgba(152,112,240,0.15)', border:'1px solid var(--accent-violet)',
                color:'var(--accent-violet)', padding:'12px 24px', borderRadius:8,
                cursor:'pointer', fontFamily:'var(--font-mono)', fontSize:12, letterSpacing:'0.12em' }}>
                <Sparkles size={14} /> ANALYZE WITH GROQ
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ animation:'spin 1s linear infinite', display:'inline-block',
                fontSize:24, color:'var(--accent-violet)', marginBottom:16 }}>◌</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
                Groq is analyzing your workflow…
              </div>
            </div>
          )}

          {error && (
            <div style={{ background:'rgba(240,80,96,0.1)', border:'1px solid rgba(240,80,96,0.3)',
              borderRadius:8, padding:16, color:'var(--accent-red)', fontSize:13, fontFamily:'var(--font-mono)' }}>
              {error}
            </div>
          )}

          {suggestions && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{ background:'var(--bg-deep)', border:'1px solid var(--border)',
                  borderRadius:8, padding:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:15, color:'var(--text-primary)' }}>
                      {s.title}
                    </div>
                    <span style={{ background:'rgba(0,232,160,0.12)', border:'1px solid rgba(0,232,160,0.3)',
                      color:'var(--accent-green)', padding:'2px 10px', borderRadius:20,
                      fontSize:10, fontFamily:'var(--font-mono)', letterSpacing:'0.1em', flexShrink:0, marginLeft:12 }}>
                      {s.scoreImpact}
                    </span>
                  </div>
                  <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{s.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
