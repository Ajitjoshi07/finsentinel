import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store';
import { LayoutDashboard, AlertTriangle, ArrowLeftRight, Brain, Activity, Shield, Zap, User } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/live', icon: Activity, label: 'Live Feed' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alert Queue' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/model', icon: Brain, label: 'ML Intelligence' },
  { to: '/simulate', icon: Zap, label: 'Simulator' },
  { to: '/about', icon: User, label: 'About Me' },
];

export default function Sidebar() {
  const { wsConnected, alertCount } = useStore();
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: 'var(--bg-base)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>FinSentinel</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>AI FRAUD INTELLIGENCE</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: wsConnected ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
          <span className={`live-dot ${wsConnected ? '' : 'red'}`} />
          {wsConnected ? 'Live feed active' : 'Connecting...'}
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: 13, fontWeight: 500, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', background: isActive ? 'var(--bg-elevated)' : 'transparent', borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent', transition: 'all 0.15s', position: 'relative' })}>
            <Icon size={16} />
            <span style={{ flex: 1 }}>{label}</span>
            {label === 'Alert Queue' && alertCount > 0 && (
              <span style={{ background: 'var(--critical)', color: '#fff', borderRadius: 99, padding: '1px 6px', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{alertCount > 99 ? '99+' : alertCount}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v1.0.0 · XGBoost + SHAP</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Ajit Mukund Joshi</div>
      </div>
    </aside>
  );
}
