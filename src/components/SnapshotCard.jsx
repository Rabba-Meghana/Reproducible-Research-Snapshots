import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Share2, FileText, ExternalLink, Sparkles, Trash2 } from 'lucide-react';
import ScoreRing from './ScoreRing';
import WorkflowDAG from './WorkflowDAG';
import MethodsModal from './MethodsModal';
import ImprovementsModal from './ImprovementsModal';

export default function SnapshotCard({ snapshot, index, apiKey, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showMethods, setShowMethods] = useState(false);
  const [showImprove, setShowImprove] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const staticCount = (snapshot.steps || []).filter(s => s.static).length;
  const liveCount = (snapshot.steps || []).length - staticCount;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(snapshot.reviewerLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const outputs = snapshot.outputs || {};

  return (
    <>
      <div className="card" style={{ animation:`fadeUp 0.4s ease ${index * 0.08}s both`, overflow:'hidden' }}>
        {/* Score stripe */}
        <div style={{ height:3, background: snapshot.reproducibilityScore >= 85
          ? 'linear-gradient(90deg, var(--accent-green), transparent)'
          : snapshot.reproducibilityScore >= 65
          ? 'linear-gradient(90deg, var(--accent-amber), transparent)'
          : 'linear-gradient(90deg, var(--accent-red), transparent)' }} />

        <div style={{ padding:'20px 24px' }}>
          <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
            <ScoreRing score={snapshot.reproducibilityScore} size={72} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'var(--text-muted)',
                fontFamily:'var(--font-mono)', marginBottom:4 }}>#{snapshot.id}</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, marginBottom:6, lineHeight:1.3 }}>
                {snapshot.title}
              </h2>
              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5, marginBottom:12 }}>
                {snapshot.description}
              </p>
              <div style={{ display:'flex', gap:20, flexWrap:'wrap', fontSize:11,
                fontFamily:'var(--font-mono)', color:'var(--text-muted)' }}>
                <span>👤 {snapshot.author}</span>
                <span>📅 {new Date(snapshot.created).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</span>
                <span style={{ color:'var(--accent-green)' }}>● {staticCount} static</span>
                {liveCount > 0 && <span style={{ color:'var(--accent-amber)' }}>◌ {liveCount} live</span>}
              </div>
            </div>
          </div>

          {/* Output metrics */}
          {Object.keys(outputs).length > 0 && (
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:16 }}>
              {Object.entries(outputs).map(([key, val]) => (
                <div key={key} style={{ background:'var(--bg-deep)', border:'1px solid var(--border)',
                  borderRadius:8, padding:'8px 14px', textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--text-primary)' }}>
                    {typeof val === 'number' ? val.toLocaleString() : val}
                  </div>
                  <div style={{ fontSize:9, color:'var(--text-muted)', fontFamily:'var(--font-mono)',
                    letterSpacing:'0.1em', marginTop:2 }}>
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:14 }}>
            {(snapshot.tags || []).map(tag => (
              <span key={tag} style={{ fontSize:10, fontFamily:'var(--font-mono)',
                background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
                padding:'2px 8px', borderRadius:20, color:'var(--text-muted)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap', alignItems:'center' }}>
            <ActionBtn onClick={() => setExpanded(e => !e)} icon={expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}>
              {expanded ? 'HIDE DAG' : 'VIEW DAG'}
            </ActionBtn>
            <ActionBtn onClick={() => setShowMethods(true)} icon={<FileText size={12}/>} color="cyan">
              METHODS DRAFT
            </ActionBtn>
            <ActionBtn onClick={() => setShowImprove(true)} icon={<Sparkles size={12}/>} color="violet">
              AI IMPROVE
            </ActionBtn>
            <ActionBtn onClick={handleCopyLink} icon={<Share2 size={12}/>} color="green">
              {linkCopied ? 'COPIED!' : 'REVIEWER LINK'}
            </ActionBtn>
            <a href={snapshot.reviewerLink} target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:6, background:'none',
                border:'1px solid var(--border)', color:'var(--text-muted)', padding:'7px 12px',
                borderRadius:6, fontSize:11, fontFamily:'var(--font-mono)', textDecoration:'none' }}>
              <ExternalLink size={12}/> OPEN
            </a>
            <button onClick={() => onDelete(snapshot.id)}
              style={{ background:'none', border:'none', cursor:'pointer',
                color:'var(--text-muted)', padding:'7px 8px', marginLeft:'auto',
                transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <Trash2 size={14}/>
            </button>
          </div>
        </div>

        {/* Expanded DAG */}
        {expanded && (
          <div style={{ borderTop:'1px solid var(--border)', padding:'20px 24px',
            background:'var(--bg-deep)', animation:'fadeUp 0.2s ease' }}>
            <div style={{ fontSize:10, letterSpacing:'0.2em', color:'var(--text-muted)',
              fontFamily:'var(--font-mono)', marginBottom:16 }}>
              WORKFLOW DAG — {(snapshot.steps||[]).length} SKILLS INVOKED
            </div>
            <WorkflowDAG steps={snapshot.steps || []} />
            <div style={{ marginTop:20, overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11, fontFamily:'var(--font-mono)' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {['#','SKILL','DATABASE','TIMESTAMP UTC','TYPE'].map(h => (
                      <th key={h} style={{ textAlign:'left', padding:'6px 12px',
                        color:'var(--text-muted)', fontWeight:400, letterSpacing:'0.12em', fontSize:9 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(snapshot.steps||[]).map(step => (
                    <tr key={step.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'8px 12px', color:'var(--text-muted)' }}>{step.id}</td>
                      <td style={{ padding:'8px 12px', color:'var(--text-primary)' }}>{step.skill}</td>
                      <td style={{ padding:'8px 12px', color:'var(--text-secondary)' }}>{step.db}</td>
                      <td style={{ padding:'8px 12px', color:'var(--text-muted)' }}>{step.timestamp}</td>
                      <td style={{ padding:'8px 12px' }}>
                        <span style={{ color: step.static ? 'var(--accent-green)' : 'var(--accent-amber)',
                          fontSize:9, letterSpacing:'0.12em' }}>
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

      {showMethods && <MethodsModal snapshot={snapshot} onClose={() => setShowMethods(false)} />}
      {showImprove && <ImprovementsModal snapshot={snapshot} apiKey={apiKey} onClose={() => setShowImprove(false)} />}
    </>
  );
}

function ActionBtn({ onClick, icon, color, children }) {
  const colors = {
    cyan:   { bg:'rgba(0,200,232,0.08)',   border:'rgba(0,200,232,0.25)',   text:'var(--accent-cyan)' },
    green:  { bg:'rgba(0,232,160,0.08)',   border:'rgba(0,232,160,0.25)',   text:'var(--accent-green)' },
    violet: { bg:'rgba(152,112,240,0.08)', border:'rgba(152,112,240,0.25)', text:'var(--accent-violet)' },
    default:{ bg:'none',                   border:'var(--border)',           text:'var(--text-secondary)' },
  };
  const c = colors[color] || colors.default;
  return (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:6,
      background:c.bg, border:`1px solid ${c.border}`, color:c.text,
      padding:'7px 12px', borderRadius:6, cursor:'pointer',
      fontSize:11, fontFamily:'var(--font-mono)', letterSpacing:'0.08em', transition:'all 0.15s' }}>
      {icon}{children}
    </button>
  );
}
