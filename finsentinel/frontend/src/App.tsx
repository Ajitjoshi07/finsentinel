import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Overview from './pages/Overview';
import LiveFeed from './pages/LiveFeed';
import AlertQueue from './pages/AlertQueue';
import Transactions from './pages/Transactions';
import MLIntelligence from './pages/MLIntelligence';
import Simulator from './pages/Simulator';
import { useStore } from './store';
import { createWebSocket } from './api/client';
import './index.css';

function useWebSocket() {
  const { addLiveTransaction, setWsConnected } = useStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = () => {
    try {
      const ws = createWebSocket();
      wsRef.current = ws;
      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => {
        setWsConnected(false);
        reconnectRef.current = setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();
      ws.onmessage = (e: MessageEvent) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === 'transaction') addLiveTransaction(msg.data);
        } catch {}
      };
    } catch {
      reconnectRef.current = setTimeout(connect, 3000);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, []);
}

function AppLayout() {
  useWebSocket();
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '32px 36px', maxWidth: 'calc(100vw - 220px)', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/live" element={<LiveFeed />} />
          <Route path="/alerts" element={<AlertQueue />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/model" element={<MLIntelligence />} />
          <Route path="/simulate" element={<Simulator />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
      <Toaster position="bottom-right" toastOptions={{
        style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13 }
      }} />
    </BrowserRouter>
  );
}
