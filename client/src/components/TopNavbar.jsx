import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDarkMode, MdLightMode, MdExitToApp, MdSecurity, 
  MdTrendingUp, MdEmail, MdPerson, MdDashboard, 
  MdVpnKey, MdSettings
} from 'react-icons/md';

export const TopNavbar = () => {
  const { darkMode, toggleDarkMode, initUI, logout, isAuthenticated, user } = useStore();
  const location = useLocation();

  useEffect(() => {
    initUI();
  }, [initUI]);

  if (!isAuthenticated || !user) return null;

  const role = user.role;
  const username = user.owner;

  const getNavLinks = () => {
    const links = [];
    if (role === 'admin') {
      links.push(
        { name: 'Klientų tvarkyklė', path: '/', icon: <MdDashboard size={14} /> },
        { name: 'Prieigos raktai', path: '/keys', icon: <MdVpnKey size={14} /> },
        { name: 'Laiškų siuntėjas', path: '/email', icon: <MdEmail size={14} /> },
        { name: 'Profilis', path: '/profile', icon: <MdSettings size={14} /> }
      );
    } else if (role === 'marketing') {
      links.push(
        { name: 'Emailer', path: '/email', icon: <MdEmail size={14} /> },
        { name: 'Profilis', path: '/profile', icon: <MdSettings size={14} /> }
      );
    }
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="h-[30px] bg-[#f3f3f3] dark:bg-[#1e1e1e] flex items-center px-3 gap-4 border-b border-[#dadce0] dark:border-[#3c4043] shrink-0 z-50 select-none">
      <div className="flex items-center">
        {navLinks.map((link, idx) => (
          <div key={link.path} className="flex items-center">
            <Link
              to={link.path}
              className={`text-[12px] px-2.5 py-0.5 rounded transition-all flex items-center gap-1.5 ${
                location.pathname === link.path
                  ? "bg-[#e1e1e1] dark:bg-[#333333] text-[#1a73e8] font-bold"
                  : "text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e8eaed] dark:hover:bg-[#2d2d2d]"
              }`}
            >
              <span className="opacity-70">{link.icon}</span>
              {link.name}
            </Link>
            {idx < navLinks.length - 1 && (
              <div className="h-3 w-[1px] bg-[#dadce0] dark:bg-[#3c4043] mx-1" />
            )}
          </div>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-1 rounded hover:bg-[#e8eaed] dark:hover:bg-[#2d2d2d] text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
          title={darkMode ? "Šviesus režimas" : "Tamsus režimas"}
        >
          {darkMode ? <MdLightMode size={16} /> : <MdDarkMode size={16} />}
        </button>

        <div className="flex items-center gap-3 pr-4 ml-2 border-r border-[#dadce0] dark:border-[#3c4043]">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <MdPerson size={14} className="text-[#1a73e8] opacity-80" />
            <span className="max-w-[120px] truncate">{username || 'Vartotojas'}</span>
          </div>
          
          {role === 'admin' ? (
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40">
              <MdSecurity size={10} /> Administratorius
            </div>
          ) : role === 'marketing' ? (
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
              <MdTrendingUp size={10} /> Marketingas
            </div>
          ) : null}
        </div>

        <button
          onClick={logout}
          className="text-[12px] text-red-500 hover:text-red-600 hover:underline flex items-center gap-1 ml-1 font-medium"
        >
          <MdExitToApp size={14} /> Atsijungti
        </button>
      </div>
    </nav>
  );
};