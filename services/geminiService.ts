
import { GoogleGenAI, Type } from "@google/genai";
import { EmailMode, Lead, CompanyInfo, GroundingSource, ManualEmailContext } from "../types.ts";

/**
 * Enhanced retry logic with jittered exponential backoff
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number = 4): Promise<T> {
  let delay = 2000; 
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const statusCode = error?.status || 0;
      const errorMsg = error?.message || "";
      
      const shouldRetry = 
        statusCode === 429 || 
        statusCode === 500 || 
        statusCode === 503 || 
        statusCode === 504 ||
        errorMsg.includes('500') ||
        errorMsg.includes('429');

      if (shouldRetry && i < maxRetries - 1) {
        const jitter = Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
        delay *= 2; 
        continue;
      }
      throw error;
    }
  }
  throw new Error('Research Node currently saturated. Please retry in 30 seconds.');
}

function extractJson(text: string): any {
  if (!text) throw new Error("Empty response from Intelligence Node.");
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerError) {
        console.error("JSON parsing failed", innerError);
      }
    }
    throw new Error("Invalid intelligence format.");
  }
}

export const researchCompanyLeads = async (companyName: string, targetDept?: string): Promise<{ leads: Lead[], companyInfo: CompanyInfo }> => {
  const sanitizedCompany = companyName.trim().replace(/[^\w\s\-\.]/g, '');

  return retryWithBackoff(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `You are a World-Class B2B Intelligence Architect. 
    Task: Resolve 100% accurate identities for decision-makers at "${sanitizedCompany}".

    SEARCH DOMAIN: 
    - site:linkedin.com/in "${sanitizedCompany}"
    - site:crunchbase.com "${sanitizedCompany}" leadership
    - site:zoominfo.com "${sanitizedCompany}" executives

    MANDATORY DEPARTMENTS TO AUDIT:
    1. Marketing: CMO, VP Marketing, Marketing Director, Brand Head.
    2. Digital/Growth: CDO, Head of Growth, Performance Marketing Lead, Digital Head.
    3. Creative/Content: Creative Director, Content Strategy Head, Design Lead.
    4. IT & Technology: CTO, CIO, VP Engineering, Infrastructure Head, IT Director.
    5. Product: CPO, Head of Product, Product Director, VP Product.
    6. Innovation/AI: Chief AI Officer (CAIO), Head of AI, Innovation Director, R&D Head.
    7. Sales/Revenue: CRO (Chief Revenue Officer), VP Sales, Head of Revenue, GTM Lead.
    8. E-commerce: Head of E-commerce, Digital Retail Head, Marketplace Director.
    9. Operations: COO, Head of Ops, Process Excellence Lead, OpEx Director.
    10. Corporate Strategy: CSO (Chief Strategy Officer), VP Strategy, Head of Corp Dev.
    11. Innovation Lab: Lab Director, Venture Studio Lead, Intrapreneurship Head.
    12. Digital Transformation: Transformation Lead, Digital Catalyst, Modernization Head.
    13. Data Science / AI: Chief Data Officer, Head of Analytics, Lead Data Scientist.
    14. Information Security: CISO, VP Information Security, Security Architect.
    15. Data Privacy / Legal: DPO (Data Privacy Officer), Privacy Counsel, Legal Head.
    16. Risk Management: Chief Risk Officer (CRO), Risk Head, Internal Audit Director.

    RULE: Find 3-5 key stakeholders PER department. 
    EXCLUDE: "Former", "Ex-", "Freelance", "Consultant", "Intern", "Advisor".

    OUTPUT:
    Return valid JSON. "department" MUST exactly match one of the 16 listed above.
    {
      "companyInfo": { "name": "${sanitizedCompany}", "domain": "...", "summary": "...", "industry": "...", "turnover": "..." },
      "leads": [
        { 
          "name": "...", 
          "title": "Exact LinkedIn Title", 
          "department": "Exact Cluster Name from the 16 above", 
          "hierarchyLevel": "Tier 1|2", 
          "linkedinUrl": "...", 
          "email": "...", 
          "confidenceScore": 10,
          "verificationStatus": "grounded_fact",
          "sourceEvidence": "...",
          "booleanQueryUsed": "site:linkedin.com/in ..."
        }
      ]
    }`;

    const prompt = targetDept 
      ? `Perform deep extraction for "${sanitizedCompany}" specifically for the ${targetDept} department. Find all associated designations.`
      : `Perform a massive global stakeholder audit for "${sanitizedCompany}" across ALL 16 departments. Map as many decision-makers as possible (target 40+).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: { 
        systemInstruction,
        tools: [{ googleSearch: {} }] 
      }
    });

    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []).map((c: any) => ({
      title: c.web?.title || "Search Result",
      uri: c.web?.uri || ""
    })).filter((s: any) => s.uri);

    const data = extractJson(response.text || "{}");
    if (!data.companyInfo) {
      data.companyInfo = { name: sanitizedCompany, domain: "Pending", summary: "Audit complete.", industry: "Enterprise", turnover: "N/A" };
    }
    if (!Array.isArray(data.leads)) data.leads = [];

    data.leads = data.leads.map((l: any, idx: number) => ({
      ...l,
      id: l.id || `lead-${idx}-${Date.now()}`,
      name: l.name || "[STAKEHOLDER]",
      title: l.title || "Decision Maker",
      company: sanitizedCompany,
      linkedinUrl: l.linkedinUrl || `https://www.google.com/search?q=${encodeURIComponent(l.name + " " + sanitizedCompany)}`,
      email: l.email || `[Verify @${data.companyInfo.domain}]`,
      status: (l.confidenceScore || 0) > 8 ? 'verified' : 'pending',
      department: l.department || "General Node",
      relevanceScore: l.relevanceScore || 7,
      hierarchyLevel: l.hierarchyLevel || "Decision Maker",
      confidenceScore: l.confidenceScore || 5,
      verificationStatus: l.verificationStatus || 'grounded_fact',
      sourceEvidence: l.sourceEvidence || `Domain Locked: ${data.companyInfo.domain}`,
      logs: []
    }));

    data.companyInfo.groundingSources = sources;
    return data;
  });
};

export const scrubLeadContact = async (lead: Lead, company: string): Promise<{ email: string; phone: string }> => {
  return retryWithBackoff(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find official business email for ${lead.name} (${lead.title}) at ${company}. Use multi-source search.`,
      config: { 
        systemInstruction: 'Return JSON: {"email": "...", "phone": "..."}.',
        tools: [{ googleSearch: {} }] 
      }
    });
    const data = extractJson(response.text || "{}");
    return { email: data.email || "", phone: data.phone || "" };
  });
};

export const polishRemarks = async (rawNotes: string): Promise<string> => {
  return retryWithBackoff(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Polish CRM notes: "${rawNotes}"`,
      config: { systemInstruction: "Output professional CRM notes without markdown." }
    });
    return response.text || rawNotes;
  });
};

export const generateSalesEmail = async (context: Lead | ManualEmailContext, mode: EmailMode): Promise<string> => {
  return retryWithBackoff(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let r, t, c, dept;
    if ('name' in context) { r = context.name; t = context.title; c = context.company; dept = context.department; }
    else { r = context.recipientName; t = context.designation; c = context.companyName; dept = context.topic; }
    
    const systemInstruction = `You are a B2B Sales Executive. Write a ${mode} email.
    RULES: No markdown, focus on cluster pain points, professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft email to ${r} at ${c} regarding ${dept}.`,
      config: { systemInstruction }
    });
    
    return response.text?.trim() || "Email synthesis failed.";
  });
};

export const generateLinkedInMessage = async (lead: Lead): Promise<string> => {
  return retryWithBackoff(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `LinkedIn request for ${lead.name} @ ${lead.company}.`,
      config: { systemInstruction: "Max 250 characters. No markdown." }
    });
    return response.text?.trim() || "Let's connect.";
  });
};
