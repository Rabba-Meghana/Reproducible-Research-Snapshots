import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

export default function MethodsModal({ snapshot, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snapshot.methodsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(6,8,15,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'fadeUp 0.2s ease',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 680,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
              AUTO-GENERATED METHODS SECTION
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' }}>
              {snapshot.title}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div style={{
            background: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '20px',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.75,
            color: 'var(--text-primary)',
          }}>
            {snapshot.methodsText}
          </div>

          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {snapshot.databases.map(db => (
              <span key={db} style={{
                background: 'rgba(0,200,232,0.08)',
                border: '1px solid rgba(0,200,232,0.2)',
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 11,
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
              }}>{db}</span>
            ))}
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
            ✓ All database versions and query timestamps are locked to this snapshot. Ready to paste into your manuscript's Methods section.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 12,
        }}>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: copied ? 'rgba(0,232,160,0.15)' : 'rgba(0,200,232,0.12)',
              border: `1px solid ${copied ? 'var(--accent-green)' : 'var(--accent-cyan)'}`,
              color: copied ? 'var(--accent-green)' : 'var(--accent-cyan)',
              padding: '10px 20px',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}
          </button>
        </div>
      </div>
    </div>
  );
}
