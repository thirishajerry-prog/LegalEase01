import React from 'react';
import { ShieldAlert, Phone, ExternalLink, AlertOctagon, Scale, ShieldCheck } from 'lucide-react';
import { EMERGENCY_RESOURCES, ARREST_AND_CUSTODY_RIGHTS } from '../data/emergencyContacts';
import { JurisdictionState } from '../types/legal';

interface EmergencyHubViewProps {
  jurisdiction: JurisdictionState;
}

export const EmergencyHubView: React.FC<EmergencyHubViewProps> = ({ jurisdiction }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* High-Alert Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-red-100 flex items-center justify-center shrink-0 text-red-700 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-red-950 uppercase tracking-wide">
              Immediate Safety & High-Risk Legal Shield (Section 16 Protocol)
            </h2>
            <p className="text-xs text-red-800 mt-1 max-w-3xl leading-relaxed">
              If you or someone else is in immediate physical danger, facing unlawful detention, domestic violence, or an imminent court limitation deadline, prioritize immediate safety and contact designated authorities or free legal aid authorities below.
            </p>
          </div>
        </div>

        <div className="shrink-0 text-xs font-bold text-red-900 bg-white/80 border border-red-200 px-3 py-2 rounded">
          Emergency Services: Dial 112 (India/EU) · 911 (US) · 999 (UK)
        </div>
      </div>

      {/* Free Legal Aid & Hotlines Directory */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-2">
          <Phone className="w-4 h-4 text-amber-800" />
          Government & Statutory Legal Aid Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_RESOURCES.map((res, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-xs text-stone-900">{res.title}</h4>
                  <span className="text-[10px] text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                    {res.category}
                  </span>
                </div>

                <span className="text-[11px] text-stone-400 block mb-2">{res.jurisdiction}</span>

                <p className="text-xs text-stone-700 leading-relaxed">{res.description}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-amber-950 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-800" />
                  {res.phone}
                </span>

                <span className="text-stone-500 font-normal text-[11px]">{res.portalOrEmail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fundamental Arrest & Custody Rights (D.K. Basu Guidelines) */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-800" />
            Fundamental Rights on Arrest & Detention (Supreme Court D.K. Basu Guidelines)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Key constitutional protections under Article 21, 22 of the Constitution and criminal procedure codes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARREST_AND_CUSTODY_RIGHTS.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg space-y-1.5 text-xs">
              <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                {item.rule}
              </span>
              <p className="text-stone-700 leading-relaxed text-[11px]">{item.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Limitation Caveat */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-stone-800 space-y-1">
        <span className="font-bold text-amber-950 block">Urgent Limitation Alert:</span>
        <p className="text-[11px] text-stone-700 leading-relaxed">
          Statutory limitation periods (statutes of limitations) extinguish your legal remedy permanently once they expire. For example, Section 138 NI Act notices have a strict 30-day window, Consumer complaints have 2 years, and money suits have 3 years. If your deadline is approaching, immediately consult a qualified lawyer to prepare an emergency filing or caveat.
        </p>
      </div>
    </div>
  );
};
