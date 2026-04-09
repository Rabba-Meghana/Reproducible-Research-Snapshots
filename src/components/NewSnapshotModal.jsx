import React, { useState } from 'react';
import { X, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { generateSnapshot } from '../groq';

const SKILLS = [
  'ChEMBL Query','PubMed Search','AlphaFold Structure','AutoDock Vina',
  'Seurat Preprocessing','CellTypist','ResFinder','BLAST Alignment',
  'STRING PPI Network','TCGA Query','GEO Fetch','Monocle3 Trajectory',
  'GWAS Catalog','UniProt Fetch','RDKit Descriptor','Ensembl VEP',
];

export default function NewSnapshotModal({ apiKey, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [error, setError] = useState('');

  const toggleSkill = skill =>
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);

  const handleRun = async () => {
    if (!title || selectedSkills.length === 0) return;
    setStatus('running');
    setError('');
    try {
      const snapshot = await generateSnapshot(apiKey, { title, author, description, skills: selectedSkills });
      onAdd(snapshot);
      setStatus('done');
      setTimeout(() => onClose(), 1200);
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  };

  const canRun = title.trim() && selectedSkills.length > 0 && status === 'idle';

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(6,8,15,0.9)',
      backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, animation:'fadeUp 0.2s ease' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-bright)',
        borderRadius:16, width:'100%', maxWidth:600, maxHeight:'88vh', overflowY:'auto',
        boxShadow:'0 32px 80px rgba(0,0,0,0.7)' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:'0.2em', color:'var(--accent-cyan)',
              fontFamily:'var(--font-mono)', marginBottom:4 }}>NEW WORKFLOW SNAPSHOT · POWERED BY GROQ</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:20 }}>Capture a Research Run</h3>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}>
            <X size={18}/>
          </button>
        </div>

        <div style={{ padding:24 }}>
          {/* Fields */}
          {[
            { label:'WORKFLOW TITLE *', value:title, onChange:setTitle, placeholder:'e.g. KRAS G12C Inhibitor Screen' },
            { label:'AUTHOR', value:author, onChange:setAuthor, placeholder:'e.g. Dr. Jane Smith' },
            { label:'DESCRIPTION', value:description, onChange:setDescription, placeholder:'Describe the scientific goal of this workflow…' },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label} style={{ marginBottom:16 }}>
              <label style={{ fontSize:9, letterSpacing:'0.18em', color:'var(--text-muted)',
                fontFamily:'var(--font-mono)', display:'block', marginBottom:6 }}>{label}</label>
              <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                style={{ width:'100%', background:'var(--bg-deep)', border:'1px solid var(--border)',
                  borderRadius:6, padding:'10px 14px', color:'var(--text-primary)', fontSize:13,
                  fontFamily:'var(--font-sans)', outline:'none', transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          ))}

          {/* Skill picker */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:9, letterSpacing:'0.18em', color:'var(--text-muted)',
              fontFamily:'var(--font-mono)', marginBottom:10 }}>SELECT K-DENSE SKILLS TO INVOKE *</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {SKILLS.map(skill => {
                const active = selectedSkills.includes(skill);
                return (
                  <button key={skill} onClick={() => toggleSkill(skill)} style={{
                    background: active ? 'rgba(0,200,232,0.14)' : 'var(--bg-deep)',
                    border:`1px solid ${active ? 'var(--accent-cyan)' : 'var(--border)'}`,
                    color: active ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    borderRadius:20, padding:'5px 12px', fontSize:11,
                    fontFamily:'var(--font-mono)', cursor:'pointer', transition:'all 0.15s' }}>
                    {skill}
                  </button>
                );
              })}
            </div>
            {selectedSkills.length > 0 && (
              <div style={{ marginTop:8, fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
                {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Error */}
          {status === 'error' && (
            <div style={{ background:'rgba(240,80,96,0.1)', border:'1px solid rgba(240,80,96,0.3)',
              borderRadius:8, padding:'12px 16px', marginBottom:16, display:'flex', gap:10, alignItems:'flex-start' }}>
              <AlertCircle size={14} color="var(--accent-red)" style={{ flexShrink:0, marginTop:1 }}/>
              <span style={{ fontSize:12, color:'var(--accent-red)', fontFamily:'var(--font-mono)' }}>{error}</span>
            </div>
          )}

          {/* Run button */}
          <button onClick={handleRun} disabled={!canRun} style={{
            width:'100%', padding:14,
            background: status === 'done' ? 'rgba(0,232,160,0.15)'
              : status === 'running' ? 'rgba(0,200,232,0.06)'
              : 'linear-gradient(135deg, rgba(0,200,232,0.2), rgba(152,112,240,0.2))',
            border:`1px solid ${status === 'done' ? 'var(--accent-green)' : 'var(--accent-cyan)'}`,
            borderRadius:8,
            color: status === 'done' ? 'var(--accent-green)' : 'var(--accent-cyan)',
            fontSize:12, fontFamily:'var(--font-mono)', letterSpacing:'0.15em',
            cursor: canRun ? 'pointer' : 'not-allowed',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            transition:'all 0.2s', opacity: !title || selectedSkills.length === 0 ? 0.4 : 1 }}>
            {status === 'done' && <><CheckCircle size={14}/> SNAPSHOT CAPTURED!</>}
            {status === 'running' && <><span style={{ animation:'spin 1s linear infinite', display:'inline-block' }}>◌</span> GROQ IS GENERATING YOUR SNAPSHOT…</>}
            {(status === 'idle' || status === 'error') && <><Play size={14}/> RUN & SNAPSHOT WITH GROQ</>}
          </button>
        </div>
      </div>
    </div>
  );
}
