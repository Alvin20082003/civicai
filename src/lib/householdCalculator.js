import { governmentSchemes } from "@/lib/indiaData";

// ============================================================
// Household Benefit Calculator
// Evaluates each family member against all government schemes
// using deterministic eligibility rules (no hallucinations).
// ============================================================

const schemeRules = {
  "pm-kisan": (m) => {
    const score =
      (m.occupation?.toLowerCase().includes("farmer") ? 40 : 0) +
      (m.age >= 18 ? 30 : 0) +
      (m.aadhaar_linked ? 20 : 0) +
      (m.annual_income < 500000 ? 10 : 0);
    return { match: Math.min(score + 56, 99), eligible: score >= 60, benefit: 6000 };
  },
  "nsp-engineering": (m) => {
    const score =
      (m.student ? 40 : 0) +
      (m.age >= 18 && m.age <= 30 ? 30 : 0) +
      (m.annual_income < 200000 ? 25 : 0) +
      (m.aadhaar_linked ? 5 : 0);
    return { match: Math.min(score + 57, 99), eligible: score >= 60, benefit: 50000 };
  },
  "ayushman-bharat": (m) => {
    const score =
      (m.senior_citizen || m.age >= 60 ? 40 : 0) +
      (m.bpl_category || m.annual_income < 100000 ? 35 : 0) +
      (m.aadhaar_linked ? 20 : 0);
    return { match: Math.min(score + 58, 99), eligible: score >= 60, benefit: 500000 };
  },
  "pmay": (m) => {
    const score =
      (m.annual_income >= 100000 && m.annual_income <= 600000 ? 30 : 0) +
      (m.age >= 18 ? 20 : 0) +
      (m.gender === "Female" ? 15 : 0) +
      (m.aadhaar_linked ? 10 : 0);
    return { match: Math.min(score + 42, 80), eligible: score >= 50, benefit: 150000 };
  },
  "old-age-pension": (m) => {
    const score =
      (m.age >= 60 ? 50 : 0) +
      (m.bpl_category || m.annual_income < 100000 ? 30 : 0) +
      (m.aadhaar_linked ? 15 : 0);
    return { match: Math.min(score + 49, 99), eligible: score >= 60, benefit: 12000 };
  },
  "beti-bachao": (m) => {
    const score =
      (m.gender === "Female" ? 40 : 0) +
      (m.student ? 30 : 0) +
      (m.age >= 9 && m.age <= 25 ? 20 : 0) +
      (m.annual_income < 200000 ? 10 : 0);
    return { match: Math.min(score + 55, 99), eligible: score >= 60, benefit: 25000 };
  },
  "stand-up-india": (m) => {
    const score =
      (m.gender === "Female" ? 35 : 0) +
      (m.age >= 18 ? 25 : 0) +
      (m.occupation?.toLowerCase().includes("business") || m.occupation?.toLowerCase().includes("entrepreneur") ? 20 : 0) +
      (m.aadhaar_linked ? 10 : 0);
    return { match: Math.min(score + 46, 85), eligible: score >= 50, benefit: 100000 };
  },
  "skill-india": (m) => {
    const score =
      (m.age >= 15 && m.age <= 45 ? 40 : 0) +
      (m.student || m.occupation?.toLowerCase().includes("unemployed") ? 25 : 0) +
      (m.aadhaar_linked ? 15 : 0);
    return { match: Math.min(score + 48, 95), eligible: score >= 50, benefit: 15000 };
  },
};

export function calculateMemberEligibility(member) {
  const results = governmentSchemes.map((scheme) => {
    const rule = schemeRules[scheme.id];
    if (!rule) return null;
    const result = rule(member);
    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      category: scheme.category,
      benefit: result.benefit,
      match: result.match,
      eligible: result.eligible,
      portal: scheme.portal,
      icon: scheme.icon,
    };
  }).filter(Boolean);

  const eligibleSchemes = results.filter((r) => r.eligible);
  const totalBenefit = eligibleSchemes.reduce((sum, s) => sum + s.benefit, 0);

  return { results, eligibleSchemes, totalBenefit };
}

export function calculateHouseholdBenefits(members) {
  const memberResults = members.map((m) => ({
    member: m,
    ...calculateMemberEligibility(m),
  }));

  const totalHouseholdBenefit = memberResults.reduce(
    (sum, mr) => sum + mr.totalBenefit,
    0
  );

  const totalEligibleSchemes = memberResults.reduce(
    (sum, mr) => sum + mr.eligibleSchemes.length,
    0
  );

  // Aggregate by category
  const categoryBreakdown = {};
  memberResults.forEach((mr) => {
    mr.eligibleSchemes.forEach((s) => {
      if (!categoryBreakdown[s.category]) {
        categoryBreakdown[s.category] = { count: 0, benefit: 0 };
      }
      categoryBreakdown[s.category].count += 1;
      categoryBreakdown[s.category].benefit += s.benefit;
    });
  });

  return {
    memberResults,
    totalHouseholdBenefit,
    totalEligibleSchemes,
    categoryBreakdown,
    memberCount: members.length,
  };
}

// Default avatars by relation for newly linked members
export const defaultAvatars = {
  Father: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
  Mother: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
  Spouse: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces",
  Son: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
  Daughter: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
  Brother: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
  Sister: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
  Grandfather: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces",
  Grandmother: "https://images.unsplash.com/photo-1581579438747-104c53e7cb71?w=200&h=200&fit=crop&crop=faces",
  Self: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
  Other: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
};