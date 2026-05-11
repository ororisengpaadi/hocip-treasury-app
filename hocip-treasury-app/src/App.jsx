import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import MonthlyReport from './pages/MonthlyReport';
import AnnualReport from './pages/AnnualReport';
import { DataContext } from './context/DataContext';
import { loadData, saveData } from './utils/storage';
import './App.css';

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
    setSaveMsg(ok ? 'Saved' : 'Save failed');
    setTimeout(() => setSaveMsg(''), 3500);
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
        <AppShell saveMsg={saveMsg} />
      </BrowserRouter>
    </DataContext.Provider>
  );
}

function AppShell({ saveMsg }) {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {saveMsg && <div className="save-toast">{saveMsg}</div>}

        <div key={location.pathname} className="route-transition">
          <Routes location={location}>
            <Route path="/"          element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income"    element={<Income />} />
            <Route path="/expenses"  element={<Expenses />} />
            <Route path="/monthly"   element={<MonthlyReport />} />
            <Route path="/annual"    element={<AnnualReport />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
