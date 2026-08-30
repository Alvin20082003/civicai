import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, GitBranch, Shield, ScrollText, Lock, Brain, AlertTriangle, FileText, TrendingUp, Network, Home } from 'lucide-react';

const navSections = [
  {
    section: 'Platform',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
      { label: 'Rule Engine', path: '/rule-engine', icon: GitBranch },
      { label: 'Architecture', path: '/architecture', icon: Network },
    ],
  },
  {
    section: 'Governance',
    items: [
      { label: 'Governance Center', path: '/governance', icon: Shield },
      { label: 'Decision Log', path: '/decision-log', icon: ScrollText },
      { label: 'Explainable AI', path: '/explainable-ai', icon: Brain },
      { label: 'Risk Dashboard', path: '/risk', icon: AlertTriangle },
    ],
  },
  {
    section: 'Citizen Services',
    items: [
      { label: 'Consent Management', path: '/consent', icon: Lock },
      { label: 'Policy Intelligence', path: '/policy-intelligence', icon: FileText },
      { label: 'Predictive Governance', path: '/predictive', icon: TrendingUp },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-white/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <div>
          <span className="font-heading font-bold text-base text-foreground">CivicAI</span>
          <p className="text-[10px] text-muted-foreground font-medium tracking-wide">Responsible AI Platform</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-6">
        {navSections.map((group) => (
          <div key={group.section}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">{group.section}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Link to="/" className="nav-link">
          <Home className="h-4 w-4 shrink-0" />
          <span>Back to Landing</span>
        </Link>
      </div>
    </aside>
  );
}