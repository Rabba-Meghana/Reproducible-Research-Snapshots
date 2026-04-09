import React, { useState } from 'react';
import { FlaskConical, Key, ArrowRight, ExternalLink } from 'lucide-react';

export default function ApiKeyScreen({ onSubmit }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);

  const handleSubmit = async () => {
    if (!key.trim()) return;
    setTesting(true);
    setError('');
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key.trim()}` },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || 'Invalid API key');
      }
      onSubmit(key.trim());
    } catch (e) {
      setError(e.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:480, animation:'fadeUp 0.5s ease' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:40 }}>
          <div style={{ width:48, height:48, background:'rgba(0,200,232,0.1)',
            border:'1px solid rgba(0,200,232,0.3)', borderRadius:12,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FlaskConical size={24} color="var(--accent-cyan)"/>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, letterSpacing:'0.1em' }}>RRS</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>K-Dense Web · Reproducible Research Snapshots</div>
          </div>
        </div>

        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32, marginBottom:12, lineHeight:1.2 }}>
          Enter your <em style={{ color:'var(--accent-cyan)' }}>Groq</em> API Key
        </h1>
        <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7, marginBottom:32 }}>
          Every research snapshot is generated live by Groq's LLM — no hardcoded data, no mocks.
          Your API key stays in your browser and is never sent anywhere except Groq.
        </p>

        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)',
          borderRadius:12, padding:24, marginBottom:16 }}>
          <label style={{ fontSize:9, letterSpacing:'0.18em', color:'var(--text-muted)',
            fontFamily:'var(--font-mono)', display:'block', marginBottom:8 }}>
            GROQ API KEY
          </label>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flex:1,
              background:'var(--bg-deep)', border:'1px solid var(--border)',
              borderRadius:8, padding:'10px 14px', transition:'border-color 0.2s' }}>
              <Key size={14} color="var(--text-muted)"/>
              <input
                type="password"
                placeholder="gsk_••••••••••••••••••••••"
                value={key}
                onChange={e => setKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ background:'none', border:'none', outline:'none',
                  color:'var(--text-primary)', fontSize:13, fontFamily:'var(--font-mono)', flex:1 }}
              />
            </div>
            <button onClick={handleSubmit} disabled={!key.trim() || testing} style={{
              display:'flex', alignItems:'center', gap:6,
              background:'linear-gradient(135deg, rgba(0,200,232,0.25), rgba(152,112,240,0.2))',
              border:'1px solid var(--accent-cyan)', color:'var(--accent-cyan)',
              padding:'10px 18px', borderRadius:8, cursor: key.trim() && !testing ? 'pointer' : 'not-allowed',
              fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.1em',
              opacity: key.trim() && !testing ? 1 : 0.4, transition:'all 0.2s', flexShrink:0 }}>
              {testing
                ? <span style={{ animation:'spin 1s linear infinite', display:'inline-block' }}>◌</span>
                : <ArrowRight size={14}/>}
              {testing ? 'TESTING…' : 'CONNECT'}
            </button>
          </div>

          {error && (
            <div style={{ marginTop:12, fontSize:12, color:'var(--accent-red)',
              fontFamily:'var(--font-mono)', background:'rgba(240,80,96,0.08)',
              border:'1px solid rgba(240,80,96,0.2)', borderRadius:6, padding:'8px 12px' }}>
              {error}
            </div>
          )}
        </div>

        <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer"
          style={{ display:'flex', alignItems:'center', gap:6, fontSize:12,
            color:'var(--text-muted)', fontFamily:'var(--font-mono)', textDecoration:'none', transition:'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ExternalLink size={11}/> Get a free Groq API key at console.groq.com
        </a>
      </div>
    </div>
  );
}
