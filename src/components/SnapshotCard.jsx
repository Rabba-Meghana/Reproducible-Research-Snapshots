import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Share2, FileText, ExternalLink } from 'lucide-react';
import ScoreRing from './ScoreRing';
import WorkflowDAG from './WorkflowDAG';
import MethodsModal from './MethodsModal';

export default function SnapshotCard({ snapshot, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showMethods, setShowMethods] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const staticCount = snapshot.steps.filter(s => s.static).length;
  const liveCount = snapshot.steps.length - staticCount;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(snapshot.reviewerLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <>
      <div className="card" style={{
        animation: `fadeUp 0.4s ease ${index * 0.08}s both`,
        overflow: 'hidden',
      }}>
        {/* Top bar — score stripe */}
        <div style={{
          height: 3,
          background: snapshot.reproducibilityScore >= 85
            ? 'linear-gradient(90deg, var(--accent-green), transparent)'
            : snapshot.reproducibilityScore >= 65
            ? 'linear-gradient(90deg, var(--accent-amber), transparent)'
            : 'linear-gradient(90deg, var(--accent-red), transparent)',
        }} />

        <div style={{ padding: '20px 24px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <ScoreRing score={snapshot.reproducibilityScore} size={72} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  #{snapshot.id}
                </span>
                {snapshot.status === 'partial' && (
                  <span style={{
                    fontSize: 9, letterSpacing: '0.15em',
                    background: 'rgba(240,176,64,0.12)',
                    border: '1px solid rgba(240,176,64,0.3)',
                    color: 'var(--accent-amber)',
                    padding: '2px 8px', borderRadius: 20,
                    fontFamily: 'var(--font-mono)',
                  }}>PARTIAL SNAPSHOT</span>
                )}
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 6, lineHeight: 1.3 }}>
                {snapshot.title}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                {snapshot.description}
              </p>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <span>👤 {snapshot.author}</span>
                <span>📅 {new Date(snapshot.created).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</span>
                <span style={{ color: 'var(--accent-green)' }}>● {staticCount} static</span>
                <span style={{ color: liveCount > 0 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>◌ {liveCount} live</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
            {snapshot.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                padding: '2px 8px',
                borderRadius: 20,
                color: 'var(--text-muted)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Actions row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '7px 14px', borderRadius: 6,
                cursor: 'pointer', fontSize: 11,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? 'HIDE DAG' : 'VIEW WORKFLOW DAG'}
            </button>

            <button
              onClick={() => setShowMethods(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(0,200,232,0.08)',
                border: '1px solid rgba(0,200,232,0.25)',
                color: 'var(--accent-cyan)',
                padding: '7px 14px', borderRadius: 6,
                cursor: 'pointer', fontSize: 11,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,200,232,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,200,232,0.08)'}
            >
              <FileText size={12} />
              METHODS DRAFT
            </button>

            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: linkCopied ? 'rgba(0,232,160,0.12)' : 'rgba(0,232,160,0.06)',
                border: `1px solid ${linkCopied ? 'rgba(0,232,160,0.4)' : 'rgba(0,232,160,0.2)'}`,
                color: 'var(--accent-green)',
                padding: '7px 14px', borderRadius: 6,
                cursor: 'pointer', fontSize: 11,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
              }}
            >
              <Share2 size={12} />
              {linkCopied ? 'LINK COPIED!' : 'REVIEWER LINK'}
            </button>

            <a
              href={snapshot.reviewerLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '7px 14px', borderRadius: 6,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <ExternalLink size={12} />
              OPEN REVIEW
            </a>
          </div>
        </div>

        {/* Expanded DAG section */}
        {expanded && (
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '20px 24px',
            background: 'var(--bg-deep)',
            animation: 'fadeUp 0.2s ease',
          }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}>
              WORKFLOW DAG — {snapshot.steps.length} SKILLS INVOKED
            </div>
            <WorkflowDAG steps={snapshot.steps} />

            {/* Step detail table */}
            <div style={{ marginTop: 20, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['#', 'SKILL', 'DATABASE', 'TIMESTAMP UTC', 'TYPE'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '0.12em', fontSize: 9 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {snapshot.steps.map(step => (
                    <tr key={step.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{step.id}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-primary)' }}>{step.skill}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{step.db}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{step.timestamp}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          color: step.static ? 'var(--accent-green)' : 'var(--accent-amber)',
                          fontSize: 9, letterSpacing: '0.12em',
                        }}>
                          {step.static ? '● STATIC' : '◌ LIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showMethods && (
        <MethodsModal snapshot={snapshot} onClose={() => setShowMethods(false)} />
      )}
    </>
  );
}
