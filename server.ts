/**
 * LegalEase - Express & Gemini Server
 * Full-stack backend adhering to AI Studio guidelines.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { LEGALEASE_MASTER_SYSTEM_PROMPT } from './src/server/masterPrompt';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Shared Gemini Client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * 1. Legal Assistant / Triage / Q&A Endpoint
 */
app.post('/api/legal/ask', async (req, res) => {
  try {
    const { messages, jurisdiction, language = 'en', mode = 'triage' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const jurisdictionContext = `
ACTIVE JURISDICTION:
- Country: ${jurisdiction?.country || 'Not specified (request or clarify)'}
- State / Province: ${jurisdiction?.region || 'General / Central laws'}
- Specific Forum / Court Level: ${jurisdiction?.courtLevel || 'General jurisdiction'}
TARGET LANGUAGE: ${language} (Ensure response is natural, keeping English legal terms in parentheses when translating to Tamil, Hindi, etc.)
MODE: ${mode}
`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Append jurisdiction note to the latest user message
    const lastUserTurn = contents[contents.length - 1];
    if (lastUserTurn && lastUserTurn.role === 'user') {
      lastUserTurn.parts[0].text = `${jurisdictionContext}\n\nUser Question/Details:\n${lastUserTurn.parts[0].text}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: LEGALEASE_MASTER_SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for high factual accuracy and calm tone
      },
    });

    return res.json({
      text: response.text || 'Unable to generate response at this time.',
    });
  } catch (error: any) {
    console.error('Error in /api/legal/ask:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while consulting LegalEase.',
    });
  }
});

/**
 * 2. Document & Contract Analyzer Endpoint (Structured JSON)
 */
app.post('/api/legal/analyze', async (req, res) => {
  try {
    const { documentText, documentType, jurisdiction, language = 'en' } = req.body;

    if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
      return res.status(400).json({ error: 'Document text is required.' });
    }

    const prompt = `
Analyze the following legal document with meticulous precision under the Master AI System Prompt rules.
Jurisdiction Context:
- Country: ${jurisdiction?.country || 'Unspecified'}
- State/Region: ${jurisdiction?.region || 'General'}
- Document Type Hint: ${documentType || 'Auto-detect'}
Language of analysis: ${language}

DOCUMENT TEXT:
"""
${documentText.slice(0, 45000)}
"""

Provide a thorough, plain-language analysis adhering strictly to the JSON schema.
Ensure you evaluate obligations, critical deadlines, key clauses (Indemnity, Liability, Dispute Resolution, Governing Law, Termination, Force Majeure, Confidentiality, etc.), flag unusual or ambiguous terms without making superficial validity claims, and provide specific questions the user should ask their attorney.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LEGALEASE_MASTER_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Plain-language summary of what this document is and its main objective.' },
            documentType: { type: Type.STRING, description: 'Identified legal document classification (e.g. Residential Lease, Mutual NDA, Service Contract, Legal Notice).' },
            governingJurisdiction: { type: Type.STRING, description: 'Governing law and jurisdiction specified in the text or implied.' },
            parties: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Party name or designation' },
                  role: { type: Type.STRING, description: 'Role (e.g., Landlord, Tenant, Service Provider, Disclosing Party)' },
                  keyObligations: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'role', 'keyObligations'],
              },
            },
            criticalDeadlines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  eventOrClause: { type: Type.STRING, description: 'Event or clause trigger' },
                  timeframe: { type: Type.STRING, description: 'Timeframe or exact deadline' },
                  urgency: { type: Type.STRING, description: 'High, Medium, or Low' },
                  consequence: { type: Type.STRING, description: 'What happens if this deadline is missed' },
                },
                required: ['eventOrClause', 'timeframe', 'urgency', 'consequence'],
              },
            },
            clauseBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clauseTitle: { type: Type.STRING, description: 'Name of the clause (e.g., Limitation of Liability, Indemnification)' },
                  originalSnippetGist: { type: Type.STRING, description: 'Brief gist of what the clause says' },
                  plainLanguageExplanation: { type: Type.STRING, description: 'Easy to understand explanation for a non-lawyer' },
                  riskAssessment: { type: Type.STRING, description: 'Low, Balanced, or Attention Required' },
                  practicalImpact: { type: Type.STRING, description: 'Practical impact on user rights, liability, or wallet' },
                },
                required: ['clauseTitle', 'plainLanguageExplanation', 'riskAssessment', 'practicalImpact'],
              },
            },
            ambiguousOrUnusualProvisions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of unusual, ambiguous, or heavily one-sided provisions that warrant attention.',
            },
            questionsForLawyer: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Targeted questions the user should discuss with a qualified lawyer before signing or responding.',
            },
            redactionNotice: { type: Type.STRING, description: 'Reminder regarding redaction of sensitive personal data.' },
          },
          required: [
            'summary',
            'documentType',
            'governingJurisdiction',
            'parties',
            'criticalDeadlines',
            'clauseBreakdown',
            'ambiguousOrUnusualProvisions',
            'questionsForLawyer',
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/legal/analyze:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while analyzing the document.',
    });
  }
});

/**
 * 3. Document Drafter Endpoint
 * Generates transparent, non-deceptive legal drafts with clear placeholders [NAME], [DATE], etc.
 */
app.post('/api/legal/draft', async (req, res) => {
  try {
    const { templateType, jurisdiction, userParty, opposingParty, facts, keyTerms, language = 'en' } = req.body;

    if (!facts || !templateType) {
      return res.status(400).json({ error: 'Template type and facts are required.' });
    }

    const prompt = `
Draft a transparent, non-deceptive legal document template based on the following instructions:
- Template Type: ${templateType}
- Country & Jurisdiction: ${jurisdiction?.country || 'India'} (${jurisdiction?.region || 'Central/General'})
- Requesting Party: ${JSON.stringify(userParty || {})}
- Opposing/Other Party: ${JSON.stringify(opposingParty || {})}
- Stated Facts & Context: ${facts}
- Specific Terms/Demands: ${keyTerms || 'Standard provisions'}
- Target Language: ${language}

CRITICAL DRAFTING RULES:
1. Preserve explicit placeholders in brackets like [Date of Incident], [Account Number], [Landlord Address] for unknown or factual specifics.
2. Provide a clear Pre-Use Verification Checklist listing exactly what facts and local statutory deadlines the user MUST verify before serving or using this document.
3. Cite the relevant statutory basis (e.g. for Indian Consumer Notice: Consumer Protection Act 2019; for Cheque Dishonour: Section 138 of Negotiable Instruments Act 1881; for RTI: Right to Information Act 2005; for Tenancy: relevant state tenancy rules).
4. Use formal, professional, firm yet non-deceptive legal correspondence language.
5. Include the standard disclaimer that this is a draft template and should be reviewed by an advocate/attorney.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LEGALEASE_MASTER_SYSTEM_PROMPT,
        temperature: 0.1,
      },
    });

    return res.json({ draftText: response.text });
  } catch (error: any) {
    console.error('Error in /api/legal/draft:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while drafting the document.',
    });
  }
});

/**
 * 4. Legalese Simplifier & Clause Explainer Endpoint
 */
app.post('/api/legal/simplify', async (req, res) => {
  try {
    const { legaleseText, jurisdiction, language = 'en' } = req.body;

    if (!legaleseText || !legaleseText.trim()) {
      return res.status(400).json({ error: 'Legalese text is required.' });
    }

    const prompt = `
Translate and explain this convoluted legal text or contract clause into simple, crystal-clear plain language.
Jurisdiction: ${jurisdiction?.country || 'General'} (${jurisdiction?.region || 'General'})
Language: ${language}

ORIGINAL TEXT:
"""
${legaleseText}
"""

Provide:
1. Plain-Language Explanation (What does this actually mean in plain words?)
2. Real-World Practical Example (A relatable everyday scenario showing how it operates)
3. Practical Impact (How does this affect my rights, liabilities, or money?)
4. Key Terms Defined (Define every legal jargon term found in the excerpt, e.g. "Indemnity means...", "Subrogation means...")
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LEGALEASE_MASTER_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    return res.json({ simplifiedText: response.text });
  } catch (error: any) {
    console.error('Error in /api/legal/simplify:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while simplifying legal text.',
    });
  }
});

/**
 * 5. Litigation & Procedural Roadmap Endpoint
 */
app.post('/api/legal/procedure-roadmap', async (req, res) => {
  try {
    const { procedureType, jurisdiction, disputeSummary, language = 'en' } = req.body;

    const prompt = `
Generate a comprehensive, realistic procedural roadmap for:
- Matter Type: ${procedureType}
- Jurisdiction: ${jurisdiction?.country || 'India'} (${jurisdiction?.region || 'General'})
- Summary of Dispute / Issue: ${disputeSummary || 'General procedure inquiry'}
- Language: ${language}

Follow the rules of Section 8 (Court and Legal Proceedings):
1. Explain general procedural stages step-by-step (e.g. Legal Notice -> Pre-litigation mediation -> Filing plaint/petition -> Service of summons -> Written Statement -> Framing of issues -> Evidence -> Final arguments -> Decree/Order -> Execution).
2. List relevant filings and typical required documentation.
3. Highlight critical statutory limitation periods (statutes of limitations).
4. Explicitly include caveats: NEVER guarantee a timeline, court outcome, bail, or settlement.
5. Provide guidance on when an advocate is essential and options for free legal aid (e.g. Legal Services Authorities / DLSA in India, Legal Aid in US/UK).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LEGALEASE_MASTER_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    return res.json({ roadmapText: response.text });
  } catch (error: any) {
    console.error('Error in /api/legal/procedure-roadmap:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while generating the procedural roadmap.',
    });
  }
});

// Setup Vite in Dev or Static Files in Production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LegalEase Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
