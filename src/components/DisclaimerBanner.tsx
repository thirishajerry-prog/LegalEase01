import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-amber-50/80 border-b border-amber-200/80 text-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
          <p className="text-stone-800 font-medium">
            <span className="font-semibold text-amber-950">Legal Notice: </span>
            This information is for general legal information and does not create an attorney-client relationship. For advice about your specific circumstances, consider consulting a qualified lawyer in the relevant jurisdiction.
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-amber-900 hover:text-amber-950 underline underline-offset-2 cursor-pointer"
        >
          <span>{expanded ? 'Less' : 'Our Boundaries'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="bg-amber-100/60 border-t border-amber-200/60 px-4 sm:px-6 lg:px-8 py-3 text-[11px] text-stone-700 animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-semibold text-stone-900 block mb-1">Not a Law Firm or Attorney</span>
              <p>LegalEase is an educational and organizational tool. It does not provide legal representation, file court papers on your behalf, or represent you before tribunals or authorities.</p>
            </div>
            <div>
              <span className="font-semibold text-stone-900 block mb-1">No Guaranteed Outcomes</span>
              <p>Legal proceedings depend on disputed facts, witness credibility, and judicial discretion. LegalEase never guarantees court rulings, settlement values, or timelines.</p>
            </div>
            <div>
              <span className="font-semibold text-stone-900 block mb-1">Confidentiality & Privacy</span>
              <p>Always redact sensitive identification details (Aadhaar, SSN, bank accounts) before uploading documents. Use our built-in Redactor tool.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
