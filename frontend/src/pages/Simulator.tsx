import React, { useState, useRef } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const SCENARIOS = [
  { id: 'random', label: 'Mixed Reality', desc: '85% normal, 15% suspicious — mirrors real-world fraud distribution', color: '#3b82f6', tag: 'Balanced', icon: '📊' },
  { id: 'high_fraud', label: 'Fraud Storm', desc: 'High-velocity cross-border attacks and large anomalous amounts', color: '#ef4444', tag: 'Stress Test', icon: '⚡' },
  { id: 'normal', label: 'Clean Traffic', desc: 'Low-risk domestic transactions of a trusted cardholder', color: '#10b981', tag: 'Baseline', icon: '✅' },
  { id: 'burst', label: 'Velocity Burst', desc: 'Card testing attack — many rapid transactions in succession', color: '#f59e0b', tag: 'Anomaly', icon: '🚀' },
];

export default function Simulator() {
  const [scenario, setScenario] = useState('random');
  const [count, setCount] = useState(10);
  const [running, setRunning] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, flagged: 0, critical: 0, high: 0 });
  const autoRef = useRef<any>(null);

  const run = async (sc = scenario, ct = count) => {
    setRunning(true);
    try {
      const res = await axios.post(API + '/simulate', { scenario: sc, count: ct });
      const txns = res.data.transactions || [];
      setResults(prev => [...txns, ...prev].slice(0, 50));
      setStats(prev => ({
        total: prev.total + txns.length,
        flagged: prev.flagged + txns.filter((t: any) => t.is_flagged).length,
        critical: prev.critical + txns.filter((t: any) => t.risk_level === 'CRITICAL').length,
        high: prev.high + txns.filter((t: any) => t.risk_level === 'HIGH').length,
      }));
    } catch {
      alert('Simulation failed — backend may be sleeping. Try again in 30 seconds.');
    }
    setRunning(false);
  };

  const startAuto = () => {
    setAutoMode(true);
    autoRef.current = setInterval(() => run('random', 3), 2000);
  };

  const stopAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = null;
    setAutoMode(false);
  };

  const sc = SCENARIOS.find(s => s.id === scenario)!;

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Transaction Simulator</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>Generate synthetic transactions to populate the dashboard and test the fraud detection engine</p>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Choose Scenario</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Each scenario generates different fraud patterns to stress-test the ML engine</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => setScenario(s.id)} style={{
              background: scenario === s.id ? s.color + '18' : 'var(--bg-card)',
              border: '1px solid ' + (scenario === s.id ? s.color + '66' : 'var(--border)'),
              borderRadius: 12, padding: 20, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: s.color + '22', color: s.color, fontFamily: 'monospace' }}>{s.tag}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: scenario === s.id ? s.color : 'var(--text-primary)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'monospace' }}>TRANSACTION COUNT</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 5, 10, 20].map(n => (
                <button key={n} onClick={() => setCount(n)} style={{
                  padding: '6px 16px', borderRadius: 8,
                  border: '1px solid ' + (count === n ? 'transparent' : 'var(--border)'),
                  background: count === n ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                  color: count === n ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer', fontFamily: 'monospace', fontSize: 14, fontWeight: 600,
                }}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            {!autoMode ? (
              <button onClick={startAuto} style={{
                padding: '9px 18px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-elevated)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13,
              }}>▶ Auto Mode</button>
            ) : (
              <button onClick={stopAuto} style={{
                padding: '9px 18px', borderRadius: 8, border: '1px solid #ef444466',
                background: '#ef444418', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              }}>⏹ Stop Auto</button>
            )}
            <button onClick={() => run()} disabled={running} style={{
              padding: '9px 24px', borderRadius: 8, border: 'none',
              background: running ? '#555' : sc.color,
              color: '#fff', cursor: running ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 700, minWidth: 200,
            }}>
              {running ? 'Running...' : '▶ Run — ' + sc.label}
            </button>
          </div>
        </div>
        {autoMode && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#ef444418', border: '1px solid #ef444433', borderRadius: 8, fontSize: 12, color: '#ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>● Auto-simulation active · generating 3 transactions every 2 seconds</span>
            <button onClick={stopAuto} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #ef444466', background: '#ef444430', color: '#ef4444', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>⏹ Stop</button>
          </div>
        )}
      </div>

      {stats.total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Simulated', value: stats.total, color: '#3b82f6' },
            { label: 'Flagged', value: stats.flagged, color: '#f59e0b' },
            { label: 'HIGH Risk', value: stats.high, color: '#f97316' },
            { label: 'CRITICAL', value: stats.critical, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 16, borderColor: s.color + '33' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span>Recent Results</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last {Math.min(results.length, 15)} transactions</span>
          </div>
          {results.slice(0, 15).map((txn: any, i: number) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 110px 90px',
              gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border)',
              borderLeft: '3px solid ' + (txn.risk_level === 'CRITICAL' ? '#ef4444' : txn.risk_level === 'HIGH' ? '#f97316' : 'transparent'),
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{txn.merchant_name || 'Unknown Merchant'}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{txn.merchant_category} · {txn.city}, {txn.country}</div>
              </div>
              <span style={{ alignSelf: 'center', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>••{txn.card_last4}</span>
              <span style={{ alignSelf: 'center', fontFamily: 'monospace', fontWeight: 700 }}>${(txn.amount || 0).toFixed(2)}</span>
              <span style={{ alignSelf: 'center', fontSize: 10, padding: '3px 10px', borderRadius: 99, textAlign: 'center', fontFamily: 'monospace',
                background: txn.risk_level === 'CRITICAL' ? '#ef444422' : txn.risk_level === 'HIGH' ? '#f9731622' : txn.risk_level === 'MEDIUM' ? '#f59e0b22' : '#10b98122',
                color: txn.risk_level === 'CRITICAL' ? '#ef4444' : txn.risk_level === 'HIGH' ? '#f97316' : txn.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981',
              }}>{txn.risk_level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
