import React from 'react';

// ── Risk Badge ────────────────────────────────────────────────
export function RiskBadge({ level }: { level: string }) {
  const cls = `badge badge-${level?.toLowerCase()}`;
  const dots: Record<string, string> = {
    CRITICAL: '●●●●', HIGH: '●●●○', MEDIUM: '●●○○', LOW: '●○○○'
  };
  return (
    <span className={cls}>
      <span style={{ fontSize: 8, letterSpacing: '-1px' }}>{dots[level] || '○○○○'}</span>
      {level}
    </span>
  );
}

// ── Stat Card ────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  mono?: boolean;
  glow?: boolean;
}

export function StatCard({ label, value, sub, color, icon, mono, glow }: StatCardProps) {
  return (
    <div className={`card ${glow ? 'animate-glow' : ''}`} style={{
      borderColor: color ? `${color}33` : undefined,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {color && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: color,
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
          {label}
        </span>
        {icon && (
          <div style={{ color: color || 'var(--text-muted)', opacity: 0.7 }}>{icon}</div>
        )}
      </div>
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
        color: color || 'var(--text-primary)',
        lineHeight: 1,
        marginBottom: 6,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
      )}
    </div>
  );
}

// ── Score Bar ─────────────────────────────────────────────────
export function ScoreBar({ score, label }: { score: number; label: string }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? 'var(--critical)' : pct >= 60 ? 'var(--high)' : pct >= 35 ? 'var(--medium)' : 'var(--low)';
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// ── Amount ───────────────────────────────────────────────────
export function Amount({ value, currency = 'USD' }: { value: number; currency?: string }) {
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 });
  return <span className="mono">{fmt.format(value)}</span>;
}

// ── Empty state ───────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⬡</div>
      <div style={{ fontSize: 13 }}>{message}</div>
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{
        width: 24, height: 24,
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────
export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 18, letterSpacing: '-0.02em' }}>{title}</h2>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}
