import React, { useState } from 'react';
import { FileEdit, ShieldAlert, Copy, Check, Download, Printer, AlertCircle, FileCheck } from 'lucide-react';
import { JurisdictionState, SupportedLanguage } from '../types/legal';
import { LEGAL_TEMPLATES } from '../data/templates';

interface DocumentDrafterViewProps {
  jurisdiction: JurisdictionState;
  language: SupportedLanguage;
  onOpenPrivacyRedactor: () => void;
}

export const DocumentDrafterView: React.FC<DocumentDrafterViewProps> = ({
  jurisdiction,
  language,
  onOpenPrivacyRedactor,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(LEGAL_TEMPLATES[0].id);
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [opposingName, setOpposingName] = useState('');
  const [opposingAddress, setOpposingAddress] = useState('');
  const [facts, setFacts] = useState(LEGAL_TEMPLATES[0].defaultFactsPlaceholder);
  const [keyTerms, setKeyTerms] = useState(LEGAL_TEMPLATES[0].keyTermsPlaceholder);

  const [loading, setLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentTemplate = LEGAL_TEMPLATES.find((t) => t.id === selectedTemplateId) || LEGAL_TEMPLATES[0];

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = LEGAL_TEMPLATES.find((t) => t.id === id);
    if (tmpl) {
      setFacts(tmpl.defaultFactsPlaceholder);
      setKeyTerms(tmpl.keyTermsPlaceholder);
      setDraftResult(null);
    }
  };

  const handleGenerateDraft = async () => {
    if (!facts.trim() || loading) return;

    setLoading(true);
    setDraftResult(null);

    try {
      const res = await fetch('/api/legal/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: currentTemplate.title,
          jurisdiction,
          userParty: { name: userName || '[Sender Name]', address: userAddress || '[Sender Address]' },
          opposingParty: { name: opposingName || '[Recipient Name]', address: opposingAddress || '[Recipient Address]' },
          facts,
          keyTerms,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate legal draft');
      }

      setDraftResult(data.draftText);
    } catch (err: any) {
      setDraftResult(`Error generating draft: ${err?.message || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (draftResult) {
      navigator.clipboard.writeText(draftResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!draftResult) return;
    const blob = new Blob([draftResult], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTemplate.id}_Draft.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-amber-800" />
            Verified Legal Document Drafter
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Generate formal, non-deceptive legal notices, consumer claims, and letters. Every draft preserves explicit bracketed placeholders like <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900 font-mono">[Date]</code> and includes a mandatory pre-service verification checklist.
          </p>
        </div>

        <button
          onClick={onOpenPrivacyRedactor}
          className="self-start md:self-center shrink-0 flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-emerald-700" />
          <span>Privacy Redactor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4 text-xs">
            {/* 1. Select Template */}
            <div>
              <label className="font-semibold text-stone-800 block mb-1.5">1. Select Document Template:</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full p-2.5 rounded border border-stone-300 bg-white font-medium text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              >
                {LEGAL_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.title} ({tmpl.jurisdictionCategory})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                <span className="font-semibold text-stone-700">Statutory Basis: </span>
                {currentTemplate.statutoryBasis}
              </p>
            </div>

            {/* 2. Parties */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="font-semibold text-stone-800 block">2. Party Information (Or leave placeholders):</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name (Sender)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="p-2 rounded border border-stone-200 bg-stone-50/50 text-[11px] focus:outline-none focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Your City / Address"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="p-2 rounded border border-stone-200 bg-stone-50/50 text-[11px] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Opposing Party / Company"
                  value={opposingName}
                  onChange={(e) => setOpposingName(e.target.value)}
                  className="p-2 rounded border border-stone-200 bg-stone-50/50 text-[11px] focus:outline-none focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Their City / Branch Address"
                  value={opposingAddress}
                  onChange={(e) => setOpposingAddress(e.target.value)}
                  className="p-2 rounded border border-stone-200 bg-stone-50/50 text-[11px] focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* 3. Facts Description */}
            <div className="pt-2 border-t border-stone-100 space-y-1.5">
              <label className="font-semibold text-stone-800 block">3. Statement of Facts & Timeline:</label>
              <textarea
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                rows={5}
                className="w-full p-2.5 rounded border border-stone-200 bg-stone-50/50 text-[11px] font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white resize-none"
                placeholder="Detail the chronology: dates, transaction numbers, amounts, failure of delivery or response..."
              />
            </div>

            {/* 4. Demand / Specific Terms */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-800 block">4. Demand / Terms / Cure Period:</label>
              <textarea
                value={keyTerms}
                onChange={(e) => setKeyTerms(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded border border-stone-200 bg-stone-50/50 text-[11px] font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white resize-none"
                placeholder="Specific remedy requested (e.g. refund within 15 days, replacement, or cessation of infringement)..."
              />
            </div>

            {/* Generate Action */}
            <button
              onClick={handleGenerateDraft}
              disabled={!facts.trim() || loading}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Composing verified draft...</span>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Generate Verified Draft Template</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Draft Preview (7 cols) */}
        <div className="lg:col-span-7">
          {!draftResult && !loading && (
            <div className="h-full min-h-[460px] bg-white border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center p-8 text-center text-stone-400">
              <FileEdit className="w-10 h-10 text-stone-300 mb-3" />
              <h3 className="text-sm font-semibold text-stone-700">Draft Document Will Appear Here</h3>
              <p className="text-xs text-stone-500 max-w-md mt-1">
                Customize your party details and statement of facts on the left, then click Generate. The resulting draft will highlight all fields requiring your verification.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[460px] bg-white border border-stone-200 rounded-lg flex flex-col items-center justify-center p-8 text-center text-stone-500 space-y-3">
              <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-sm font-semibold text-stone-800">Drafting Legal Correspondence...</h3>
              <p className="text-xs text-stone-500 max-w-md">
                Injecting statutory citations under {currentTemplate.statutoryBasis} and structuring required verification points.
              </p>
            </div>
          )}

          {draftResult && !loading && (
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4 text-xs text-stone-800">
              {/* Draft Header & Action Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{currentTemplate.title}</h3>
                  <span className="text-[11px] text-stone-500">{jurisdiction.country} · {jurisdiction.region}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors cursor-pointer text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors cursor-pointer text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.md)</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium transition-colors cursor-pointer text-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded flex items-start gap-2 text-[11px] text-stone-700">
                <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-950 block">Pre-Service Verification Notice:</span>
                  Please carefully review all items enclosed in brackets <code className="bg-amber-100 text-amber-900 px-1 rounded">[ ... ]</code> to insert exact dates, amounts, and registered addresses before dispatching via Registered Post A.D. or Speed Post.
                </div>
              </div>

              {/* Draft Text Content */}
              <div className="p-4 bg-stone-50/60 border border-stone-200 rounded font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap text-stone-800">
                {draftResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
