import React, { useState, useRef } from 'react';
import { Zap, AlertTriangle, Activity, TrendingUp, Play, Square, RefreshCw } from 'lucide-react';
import { simulate } from '../api/client';
import { useStore } from '../store';
import { RiskBadge, Amount, SectionHeader } from '../components/ui';
import toast from 'react-hot-toast';

const SCENARIOS = [
  { id: 'random', label: 'Mixed Reality', desc: '85% normal, 15% suspicious — mirrors real-world distribution', icon: <Activity size={22}/>, color: 'var(--accent-primary)', tag: 'Balanced' },
  { id: 'high_fraud', label: 'Fraud Storm', desc: 'High-velocity cross-border micro-transactions and large anomalous amounts', icon: <AlertTriangle size={22}/>, color: 'var(--critical)', tag: 'Stress test' },
  { id: 'normal', label: 'Clean Traffic', desc: 'Low-risk domestic transactions typical of a trusted cardholder', icon: <TrendingUp size={22}/>, color: 'var(--accent-emerald)', tag: 'Baseline' },
  { id: 'burst', label: 'Velocity Burst', desc: 'Card testing pattern — many transactions in rapid succession', icon: <Zap size={22}/>, color: 'var(--medium)', tag: 'Anomaly' },
];

export default function Simulator() {
  const { setSimRunning, simRunning, addLiveTransaction } = useStore();
  const [scenario, setScenario] = useState('random');
  const [count, setCount] = useState(10);
  const [results, setResults] = useState<any[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const startAuto = () => {
  setAutoMode(true);
  toast('Auto-simulation started', { icon: '▶' });
  const id = setInterval(() => run('random', 3), 2000);
  setAutoInterval(id);
};

const stopAuto = () => {
  if (autoInterval) clearInterval(autoInterval);
  setAutoInterval(null);
  setAutoMode(false);
  toast('Auto-simulation stopped', { icon: '⏹' });
};

  const run = async (sc = scenario, ct = count) => {
    setSimRunning(true);
    try {
      const data = await simulate(sc, ct);
      setResults(prev => [...data.transactions, ...prev].slice(0, 100));
      data.transactions.forEach((t: any) => addLiveTransaction(t));
      const flagged = data.transactions.filter((t: any) => t.is_flagged).length;
      toast.success(`${data.simulated} transactions · ${flagged} flagged`, { duration: 2500 });
    } catch (e) {
      toast.error('Simulation failed — is the backend running?');
    } finally {
      setSimRunning(false);
    }
  };

  const startAuto = () => {
    setAutoMode(true);
    toast('Auto-simulation started — 3 txns every 2s', { icon: '▶' });
    autoRef.current = setInterval(() => run('random', 3), 2000);
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = null;
    setAutoMode(false);
    toast('Auto-simulation stopped', { icon: '⏹' });
  };

  const clearResults = () => { setResults([]); toast('Results cleared'); };

  const sc = SCENARIOS.find(s => s.id === scenario)!;
  const criticalCount = results.filter(r => r.risk_level === 'CRITICAL').length;
  const highCount = results.filter(r => r.risk_level === 'HIGH').length;
  const flaggedCount = results.filter(r => r.is_flagged).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4 }}>Transaction Simulator</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generate synthetic transactions to populate the dashboard and test the fraud engine</div>
      </div>

      {/* Scenario picker */}
      <div>
        <SectionHeader title="Choose Scenario" sub="Each scenario generates different transaction patterns" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => setScenario(s.id)} style={{
              background: scenario === s.id ? s.color + '12' : 'var(--bg-card)',
              border: `1px solid ${scenario === s.id ? s.color + '44' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', padding: 18,
              textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', outline: 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ color: scenario === s.id ? s.color : 'var(--text-muted)' }}>{s.icon}</div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: s.color, background: s.color + '15', padding: '2px 8px', borderRadius: 99 }}>{s.tag}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: scenario === s.id ? s.color : 'var(--text-primary)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>TRANSACTION COUNT</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 5, 10, 20].map(n => (
                <button key={n} onClick={() => setCount(n)} className="btn" style={{
                  padding: '6px 14px', fontSize: 13, fontFamily: 'var(--font-mono)',
                  background: count === n ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                  color: count === n ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${count === n ? 'transparent' : 'var(--border)'}`,
                }}>{n}</button>
              ))}
            </div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            {results.length > 0 && (
              <button onClick={clearResults} className="btn btn-ghost" style={{ fontSize: 11 }}>
                <RefreshCw size={13}/> Clear
              </button>
            )}
           {!autoMode ? (
  <button onClick={startAuto} className="btn btn-ghost">▶ Auto Mode</button>
) : (
  <button onClick={stopAuto} className="btn btn-danger">⏹ Stop Auto</button>
)}
            ) : (
              <button onClick={stopAuto} className="btn" style={{
                fontSize: 12, background: 'var(--critical-bg)', color: 'var(--critical)',
                border: '1px solid var(--critical-border)',
              }}>
                <Square size={12}/> Stop Auto
              </button>
            )}
            <button onClick={() => run()} disabled={simRunning} className="btn btn-primary" style={{ minWidth: 160, justifyContent: 'center' }}>
              <Play size={14}/>
              {simRunning ? 'Running...' : `Run — ${sc.label}`}
            </button>
          </div>
        </div>

        {autoMode && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 8, fontSize: 12, color: 'var(--critical)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="live-dot red"/> Auto-simulation active · generating 3 transactions every 2 seconds
            </div>
            <button onClick={stopAuto} className="btn" style={{ padding: '4px 12px', fontSize: 11, background: 'var(--critical-bg)', color: 'var(--critical)', border: '1px solid var(--critical-border)' }}>
              <Square size={11}/> Stop
            </button>
          </div>
        )}
      </div>

      {/* Results summary */}
      {results.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Simulated', value: results.length, color: 'var(--accent-primary)' },
              { label: 'Flagged', value: flaggedCount, color: 'var(--high)' },
              { label: 'HIGH Risk', value: highCount, color: 'var(--high)' },
              { label: 'CRITICAL', value: criticalCount, color: 'var(--critical)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: 14, borderColor: s.color + '33' }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Last Batch Results</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Most recent {Math.min(results.length, 20)}</span>
            </div>
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {results.slice(0, 20).map((txn, i) => (
                <div key={txn.id} className="animate-slide-up" style={{
                  display: 'grid', gridTemplateColumns: '1fr 80px 100px 90px 70px',
                  gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border)',
                  borderLeft: txn.risk_level === 'CRITICAL' ? '3px solid var(--critical)' : txn.risk_level === 'HIGH' ? '3px solid var(--high)' : '3px solid transparent',
                  animationDelay: `${i * 20}ms`,
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{txn.merchant_name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{txn.merchant_category} · {txn.city}, {txn.country}</div>
                  </div>
                  <span style={{ alignSelf: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>••{txn.card_last4}</span>
                  <span style={{ alignSelf: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13 }}><Amount value={txn.amount}/></span>
                  <div style={{ alignSelf: 'center' }}><RiskBadge level={txn.risk_level}/></div>
                  <span style={{ alignSelf: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', color: txn.is_flagged ? 'var(--high)' : 'var(--accent-emerald)' }}>
                    {txn.is_flagged ? '⚑ FLAGGED' : '✓ CLEAR'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
