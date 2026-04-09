import React, { useState } from 'react';
import { Plus, Search, FlaskConical, Github, LogOut } from 'lucide-react';
import ApiKeyScreen from './components/ApiKeyScreen';
import SnapshotCard from './components/SnapshotCard';
import StatsBar from './components/StatsBar';
import NewSnapshotModal from './components/NewSnapshotModal';
import './App.css';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [filterScore, setFilterScore] = useState('all');

  if (!apiKey) return <ApiKeyScreen onSubmit={setApiKey} />;

  const handleAdd = snapshot => setSnapshots(prev => [snapshot, ...prev]);
  const handleDelete = id => setSnapshots(prev => prev.filter(s => s.id !== id));

  const filtered = snapshots.filter(s => {
    const q = query.toLowerCase();
    const matchQ = !q || s.title?.toLowerCase().includes(q) || (s.tags||[]).some(t => t.includes(q));
    const matchScore =
      filterScore === 'all' ? true :
      filterScore === 'high' ? s.reproducibilityScore >= 85 :
      filterScore === 'partial' ? s.reproducibilityScore >= 65 && s.reproducibilityScore < 85 :
      s.reproducibilityScore < 65;
    return matchQ && matchScore;
  });

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-block">
          <div className="logo-icon"><FlaskConical size={20} color="var(--accent-cyan)"/></div>
          <div>
            <div className="logo-title">RRS</div>
            <div className="logo-sub">K-Dense Web</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {['Snapshots','Reviewer Links','Methods Library','Team Workflows','Settings'].map((label, i) => (
            <div key={label} className={`nav-item ${i === 0 ? 'active' : ''}`}>{label}</div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a href="https://github.com/Rabba-Meghana/Reproducible-Research-Snapshots"
            target="_blank" rel="noreferrer" className="github-link">
            <Github size={13}/> View on GitHub
          </a>
          <div className="version-tag">Powered by Groq · MIT License</div>
          <button onClick={() => { setApiKey(''); setSnapshots([]); }}
            style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none',
              cursor:'pointer', color:'var(--text-muted)', fontSize:11, fontFamily:'var(--font-mono)',
              padding:'8px 0', marginTop:4, transition:'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <LogOut size={12}/> Disconnect key
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <p className="header-eyebrow">K-Dense Web · Research Infrastructure</p>
            <h1 className="header-title">Reproducible Research <em>Snapshots</em></h1>
            <p className="header-desc">
              One-click frozen workflow capsules for peer review. Every K-Dense run becomes a citable, auditable, shareable artifact — generated live by Groq AI.
            </p>
          </div>
          <button onClick={() => setShowNew(true)} className="new-btn">
            <Plus size={15}/> NEW SNAPSHOT
          </button>
        </header>

        <StatsBar snapshots={snapshots} />

        {snapshots.length > 0 && (
          <div className="filters-row">
            <div className="search-box">
              <Search size={13} color="var(--text-muted)" style={{ flexShrink:0 }}/>
              <input placeholder="Search snapshots, tags…" value={query}
                onChange={e => setQuery(e.target.value)} className="search-input"/>
            </div>
            <div className="score-filters">
              {[
                { key:'all', label:'ALL' },
                { key:'high', label:'≥85 HIGH' },
                { key:'partial', label:'65–84 PARTIAL' },
                { key:'low', label:'<65 LOW' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilterScore(key)}
                  className={`filter-btn ${filterScore === key ? 'active' : ''}`}
                  style={{
                    borderColor: filterScore === key
                      ? key==='high' ? 'var(--accent-green)' : key==='partial' ? 'var(--accent-amber)' : key==='low' ? 'var(--accent-red)' : 'var(--accent-cyan)'
                      : 'var(--border)',
                    color: filterScore === key
                      ? key==='high' ? 'var(--accent-green)' : key==='partial' ? 'var(--accent-amber)' : key==='low' ? 'var(--accent-red)' : 'var(--accent-cyan)'
                      : 'var(--text-muted)',
                  }}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {snapshots.length > 0 && (
          <div className="results-label">
            {filtered.length} snapshot{filtered.length !== 1 ? 's' : ''}
            {query && <span> matching "<strong>{query}</strong>"</span>}
          </div>
        )}

        <div className="snapshots-list">
          {snapshots.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize:40, marginBottom:16 }}>🔬</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, marginBottom:8, color:'var(--text-primary)' }}>
                No snapshots yet
              </div>
              <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24, lineHeight:1.6 }}>
                Click <strong style={{ color:'var(--accent-cyan)' }}>NEW SNAPSHOT</strong> to describe a K-Dense workflow.<br/>
                Groq AI will generate a complete reproducibility capsule in seconds.
              </div>
              <button onClick={() => setShowNew(true)} style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'linear-gradient(135deg, rgba(0,200,232,0.2), rgba(152,112,240,0.15))',
                border:'1px solid var(--accent-cyan)', color:'var(--accent-cyan)',
                padding:'12px 24px', borderRadius:8, cursor:'pointer',
                fontFamily:'var(--font-mono)', fontSize:12, letterSpacing:'0.14em' }}>
                <Plus size={14}/> CREATE YOUR FIRST SNAPSHOT
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No snapshots match your filters.</div>
          ) : (
            filtered.map((s, i) => (
              <SnapshotCard key={s.id} snapshot={s} index={i} apiKey={apiKey} onDelete={handleDelete}/>
            ))
          )}
        </div>
      </main>

      {showNew && <NewSnapshotModal apiKey={apiKey} onClose={() => setShowNew(false)} onAdd={handleAdd}/>}
    </div>
  );
}
