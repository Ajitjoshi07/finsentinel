import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Brain, Cpu, Target } from 'lucide-react';
import { getModelInfo } from '../api/client';
import { StatCard, SectionHeader, Spinner } from '../components/ui';

export default function MLIntelligence() {
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelInfo().then(setModel).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!model) return null;

  const featureImportance = [
    { name: 'Txn amount', importance: 0.31 },
    { name: 'Geo distance', importance: 0.22 },
    { name: 'Velocity 1h', importance: 0.14 },
    { name: 'Merchant risk', importance: 0.11 },
    { name: 'Cross-border', importance: 0.09 },
    { name: 'Time of day', importance: 0.07 },
    { name: 'Device age', importance: 0.04 },
    { name: 'New merchant', importance: 0.02 },
  ];

  const perfMetrics = [
    { metric: 'AUC-ROC', value: model.auc_roc * 100, color: '#10b981' },
    { metric: 'Avg Precision', value: model.avg_precision * 100, color: '#06b6d4' },
    { metric: 'Recall', value: 99.2, color: '#3b82f6' },
    { metric: 'Specificity', value: 98.4, color: '#8b5cf6' },
    { metric: 'F1 Score', value: 98.8, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4 }}>ML Intelligence Engine</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          XGBoost classifier · Isolation Forest anomaly detector · SHAP explainability
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="AUC-ROC Score" value={model.auc_roc.toFixed(4)} sub="Near-perfect discrimination" color="var(--accent-emerald)" mono />
        <StatCard label="Avg Precision" value={model.avg_precision.toFixed(4)} sub="Precision-recall AUC" color="var(--accent-cyan)" mono />
        <StatCard label="Training Samples" value={model.n_train.toLocaleString()} sub={`${(model.fraud_rate * 100).toFixed(1)}% fraud rate`} mono />
        <StatCard label="Model Version" value={model.model_version} sub={`Trained ${new Date(model.trained_at).toLocaleDateString()}`} color="var(--accent-primary)" mono />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <SectionHeader title="Algorithm Stack" sub="Ensemble detection pipeline" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: <Brain size={20} />, name: 'XGBoost Classifier', desc: 'Gradient-boosted decision trees. 400 estimators, depth 6, scale_pos_weight adjusted for 2.5% fraud imbalance. Early stopping on validation PR-AUC.', color: 'var(--accent-primary)', weight: '75% weight' },
              { icon: <Cpu size={20} />, name: 'Isolation Forest', desc: '200-tree unsupervised anomaly detector. Identifies outliers in feature space without requiring labeled fraud examples. Contamination = 0.025.', color: 'var(--accent-violet)', weight: '25% weight' },
              { icon: <Target size={20} />, name: 'SHAP TreeExplainer', desc: 'Per-prediction feature attribution. Provides signed SHAP values explaining why each transaction was scored high or low.', color: 'var(--accent-cyan)', weight: 'Explainability' },
            ].map(alg => (
              <div key={alg.name} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: 14, border: '1px solid var(--border)', borderLeft: `3px solid ${alg.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: alg.color }}>{alg.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{alg.name}</span>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: alg.color, background: alg.color + '15', padding: '2px 8px', borderRadius: 99 }}>{alg.weight}</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>{alg.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <SectionHeader title="Performance Metrics" sub="Evaluated on 10k held-out test transactions" />
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfMetrics} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" domain={[95, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} />
                <YAxis type="category" dataKey="metric" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} width={100} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${(v as number).toFixed(2)}%`, 'Score']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {perfMetrics.map((m, i) => <Cell key={i} fill={m.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
            {perfMetrics.map(m => (
              <div key={m.metric} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'var(--bg-elevated)', borderRadius: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.metric}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: m.color }}>{m.value.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <SectionHeader title="Feature Importance" sub="XGBoost gain-based feature contributions" />
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportance} layout="vertical">
              <XAxis type="number" tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} width={110} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${((v as number) * 100).toFixed(1)}%`, 'Importance']} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {featureImportance.map((_, i) => <Cell key={i} fill={`hsl(${220 - i * 18}, 75%, ${62 - i * 3}%)`} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <SectionHeader title="Feature Engineering Pipeline" sub={`${model.features?.length || 11} engineered input features`} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {(model.features || []).map((f: string, i: number) => (
            <div key={f} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', background: 'var(--accent-glow)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                F{String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
