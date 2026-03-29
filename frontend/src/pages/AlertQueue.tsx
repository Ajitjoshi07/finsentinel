import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, ChevronUp, ExternalLink, RefreshCw } from 'lucide-react';
import { getAlerts, updateAlert } from '../api/client';
import { useStore } from '../store';
import { RiskBadge, Amount, SectionHeader, EmptyState, Spinner } from '../components/ui';
import TransactionPanel from '../components/dashboard/TransactionPanel';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'var(--accent-primary)',
  REVIEWING: 'var(--medium)',
  CONFIRMED_FRAUD: 'var(--critical)',
  FALSE_POSITIVE: 'var(--accent-emerald)',
  ESCALATED: 'var(--accent-violet)',
};

export default function AlertQueue() {
  const { setAlertCount, setSelectedTransaction } = useStore();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [expanding, setExpanding] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const params: any = { limit: 100 };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const data = await getAlerts(params);
      setAlerts(data.items);
      setTotal(data.total);
      if (statusFilter === 'OPEN') setAlertCount(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, setAlertCount]);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = async (alertId: string, status: string) => {
    setUpdating(alertId);
    try {
      await updateAlert(alertId, {
        status,
        reviewed_by: 'analyst@finsentinel.ai',
        review_notes: notes[alertId] || null,
      });
      toast.success(`Alert marked as ${status.replace('_', ' ')}`);
      await load();
    } catch (e) {
      toast.error('Failed to update alert');
    } finally {
      setUpdating(null);
    }
  };

  const STATUS_TABS = ['ALL', 'OPEN', 'REVIEWING', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE', 'ESCALATED'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4 }}>Alert Queue</h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Case management · {total} alerts in current view
          </div>
        </div>
        <button className="btn btn-ghost" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="btn"
            style={{
              padding: '5px 14px', fontSize: 11,
              fontFamily: 'var(--font-mono)',
              background: statusFilter === s ? 'var(--bg-elevated)' : 'var(--bg-card)',
              color: statusFilter === s ? STATUS_COLORS[s] || 'var(--text-primary)' : 'var(--text-secondary)',
              border: `1px solid ${statusFilter === s ? STATUS_COLORS[s] + '44' || 'var(--border-bright)' : 'var(--border)'}`,
            }}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : alerts.length === 0 ? (
        <EmptyState message="No alerts in this category. Generate transactions with the Simulator." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map((alert, i) => {
            const isExpanded = expanding === alert.id;
            const txn = alert.transaction;
            const statusColor = STATUS_COLORS[alert.status] || 'var(--text-muted)';

            return (
              <div
                key={alert.id}
                className="animate-slide-up card"
                style={{
                  padding: 0, overflow: 'hidden',
                  animationDelay: `${i * 25}ms`,
                  borderColor: alert.risk_level === 'CRITICAL' ? 'var(--critical-border)' : alert.risk_level === 'HIGH' ? 'var(--high-border)' : 'var(--border)',
                }}
              >
                {/* Alert row */}
                <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 16, alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <RiskBadge level={alert.risk_level} />
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: statusColor, padding: '2px 8px', background: statusColor + '15', borderRadius: 99, border: `1px solid ${statusColor}33` }}>
                        {alert.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {txn?.merchant_name || 'Unknown Merchant'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      •••• {txn?.card_last4} · {txn?.merchant_category} · {txn?.city}, {txn?.country}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 2 }}>
                      {txn && <Amount value={txn.amount} />}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--critical)', marginBottom: 2 }}>
                      {(alert.fraud_probability * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FRAUD PROB</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {alert.status === 'OPEN' || alert.status === 'REVIEWING' ? (
                      <>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: 11 }}
                          disabled={updating === alert.id}
                          onClick={() => handleUpdate(alert.id, 'CONFIRMED_FRAUD')}
                        >
                          <CheckCircle size={13} /> Confirm
                        </button>
                        <button
                          className="btn btn-success"
                          style={{ padding: '6px 12px', fontSize: 11 }}
                          disabled={updating === alert.id}
                          onClick={() => handleUpdate(alert.id, 'FALSE_POSITIVE')}
                        >
                          <XCircle size={13} /> Dismiss
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: statusColor, fontFamily: 'var(--font-mono)' }}>
                        {alert.reviewed_by || 'resolved'}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: 6, borderRadius: 6 }}
                    onClick={() => setExpanding(isExpanded ? null : alert.id)}
                  >
                    <ChevronUp size={14} style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)', paddingTop: 14 }} className="animate-slide-up">
                    {/* Explanation */}
                    {alert.explanation && (
                      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: 10, marginRight: 6 }}>◈ AI:</span>
                        {alert.explanation}
                      </div>
                    )}
                    {/* Risk factors */}
                    {alert.top_risk_factors?.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                        {alert.top_risk_factors.map((f: string) => (
                          <span key={f} className="badge badge-high">{f}</span>
                        ))}
                      </div>
                    )}
                    {/* Notes */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Add review notes..."
                        value={notes[alert.id] || ''}
                        onChange={e => setNotes({ ...notes, [alert.id]: e.target.value })}
                        style={{
                          flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                          borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)',
                          fontSize: 12, fontFamily: 'var(--font-body)', outline: 'none',
                        }}
                      />
                      {txn && (
                        <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: 11 }} onClick={() => setSelectedTransaction(txn)}>
                          <ExternalLink size={13} /> Full Details
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
