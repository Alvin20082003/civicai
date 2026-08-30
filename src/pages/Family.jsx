import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { useI18n } from "@/lib/i18n";
import { base44 } from "@/api/base44Client";
import { familyMembers as seedMembers } from "@/lib/indiaData";
import { calculateHouseholdBenefits, defaultAvatars } from "@/lib/householdCalculator";
import { calculateMemberEligibility } from "@/lib/householdCalculator";
import LinkMemberForm from "@/components/family/LinkMemberForm";
import { cn } from "@/lib/utils";

export default function Family() {
  const { t } = useI18n();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const existing = await base44.entities.FamilyMember.list();
      if (existing.length === 0) {
        // Seed with default household if empty
        const seeded = await base44.entities.FamilyMember.bulkCreate(
          seedMembers.map((m) => ({
            name: m.name,
            relation: m.relation,
            age: m.age,
            gender: m.relation === "Mother" || m.relation === "Sister" || m.relation === "Grandmother" ? "Female" : "Male",
            occupation: m.occupation,
            annual_income: m.relation === "Self" ? 180000 : m.relation === "Father" ? 150000 : 0,
            aadhaar_linked: true,
            student: m.relation === "Self" || m.relation === "Sister",
            senior_citizen: m.relation === "Grandmother",
            bpl_category: m.relation === "Grandmother",
            disability: false,
            avatar: m.avatar,
          }))
        );
        setMembers(seeded);
      } else {
        setMembers(existing);
      }
    } catch (err) {
      console.error("Failed to load family members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async (formData) => {
    const avatar = defaultAvatars[formData.relation] || defaultAvatars.Other;
    try {
      const created = await base44.entities.FamilyMember.create({ ...formData, avatar });
      setMembers((prev) => [...prev, created]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to link member:", err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await base44.entities.FamilyMember.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  const household = useMemo(() => calculateHouseholdBenefits(members), [members]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t("family.title")} subtitle={t("family.subtitle")} icon="Users" badges>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <Icon name="Plus" className="w-4 h-4" /> Link Member
        </button>
      </PageHeader>

      {/* Total Benefits Banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <GlassCard className="p-8 gradient-brand-soft">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("family.totalBenefits")}</p>
              <p className="text-4xl font-bold text-gradient-brand mt-1">₹{household.totalHouseholdBenefit.toLocaleString("en-IN")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("family.perYear")}</p>
            </div>
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
              <Icon name="Wallet" className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-primary/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Metric label="Members" value={household.memberCount} icon="Users" />
            <Metric label="Eligible Schemes" value={household.totalEligibleSchemes} icon="FileBadge" />
            <Metric label="Categories" value={Object.keys(household.categoryBreakdown).length} icon="Layers" />
            <Metric label="Avg/Member" value={`₹${Math.round(household.totalHouseholdBenefit / Math.max(household.memberCount, 1)).toLocaleString("en-IN")}`} icon="TrendingUp" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Category Breakdown */}
      {Object.keys(household.categoryBreakdown).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="mb-6">
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="PieChart" className="w-4 h-4 text-primary" /> Benefit Breakdown by Category
            </h3>
            <div className="space-y-3">
              {Object.entries(household.categoryBreakdown).map(([cat, data]) => {
                const pct = (data.benefit / household.totalHouseholdBenefit) * 100;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{cat}</span>
                      <span className="text-muted-foreground">₹{data.benefit.toLocaleString("en-IN")} • {data.count} scheme{data.count > 1 ? "s" : ""}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full gradient-brand" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Family Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {members.map((member, i) => (
          <MemberBenefitCard
            key={member.id}
            member={member}
            index={i}
            onRemove={() => handleRemove(member.id)}
            onSelect={() => setSelectedMember(member)}
          />
        ))}
      </div>

      {/* AI Analysis Summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Icon name="Bot" className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-sm">AI Household Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The deterministic rule engine has evaluated {household.memberCount} household members across 8 government schemes ({household.memberCount * 8} total evaluations).
            {household.totalEligibleSchemes} schemes matched with eligibility, yielding an estimated annual household benefit of ₹{household.totalHouseholdBenefit.toLocaleString("en-IN")}.
            Each match is policy-backed and auditable — no AI guesswork in eligibility determination.
          </p>
          <div className="mt-4">
            <TrustBadges compact />
          </div>
        </GlassCard>
      </motion.div>

      {/* Link Member Form Modal */}
      <AnimatePresence>
        {showForm && <LinkMemberForm onLink={handleLink} onCancel={() => setShowForm(false)} />}
      </AnimatePresence>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={icon} className="w-4 h-4 text-primary shrink-0" />
      <div>
        <div className="text-sm font-bold text-foreground">{value}</div>
        <div className="text-[10px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function MemberBenefitCard({ member, index, onRemove, onSelect }) {
  const { t } = useI18n();
  const calc = useMemo(() => calculateMemberEligibility(member), [member]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.08 }}>
      <GlassCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/10" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center ring-2 ring-white">
              <Icon name="Check" className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.relation} • {member.age} years • {member.occupation}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {member.aadhaar_linked && <Badge color="primary" icon="ShieldCheck">Aadhaar</Badge>}
              {member.student && <Badge color="info" icon="GraduationCap">Student</Badge>}
              {member.senior_citizen && <Badge color="warning" icon="Users">Senior</Badge>}
              {member.bpl_category && <Badge color="destructive" icon="Wallet">BPL</Badge>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold text-gradient-brand">₹{calc.totalBenefit.toLocaleString("en-IN")}</div>
              <div className="text-[10px] text-muted-foreground">/year</div>
            </div>
            <button onClick={onRemove} className="w-7 h-7 rounded-lg hover:bg-destructive/5 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors">
              <Icon name="X" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Eligible Schemes */}
        <div className="mt-4 space-y-2">
          {calc.eligibleSchemes.length === 0 ? (
            <div className="p-3 rounded-xl border border-dashed border-border text-center">
              <p className="text-xs text-muted-foreground">No eligible schemes found. Adjust profile flags for better matches.</p>
            </div>
          ) : (
            calc.eligibleSchemes.map((scheme, si) => (
              <button
                key={si}
                onClick={onSelect}
                className="w-full p-3 rounded-xl border border-border bg-white/40 hover:border-primary/20 transition-colors text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Icon name={scheme.icon} className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{scheme.schemeName}</div>
                      <div className="text-xs text-primary font-medium mt-0.5">{t("family.individualBenefit")}: ₹{scheme.benefit.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn("text-sm font-bold", scheme.match >= 90 ? "text-success" : scheme.match >= 80 ? "text-primary" : "text-warning")}>{scheme.match}%</div>
                    <div className="text-[10px] text-muted-foreground">{t("common.match")}</div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", scheme.match >= 90 ? "bg-success" : scheme.match >= 80 ? "bg-primary" : "bg-warning")}
                    style={{ width: `${scheme.match}%` }}
                  />
                </div>
              </button>
            ))
          )}
        </div>

        {calc.eligibleSchemes.length > 0 && (
          <button onClick={onSelect} className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline">
            View all {calc.results.length} evaluated schemes <Icon name="ArrowRight" className="w-3 h-3" />
          </button>
        )}
      </GlassCard>
    </motion.div>
  );
}

function MemberDetailModal({ member, onClose }) {
  const calc = useMemo(() => calculateMemberEligibility(member), [member]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-start gap-4">
            <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{member.name}</h2>
              <p className="text-sm text-muted-foreground">{member.relation} • {member.age} yrs • {member.occupation}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gradient-brand">₹{calc.totalBenefit.toLocaleString("en-IN")}</div>
              <div className="text-[10px] text-muted-foreground">total eligible</div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
              <Icon name="X" className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">All Scheme Evaluations ({calc.results.length})</h3>
          {calc.results.map((r) => (
            <div key={r.schemeId} className={cn("p-4 rounded-xl border", r.eligible ? "border-success/20 bg-success/5" : "border-border bg-muted/30")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Icon name={r.icon} className={cn("w-4 h-4 mt-0.5", r.eligible ? "text-success" : "text-muted-foreground")} />
                  <div>
                    <div className="text-sm font-medium text-foreground">{r.schemeName}</div>
                    <div className="text-xs text-muted-foreground">{r.category} • ₹{r.benefit.toLocaleString("en-IN")}/year</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={cn("text-sm font-bold", r.eligible ? (r.match >= 90 ? "text-success" : "text-primary") : "text-muted-foreground")}>{r.match}%</div>
                  {r.eligible ? (
                    <a href={r.portal} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                      Apply <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Not eligible</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Badge({ color, icon, children }) {
  const colors = {
    primary: "bg-primary/5 text-primary border-primary/10",
    info: "bg-blue-50 text-blue-600 border-blue-100",
    warning: "bg-warning/5 text-warning border-warning/10",
    destructive: "bg-destructive/5 text-destructive border-destructive/10",
  };
  return (
    <span className={cn("trust-badge text-[10px] border", colors[color])}>
      <Icon name={icon} className="w-2.5 h-2.5" /> {children}
    </span>
  );
}