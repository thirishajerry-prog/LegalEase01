import React, { useState } from 'react';
import { FileSearch, ShieldCheck, AlertTriangle, Clock, HelpCircle, CheckCircle, Upload, Copy, Check, FileText } from 'lucide-react';
import { JurisdictionState, SupportedLanguage, DocumentAnalysisResult } from '../types/legal';

interface DocumentAnalyzerViewProps {
  jurisdiction: JurisdictionState;
  language: SupportedLanguage;
  onOpenPrivacyRedactor: () => void;
  onOpenLawyerBrief: (topic: string, summary: string, questions: string[], docs: string[]) => void;
}

const SAMPLE_CONTRACTS = [
  {
    title: 'Consulting Service Agreement (Aggressive Indemnity & Unlimited Liability)',
    type: 'Commercial Services',
    text: `CONSULTING SERVICES AGREEMENT
Between: NovaTech Solutions Ltd. ("Company") and Apex Systems LLC ("Client")
Date: October 15, 2025. Governing Law: State of New York.

1. SCOPE: Company shall provide cloud security consulting as detailed in Exhibit A.
2. PAYMENT: Invoices are payable within 30 calendar days. Late payments incur interest of 1.5% per month.
3. TERM & TERMINATION: Either party may terminate with 30 days prior written notice. If Company terminates without cause, all upfront deposits are forfeited.
4. INDEMNITY: Company shall indemnify, defend, and hold harmless Client, its affiliates, directors, and agents against ANY AND ALL losses, liabilities, claims, and attorney fees arising from or related to Company's performance, without monetary limitation.
5. LIMITATION OF LIABILITY: Client's maximum cumulative liability shall be capped at $1,000. Company's liability under this Agreement is UNLIMITED.
6. INTELLECTUAL PROPERTY: All works, scripts, documentation, and inventions authored by Company shall be deemed "Work Made for Hire" and exclusively owned by Client upon creation.
7. DISPUTE RESOLUTION: Any dispute shall be submitted to binding confidential arbitration before AAA in New York City. The prevailing party is entitled to reasonable legal costs.`,
  },
  {
    title: 'Residential Tenancy Agreement (High Deposit & Automatic Renewal)',
    type: 'Property & Lease',
    text: `RESIDENTIAL LEASE AGREEMENT
Landlord: Green Meadows Properties Pvt Ltd
Tenant: Arun Swaminathan
Property: Flat 402, Highgate Towers, OMR Road, Chennai, Tamil Nadu.

1. TERM: 11 months commencing November 1, 2025.
2. RENT & DEPOSIT: Monthly rent of ₹38,000 payable on or before 5th of each month. Tenant has paid an interest-free refundable security deposit of ₹3,00,000 (roughly 8 months rent).
3. LOCK-IN PERIOD: Both parties agree to a strict 6-month lock-in period. If Tenant vacates prior to 6 months, the entire security deposit shall be forfeited.
4. REPAIRS & MAINTENANCE: Tenant is solely responsible for all electrical, plumbing, whitewashing, and structural maintenance during the tenancy.
5. VACATING NOTICE: Tenant must provide 90 days written notice prior to vacating. Failure to provide 90 days notice grants Landlord right to deduct 2 months rent.
6. GOVERNING LAW: Subject to the exclusive jurisdiction of the Courts and Rent Tribunal at Chennai, Tamil Nadu under the Tamil Nadu Regulation of Rights and Responsibilities of Landlords and Tenants Act.`,
  },
  {
    title: 'Employment Offer Letter (Broad Non-Compete & Notice Period)',
    type: 'Employment',
    text: `CONFIDENTIAL EMPLOYMENT AGREEMENT
Employer: Global Fintech Innovations Inc.
Employee: Priya Sharma
Position: Senior Backend Engineer

1. NOTICE PERIOD: Employee agrees to serve 90 calendar days notice upon resignation. Buyout of notice period is strictly at Employer's sole discretion.
2. RESTRICTIVE COVENANTS / NON-COMPETE: For a period of 18 months following separation, Employee shall not directly or indirectly work for, consult, or invest in any firm operating in digital payments or financial technologies across the Indian subcontinent.
3. PROPRIETARY INFORMATION: Employee agrees that all concepts, code, and inventions conceived during employment or within 6 months post-employment belong unconditionally to Employer.
4. JURISDICTION: This agreement is governed by the laws of India, subject to Courts at Bengaluru, Karnataka.`,
  },
];

export const DocumentAnalyzerView: React.FC<DocumentAnalyzerViewProps> = ({
  jurisdiction,
  language,
  onOpenPrivacyRedactor,
  onOpenLawyerBrief,
}) => {
  const [docText, setDocText] = useState('');
  const [docTypeHint, setDocTypeHint] = useState('Auto-Detect');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!docText.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/legal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          documentType: docTypeHint,
          jurisdiction,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete document analysis');
      }

      setAnalysis(data);
    } catch (err: any) {
      setError(err?.message || 'Error communicating with analysis service');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sampleText: string, sampleTitle: string) => {
    setDocText(sampleText);
    setDocTypeHint(sampleTitle);
    setAnalysis(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDocText(text);
        setAnalysis(null);
      };
      reader.readAsText(file);
    }
  };

  const handleCreateLawyerBrief = () => {
    if (!analysis) return;
    onOpenLawyerBrief(
      `${analysis.documentType} Analysis`,
      analysis.summary,
      analysis.questionsForLawyer,
      ['Original Document Copy', 'Amendments / Side Letters', 'Relevant Email Correspondence']
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Privacy Callout */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-amber-800" />
            Legal Document & Contract Reviewer
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Upload or paste any agreement, lease, notice, or clause. LegalEase breaks down parties, critical obligations, upcoming deadlines, indemnities, liability caps, and one-sided terms without superficial claims of validity.
          </p>
        </div>

        <button
          onClick={onOpenPrivacyRedactor}
          className="self-start md:self-center shrink-0 flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Sanitize PII Before Pasting</span>
        </button>
      </div>

      {/* Main Workspace: Left Input / Right Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Box & Sample Loaders (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-800">Paste Document Text:</label>
              <label className="text-[11px] text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .txt / .md</span>
                <input type="file" accept=".txt,.md,.rtf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste contract, lease agreement, legal notice, offer letter, or NDA text here..."
              rows={16}
              className="w-full p-3 rounded border border-stone-200 bg-stone-50/50 font-mono text-[11px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-400">
                {docText.length > 0 ? `${docText.length} characters` : 'No document loaded'}
              </span>

              <button
                onClick={handleAnalyze}
                disabled={!docText.trim() || loading}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {loading ? (
                  <span>Analyzing clauses...</span>
                ) : (
                  <>
                    <FileSearch className="w-3.5 h-3.5" />
                    <span>Analyze Document</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Load Sample Contracts */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Try Sample Documents:
            </span>
            <div className="space-y-2">
              {SAMPLE_CONTRACTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadSample(sample.text, sample.title)}
                  className="w-full text-left p-2.5 rounded bg-white hover:bg-stone-100 border border-stone-200/80 transition-colors text-xs cursor-pointer group"
                >
                  <div className="font-medium text-stone-800 group-hover:text-stone-950 flex items-center justify-between">
                    <span>{sample.title}</span>
                    <span className="text-[10px] text-stone-400">{sample.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Analysis Output (7 cols) */}
        <div className="lg:col-span-7">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Analysis Notice:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {!analysis && !loading && (
            <div className="h-full min-h-[460px] bg-white border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center p-8 text-center text-stone-400">
              <FileSearch className="w-10 h-10 text-stone-300 mb-3" />
              <h3 className="text-sm font-semibold text-stone-700">No Document Analyzed Yet</h3>
              <p className="text-xs text-stone-500 max-w-md mt-1">
                Paste contract text on the left or select a sample agreement above to get an instant breakdown of obligations, liabilities, deadlines, and questions for counsel.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[460px] bg-white border border-stone-200 rounded-lg flex flex-col items-center justify-center p-8 text-center text-stone-500 space-y-3">
              <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-sm font-semibold text-stone-800">Examining Terms & Clauses...</h3>
              <p className="text-xs text-stone-500 max-w-md">
                Checking indemnities, governing law, termination rights, liability limits, and potential risks under {jurisdiction.country} law.
              </p>
            </div>
          )}

          {analysis && !loading && (
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-6 text-xs text-stone-800 leading-relaxed">
              {/* Header: Document Type & Summary */}
              <div className="border-b border-stone-200 pb-4">
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">{analysis.documentType}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 text-[11px]">{analysis.governingJurisdiction}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCreateLawyerBrief}
                      className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200/90 text-stone-800 rounded font-medium transition-colors cursor-pointer text-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-800" />
                      <span>Prepare Lawyer Brief</span>
                    </button>
                  </div>
                </div>

                <p className="text-stone-700 bg-stone-50 p-3 rounded border border-stone-200/70 text-xs">
                  {analysis.summary}
                </p>
              </div>

              {/* 1. Identified Parties & Obligations */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-2.5">
                  1. Parties & Core Responsibilities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.parties.map((p, idx) => (
                    <div key={idx} className="p-3 bg-stone-50/70 border border-stone-200 rounded space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-stone-900 text-xs">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-stone-500 font-normal">{p.role}</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-stone-600 pl-3 list-disc">
                        {p.keyObligations.map((ob, obIdx) => (
                          <li key={obIdx}>{ob}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Critical Dates & Deadlines */}
              {analysis.criticalDeadlines && analysis.criticalDeadlines.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-2.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    2. Critical Deadlines & Notice Windows
                  </h4>
                  <div className="overflow-x-auto border border-stone-200 rounded">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-semibold">
                          <th className="p-2.5">Trigger / Event</th>
                          <th className="p-2.5">Timeframe</th>
                          <th className="p-2.5">Urgency</th>
                          <th className="p-2.5">Consequence if Missed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {analysis.criticalDeadlines.map((dl, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50">
                            <td className="p-2.5 font-medium text-stone-900">{dl.eventOrClause}</td>
                            <td className="p-2.5 text-stone-700">{dl.timeframe}</td>
                            <td className="p-2.5">
                              <span
                                className={`font-semibold ${
                                  dl.urgency.toLowerCase().includes('high')
                                    ? 'text-red-700'
                                    : dl.urgency.toLowerCase().includes('med')
                                    ? 'text-amber-800'
                                    : 'text-stone-600'
                                }`}
                              >
                                {dl.urgency}
                              </span>
                            </td>
                            <td className="p-2.5 text-stone-600">{dl.consequence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. Deep Clause Breakdown */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-2.5">
                  3. Key Clauses & Risk Assessment
                </h4>
                <div className="space-y-2.5">
                  {analysis.clauseBreakdown.map((clause, idx) => {
                    const isHigh = clause.riskAssessment.toLowerCase().includes('attention') || clause.riskAssessment.toLowerCase().includes('high');
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded border text-xs ${
                          isHigh ? 'bg-amber-50/50 border-amber-200' : 'bg-stone-50/60 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                          <span>{clause.clauseTitle}</span>
                          <span
                            className={`text-[10px] font-semibold ${
                              isHigh ? 'text-amber-900' : 'text-stone-600'
                            }`}
                          >
                            Risk: {clause.riskAssessment}
                          </span>
                        </div>
                        <p className="text-stone-700 text-xs mb-1.5">{clause.plainLanguageExplanation}</p>
                        <div className="text-[11px] text-stone-600 bg-white/70 p-2 rounded border border-stone-200/50">
                          <span className="font-semibold text-stone-800">Practical Impact: </span>
                          {clause.practicalImpact}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Unusual or Ambiguous Terms */}
              {analysis.ambiguousOrUnusualProvisions && analysis.ambiguousOrUnusualProvisions.length > 0 && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
                    4. Unusual or Heavily One-Sided Provisions
                  </h4>
                  <ul className="space-y-1 text-[11px] text-stone-700 pl-4 list-disc">
                    {analysis.ambiguousOrUnusualProvisions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 5. Questions for Lawyer */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-700" />
                  5. Questions to Discuss with Your Lawyer Before Signing
                </h4>
                <div className="space-y-1.5 pl-2">
                  {analysis.questionsForLawyer.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-stone-800">
                      <span className="font-semibold text-amber-900">{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
