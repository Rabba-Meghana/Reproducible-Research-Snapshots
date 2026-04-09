import React from 'react';

const STEP_COLORS = {
  static: 'var(--accent-green)',
  live: 'var(--accent-amber)',
};

export default function WorkflowDAG({ steps }) {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        minWidth: steps.length * 160,
        padding: '12px 0',
      }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {/* Node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 140 }}>
              <div style={{
                width: 40, height: 40,
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: `2px solid ${step.static ? STEP_COLORS.static : STEP_COLORS.live}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 14px ${step.static ? 'rgba(0,232,160,0.25)' : 'rgba(240,176,64,0.25)'}`,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: step.static ? STEP_COLORS.static : STEP_COLORS.live,
                fontWeight: 700,
                position: 'relative',
                flexShrink: 0,
              }}>
                {i + 1}
                {/* Pulse ring for live */}
                {!step.static && (
                  <span style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: '1px solid var(--accent-amber)',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                    opacity: 0.4,
                  }} />
                )}
              </div>
              <div style={{
                marginTop: 8,
                textAlign: 'center',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                maxWidth: 120,
              }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 11, marginBottom: 2 }}>
                  {step.skill}
                </div>
                <div style={{ color: step.static ? 'var(--accent-green)' : 'var(--accent-amber)', fontSize: 9, letterSpacing: '0.1em' }}>
                  {step.static ? '● STATIC' : '◌ LIVE'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9, marginTop: 2 }}>
                  {step.db}
                </div>
              </div>
            </div>

            {/* Arrow connector */}
            {i < steps.length - 1 && (
              <div style={{
                height: 2,
                width: 32,
                background: 'linear-gradient(90deg, var(--border-bright), var(--border))',
                flexShrink: 0,
                position: 'relative',
                top: -16,
              }}>
                <span style={{
                  position: 'absolute',
                  right: -1,
                  top: -4,
                  color: 'var(--text-muted)',
                  fontSize: 10,
                }}>▶</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 4, paddingLeft: 4 }}>
        <span style={{ fontSize: 9, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          ● STATIC — fully reproducible
        </span>
        <span style={{ fontSize: 9, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          ◌ LIVE — snapshot may vary
        </span>
      </div>
    </div>
  );
}
