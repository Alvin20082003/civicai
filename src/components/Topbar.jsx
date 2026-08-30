import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { citizen } from '@/lib/mockData';

const allNavItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'AI Assistant', path: '/chat' },
  { label: 'Rule Engine', path: '/rule-engine' },
  { label: 'Governance', path: '/governance' },
  { label: 'Decision Log', path: '/decision-log' },
  { label: 'Consent', path: '/consent' },
  { label: 'Explainable AI', path: '/explainable-ai' },
  { label: 'Risk', path: '/risk' },
  { label: 'Policy Intelligence', path: '/policy-intelligence' },
  { label: 'Predictive', path: '/predictive' },
  { label: 'Architecture', path: '/architecture' },
];

export default function Topbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentItem = allNavItems.find(i => location.pathname.startsWith(i.path));

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-xl px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="font-heading font-bold text-sm">CivicAI</span>
          </div>
          <h1 className="hidden lg:block text-sm font-semibold text-foreground">
            {currentItem?.label || 'Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search services, policies..."
              className="bg-transparent text-sm outline-none w-48 placeholder:text-muted-foreground/60"
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-muted">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-civic-teal" />
          </button>
          <div className="flex items-center gap-2.5 pl-2 lg:pl-3 border-l border-border">
            <img src={citizen.avatar} alt={citizen.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-civic-blue/10" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-foreground leading-tight">{citizen.name}</p>
              <p className="text-[10px] text-muted-foreground">Verified Citizen</p>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white border-r border-border flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <span className="font-heading font-bold text-sm">CivicAI</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {allNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link to="/" className="nav-link border-t border-border mt-3 pt-3">
                <span>Back to Landing</span>
              </Link>
            </nav>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}