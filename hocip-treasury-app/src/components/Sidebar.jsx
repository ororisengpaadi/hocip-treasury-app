import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  ChartArea,
  ClipboardList,
  HandCoins,
  ReceiptText,
} from 'lucide-react';
import './Sidebar.css';

const links = [
  { to: '/dashboard', Icon: ChartArea, label: 'Dashboard' },
  { to: '/income',    Icon: HandCoins, label: 'Income' },
  { to: '/expenses',  Icon: ReceiptText, label: 'Expenses' },
  { to: '/monthly',   Icon: CalendarDays, label: 'Monthly Report' },
  { to: '/annual',    Icon: ClipboardList, label: 'Annual Report' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="App Logo" className="church-icon" />
        <h2>AFM Dzingidzingi</h2>
        <p>Throne of God</p>
        <span className="year-badge">2025 – 2026</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">
              <l.Icon aria-hidden="true" strokeWidth={2.25} />
            </span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>UCT IS Honours</p>
        <p>HOCIP 2025 / 2026</p>
      </div>
    </aside>
  );
}
