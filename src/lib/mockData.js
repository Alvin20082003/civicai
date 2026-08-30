// Centralized mock data for the CivicAI platform

export const citizen = {
  name: "Aarav Sharma",
  id: "SG-CIT-2024-08831",
  email: "aarav.sharma@mail.gov.sg",
  role: "Citizen",
  age: 24,
  occupation: "Engineering Student",
  income: 24000,
  residency: "Singapore Resident",
  verified: true,
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
  trustScore: 98,
};

export const eligibleServices = [
  { id: 1, title: "Government Engineering Scholarship", category: "Education", match: 97, status: "Eligible", deadline: "2026-08-15" },
  { id: 2, title: "SkillsFuture Credit Top-Up", category: "Education", match: 92, status: "Eligible", deadline: "2026-12-31" },
  { id: 3, title: "Public Housing Grant (BTO)", category: "Housing", match: 78, status: "Conditional", deadline: "2026-10-01" },
  { id: 4, title: "Healthcare Subsidy Scheme", category: "Healthcare", match: 85, status: "Eligible", deadline: "2026-09-30" },
  { id: 5, title: "Public Transport Concession", category: "Transport", match: 99, status: "Eligible", deadline: "2026-07-31" },
];

export const notifications = [
  { id: 1, title: "Scholarship eligibility confirmed", time: "2 min ago", type: "success", desc: "Your documents have been verified for the Engineering Scholarship." },
  { id: 2, title: "Policy update: Income threshold revised", time: "1 hour ago", type: "info", desc: "Scholarship income threshold updated to $30,000." },
  { id: 3, title: "Human review requested", time: "3 hours ago", type: "warning", desc: "Your BTO application requires officer review." },
  { id: 4, title: "Document expiring soon", time: "1 day ago", type: "warning", desc: "Your income certificate expires in 5 days." },
];

export const recentApplications = [
  { id: "APP-2026-0481", service: "Engineering Scholarship", submitted: "2026-07-02", status: "Under Review", confidence: 97 },
  { id: "APP-2026-0472", service: "Healthcare Subsidy", submitted: "2026-06-28", status: "Approved", confidence: 94 },
  { id: "APP-2026-0465", service: "Transport Concession", submitted: "2026-06-20", status: "Approved", confidence: 99 },
  { id: "APP-2026-0458", service: "SkillsFuture Credit", submitted: "2026-06-15", status: "Pending", confidence: 88 },
];

export const documentVault = [
  { id: 1, name: "Income Certificate", type: "PDF", size: "248 KB", verified: true, uploaded: "2026-06-12", expiry: "2026-08-12" },
  { id: 2, name: "Academic Transcript", type: "PDF", size: "1.2 MB", verified: true, uploaded: "2026-06-10", expiry: null },
  { id: 3, name: "Identity Card (NRIC)", type: "JPG", size: "892 KB", verified: true, uploaded: "2026-05-01", expiry: null },
  { id: 4, name: "Proof of Residence", type: "PDF", size: "316 KB", verified: false, uploaded: "2026-07-05", expiry: null },
  { id: 5, name: "Bank Statement", type: "PDF", size: "440 KB", verified: true, uploaded: "2026-06-30", expiry: "2026-09-30" },
];

export const policyUpdates = [
  {
    id: 1,
    title: "Scholarship Income Threshold Updated",
    department: "Ministry of Education",
    date: "2026-07-08",
    affectedCitizens: 12430,
    newBeneficiaries: 3420,
    recommendation: "Notify Eligible Citizens",
    severity: "high",
    summary: "Annual income eligibility ceiling raised from $26,000 to $30,000, expanding access to the Government Engineering Scholarship.",
  },
  {
    id: 2,
    title: "Healthcare Subsidy Expansion",
    department: "Ministry of Health",
    date: "2026-07-06",
    affectedCitizens: 8760,
    newBeneficiaries: 2110,
    recommendation: "Auto-Enroll Eligible Citizens",
    severity: "medium",
    summary: "Subsidy coverage extended to include specialist outpatient consultations for residents under 30.",
  },
  {
    id: 3,
    title: "Public Transport Concession Revision",
    department: "Ministry of Transport",
    date: "2026-07-03",
    affectedCitizens: 15200,
    newBeneficiaries: 5400,
    recommendation: "Update Eligibility Rules",
    severity: "low",
    summary: "Monthly concession cap increased; students now qualify for additional off-peak discounts.",
  },
];

export const governanceMetrics = [
  { label: "AI Transparency", value: 98, suffix: "%", icon: "Eye", trend: "up" },
  { label: "Privacy Protection", value: 100, suffix: "%", icon: "ShieldCheck", trend: "up" },
  { label: "Fairness", value: 97, suffix: "%", icon: "Scale", trend: "up" },
  { label: "Security", value: 99, suffix: "%", icon: "Lock", trend: "up" },
  { label: "Explainability", value: 96, suffix: "%", icon: "Sparkles", trend: "up" },
  { label: "Audit Readiness", value: 100, suffix: "%", icon: "FileCheck", trend: "up" },
  { label: "Bias Detection", value: "None", suffix: "", icon: "ShieldAlert", trend: "neutral", isText: true },
  { label: "AI Risk", value: "Low", suffix: "", icon: "Gauge", trend: "neutral", isText: true },
];

export const decisionLog = [
  { time: "2026-07-09 14:32", decision: "Scholarship Eligible", policy: "MOE-SCH-2024-v3.2", confidence: 97, documents: "Income Cert, Transcript", humanReview: "Available", status: "Logged" },
  { time: "2026-07-09 11:18", decision: "Healthcare Subsidy Approved", policy: "MOH-SUB-2025-v1.4", confidence: 94, documents: "NRIC, Bank Statement", humanReview: "Not Required", status: "Logged" },
  { time: "2026-07-08 16:45", decision: "BTO Grant Conditional", policy: "MND-HDB-2024-v2.1", confidence: 78, documents: "Income Cert, Residence", humanReview: "Escalated", status: "Review" },
  { time: "2026-07-08 09:22", decision: "Transport Concession Eligible", policy: "MOT-CON-2025-v1.0", confidence: 99, documents: "Student ID, NRIC", humanReview: "Not Required", status: "Logged" },
  { time: "2026-07-07 13:10", decision: "SkillsFuture Credit Top-Up", policy: "SSG-SFC-2024-v2.3", confidence: 88, documents: "Academic Transcript", humanReview: "Available", status: "Logged" },
  { time: "2026-07-07 10:05", decision: "Welfare Application Rejected", policy: "MSF-WEL-2025-v1.1", confidence: 71, documents: "Income Cert", humanReview: "Escalated", status: "Review" },
  { time: "2026-07-06 15:40", decision: "Scholarship Renewal Eligible", policy: "MOE-SCH-2024-v3.2", confidence: 96, documents: "Transcript, Income Cert", humanReview: "Not Required", status: "Logged" },
];

export const consentItems = [
  { id: 1, name: "Income Certificate", granted: true, access: "Access Granted", purpose: "Scholarship Eligibility", expiry: "30 Days", icon: "FileText" },
  { id: 2, name: "Medical Record", granted: false, access: "No Access", purpose: "—", expiry: "—", icon: "HeartPulse" },
  { id: 3, name: "Driving Licence", granted: true, access: "Renewal Only", purpose: "Licence Renewal", expiry: "60 Days", icon: "Car" },
  { id: 4, name: "Academic Transcript", granted: true, access: "Access Granted", purpose: "SkillsFuture Credit", expiry: "90 Days", icon: "GraduationCap" },
  { id: 5, name: "Employment History", granted: false, access: "No Access", purpose: "—", expiry: "—", icon: "Briefcase" },
  { id: 6, name: "Tax Records", granted: true, access: "Read Only", purpose: "Welfare Assessment", expiry: "45 Days", icon: "Receipt" },
];

export const riskAlerts = [
  { category: "Low Risk", count: 1248, color: "success", desc: "Decisions within normal parameters" },
  { category: "Medium Risk", count: 86, color: "warning", desc: "Requires monitoring" },
  { category: "High Risk", count: 12, color: "destructive", desc: "Immediate attention needed" },
];

export const riskIssues = [
  { id: 1, title: "Missing Documents", count: 34, severity: "warning", icon: "FileQuestion", desc: "Applications lacking required verification documents" },
  { id: 2, title: "Policy Conflicts", count: 8, severity: "destructive", icon: "GitBranch", desc: "Decisions conflicting with updated policy rules" },
  { id: 3, title: "Fraud Alerts", count: 3, severity: "destructive", icon: "ShieldAlert", desc: "Anomalous patterns flagged by fraud detection" },
  { id: 4, title: "Human Escalation", count: 19, severity: "warning", icon: "UserCheck", desc: "Cases awaiting human officer review" },
];

// AI Chat mock responses
export const chatResponses = [
  {
    trigger: ["scholarship", "eligible", "education"],
    response: {
      recommendation: "Eligible",
      confidence: 97,
      reasons: [
        "Annual income ($24,000) is below the $30,000 threshold",
        "Currently enrolled as a full-time Engineering student",
        "All required documents have been verified",
        "Singapore residency confirmed via NRIC",
      ],
      policySource: "Government Scholarship Policy",
      policyVersion: "MOE-SCH-2024-v3.2",
      department: "Ministry of Education",
      documentsUsed: ["Income Certificate", "Academic Transcript", "NRIC"],
      ruleMatched: "Rule #R-SCH-014: Income < $30,000 AND Student Status = Verified",
      alternatives: [
        { option: "SkillsFuture Credit Top-Up", match: 92, note: "Additional education funding available" },
        { option: "Study Loan Subsidy", match: 81, note: "Low-interest option if scholarship is declined" },
      ],
      humanReview: true,
    },
  },
];

export const defaultChatResponse = {
  recommendation: "More Information Needed",
  confidence: 72,
  reasons: [
    "Additional context is required to provide a definitive recommendation",
    "Please specify the government service you are enquiring about",
  ],
  policySource: "CivicAI Knowledge Base",
  policyVersion: "CIVIC-KB-2026-v1.0",
  department: "Cross-Agency",
  documentsUsed: ["Citizen Profile"],
  ruleMatched: "Rule #R-GEN-001: Insufficient data for definitive assessment",
  alternatives: [
    { option: "Browse Eligible Services", match: 100, note: "View services matched to your profile" },
    { option: "Speak to an Officer", match: 95, note: "Request human assistance" },
  ],
  humanReview: true,
};

export const predictiveData = {
  scholarshipDemand: [
    { month: "Jan", current: 4200, predicted: 4350 },
    { month: "Feb", current: 4480, predicted: 4600 },
    { month: "Mar", current: 4650, predicted: 4800 },
    { month: "Apr", current: 4900, predicted: 5100 },
    { month: "May", current: 5200, predicted: 5400 },
    { month: "Jun", current: 5500, predicted: 5750 },
    { month: "Jul", current: 5800, predicted: 6100 },
    { month: "Aug", current: null, predicted: 6450 },
    { month: "Sep", current: null, predicted: 6700 },
  ],
  welfareUptake: [
    { month: "Jan", value: 1820 },
    { month: "Feb", value: 1900 },
    { month: "Mar", value: 2050 },
    { month: "Apr", value: 2180 },
    { month: "May", value: 2240 },
    { month: "Jun", value: 2380 },
    { month: "Jul", value: 2510 },
  ],
  departmentWorkload: [
    { dept: "Education", current: 3200, capacity: 4000 },
    { dept: "Healthcare", current: 2800, capacity: 3500 },
    { dept: "Housing", current: 3900, capacity: 4000 },
    { dept: "Transport", current: 1500, capacity: 2500 },
    { dept: "Welfare", current: 2100, capacity: 3000 },
  ],
  serviceTrends: [
    { name: "Scholarship", value: 32 },
    { name: "Healthcare", value: 24 },
    { name: "Housing", value: 18 },
    { name: "Transport", value: 14 },
    { name: "Welfare", value: 12 },
  ],
  bottlenecks: [
    { stage: "Document Upload", delay: 2.1, color: "#0D9488" },
    { stage: "AI Validation", delay: 0.3, color: "#0052CC" },
    { stage: "Rule Engine", delay: 0.2, color: "#0052CC" },
    { stage: "Human Review", delay: 48.5, color: "#F59E0B" },
    { stage: "Final Approval", delay: 12.3, color: "#F59E0B" },
  ],
  rejectionTrends: [
    { month: "Jan", rate: 8.2 },
    { month: "Feb", rate: 7.5 },
    { month: "Mar", rate: 6.8 },
    { month: "Apr", rate: 7.1 },
    { month: "May", rate: 6.2 },
    { month: "Jun", rate: 5.4 },
    { month: "Jul", rate: 4.8 },
  ],
};

export const features = [
  { title: "Responsible AI", desc: "Every recommendation is governed by ethical AI principles, ensuring fairness, accountability, and transparency across all citizen interactions.", icon: "ShieldCheck", gradient: "from-blue-500 to-blue-600" },
  { title: "Rule-Based Decision Engine", desc: "Deterministic policy rules validate every AI output, guaranteeing decisions comply with official government regulations.", icon: "GitBranch", gradient: "from-teal-500 to-teal-600" },
  { title: "Verified Government Knowledge Base", desc: "A curated, authoritative repository of government policies, schemes, and procedures — the single source of truth.", icon: "BookCheck", gradient: "from-blue-500 to-indigo-600" },
  { title: "Explainable AI", desc: "Citizens see exactly why a decision was made: which rules matched, which documents were used, and which policy was referenced.", icon: "Sparkles", gradient: "from-teal-500 to-cyan-600" },
  { title: "Privacy by Design", desc: "Data minimization, consent management, and encryption are built into the architecture — not bolted on.", icon: "Lock", gradient: "from-indigo-500 to-blue-600" },
  { title: "Human Oversight", desc: "Every decision can be escalated to a human officer, ensuring accountability for high-stakes government services.", icon: "UserCheck", gradient: "from-blue-500 to-teal-600" },
  { title: "Policy Intelligence", desc: "Real-time monitoring of policy changes with automatic impact analysis on affected citizens and services.", icon: "TrendingUp", gradient: "from-teal-500 to-blue-600" },
  { title: "Predictive Governance", desc: "Forecast demand, identify bottlenecks, and proactively allocate resources across government departments.", icon: "LineChart", gradient: "from-blue-500 to-indigo-600" },
];

export const trustBadges = [
  { label: "Explainable AI", icon: "Sparkles" },
  { label: "Government Source Verified", icon: "BadgeCheck" },
  { label: "Rule Engine Validated", icon: "GitBranch" },
  { label: "Human Review Available", icon: "UserCheck" },
  { label: "Privacy Protected", icon: "ShieldCheck" },
  { label: "Audit Logged", icon: "FileCheck" },
];

export const ruleEngineSteps = [
  { id: 1, title: "Citizen", desc: "Citizen submits a query or application through the conversational AI interface.", icon: "User" },
  { id: 2, title: "Rule Engine", desc: "Deterministic policy rules evaluate the request against eligibility criteria.", icon: "GitBranch" },
  { id: 3, title: "Eligibility Validation", desc: "Citizen data is cross-checked against verified documents and policy thresholds.", icon: "CheckCircle2" },
  { id: 4, title: "Explainable AI", desc: "The AI generates a recommendation with full reasoning and confidence score.", icon: "Sparkles" },
  { id: 5, title: "Recommendation", desc: "A structured, explainable recommendation is presented to the citizen.", icon: "Lightbulb" },
  { id: 6, title: "Human Review", desc: "High-stakes decisions are escalated for human officer verification.", icon: "UserCheck" },
  { id: 7, title: "Government Submission", desc: "The validated application is submitted to the relevant government system.", icon: "Send" },
];

export const architectureLayers = [
  { id: 1, title: "Citizen", desc: "The end-user interacting with government services via a conversational interface.", icon: "User", layer: "Interface" },
  { id: 2, title: "Conversational AI", desc: "Natural language understanding layer that interprets citizen queries and intent.", icon: "MessageSquare", layer: "Interaction" },
  { id: 3, title: "Rule Engine", desc: "Deterministic policy rules that validate requests against government regulations.", icon: "GitBranch", layer: "Validation" },
  { id: 4, title: "Verified Government Knowledge Base", desc: "Authoritative repository of policies, schemes, and procedures.", icon: "BookCheck", layer: "Knowledge" },
  { id: 5, title: "Retrieval-Augmented Generation (RAG)", desc: "Retrieves relevant policy context to ground AI responses in verified data.", icon: "Database", layer: "Retrieval" },
  { id: 6, title: "Explainable AI Layer", desc: "Generates transparent, auditable recommendations with full reasoning.", icon: "Sparkles", layer: "Intelligence" },
  { id: 7, title: "Government Services", desc: "Integration with backend government systems for application submission.", icon: "Landmark", layer: "Services" },
  { id: 8, title: "Audit & Governance Layer", desc: "Every decision is logged, monitored, and auditable for compliance.", icon: "FileCheck", layer: "Governance" },
];

export const technologies = [
  "Responsible AI", "AI Governance", "Explainable AI (XAI)", "Rule Engine", "Retrieval-Augmented Generation (RAG)",
  "Knowledge Graph", "Human-in-the-Loop", "Privacy by Design", "Security by Design", "Policy Intelligence",
  "Digital Trust", "Data Minimization", "AI Risk Management", "Auditability", "Transparency", "Accountability", "Bias Monitoring",
];