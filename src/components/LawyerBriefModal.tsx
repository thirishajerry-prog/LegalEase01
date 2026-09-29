import React, { useRef } from 'react';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';
import { JurisdictionState } from '../types/legal';

interface LawyerBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  jurisdiction: JurisdictionState;
  caseTopic: string;
  factsSummary: string;
  questionsForLawyer: string[];
  documentsToBring: string[];
  applicableLawsMentioned?: string[];
}

export const LawyerBriefModal: React.FC<LawyerBriefModalProps> = ({
  isOpen,
  onClose,
  jurisdiction,
  caseTopic,
  factsSummary,
  questionsForLawyer,
  documentsToBring,
  applicableLawsMentioned = [],
}) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getBriefText = () => {
    return `LEGAL CONSULTATION BRIEFING SHEET
Prepared via LegalEase Assistant for Advocate Consultation

DATE: ${new Date().toLocaleDateString()}
JURISDICTION: ${jurisdiction.country} · ${jurisdiction.region} (${jurisdiction.courtLevel})
MATTER: ${caseTopic || 'Legal Inquiry'}

1. SUMMARY OF KNOWN FACTS:
${factsSummary || 'No summary facts specified yet.'}

2. STATUTES & PRINCIPLES IDENTIFIED:
${applicableLawsMentioned.length > 0 ? applicableLawsMentioned.map((l) => `- ${l}`).join('\n') : '- General governing law / civil principles'}

3. QUESTIONS TO DISCUSS WITH ADVOCATE / COUNSEL:
${questionsForLawyer.length > 0 ? questionsForLawyer.map((q, idx) => `${idx + 1}. ${q}`).join('\n') : '1. What are the immediate limitation periods or statutory deadlines?\n2. What is the likelihood of pre-litigation settlement versus formal court filing?\n3. What are the estimated legal fees and court costs?'}

4. EVIDENCE & DOCUMENTS TO BRING TO CONSULTATION:
${documentsToBring.length > 0 ? documentsToBring.map((d) => `- ${d}`).join('\n') : '- Original contracts, invoices, email/WhatsApp correspondence, and proof of payment.'}

CONFIDENTIALITY & DISCLAIMER:
This document is prepared as a personal organizational aid for discussing with licensed counsel. It does not constitute formal legal advice.
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getBriefText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getBriefText()], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lawyer_Brief_${caseTopic.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20) || 'LegalEase'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-amber-900">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Lawyer Consultation Briefing Sheet</h2>
              <p className="text-[11px] text-stone-500">Structured 1-page summary to bring to your advocate consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Sheet Content */}
        <div ref={printRef} className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800 leading-relaxed font-serif">
          {/* Header on Sheet */}
          <div className="border-b-2 border-stone-900 pb-3 flex justify-between items-start">
            <div>
              <h1 className="text-base font-bold uppercase tracking-wider text-stone-900 font-sans">
                Lawyer Consultation Briefing Sheet
              </h1>
              <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                Prepared by client for preliminary consultation · Privileged & Confidential
              </p>
            </div>
            <div className="text-right text-[11px] font-sans text-stone-600">
              <span className="font-semibold">{jurisdiction.country}</span> · {jurisdiction.region}
              <div className="text-[10px] text-stone-500">{jurisdiction.courtLevel}</div>
            </div>
          </div>

          {/* Matter & Date */}
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-stone-200 font-sans text-[11px]">
            <div>
              <span className="text-stone-500 block">Matter / Subject:</span>
              <span className="font-semibold text-stone-900">{caseTopic || 'General Legal Consultation'}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Date of Preparation:</span>
              <span className="font-semibold text-stone-900">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>

          {/* 1. Summary of Facts */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-stone-100 border border-stone-300 inline-flex items-center justify-center text-[10px]">1</span>
              Summary of Known Facts
            </h3>
            <div className="p-3 bg-stone-50 rounded border border-stone-200 font-sans text-stone-700 whitespace-pre-wrap text-[11px]">
              {factsSummary || 'User query and discussion facts as structured in LegalEase conversation.'}
            </div>
          </div>

          {/* 2. Key Questions for Advocate */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-stone-100 border border-stone-300 inline-flex items-center justify-center text-[10px]">2</span>
              Key Questions to Ask Counsel
            </h3>
            <ul className="space-y-1.5 font-sans pl-2">
              {(questionsForLawyer.length > 0 ? questionsForLawyer : [
                'What is the statutory limitation period (time limit) to file in this matter?',
                'Is issuing a formal pre-litigation Legal Notice mandatory before approaching court?',
                'What are the chances of dispute resolution through pre-institution mediation?',
                'What are the expected legal fees, court fee stamps, and realistic litigation timeline?',
              ]).map((q, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-stone-800">
                  <span className="font-semibold text-amber-900">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Documents to Bring */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-stone-100 border border-stone-300 inline-flex items-center justify-center text-[10px]">3</span>
              Documents & Evidence to Bring
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-sans">
              {(documentsToBring.length > 0 ? documentsToBring : [
                'Original signed agreements or contracts',
                'Bank account statements / payment receipts',
                'Email trails and formal written notices',
                'Photographic / video proof or technical reports',
              ]).map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded text-[11px]">
                  <input type="checkbox" className="rounded text-amber-800 focus:ring-amber-800" />
                  <span className="truncate">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lawyer Notes Box */}
          <div className="pt-2 border-t border-dashed border-stone-300 font-sans">
            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block mb-2">
              Advocate’s Notes & Action Items (For consultation use):
            </span>
            <div className="h-20 border border-stone-200 rounded bg-stone-50/40 p-2"></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs no-print">
          <span className="text-[11px] text-stone-500">Ready to print or save for your meeting</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded hover:bg-stone-100 text-stone-800 font-medium transition-colors cursor-pointer text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded hover:bg-stone-100 text-stone-800 font-medium transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium transition-colors cursor-pointer text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
