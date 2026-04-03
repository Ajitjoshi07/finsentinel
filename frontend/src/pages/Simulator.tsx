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
  const autoRef = useRef<any>(null);

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
        <h1 style={{ fontSize: 26 }}>Transaction Simulator</h1>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 10 }}>
          {!autoMode ? (
            <button onClick={startAuto} className="btn btn-ghost">▶ Auto Mode</button>
          ) : (
            <button onClick={stopAuto} className="btn btn-danger">⏹ Stop Auto</button>
          )}

          <button onClick={() => run()} disabled={simRunning} className="btn btn-primary">
            <Play size={14}/>
            {simRunning ? 'Running...' : `Run — ${sc.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}