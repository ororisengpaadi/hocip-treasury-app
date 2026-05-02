import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import MonthlyReport from './pages/MonthlyReport';
import AnnualReport from './pages/AnnualReport';
import { loadData, saveData } from './utils/storage';
import './App.css';

export const DataContext = createContext(null);

export default function App() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    loadData().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  async function updateData(newData) {
    setData(newData);
    const ok = await saveData(newData);
    setSaveMsg(ok ? '✓ Saved' : '⚠ Save failed');
    setTimeout(() => setSaveMsg(''), 2000);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading treasury data...</p>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ data, updateData }}>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {saveMsg && <div className="save-toast">{saveMsg}</div>}
            <Routes>
              <Route path="/"         element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/income"    element={<Income />} />
              <Route path="/expenses"  element={<Expenses />} />
              <Route path="/monthly"   element={<MonthlyReport />} />
              <Route path="/annual"    element={<AnnualReport />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
