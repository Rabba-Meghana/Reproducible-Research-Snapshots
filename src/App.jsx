import React, { useState } from 'react';
import { Plus, Search, FlaskConical, Github } from 'lucide-react';
import SnapshotCard from './components/SnapshotCard';
import StatsBar from './components/StatsBar';
import NewSnapshotModal from './components/NewSnapshotModal';
import { mockSnapshots } from './data/mockData';
import './App.css';

export default function App() {
  const [snapshots] = useState(mockSnapshots);
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [filterScore, setFilterScore] = useState('all');

  const filtered = snapshots.filter(s => {
    const matchQ = !query || s.title.toLowerCase().includes(query.toLowerCase()) || s.tags.some(t => t.includes(query.toLowerCase()));
    const matchScore =
      filterScore === 'all' ? true :
      filterScore === 'high' ? s.reproducibilityScore >= 85 :
      filterScore === 'partial' ? (s.reproducibilityScore >= 65 && s.reproducibilityScore < 85) :
      s.reproducibilityScore < 65;
    return matchQ && matchScore;
  });

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-block">
          <div className="logo-icon">
            <FlaskConical size={20} color="var(--accent-cyan)" />
          </div>
          <div>
            <div className="logo-title">RRS</div>
            <div className="logo-sub">K-Dense Web</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { label: 'Snapshots', active: true },
            { label: 'Reviewer Links', active: false },
            { label: 'Methods Library', active: false },
            { label: 'Team Workflows', active: false },
            { label: 'Settings', active: false },
          ].map(({ label, active }) => (
            <div key={label} className={`nav-item ${active ? 'active' : ''}`}>
              {label}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a
            href="https://github.com/Rabba-Meghana/Reproducible-Research-Snapshots"
            target="_blank"
            rel="noreferrer"
            className="github-link"
          >
            <Github size={13} />
            View on GitHub
          </a>
          <div className="version-tag">Open Source · MIT License</div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Top header */}
        <header className="top-header">
          <div>
            <p className="header-eyebrow">K-Dense Web · Research Infrastructure</p>
            <h1 className="header-title">
              Reproducible Research <em>Snapshots</em>
            </h1>
            <p className="header-desc">
              One-click frozen workflow capsules for peer review. Every K-Dense run becomes a citable, auditable, shareable artifact.
            </p>
          </div>

          <button
            onClick={() => setShowNew(true)}
            className="new-btn"
          >
            <Plus size={15} />
            NEW SNAPSHOT
          </button>
        </header>

        {/* Stats */}
        <StatsBar />

        {/* Filters */}
        <div className="filters-row">
          <div className="search-box">
            <Search size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              placeholder="Search snapshots, tags…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="score-filters">
            {[
              { key: 'all', label: 'ALL' },
              { key: 'high', label: '≥85 HIGH' },
              { key: 'partial', label: '65–84 PARTIAL' },
              { key: 'low', label: '<65 LOW' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterScore(key)}
                className={`filter-btn ${filterScore === key ? 'active' : ''}`}
                style={{
                  borderColor: filterScore === key
                    ? key === 'high' ? 'var(--accent-green)'
                    : key === 'partial' ? 'var(--accent-amber)'
                    : key === 'low' ? 'var(--accent-red)'
                    : 'var(--accent-cyan)'
                    : 'var(--border)',
                  color: filterScore === key
                    ? key === 'high' ? 'var(--accent-green)'
                    : key === 'partial' ? 'var(--accent-amber)'
                    : key === 'low' ? 'var(--accent-red)'
                    : 'var(--accent-cyan)'
                    : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Snapshot count */}
        <div className="results-label">
          {filtered.length} snapshot{filtered.length !== 1 ? 's' : ''}
          {query && <span> matching "<strong>{query}</strong>"</span>}
        </div>

        {/* Cards */}
        <div className="snapshots-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div>No snapshots match your filters.</div>
            </div>
          ) : (
            filtered.map((s, i) => <SnapshotCard key={s.id} snapshot={s} index={i} />)
          )}
        </div>
      </main>

      {showNew && <NewSnapshotModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
