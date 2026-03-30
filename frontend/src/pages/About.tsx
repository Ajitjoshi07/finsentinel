import React from 'react';
import { ExternalLink, GitBranch, Brain, Code2, Database, Shield, Award } from 'lucide-react';

export default function About() {
  const skills = [
    { icon: <Brain size={16}/>, label: 'AI / Machine Learning', items: ['XGBoost','Isolation Forest','SHAP','Scikit-learn','Pandas','NumPy'] },
    { icon: <Code2 size={16}/>, label: 'Software Development', items: ['Python','React','TypeScript','FastAPI','Node.js','REST APIs'] },
    { icon: <Database size={16}/>, label: 'Data Engineering', items: ['PostgreSQL','SQLAlchemy','Redis','Feature Engineering'] },
    { icon: <Shield size={16}/>, label: 'DevOps', items: ['Docker','GitHub Actions','Render','CI/CD','nginx'] },
  ];

  const projects = [
    {
      name: 'FinSentinel',
      desc: 'AI-powered real-time fraud detection platform. XGBoost + Isolation Forest + SHAP explainability. FastAPI backend, React TypeScript dashboard, WebSocket live feed, Docker, CI/CD. AUC-ROC: 1.0000.',
      tech: ['Python','XGBoost','SHAP','FastAPI','React','TypeScript','Docker'],
      github: 'https://github.com/Ajitjoshi07/finsentinel',
      demo: 'https://finsentinel-ui.onrender.com',
      badge: 'Current', badgeColor: 'var(--accent-primary)',
    },
    {
      name: 'CodeSync',
      desc: 'Real-time collaborative code editor with live multi-user synchronization using Yjs CRDT, syntax highlighting via Monaco Editor, and room-based sessions. Multiple developers can code together simultaneously.',
      tech: ['React','Node.js','WebSocket','Yjs CRDT','Monaco Editor'],
      github: 'https://github.com/Ajitjoshi07/Ajitjoshi-codesync',
      demo: 'https://ajitjoshi-codesync.onrender.com/',
      badge: 'Previous', badgeColor: 'var(--accent-violet)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 900 }}>
      <div>
        <h1 style={{ fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4 }}>Developer Profile</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>The engineer behind FinSentinel</div>
      </div>

      {/* Hero */}
      <div className="card" style={{ padding: 28, borderColor: 'rgba(59,130,246,0.2)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', flexShrink: 0 }}>AJ</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Ajit Mukund Joshi</div>
            <div style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 8 }}>AI Engineer & Software Developer</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
              B.Tech in Artificial Intelligence & Data Science. Expert in end-to-end ML pipelines, full-stack development, and building production-grade AI systems. Passionate about fintech engineering and building systems that matter at scale.
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {['B.Tech AI & DS','AI Engineer','Software Developer','Full-Stack','MLOps','Fintech'].map(b => (
                <span key={b} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, background: 'rgba(59,130,246,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(59,130,246,0.2)', fontFamily: 'var(--font-mono)' }}>{b}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="https://github.com/Ajitjoshi07" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 12, textDecoration: 'none' }}>
                <GitBranch size={13}/> GitHub
              </a>
              <a href="https://www.linkedin.com/in/ajit-joshi-ai-engineer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.3)', color: '#4a9edd', fontSize: 12, textDecoration: 'none' }}>
                <ExternalLink size={13}/> LinkedIn
              </a>
              <a href="https://leetcode.com/u/ajit_joshi_/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--accent-amber)', fontSize: 12, textDecoration: 'none' }}>
                <ExternalLink size={13}/> LeetCode
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <div style={{ fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>Skills & Technologies</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {skills.map(skill => (
            <div key={skill.label} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--accent-primary)' }}>
                {skill.icon}
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{skill.label}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skill.items.map(item => (
                  <span key={item} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div style={{ fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>Projects</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map(proj => (
            <div key={proj.name} className="card" style={{ padding: 20, borderColor: proj.badgeColor + '33' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>{proj.name}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: proj.badgeColor + '18', color: proj.badgeColor, border: `1px solid ${proj.badgeColor}33`, fontFamily: 'var(--font-mono)' }}>{proj.badge}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}><GitBranch size={11}/> Code</a>
                  <a href={proj.demo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent-primary)', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)' }}><ExternalLink size={11}/> Live Demo</a>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>{proj.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {proj.tech.map(t => (
                  <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="card" style={{ padding: 20, borderColor: 'rgba(16,185,129,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Award size={16} style={{ color: 'var(--accent-emerald)' }}/>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Education</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>B.Tech — Artificial Intelligence & Data Science</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>Machine Learning · Deep Learning · Data Engineering · Software Systems · Full-Stack Development · MLOps</div>
      </div>

      <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FinSentinel v1.0.0 · Built by Ajit Mukund Joshi · B.Tech AI & DS · 2026</div>
      </div>
    </div>
  );
}
