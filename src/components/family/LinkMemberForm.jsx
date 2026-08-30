import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const relations = ["Self", "Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister", "Grandfather", "Grandmother", "Other"];
const genders = ["Male", "Female", "Other"];

export default function LinkMemberForm({ onLink, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    relation: "Father",
    age: "",
    gender: "Male",
    occupation: "",
    annual_income: "",
    aadhaar_linked: true,
    student: false,
    senior_citizen: false,
    bpl_category: false,
    disability: false,
  });
  const [step, setStep] = useState(1);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const canSubmit = form.name.trim() && form.age && form.occupation.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onLink({
      ...form,
      age: parseInt(form.age),
      annual_income: parseInt(form.annual_income) || 0,
      senior_citizen: form.senior_citizen || parseInt(form.age) >= 60,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <Icon name="UserCheck" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Link Family Member</h2>
                <p className="text-xs text-muted-foreground">Connect a household profile for benefit calculation</p>
              </div>
            </div>
            <button onClick={onCancel} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
              <Icon name="X" className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <div key={s} className={cn("flex-1 h-1.5 rounded-full transition-colors", s <= step ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 && (
            <>
              <Field label="Full Name" required>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="input-base"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Relation" required>
                  <select value={form.relation} onChange={(e) => update("relation", e.target.value)} className="input-base">
                    {relations.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Age" required>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    placeholder="e.g. 52"
                    className="input-base"
                  />
                </Field>
              </div>
              <Field label="Gender">
                <div className="flex gap-2">
                  {genders.map((g) => (
                    <button
                      key={g}
                      onClick={() => update("gender", g)}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                        form.gender === g ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Occupation" required>
                <input
                  value={form.occupation}
                  onChange={(e) => update("occupation", e.target.value)}
                  placeholder="e.g. Farmer, Student, Homemaker"
                  className="input-base"
                />
              </Field>
              <button
                onClick={() => setStep(2)}
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                Continue <Icon name="ArrowRight" className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Annual Income (₹)">
                <input
                  type="number"
                  value={form.annual_income}
                  onChange={(e) => update("annual_income", e.target.value)}
                  placeholder="e.g. 180000"
                  className="input-base"
                />
              </Field>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Profile Flags</p>
                <ToggleRow label="Aadhaar Linked" checked={form.aadhaar_linked} onChange={(v) => update("aadhaar_linked", v)} />
                <ToggleRow label="Student" checked={form.student} onChange={(v) => update("student", v)} />
                <ToggleRow label="Senior Citizen (60+)" checked={form.senior_citizen} onChange={(v) => update("senior_citizen", v)} />
                <ToggleRow label="BPL Category" checked={form.bpl_category} onChange={(v) => update("bpl_category", v)} />
                <ToggleRow label="Disability" checked={form.disability} onChange={(v) => update("disability", v)} />
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-2">
                <Icon name="ShieldCheck" className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Profile flags determine eligibility matches against government policy rules. The deterministic rule engine calculates matches without AI guesswork.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Icon name="ArrowLeft" className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  <Icon name="UserCheck" className="w-4 h-4" /> Link & Calculate
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
    >
      <span className="text-sm text-foreground">{label}</span>
      <div className={cn("w-9 h-5 rounded-full transition-colors relative", checked ? "bg-primary" : "bg-muted")}>
        <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", checked ? "translate-x-4" : "translate-x-0.5")} />
      </div>
    </button>
  );
}