import React, { useState } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import LanguageSelector from "@/components/LanguageSelector";
import VoiceCommandBar from "@/components/VoiceCommandBar";
import { LanguageProvider, useI18n } from "@/lib/i18n";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { citizen } from "@/lib/indiaData";
import { cn } from "@/lib/utils";

const navSections = [
  {
    sectionKey: "nav.section.overview",
    items: [
      { to: "/dashboard", labelKey: "nav.dashboard", icon: "House" },
      { to: "/chat", labelKey: "nav.aiAssistant", icon: "MessageCircle" },
    ],
  },
  {
    sectionKey: "nav.section.india",
    items: [
      { to: "/schemes", labelKey: "nav.schemes", icon: "FileBadge" },
      { to: "/family", labelKey: "nav.family", icon: "Users" },
      { to: "/life-events", labelKey: "nav.lifeEvents", icon: "Sparkles" },
      { to: "/documents", labelKey: "nav.documents", icon: "FileCheck" },
      { to: "/map-services", labelKey: "nav.mapServices", icon: "Globe" },
      { to: "/proactive", labelKey: "nav.proactive", icon: "Bell" },
    ],
  },
  {
    sectionKey: "nav.section.governance",
    items: [
      { to: "/governance", labelKey: "nav.governance", icon: "ShieldCheck" },
      { to: "/explainable-ai", labelKey: "nav.explainableAi", icon: "Brain" },
      { to: "/rule-engine", labelKey: "nav.ruleEngine", icon: "GitBranch" },
      { to: "/decision-log", labelKey: "nav.decisionLog", icon: "FileClock" },
    ],
  },
  {
    sectionKey: "nav.section.services",
    items: [
      { to: "/consent", labelKey: "nav.consent", icon: "KeyRound" },
      { to: "/risk", labelKey: "nav.risk", icon: "ShieldAlert" },
      { to: "/policy-intelligence", labelKey: "nav.policy", icon: "TrendingUp" },
      { to: "/predictive", labelKey: "nav.predictive", icon: "LineChart" },
    ],
  },
  {
    sectionKey: "nav.section.platform",
    items: [
      { to: "/architecture", labelKey: "nav.architecture", icon: "Network" },
    ],
  },
];



export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <LanguageProvider>
      <AppLayoutInner sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} location={location} />
    </LanguageProvider>
  );
}

function AppLayoutInner({ sidebarOpen, setSidebarOpen, location }) {
  const { unreadCount, actionRequiredCount } = useUnreadNotifications();
  const { t } = useI18n();

  const currentPage = navSections
    .flatMap((s) => s.items)
    .find((item) => location.pathname === item.to);

  return (
    <div className="min-h-screen bg-background flex">
      <VoiceCommandBar />
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-slate-200/70 bg-white/80 backdrop-blur-xl z-30">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 flex flex-col bg-white z-50 lg:hidden"
            >
              <SidebarContent onNavigate={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
            >
              <Icon name="Menu" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-foreground">
                {currentPage ? t(currentPage.labelKey) : t("topbar.platformName")}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t("topbar.tagline")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/70 text-xs text-muted-foreground">
              <Icon name="Search" className="w-3.5 h-3.5" />
              <span>{t("topbar.search")}</span>
            </div>
            <LanguageSelector compact />
            <Link
              to="/dashboard"
              className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              title={actionRequiredCount > 0 ? `${unreadCount} unread (${actionRequiredCount} require action)` : `${unreadCount} unread`}
            >
              <Icon name="Bell" className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className={cn(
                  "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white",
                  actionRequiredCount > 0 ? "bg-destructive" : "bg-primary"
                )}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <img
                src={citizen.avatar}
                alt={citizen.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
              />
              <div className="hidden sm:block">
                <div className="text-sm font-medium leading-tight">{citizen.name}</div>
                <div className="text-xs text-muted-foreground leading-tight">{citizen.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const { t } = useI18n();
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-200/70">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
          <Icon name="ShieldCheck" className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-bold text-foreground leading-tight tracking-tight">{t("topbar.platformName")}</div>
          <div className="text-[10px] text-muted-foreground leading-tight">{t("topbar.tagline")}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.sectionKey}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {t(section.sectionKey)}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/8 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon name={item.icon} className="w-4 h-4" />
                      {t(item.labelKey)}
                      {isActive && <Icon name="ChevronRight" className="w-3.5 h-3.5 ml-auto" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200/70">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" className="w-4 h-4" />
          {t("topbar.backToLanding")}
        </Link>
      </div>
    </>
  );
}