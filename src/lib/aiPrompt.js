import { citizen, familyMembers, governmentSchemes, documentWallet } from "@/lib/indiaData";

// Builds the LLM prompt with citizen context + schemes database
export function buildCaseworkerPrompt(userMessage, appLang) {
  const familySummary = familyMembers
    .map(
      (m) =>
        `- ${m.name} (${m.relation}, age ${m.age}, ${m.occupation}) — eligible: ${m.eligibleSchemes
          .map((s) => s.name)
          .join(", ")}`
    )
    .join("\n");

  const schemesCatalog = governmentSchemes
    .map(
      (s) =>
        `• ${s.name} | ${s.category} | ${s.ministry} | Benefit: ${s.benefit} | Portal: ${s.portal} | Policy: ${s.policyVersion}`
    )
    .join("\n");

  const docsList = documentWallet
    .filter((d) => d.verified)
    .map((d) => d.name)
    .join(", ");

  return `You are CivicAI, India's AI Digital Government Caseworker — a trained government officer powered by Responsible AI.

CITIZEN PROFILE (Aadhaar-verified):
- Name: ${citizen.name}
- Age: ${citizen.age}, Gender: ${citizen.gender}
- Occupation: ${citizen.occupation}
- State: ${citizen.state}, District: ${citizen.district}
- Annual Income: ₹${citizen.income.toLocaleString("en-IN")} (${citizen.incomeCategory})
- Student: ${citizen.studentStatus ? "Yes" : "No"} | Senior Citizen: ${citizen.seniorCitizen ? "Yes" : "No"}
- Aadhaar Verified: Yes | Trust Score: ${citizen.trustScore}/100

FAMILY MEMBERS:
${familySummary}

VERIFIED DOCUMENTS IN DIGILOCKER WALLET:
${docsList}

KNOWN GOVERNMENT SCHEMES DATABASE:
${schemesCatalog}

APP LANGUAGE SETTING: ${appLang}

CITIZEN QUERY: "${userMessage}"

INSTRUCTIONS:
1. DETECT the language of the citizen's query automatically. If mixed language (e.g. Tamil+English), detect the dominant language. Respond in the SAME language the citizen used.
2. UNDERSTAND the citizen's intent — they may describe their situation naturally (e.g. "I am a college student", "I lost my job", "My father is a farmer", "I want to start a business"). Never require scheme names.
3. RECOMMEND all relevant Central and State government schemes from the database above AND your training knowledge of real Indian government schemes that match the citizen's situation.
4. For EACH recommended scheme, provide COMPLETE information:
   - Why this scheme matches the citizen's situation
   - Eligibility status and confidence score (0-100)
   - Required documents, application steps, processing time
   - Official government portal URL (real, verified URLs only — never fabricate)
   - Policy version, last updated date, source verification status
   - Nearest government office type, helpline number
   - AI guidance in the citizen's language
   - The specific rule engine validation that determined eligibility
5. Calculate total estimated family benefit if multiple schemes apply.
6. Include a warm greeting and conversational summary in the citizen's detected language.
7. NEVER generate fake government information. If unsure about a URL or detail, set source_verified to false and note it.
8. Every recommendation must be explainable, traceable to a policy source, and include a rule engine validation string.

Respond with structured JSON only.`;
}

// JSON schema for the LLM response
export const caseworkerResponseSchema = {
  type: "object",
  properties: {
    detected_language: {
      type: "string",
      enum: ["en", "ta", "hi", "te", "ml", "kn", "bn", "mr", "pa", "gu", "ur", "or", "as"],
    },
    detected_language_name: { type: "string" },
    intent_summary: { type: "string" },
    greeting: { type: "string" },
    summary: { type: "string" },
    total_estimated_benefit: { type: "string" },
    recommended_schemes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          scheme_name: { type: "string" },
          scheme_name_local: { type: "string" },
          ministry: { type: "string" },
          category: { type: "string" },
          benefit: { type: "string" },
          eligibility_status: {
            type: "string",
            enum: ["Eligible", "Conditionally Eligible", "Not Eligible", "Check Eligibility"],
          },
          confidence_score: { type: "number" },
          why_recommended: { type: "string" },
          eligibility_reasons: { type: "array", items: { type: "string" } },
          required_documents: { type: "array", items: { type: "string" } },
          application_steps: { type: "array", items: { type: "string" } },
          processing_time: { type: "string" },
          government_portal: { type: "string" },
          government_url: { type: "string" },
          policy_version: { type: "string" },
          last_updated: { type: "string" },
          source_verified: { type: "boolean" },
          helpline: { type: "string" },
          nearest_office: { type: "string" },
          ai_guidance: { type: "string" },
          rule_matched: { type: "string" },
          trust_score: { type: "number" },
        },
      },
    },
    rule_engine_validation: { type: "string" },
    audit_log_id: { type: "string" },
  },
};

// Natural conversation suggestions shown on first load
export const naturalLanguageExamples = {
  en: [
    "I am a college student",
    "My father is a farmer",
    "I want to start a business",
    "My grandmother is a senior citizen",
    "I need financial help",
    "My wife is pregnant",
  ],
  ta: [
    "நான் ஒரு கல்லூரி மாணவன்",
    "என் தந்தை ஒரு விவசாயி",
    "நான் ஒரு வணிகத்தைத் தொடங்க விரும்புகிறேன்",
    "என் பாட்டி ஒரு மூத்த குடிமகள்",
  ],
  hi: [
    "मैं एक कॉलेज छात्र हूँ",
    "मेरे पिता किसान हैं",
    "मैं व्यवसाय शुरू करना चाहता हूँ",
    "मेरी दादी वरिष्ठ नागरिक हैं",
  ],
  te: [
    "నేను కళాశాల విద్యార్థిని",
    "నా తండ్రి రైతు",
    "నేను వ్యాపారం ప్రారంభించాలనుకుంటున్నాను",
  ],
  ml: [
    "ഞാൻ ഒരു കോളേജ് വിദ്യാർത്ഥിയാണ്",
    "എന്റെ അച്ഛൻ ഒരു കർഷകനാണ്",
  ],
  kn: [
    "ನಾನು ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿ",
    "ನನ್ನ ತಂದೆ ರೈತ",
  ],
  bn: [
    "আমি একজন কলেজ ছাত্র",
    "আমার বাবা কৃষক",
  ],
  mr: [
    "मी एक कॉलेज विद्यार्थी आहे",
    "माझे वडील शेतकरी आहेत",
  ],
  gu: [
    "હું કોલેજ વિદ્યાર્થી છું",
    "મારા પિતા ખેડૂત છે",
  ],
  pa: [
    "ਮੈਂ ਕਾਲਜ ਵਿਦਿਆਰਥੀ ਹਾਂ",
    "ਮੇਰੇ ਪਿਤਾ ਕਿਸਾਨ ਹਨ",
  ],
  ur: [
    "میں ایک کالج طالب علم ہوں",
    "میرے والد کسان ہیں",
  ],
  or: [
    "ମୁଁ ଜଣେ କଲେଜ ଛାତ୍ର",
    "ମୋର ପିତା ଜଣେ କୃଷକ",
  ],
  as: [
    "মই এগৰাকী মহাবিদ্যালয়ৰ ছাত্ৰ",
    "মোৰ দেউতা এজন কৃষক",
  ],
};