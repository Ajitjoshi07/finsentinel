import React, { useState } from 'react';
import { Wifi, WifiOff, Trash2, Filter } from 'lucide-react';
import { useStore } from '../store';
import { RiskBadge, Amount, SectionHeader, EmptyState } from '../components/ui';
import TransactionPanel from '../components/dashboard/TransactionPanel';

const RISK_LEVELS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function LiveFeed() {
  const { liveFeed, clearFeed, wsConnected, setSelectedTransaction, selectedTransaction } = useStore();
  const [filter, setFilter] = useState('ALL');
  const [showFlagged, setShowFlagged] = useState(false);

  const filtered = liveFeed.filter(t => {
    if (showFlagged && !t.is_flagged) return false;
    if (filter !== 'ALL' && t.risk_level !== filter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4 }}>Live Transaction Feed</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            {wsConnected ? <><span className="live-dot" /><span style={{ color: 'var(--accent-emerald)' }}>WebSocket connected</span></> : <><WifiOff size={12} /> Disconnected</>}
            <span style={{ color: 'var(--border-bright)' }}>·</span>
            <span>{liveFeed.length} transactions captured</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowFlagged(!showFlagged)} style={{ color: showFlagged ? 'var(--high)' : undefined, borderColor: showFlagged ? 'var(--high-border)' : undefined }}>
            <Filter size={14} /> {showFlagged ? 'Flagged only' : 'All txns'}
          </button>
          <button className="btn btn-ghost" onClick={clearFeed}><Trash2 size={14} /> Clear</button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8 }}>
        {RISK_LEVELS.map(r => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className="btn"
            style={{
              padding: '5px 14px',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              background: filter === r ? (r === 'ALL' ? 'var(--accent-primary)' : `var(--${r.toLowerCase()}-bg, var(--bg-hover))`) : 'var(--bg-card)',
              color: filter === r ? (r === 'ALL' ? '#fff' : `var(--${r.toLowerCase()}, var(--text-primary))`) : 'var(--text-secondary)',
              border: `1px solid ${filter === r ? 'transparent' : 'var(--border)'}`,
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Feed table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 80px 100px 90px 80px 100px 60px',
          gap: 12, padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Merchant</span><span>Card</span><span>Amount</span>
          <span>Risk</span><span>Score</span><span>Location</span><span>Time</span>
        </div>

        {/* Rows */}
        <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <EmptyState message="No transactions match the filter. Run the Simulator to generate data." />
          ) : (
            filtered.map((txn, i) => {
              const ts = new Date(txn.timestamp);
              const riskColor: Record<string, string> = {
                CRITICAL: 'var(--critical)', HIGH: 'var(--high)', MEDIUM: 'var(--medium)', LOW: 'var(--low)'
              };
              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTransaction(txn)}
                  className="animate-slide-right"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 80px 100px 90px 80px 100px 60px',
                    gap: 12,
                    padding: '11px 16px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    borderLeft: txn.risk_level === 'CRITICAL' ? '3px solid var(--critical)' : txn.risk_level === 'HIGH' ? '3px solid var(--high)' : '3px solid transparent',
                    background: txn.is_blocked ? 'rgba(244,63,94,0.04)' : 'transparent',
                    transition: 'background 0.12s',
                    animationDelay: `${Math.min(i, 20) * 20}ms`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={e => (e.currentTarget.style.background = txn.is_blocked ? 'rgba(244,63,94,0.04)' : 'transparent')}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{txn.merchant_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {txn.merchant_category}
                      {txn.cross_border && <span style={{ color: 'var(--medium)', marginLeft: 6 }}>⚑ XB</span>}
                      {txn.is_blocked && <span style={{ color: 'var(--critical)', marginLeft: 6 }}>⊘ BLOCKED</span>}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, alignSelf: 'center', color: 'var(--text-secondary)' }}>
                    ••{txn.card_last4}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, alignSelf: 'center' }}>
                    <Amount value={txn.amount} />
                  </span>
                  <div style={{ alignSelf: 'center' }}>
                    <RiskBadge level={txn.risk_level} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, alignSelf: 'center', color: riskColor[txn.risk_level] }}>
                    {(txn.ensemble_score * 100).toFixed(0)}%
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>
                    {txn.city || '—'}, {txn.country}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', alignSelf: 'center' }}>
                    {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedTransaction && <TransactionPanel />}
    </div>
  );
}
