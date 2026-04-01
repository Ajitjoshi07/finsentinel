import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Activity, AlertTriangle, Shield, TrendingUp,
  Cpu, Eye, RefreshCw, Zap
} from 'lucide-react';
import { getDashboard, getRiskDistribution, getCategoryBreakdown, getTimeSeries, getHourlyStats, getAlerts } from '../api/client';
import { useStore } from '../store';
import { StatCard, RiskBadge, Amount, SectionHeader, EmptyState, Spinner } from '../components/ui';

const RISK_COLORS: Record<string, string> = {
  LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#f43f5e'
};

export default function Overview() {
  const { stats, setStats, liveFeed, setAlertCount, setSelectedTransaction } = useStore();
  const [riskDist, setRiskDist] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [s, r, c, ts, h, al] = await Promise.all([
        getDashboard(), getRiskDistribution(), getCategoryBreakdown(),
        getTimeSeries(), getHourlyStats(), getAlerts({ status: 'OPEN', limit: 1 })
      ]);
      setStats(s);
      setRiskDist(r);
      setCategories(c.slice(0, 7));
      setTimeSeries(ts);
      setHourly(h);
      setAlertCount(al.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [setStats, setAlertCount]);

  useEffect(() => { load(); const id = setInterval(load, 10000); return () => clearInterval(id); }, [load]);

  const pieData = riskDist ? Object.entries(riskDist).map(([k, v]) => ({ name: k, value: v })) : [];

  if (loading && !stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Spinner />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4 }}>
            Intelligence Overview
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            Real-time fraud monitoring · Updates every 10s
          </div>
        </div>
        <button className="btn btn-ghost" onClick={load}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* KPI Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <StatCard
            label="Total Transactions"
            value={stats.total_transactions.toLocaleString()}
            sub="All time"
            icon={<Activity size={16} />}
            color="var(--accent-primary)"
          />
          <StatCard
            label="Fraud Flagged"
            value={stats.total_flagged.toLocaleString()}
            sub={`${stats.fraud_rate}% flag rate`}
            icon={<AlertTriangle size={16} />}
            color="var(--high)"
            glow={stats.total_flagged > 0}
          />
          <StatCard
            label="Blocked Transactions"
            value={stats.total_blocked.toLocaleString()}
            sub="Critical risk only"
            icon={<Shield size={16} />}
            color="var(--critical)"
            glow={stats.total_blocked > 0}
          />
          <StatCard
            label="Open Alerts"
            value={stats.total_alerts_open.toLocaleString()}
            sub={`${stats.total_alerts_resolved} resolved`}
            icon={<Eye size={16} />}
            color="var(--accent-violet)"
          />
        </div>
      )}

      {/* Secondary stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <StatCard label="Txns Last Hour" value={stats.transactions_last_hour} sub={`${stats.high_risk_last_hour} high risk`} mono />
          <StatCard label="Avg Fraud Prob" value={`${stats.avg_fraud_probability}%`} sub="Across all transactions" mono />
          <StatCard label="Model AUC-ROC" value={stats.model_auc_roc.toFixed(4)} sub="XGBoost classifier" color="var(--accent-emerald)" mono />
          <StatCard label="Avg Precision" value={stats.model_avg_precision.toFixed(4)} sub="Precision-recall curve" color="var(--accent-cyan)" mono />
        </div>
      )}

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

        {/* Time series */}
        <div className="card">
          <SectionHeader title="Transaction Volume" sub="Last 30 minutes · 1-min buckets" />
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gFlagged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--critical)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--critical)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                />
                <Area type="monotone" dataKey="total" stroke="var(--accent-primary)" strokeWidth={1.5} fill="url(#gTotal)" name="Total" />
                <Area type="monotone" dataKey="flagged" stroke="var(--critical)" strokeWidth={1.5} fill="url(#gFlagged)" name="Flagged" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk donut */}
        <div className="card">
          <SectionHeader title="Risk Distribution" />
          <div style={{ height: 200, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={RISK_COLORS[entry.name]} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                {pieData.reduce((a, b) => a + (b.value as number), 0)}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>TOTAL</div>
            </div>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {pieData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: RISK_COLORS[d.name], display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: RISK_COLORS[d.name] }}>{d.value as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Category fraud breakdown */}
        <div className="card">
          <SectionHeader title="Fraud by Category" sub="Flagged transaction rate" />
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} width={80} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => [`${v}%`, 'Fraud Rate']}
                />
                <Bar dataKey="fraud_rate" fill="var(--high)" radius={[0, 4, 4, 0]} fillOpacity={0.8} name="Fraud Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly heatmap-style */}
        <div className="card">
          <SectionHeader title="Hourly Activity" sub="Transaction volume by hour" />
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly}>
                <XAxis dataKey="hour" tickFormatter={h => `${h}h`} tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                  labelFormatter={h => `${h}:00`}
                />
                <Bar dataKey="total" fill="var(--accent-primary)" fillOpacity={0.5} radius={[2, 2, 0, 0]} name="Total" />
                <Bar dataKey="flagged" fill="var(--critical)" fillOpacity={0.8} radius={[2, 2, 0, 0]} name="Flagged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live recent feed preview */}
      <div className="card">
        <SectionHeader
          title="Recent Transactions"
          sub={`${liveFeed.length} captured in live feed`}
          action={
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="live-dot" /> Live
            </span>
          }
        />
        {liveFeed.length === 0 ? (
          <EmptyState message="No live transactions yet. Use the Simulator to generate data." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {liveFeed.slice(0, 8).map((txn, i) => (
              <div
                key={txn.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }}
                onClick={() => setSelectedTransaction(txn)}
              >
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto auto',
                  gap: 12, alignItems: 'center',
                  padding: '10px 14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${txn.risk_level === 'CRITICAL' ? 'var(--critical-border)' : txn.risk_level === 'HIGH' ? 'var(--high-border)' : 'var(--border)'}`,
                  transition: 'background 0.15s',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{txn.merchant_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      •••• {txn.card_last4} · {txn.merchant_category} · {txn.city || txn.country}
                    </div>
                  </div>
                  <RiskBadge level={txn.risk_level} />
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>
                    <Amount value={txn.amount} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    {(txn.ensemble_score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
