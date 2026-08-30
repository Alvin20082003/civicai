import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const proactiveAlerts = [
  {
    id: 1,
    type: "document_expiry",
    severity: "high",
    title: "Passport Expires in 60 Days",
    title_ta: "பாஸ்போர்ட் 60 நாட்களில் காலாவதியாகும்",
    description: "Your passport (T****8842) expires on 14 March 2031. Start renewal now to avoid last-minute rush.",
    action_label: "Start Renewal",
    action_link: "/map-services",
    portal_url: "https://www.passportindia.gov.in",
    icon: "Globe",
    due_date: "60 days",
  },
  {
    id: 2,
    type: "document_expiry",
    severity: "medium",
    title: "Income Certificate Expires in 3 Months",
    title_ta: "வருமானச் சான்று 3 மாதங்களில் காலாவதியாகும்",
    description: "Your income certificate (INC-TN-2024-08****) expires March 2027. Renew it to keep scholarship applications active.",
    action_label: "Renew Now",
    action_link: "/documents",
    icon: "FileBadge",
    due_date: "3 months",
  },
  {
    id: 3,
    type: "new_scheme",
    severity: "high",
    title: "New Scholarship Available: ₹60,000/year",
    title_ta: "புதிய உதவித்தொகை கிடைக்கிறது: ₹60,000/வருடம்",
    description: "A new state scholarship for engineering students has been launched. You match with 94% eligibility. Apply before August 15.",
    action_label: "Check Eligibility",
    action_link: "/chat",
    icon: "GraduationCap",
    due_date: "37 days left",
  },
  {
    id: 4,
    type: "deadline",
    severity: "urgent",
    title: "Beti Bachao Scholarship Deadline Tomorrow",
    title_ta: "பேட்டி பச்சோ உதவித்தொகை கடைசி தேதி நாளை",
    description: "Priya's Beti Bachao Scholarship application must be submitted by tomorrow. Income certificate upload is pending.",
    action_label: "Complete Application",
    action_link: "/documents",
    portal_url: "https://scholarships.gov.in",
    icon: "Clock",
    due_date: "1 day",
  },
  {
    id: 5,
    type: "policy_update",
    severity: "medium",
    title: "PM-KISAN Benefit Increased to ₹8,000",
    title_ta: "PM-KISAN நன்மை ₹8,000 ஆக அதிகரித்தது",
    description: "PM-KISAN annual benefit has increased from ₹6,000 to ₹8,000. Your father Rajesh Kumar is eligible for the updated amount.",
    action_label: "View Details",
    action_link: "/schemes",
    portal_url: "https://pmkisan.gov.in",
    icon: "Wallet",
    due_date: "New",
  },
  {
    id: 6,
    type: "missing_document",
    severity: "high",
    title: "Missing: Property Documents",
    title_ta: "விடுபட்டது: சொத்து ஆவணங்கள்",
    description: "Property documents are needed for PMAY housing scheme application. Upload to unlock ₹1.5-2.67 Lakh subsidy eligibility.",
    action_label: "Upload Now",
    action_link: "/documents",
    icon: "House",
    due_date: "Blocking",
  },
  {
    id: 7,
    type: "family_benefit",
    severity: "medium",
    title: "Grandmother: Senior Citizen Savings Scheme Available",
    title_ta: "பாட்டி: மூத்த குடிமகள் சேமிப்புத் திட்டம் கிடைக்கிறது",
    description: "Kamala Ammal (68) is eligible for Senior Citizen Savings Scheme with 8.2% interest. Maximum deposit ₹30 Lakh.",
    action_label: "Learn More",
    action_link: "/family",
    portal_url: "https://www.india.gov.in/senior-citizen-savings-scheme",
    icon: "Users",
    due_date: "New",
  },
  {
    id: 8,
    type: "election",
    severity: "low",
    title: "Voter ID Verification Reminder",
    title_ta: "வாக்காளர் அடையாள அட்டை சரிபார்ப்பு நினைவூட்டல்",
    description: "Verify your voter details on the electoral roll. Next general election is approaching.",
    action_label: "Verify Now",
    action_link: "/documents",
    icon: "ScrollText",
    due_date: "This month",
  },
];

const severityConfig = {
  urgent: { color: "destructive", bg: "bg-destructive/5", text: "text-destructive", border: "border-destructive/20", icon: "AlertTriangle", label: "Urgent" },
  high: { color: "warning", bg: "bg-warning/5", text: "text-warning", border: "border-warning/20", icon: "AlertCircle", label: "High Priority" },
  medium: { color: "primary", bg: "bg-primary/5", text: "text-primary", border: "border-primary/20", icon: "Info", label: "Info" },
  low: { color: "muted", bg: "bg-slate-50", text: "text-muted-foreground", border: "border-slate-200", icon: "Info", label: "Low" },
};

const typeFilters = [
  { key: "All", label: "All Alerts", icon: "Bell" },
  { key: "document_expiry", label: "Document Expiry", icon: "FileClock" },
  { key: "new_scheme", label: "New Schemes", icon: "Sparkles" },
  { key: "deadline", label: "Deadlines", icon: "Clock" },
  { key: "policy_update", label: "Policy Updates", icon: "FileText" },
  { key: "missing_document", label: "Missing Documents", icon: "AlertCircle" },
  { key: "family_benefit", label: "Family Benefits", icon: "Users" },
];

export default function Proactive() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState("All");
  const [dismissed, setDismissed] = useState([]);

  const filteredAlerts = proactiveAlerts.filter(
    (a) => (filter === "All" || a.type === filter) && !dismissed.includes(a.id)
  );

  const stats = {
    total: proactiveAlerts.length - dismissed.length,
    urgent: proactiveAlerts.filter((a) => a.severity === "urgent" && !dismissed.includes(a.id)).length,
    high: proactiveAlerts.filter((a) => a.severity === "high" && !dismissed.includes(a.id)).length,
    newSchemes: proactiveAlerts.filter((a) => a.type === "new_scheme" && !dismissed.includes(a.id)).length,
  };

  return (
    <div>
      <PageHeader
        title="Proactive AI Assistant"
        subtitle="The government reaches you before you search — proactive alerts for document expirations, new schemes, deadlines, and family benefits"
        icon="Sparkles"
        badges
      >
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <Icon name="Bot" className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">AI Monitoring Active</span>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="Bell" label="Active Alerts" value={stats.total} color="primary" />
        <StatCard icon="AlertTriangle" label="Urgent" value={stats.urgent} color="destructive" />
        <StatCard icon="AlertCircle" label="High Priority" value={stats.high} color="warning" />
        <StatCard icon="Sparkles" label="New Schemes" value={stats.newSchemes} color="success" />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {typeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
              filter === f.key ? "bg-primary text-primary-foreground" : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
            )}
          >
            <Icon name={f.icon} className="w-3 h-3" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Icon name="CheckCircle2" className="w-12 h-12 text-success mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">All caught up!</h3>
            <p className="text-xs text-muted-foreground mt-1">No pending alerts. The AI is monitoring your profile for new opportunities.</p>
          </GlassCard>
        ) : (
          filteredAlerts.map((alert, i) => {
            const config = severityConfig[alert.severity];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <GlassCard className={cn("p-4 border-l-4", config.border)}>
                  <div className="flex items-start gap-3">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", config.bg)}>
                      <Icon name={alert.icon} className={cn("w-5 h-5", config.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={cn("text-[10px] font-semibold uppercase tracking-wide", config.text)}>
                              {config.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Icon name="Clock" className="w-2.5 h-2.5" /> {alert.due_date}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-foreground">
                            {lang === "ta" && alert.title_ta ? alert.title_ta : alert.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.description}</p>
                        </div>
                        <button
                          onClick={() => setDismissed([...dismissed, alert.id])}
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center shrink-0 text-muted-foreground"
                        >
                          <Icon name="X" className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {alert.portal_url ? (
                          <a
                            href={alert.portal_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                          >
                            {alert.action_label}
                            <Icon name="ExternalLink" className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            to={alert.action_link}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                          >
                            {alert.action_label}
                            <Icon name="ArrowRight" className="w-3 h-3" />
                          </Link>
                        )}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-foreground text-xs font-medium hover:bg-slate-200 transition-colors">
                          <Icon name="MessageCircle" className="w-3 h-3" /> Ask AI
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-6">
        <TrustBadges />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `bg-${color}/10`)}>
          <Icon name={icon} className={cn("w-5 h-5", `text-${color}`)} />
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </GlassCard>
  );
}