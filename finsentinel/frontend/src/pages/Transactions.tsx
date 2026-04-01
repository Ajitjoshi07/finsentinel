import React, { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { getTransactions } from '../api/client';
import { useStore } from '../store';
import { RiskBadge, Amount, EmptyState, Spinner } from '../components/ui';
import TransactionPanel from '../components/dashboard/TransactionPanel';

export default function Transactions() {
  const { setSelectedTransaction, selectedTransaction } = useStore();
  const [data, setData] = useState<any>({ total: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { limit: PAGE, offset: page * PAGE };
      if (riskFilter) params.risk_level = riskFilter;
      if (flaggedOnly) params.flagged_only = true;
      const d = await getTransactions(params);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [riskFilter, flaggedOnly, page]);

  useEffect(() => { load(); }, [load]);

  const filtered = data.items.filter((t: any) =>
    !search || t.merchant_name.toLowerCase().includes(search.toLowerCase()) ||
    t.card_last4.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4 }}>Transactions</h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{data.total.toLocaleString()} total transactions in database</div>
        </div>
        <button className="btn btn-ghost" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search merchant or card..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '8px 12px 8px 32px',
              color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-body)', outline: 'none',
            }}
          />
        </div>
        {['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
          <button key={r} onClick={() => setRiskFilter(r)} className="btn"
            style={{
              padding: '7px 14px', fontSize: 11, fontFamily: 'var(--font-mono)',
              background: riskFilter === r ? 'var(--bg-elevated)' : 'var(--bg-card)',
              color: riskFilter === r ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: `1px solid ${riskFilter === r ? 'var(--border-bright)' : 'var(--border)'}`,
            }}>
            {r || 'ALL'}
          </button>
        ))}
        <button onClick={() => setFlaggedOnly(!flaggedOnly)} className="btn"
          style={{
            padding: '7px 14px', fontSize: 11,
            background: flaggedOnly ? 'var(--high-bg)' : 'var(--bg-card)',
            color: flaggedOnly ? 'var(--high)' : 'var(--text-secondary)',
            border: `1px solid ${flaggedOnly ? 'var(--high-border)' : 'var(--border)'}`,
          }}>
          ⚑ Flagged Only
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 70px 110px 90px 70px 100px 50px',
          gap: 12, padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Merchant</span><span>Card</span><span>Amount</span><span>Risk</span><span>Score</span><span>City</span><span>Status</span>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState message="No transactions found. Try the Simulator to generate data." />
        ) : (
          <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {filtered.map((txn: any, i: number) => (
              <div
                key={txn.id}
                onClick={() => setSelectedTransaction(txn)}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 70px 110px 90px 70px 100px 50px',
                  gap: 12, padding: '10px 16px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  borderLeft: txn.risk_level === 'CRITICAL' ? '3px solid var(--critical)' : txn.risk_level === 'HIGH' ? '3px solid var(--high)' : '3px solid transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: 12 }}>{txn.merchant_name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{txn.merchant_category}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, alignSelf: 'center', color: 'var(--text-secondary)' }}>••{txn.card_last4}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, alignSelf: 'center' }}><Amount value={txn.amount} /></span>
                <div style={{ alignSelf: 'center' }}><RiskBadge level={txn.risk_level} /></div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, alignSelf: 'center', color: txn.ensemble_score > 0.6 ? 'var(--high)' : 'var(--text-secondary)' }}>
                  {(txn.ensemble_score * 100).toFixed(0)}%
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>{txn.city || '—'}</span>
                <span style={{ alignSelf: 'center', fontSize: 10, fontFamily: 'var(--font-mono)', color: txn.is_blocked ? 'var(--critical)' : txn.is_flagged ? 'var(--high)' : 'var(--accent-emerald)' }}>
                  {txn.is_blocked ? '⊘' : txn.is_flagged ? '⚑' : '✓'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data.total > PAGE && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn btn-ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
            Page {page + 1} of {Math.ceil(data.total / PAGE)}
          </span>
          <button className="btn btn-ghost" disabled={(page + 1) * PAGE >= data.total} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {selectedTransaction && <TransactionPanel />}
    </div>
  );
}
