import React from 'react';
import { X, MapPin, Clock, CreditCard, Globe, Zap, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore } from '../../store';
import { RiskBadge, ScoreBar, Amount } from '../ui';

export default function TransactionPanel() {
  const { selectedTransaction: txn, setSelectedTransaction } = useStore();

  if (!txn) return null;

  const shap = (txn.shap_values || []).slice(0, 8).map(s => ({
    name: s.feature.replace('Transaction ', '').replace('Geographic ', 'Geo '),
    value: s.shap_value,
    abs: Math.abs(s.shap_value),
  }));

  const riskColor: Record<string, string> = {
    CRITICAL: 'var(--critical)', HIGH: 'var(--high)',
    MEDIUM: 'var(--medium)', LOW: 'var(--low)',
  };
  const color = riskColor[txn.risk_level] || 'var(--accent-primary)';

  const ts = new Date(txn.timestamp);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSelectedTransaction(null)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(2px)' }}
      />

      {/* Panel */}
      <div className="animate-slide-right" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480,
        background: 'var(--bg-surface)',
        borderLeft: `1px solid ${color}44`,
        zIndex: 201,
        overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header bar */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: `linear-gradient(135deg, ${color}10, transparent)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <RiskBadge level={txn.risk_level} />
              {txn.is_blocked && (
                <span className="badge" style={{ background: 'rgba(244,63,94,0.2)', color: 'var(--critical)', border: '1px solid var(--critical-border)' }}>
                  ⊘ BLOCKED
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
              {txn.merchant_name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              TXN #{txn.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8, borderRadius: 8 }} onClick={() => setSelectedTransaction(null)}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', flex: 1 }}>

          {/* Amount + scores */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            marginBottom: 20,
            border: `1px solid ${color}33`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>TRANSACTION AMOUNT</div>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>
                  <Amount value={txn.amount} currency={txn.currency} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>ENSEMBLE RISK</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-mono)', color }}>
                  {(txn.ensemble_score * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <ScoreBar score={txn.fraud_probability} label="Fraud probability (XGBoost)" />
            <ScoreBar score={txn.anomaly_score} label="Anomaly score (Isolation Forest)" />
            <ScoreBar score={txn.ensemble_score} label="Ensemble risk score" />
          </div>

          {/* Meta info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { icon: <CreditCard size={13} />, label: 'Card', val: `•••• ${txn.card_last4}` },
              { icon: <Globe size={13} />, label: 'Category', val: txn.merchant_category },
              { icon: <MapPin size={13} />, label: 'Location', val: `${txn.city || '—'}, ${txn.country}` },
              { icon: <Clock size={13} />, label: 'Time', val: ts.toLocaleTimeString() },
              { icon: <Zap size={13} />, label: 'Velocity 1h', val: `${txn.velocity_1h || 0} txns` },
              { icon: <AlertTriangle size={13} />, label: 'Geo distance', val: txn.geo_distance_km ? `${txn.geo_distance_km.toFixed(0)} km` : '—' },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Flags */}
          {(txn.cross_border || txn.is_blocked) && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {txn.cross_border && (
                <span className="badge badge-high">⚑ Cross-border</span>
              )}
            </div>
          )}

          {/* AI Explanation */}
          {txn.ml_explanation && (
            <div style={{
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 10, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: '0.08em' }}>
                ◈ AI EXPLANATION
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {txn.ml_explanation}
              </div>
            </div>
          )}

          {/* SHAP waterfall */}
          {shap.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.06em' }}>
                SHAP FEATURE CONTRIBUTIONS
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shap} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} width={120} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                      formatter={(v: any) => [v.toFixed(4), 'SHAP value']}
                    />
                    <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                      {shap.map((s, i) => (
                        <Cell key={i} fill={s.value > 0 ? 'var(--critical)' : 'var(--accent-emerald)'} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: 'var(--critical)', borderRadius: 2, display: 'inline-block' }} />
                  Increases fraud risk
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: 'var(--accent-emerald)', borderRadius: 2, display: 'inline-block' }} />
                  Decreases fraud risk
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
