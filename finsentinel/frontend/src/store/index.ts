import { create } from 'zustand';

export interface Transaction {
  id: string;
  card_last4: string;
  merchant_name: string;
  merchant_category: string;
  amount: number;
  currency: string;
  timestamp: string;
  city?: string;
  country: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fraud_probability: number;
  ensemble_score: number;
  anomaly_score: number;
  is_flagged: boolean;
  is_blocked: boolean;
  ml_explanation?: string;
  shap_values?: ShapValue[];
  geo_distance_km?: number;
  cross_border?: boolean;
  velocity_1h?: number;
  velocity_24h?: number;
}

export interface ShapValue {
  feature: string;
  feature_key: string;
  shap_value: number;
  feature_value: number;
}

export interface Alert {
  id: string;
  transaction_id: string;
  risk_level: string;
  status: string;
  fraud_probability: number;
  ensemble_score: number;
  explanation?: string;
  top_risk_factors: string[];
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  review_notes?: string;
  resolved_at?: string;
  transaction?: Transaction;
}

export interface DashboardStats {
  total_transactions: number;
  total_flagged: number;
  total_blocked: number;
  fraud_rate: number;
  avg_fraud_probability: number;
  total_alerts_open: number;
  total_alerts_resolved: number;
  transactions_last_hour: number;
  high_risk_last_hour: number;
  model_auc_roc: number;
  model_avg_precision: number;
}

interface AppStore {
  // Live feed
  liveFeed: Transaction[];
  addLiveTransaction: (t: Transaction) => void;
  clearFeed: () => void;

  // WS
  wsConnected: boolean;
  setWsConnected: (v: boolean) => void;

  // Selected
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (t: Transaction | null) => void;

  // Stats
  stats: DashboardStats | null;
  setStats: (s: DashboardStats) => void;

  // Alerts
  alertCount: number;
  setAlertCount: (n: number) => void;

  // Simulation running
  simRunning: boolean;
  setSimRunning: (v: boolean) => void;
}

export const useStore = create<AppStore>((set) => ({
  liveFeed: [],
  addLiveTransaction: (t) =>
    set((s) => ({
      liveFeed: [t, ...s.liveFeed].slice(0, 200),
    })),
  clearFeed: () => set({ liveFeed: [] }),

  wsConnected: false,
  setWsConnected: (v) => set({ wsConnected: v }),

  selectedTransaction: null,
  setSelectedTransaction: (t) => set({ selectedTransaction: t }),

  stats: null,
  setStats: (s) => set({ stats: s }),

  alertCount: 0,
  setAlertCount: (n) => set({ alertCount: n }),

  simRunning: false,
  setSimRunning: (v) => set({ simRunning: v }),
}));
