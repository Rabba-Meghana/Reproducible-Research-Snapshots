import React, { useState } from 'react';
import { X, Play, CheckCircle } from 'lucide-react';

const SKILLS = [
  'ChEMBL Query', 'PubMed Search', 'AlphaFold Structure', 'AutoDock Vina',
  'Seurat Preprocessing', 'CellTypist', 'ResFinder', 'BLAST Alignment',
  'STRING PPI Network', 'TCGA Query', 'GEO Fetch', 'Monocle3 Trajectory',
];

export default function NewSnapshotModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleRun = () => {
    if (!title || selectedSkills.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
      setTimeout(() => {
        onClose();
        onAdd && onAdd({ title, author, description, skills: selectedSkills });
      }, 1200);
    }, 2200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(6,8,15,0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, animation: 'fadeUp 0.2s ease',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 16,
        width: '100%', maxWidth: 600,
        maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              NEW WORKFLOW SNAPSHOT
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Capture a Research Run</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Fields */}
          {[
            { label: 'WORKFLOW TITLE', value: title, onChange: setTitle, placeholder: 'e.g. KRAS G12C Inhibitor Screen' },
            { label: 'AUTHOR', value: author, onChange: setAuthor, placeholder: 'e.g. Dr. Jane Smith' },
            { label: 'DESCRIPTION', value: description, onChange: setDescription, placeholder: 'Brief description of research goal…' },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>
                {label}
              </label>
              <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          {/* Skill picker */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
              SELECT K-DENSE SKILLS TO INVOKE
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILLS.map(skill => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      background: active ? 'rgba(0,200,232,0.14)' : 'var(--bg-deep)',
                      border: `1px solid ${active ? 'var(--accent-cyan)' : 'var(--border)'}`,
                      color: active ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      borderRadius: 20,
                      padding: '5px 12px',
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={!title || selectedSkills.length === 0 || running || done}
            style={{
              width: '100%',
              padding: '14px',
              background: done
                ? 'rgba(0,232,160,0.15)'
                : running
                ? 'rgba(0,200,232,0.08)'
                : 'linear-gradient(135deg, rgba(0,200,232,0.2), rgba(152,112,240,0.2))',
              border: `1px solid ${done ? 'var(--accent-green)' : 'var(--accent-cyan)'}`,
              borderRadius: 8,
              color: done ? 'var(--accent-green)' : 'var(--accent-cyan)',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.15em',
              cursor: (!title || selectedSkills.length === 0) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
              opacity: (!title || selectedSkills.length === 0) ? 0.4 : 1,
            }}
          >
            {done ? <><CheckCircle size={14} /> SNAPSHOT CAPTURED!</> :
             running ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◌</span> RUNNING WORKFLOW…</> :
             <><Play size={14} /> RUN & SNAPSHOT</>}
          </button>
        </div>
      </div>
    </div>
  );
}
