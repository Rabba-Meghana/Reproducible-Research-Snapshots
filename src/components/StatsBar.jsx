import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { scoreHistory, tagDistribution } from '../data/mockData';

function StatBox({ label, value, sub, color = 'var(--text-primary)', glow }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px 20px',
      flex: '1 1 140px',
      boxShadow: glow ? `0 0 20px ${glow}22` : 'none',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', color, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-bright)',
      borderRadius: 6,
      padding: '8px 12px',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--accent-cyan)' }}>Avg Score: {payload[0].value}</div>
    </div>
  );
};

export default function StatsBar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
      {/* Stat boxes */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <StatBox label="TOTAL SNAPSHOTS" value="52" sub="across 8 labs" color="var(--text-primary)" />
        <StatBox label="AVG REPRO SCORE" value="83" sub="↑ 4pts this month" color="var(--accent-cyan)" glow="rgba(0,200,232,0.3)" />
        <StatBox label="FULLY STATIC" value="31" sub="59% of workflows" color="var(--accent-green)" glow="rgba(0,232,160,0.3)" />
        <StatBox label="REVIEWER LINKS" value="127" sub="sent this month" color="var(--accent-violet)" />
        <StatBox label="METHODS COPIED" value="89" sub="manuscript-ready" color="var(--accent-amber)" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {/* Score trend */}
        <div style={{
          flex: '2 1 320px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '16px 20px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
            REPRODUCIBILITY SCORE TREND
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={scoreHistory}>
              <XAxis dataKey="date" tick={{ fill: '#4a6080', fontSize: 9, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="avg"
                stroke="var(--accent-cyan)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent-cyan)', r: 3 }}
                activeDot={{ r: 5, fill: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 6px var(--accent-cyan))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tag distribution */}
        <div style={{
          flex: '1 1 240px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '16px 20px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
            TOP RESEARCH DOMAINS
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={tagDistribution} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="tag" tick={{ fill: '#8fa3c8', fontSize: 9, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} width={80} />
              <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                {tagDistribution.map((_, i) => (
                  <Cell key={i} fill={`hsl(${190 + i * 20}, 80%, ${55 - i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
