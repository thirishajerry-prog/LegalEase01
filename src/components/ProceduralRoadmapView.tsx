import React, { useState } from 'react';
import { GitBranch, ShieldAlert, Clock, FileText, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { JurisdictionState, SupportedLanguage } from '../types/legal';

interface ProceduralRoadmapViewProps {
  jurisdiction: JurisdictionState;
  language: SupportedLanguage;
}

interface ProceduralFlow {
  id: string;
  title: string;
  category: string;
  statutoryBasis: string;
  limitationNote: string;
  stages: {
    stageNumber: number;
    title: string;
    description: string;
    typicalFiling: string;
    timeframe: string;
    warningNote?: string;
  }[];
}

const PRELOADED_FLOWS: ProceduralFlow[] = [
  {
    id: 'consumer-dispute',
    title: 'Consumer Grievance & Commission Dispute Roadmap',
    category: 'Consumer Protection',
    statutoryBasis: 'Consumer Protection Act, 2019 (District / State / National Commission)',
    limitationNote: '2 years from the date on which the cause of action arose (Section 69 CPA 2019).',
    stages: [
      {
        stageNumber: 1,
        title: 'Step 1: Written Grievance & Pre-Litigation Legal Notice',
        description: 'Serve a formal written legal notice or registered email giving the company/vendor 15 to 30 days to resolve defect or refund.',
        typicalFiling: 'Formal Legal Notice via Registered Post A.D. / e-NCH Grievance',
        timeframe: '15 – 30 days cure period',
      },
      {
        stageNumber: 2,
        title: 'Step 2: Filing Formal Complaint on e-Daakhil Portal or Registry',
        description: 'File consumer complaint before District Commission (claims up to ₹50 Lakh), State Commission (₹50L – ₹2 Crore), or NCDRC (> ₹2 Crore).',
        typicalFiling: 'Consumer Complaint Petition + Supporting Invoices + Evidence Affidavit',
        timeframe: 'Must be within 2 years of cause of action',
      },
      {
        stageNumber: 3,
        title: 'Step 3: Admission & Notice to Opposite Party',
        description: 'Commission examines admissibility. If admitted, notice issued to opposite party to file Written Version within 30 days (extendable by 15 days).',
        typicalFiling: 'Commission Notice & Opposite Party Written Version',
        timeframe: '30 to 45 days for defense',
      },
      {
        stageNumber: 4,
        title: 'Step 4: Evidence Affidavits & Arguments',
        description: 'Both complainant and opposite party file evidence on affidavit and documentary exhibits. Oral arguments heard.',
        typicalFiling: 'Affidavit in Evidence + Written Submissions',
        timeframe: 'Subject to Commission listing docket',
      },
      {
        stageNumber: 5,
        title: 'Step 5: Final Order & Execution Proceedings',
        description: 'Commission passes order for refund, replacement, compensation, and litigation costs. If not complied with, Section 71 / 72 execution petition filed.',
        typicalFiling: 'Certified Copy of Final Order / Execution Petition',
        timeframe: 'Appeals within 45 days to State/National Commission',
        warningNote: 'Never assume immediate recovery; opposite parties may file statutory appeals.',
      },
    ],
  },
  {
    id: 'cheque-bounce-138',
    title: 'Section 138 NI Act Cheque Dishonour Pathway',
    category: 'Commercial & Financial',
    statutoryBasis: 'Negotiable Instruments Act, 1881 (Criminal / Quasi-Criminal Proceedings)',
    limitationNote: 'Strict statutory timelines: Notice within 30 days of memo; Complaint within 30 days of cure expiry.',
    stages: [
      {
        stageNumber: 1,
        title: 'Step 1: Presentation & Bank Return Memo',
        description: 'Cheque presented within validity (3 months from date). Returned unpaid with memo stating "Insufficient Funds", "Account Closed", etc.',
        typicalFiling: 'Original Cheque + Official Bank Return Memo',
        timeframe: 'Cheque valid for 3 months from issuance',
      },
      {
        stageNumber: 2,
        title: 'Step 2: Mandatory Statutory Demand Notice',
        description: 'Send formal legal notice demanding payment within 30 days of receiving bank dishonour memo.',
        typicalFiling: 'Section 138 Statutory Notice via Speed Post / Reg. AD',
        timeframe: 'MUST be dispatched within 30 days of receiving memo',
        warningNote: 'Missing the 30-day notice deadline can be fatal to criminal prosecution.',
      },
      {
        stageNumber: 3,
        title: 'Step 3: 15-Day Statutory Cure Period for Drawer',
        description: 'The drawer has 15 days from receipt of notice to make payment. The offence is complete only if payment is not made within these 15 days.',
        typicalFiling: 'Postal Tracking Delivery Confirmation Report',
        timeframe: '15 calendar days from date of notice delivery',
      },
      {
        stageNumber: 4,
        title: 'Step 4: Filing Complaint Before Judicial Magistrate / MM',
        description: 'File criminal complaint under Section 138 within 30 days from expiry of the 15-day cure window.',
        typicalFiling: 'Criminal Complaint + Pre-Summoning Evidence Affidavit',
        timeframe: 'Strict 30 days limitation to file complaint',
      },
      {
        stageNumber: 5,
        title: 'Step 5: Cognizance, Summons & Trial',
        description: 'Magistrate takes cognizance, issues summons/warrants. Notice of accusation framed. Opportunity for compounding/mediation offered.',
        typicalFiling: 'Summons / Bail Application / Defense Evidence',
        timeframe: 'Summary trial procedure (interim compensation up to 20% under Section 143A)',
      },
    ],
  },
  {
    id: 'civil-recovery-suit',
    title: 'Civil Suit for Money Recovery / Breach of Contract',
    category: 'Civil Litigation',
    statutoryBasis: 'Code of Civil Procedure, 1908 & Commercial Courts Act, 2015',
    limitationNote: 'General limitation: 3 years from the date debt or breach occurred (Limitation Act, 1963).',
    stages: [
      {
        stageNumber: 1,
        title: 'Step 1: Legal Notice & Mandatory Pre-Institution Mediation',
        description: 'For commercial disputes not contemplating urgent interim relief, Section 12A requires approaching Legal Services Authority for mediation.',
        typicalFiling: 'Section 12A Mediation Application / Non-Starter Report',
        timeframe: '3 months for mediation completion',
      },
      {
        stageNumber: 2,
        title: 'Step 2: Filing Plaint & Payment of Ad-Valorem Court Fees',
        description: 'Drafting Plaint detailing facts, jurisdiction, cause of action, and court fee valuation. Filing in Court Registry.',
        typicalFiling: 'Plaint + Statement of Truth + List of Documents',
        timeframe: 'Within 3-year limitation window',
      },
      {
        stageNumber: 3,
        title: 'Step 3: Service of Summons & Written Statement',
        description: 'Court issues summons to defendant. Defendant must file Written Statement within 30 days (maximum 120 days for commercial disputes).',
        typicalFiling: 'Written Statement + Affidavit of Admission/Denial',
        timeframe: '30 to 120 days strict deadline',
      },
      {
        stageNumber: 4,
        title: 'Step 4: Framing of Issues & Trial (Evidence)',
        description: 'Judge frames legal points of dispute (Issues). Plaintiff leads evidence, followed by cross-examination and defendant evidence.',
        typicalFiling: 'Affidavit in Examination-in-Chief + Cross-examination',
        timeframe: 'Varies with court schedule and witness availability',
      },
      {
        stageNumber: 5,
        title: 'Step 5: Final Judgment & Execution of Decree',
        description: 'Court delivers judgment and decree. Plaintiff files Execution Petition (Order XXI CPC) to attach bank accounts or property if decree unpaid.',
        typicalFiling: 'Certified Decree + Execution Petition (Order XXI)',
        timeframe: 'Execution limitation is 12 years from decree',
      },
    ],
  },
];

export const ProceduralRoadmapView: React.FC<ProceduralRoadmapViewProps> = ({
  jurisdiction,
  language,
}) => {
  const [selectedFlowId, setSelectedFlowId] = useState(PRELOADED_FLOWS[0].id);
  const [customIssue, setCustomIssue] = useState('');
  const [customRoadmap, setCustomRoadmap] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentFlow = PRELOADED_FLOWS.find((f) => f.id === selectedFlowId) || PRELOADED_FLOWS[0];

  const handleGenerateCustomRoadmap = async () => {
    if (!customIssue.trim() || loading) return;

    setLoading(true);
    setCustomRoadmap(null);

    try {
      const res = await fetch('/api/legal/procedure-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureType: 'Custom Litigation Pathway',
          jurisdiction,
          disputeSummary: customIssue,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate roadmap');

      setCustomRoadmap(data.roadmapText);
    } catch (err: any) {
      setCustomRoadmap(`Error: ${err?.message || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner with No False Certainty Principle */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-800" />
            Litigation & Procedural Pathways
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Understand the statutory stages, filing prerequisites, and limitation windows for common dispute types. LegalEase never guarantees court rulings, duration, or outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-stone-600 text-[11px] bg-stone-50 border border-stone-200 px-3 py-2 rounded">
          <Clock className="w-4 h-4 text-amber-800 shrink-0" />
          <span>Statutory Limitation Rules Enforced</span>
        </div>
      </div>

      {/* Selector of Standard Procedures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRELOADED_FLOWS.map((flow) => {
          const isSelected = flow.id === selectedFlowId;
          return (
            <button
              key={flow.id}
              onClick={() => {
                setSelectedFlowId(flow.id);
                setCustomRoadmap(null);
              }}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  {flow.category}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-800"></span>}
              </div>
              <h3 className="font-bold text-xs text-stone-900 leading-snug">{flow.title}</h3>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{flow.statutoryBasis}</p>
            </button>
          );
        })}
      </div>

      {/* Flow Details & Stage Timeline */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-stone-900">{currentFlow.title}</h3>
            <span className="text-xs text-stone-500">{currentFlow.statutoryBasis}</span>
          </div>

          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-950 font-medium">
            <span className="font-semibold">Limitation Period: </span>
            {currentFlow.limitationNote}
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
          {currentFlow.stages.map((stg) => (
            <div key={stg.stageNumber} className="relative flex items-start gap-4 text-xs">
              <div className="w-7 h-7 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shrink-0 text-xs font-bold border-2 border-white shadow-xs z-10">
                {stg.stageNumber}
              </div>

              <div className="flex-1 bg-stone-50/80 border border-stone-200 rounded-lg p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-xs text-stone-900">{stg.title}</h4>
                  <span className="text-[10px] text-amber-900 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
                    {stg.timeframe}
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed text-xs">{stg.description}</p>

                <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-3.5 h-3.5 text-stone-400" />
                    <span>Typical Filing: {stg.typicalFiling}</span>
                  </div>

                  {stg.warningNote && (
                    <div className="flex items-center gap-1 text-red-700 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{stg.warningNote}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 8 Caveats Box */}
        <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-lg text-xs text-stone-700 space-y-1.5">
          <div className="font-bold text-stone-900 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-800" />
            <span>Essential Litigation Boundaries (Section 8 Standard):</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            LegalEase outlines standard statutory milestones. Actual litigation duration varies significantly by judicial roster, interlocutory applications, and adjournments. Never attempt to file contested civil suits or criminal complaints without representation by a qualified enrolled advocate.
          </p>
        </div>
      </div>

      {/* Custom Procedure Roadmap Generator */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
          Inquire About a Specific Dispute Procedure:
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customIssue}
            onChange={(e) => setCustomIssue(e.target.value)}
            placeholder="e.g. 'Filing an RTI first appeal in Tamil Nadu' or 'Evicting a commercial tenant for non-payment in California'..."
            className="flex-1 p-2.5 rounded border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
          <button
            onClick={handleGenerateCustomRoadmap}
            disabled={!customIssue.trim() || loading}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded font-medium text-xs transition-colors cursor-pointer shrink-0"
          >
            {loading ? 'Mapping...' : 'Generate Roadmap'}
          </button>
        </div>

        {customRoadmap && (
          <div className="p-4 bg-stone-50 border border-stone-200 rounded text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap mt-3">
            {customRoadmap}
          </div>
        )}
      </div>
    </div>
  );
};
