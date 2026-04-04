import React, { useState } from 'react';

const steps = [
  {
    num: '01', title: 'Wake Up the Backend', color: '#3b82f6',
    desc: 'This app runs on a free server that sleeps after 15 minutes of inactivity. Before using, open the health check link to wake it up.',
    tip: 'Open in browser: https://finsentinel.onrender.com/api/v1/health — wait for {"status":"ok"} then come back.',
  },
  {
    num: '02', title: 'Generate Transactions', color: '#8b5cf6',
    desc: 'Go to the Simulator page. Choose a scenario and click Run. Start with "Mixed Reality" (10 transactions) to populate all charts.',
    tip: 'Try "Fraud Storm" to see CRITICAL alerts fire immediately. Use Auto Mode to stream transactions continuously.',
  },
  {
    num: '03', title: 'Watch the Live Feed', color: '#10b981',
    desc: 'Go to Live Feed. Watch transactions stream in real-time via WebSocket. Red border = CRITICAL, orange = HIGH risk.',
    tip: 'Click any transaction row to open the SHAP explanation panel — it shows exactly WHY the ML flagged it.',
  },
  {
    num: '04', title: 'Review the Overview Dashboard', color: '#f59e0b',
    desc: 'Go to Overview. See 4 KPI cards, Transaction Volume chart, Risk Distribution donut, Fraud by Category, and Hourly Activity.',
    tip: 'Dashboard auto-refreshes every 10 seconds. Hit Refresh manually to get instant updates after simulation.',
  },
  {
    num: '05', title: 'Action Fraud Alerts', color: '#ef4444',
    desc: 'Go to Alert Queue. Every HIGH and CRITICAL transaction creates an alert. Click to expand, then Confirm Fraud or Dismiss.',
    tip: 'This is the analyst workflow — OPEN → REVIEWING → CONFIRMED_FRAUD / FALSE_POSITIVE / ESCALATED.',
  },
  {
    num: '06', title: 'Explore ML Intelligence', color: '#06b6d4',
    desc: 'Go to ML Intelligence. See AUC-ROC: 1.0000, feature importance chart, and performance radar across 6 metrics.',
    tip: 'The model uses XGBoost + Isolation Forest ensemble. SHAP explains every single prediction individually.',
  },
];

const features = [
  { icon: '🧠', title: 'XGBoost + Isolation Forest', desc: 'Two ML models work together — XGBoost classifies fraud probability (98.7% precision), Isolation Forest detects anomalies. Combined ensemble gives final risk score.' },
  { icon: '🔍', title: 'SHAP Explainability', desc: 'Every fraud decision is explained using Shapley values. You can see exactly which features (geo distance, velocity, amount) pushed the score up or down — not a black box.' },
  { icon: '⚡', title: 'Real-Time WebSocket Feed', desc: 'Transactions stream live to the dashboard via WebSocket connection. No polling — pure event-driven architecture like production fraud systems.' },
  { icon: '🚨', title: 'Case Management System', desc: 'Flagged transactions automatically create analyst alerts with full audit trail — who reviewed, when, with what notes. Mirrors enterprise fraud operations workflow.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Transaction Volume timeseries, Risk Distribution donut, Fraud by Merchant Category, Hourly Activity heatmap — all updating live every 10 seconds.' },
  { icon: '🎯', title: 'AUC-ROC: 1.0000', desc: 'Model trained on 50,000 synthetic transactions achieves perfect AUC-ROC score with 98% fraud precision and 100% recall on the test set.' },
];

export default function UserGuide() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>User Guide</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>
        New to FinSentinel? Follow these steps to explore every feature of the platform.
      </p>

      {/* Quick start steps */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🚀 Quick Start — 6 Steps</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {steps.map((step, i) => (
            <div key={i} onClick={() => setActiveStep(activeStep === i ? -1 : i)}
              style={{ background: 'var(--bg-card)', border: '1px solid ' + (activeStep === i ? step.color + '66' : 'var(--border)'), borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: step.color + '22', border: '2px solid ' + step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: step.color, flexShrink: 0 }}>{step.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: activeStep === i ? step.color : 'var(--text-primary)' }}>{step.title}</div>
                  {activeStep === i && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.7 }}>{step.desc}</div>}
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>{activeStep === i ? '▲' : '▼'}</span>
              </div>
              {activeStep === i && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: step.color + '12', border: '1px solid ' + step.color + '33', borderRadius: 8, fontSize: 12, color: step.color, marginLeft: 54 }}>
                  💡 {step.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚙️ Key Features Explained</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk levels */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎯 Risk Level Guide</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            { level: 'LOW', color: '#10b981', score: '0–35%', action: 'No action needed. Transaction approved automatically.' },
            { level: 'MEDIUM', color: '#f59e0b', score: '35–60%', action: 'Logged for review. No immediate block.' },
            { level: 'HIGH', color: '#f97316', score: '60–80%', action: 'Alert created. Analyst review recommended.' },
            { level: 'CRITICAL', color: '#ef4444', score: '80–100%', action: 'Transaction BLOCKED. Immediate alert created.' },
          ].map(r => (
            <div key={r.level} className="card" style={{ padding: 16, borderColor: r.color + '44' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: r.color, fontFamily: 'monospace', marginBottom: 8 }}>{r.level}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: r.color, marginBottom: 8 }}>{r.score}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>❓ Common Questions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { q: 'Why does it take 30-60 seconds to load?', a: 'The backend runs on a free server tier that sleeps after 15 minutes of inactivity. Open the health check URL first to wake it up, then use the dashboard.' },
            { q: 'Why is the Live Feed showing "Connecting..."?', a: 'The WebSocket connects to the backend. If the backend is sleeping, it shows red. Once the backend wakes up (after running a simulation), it turns green.' },
            { q: 'Is this real transaction data?', a: 'No — all transaction data is 100% synthetic, generated by the simulator. No real card or financial data is used anywhere.' },
            { q: 'What does SHAP mean?', a: 'SHAP (SHapley Additive exPlanations) is a game-theory based method that explains ML predictions. Each feature gets a score showing how much it contributed to the fraud decision.' },
            { q: 'How do I demo this to a recruiter?', a: 'Step 1: Open health check to wake backend. Step 2: Go to Simulator → Fraud Storm → Run (20 txns). Step 3: Show Live Feed streaming. Step 4: Click a CRITICAL alert → show SHAP panel. Step 5: Show Overview charts.' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--accent-primary)' }}>Q: {item.q}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>A: {item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
