import React, { useState } from 'react';
import { X, ShieldAlert, Check, Copy, ArrowRight } from 'lucide-react';
import { sanitizeSensitiveLegalData, RedactionResult } from '../utils/redactor';

interface RedactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToInput?: (sanitizedText: string) => void;
}

export const RedactionModal: React.FC<RedactionModalProps> = ({
  isOpen,
  onClose,
  onApplyToInput,
}) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<RedactionResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSanitize = () => {
    if (!inputText.trim()) return;
    const res = sanitizeSensitiveLegalData(inputText);
    setResult(res);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.sanitizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (result && onApplyToInput) {
      onApplyToInput(result.sanitizedText);
      onClose();
    }
  };

  const loadSampleWithPii = () => {
    setInputText(`LEASE AGREEMENT DISPUTE
Tenant: Rajesh Kumar, Aadhaar No: 4829 1928 3847, PAN: ABCDE1234F
Phone: +91 98401 23456, Email: rajesh.kumar98@example.com
Landlord: Suresh Sharma, Account: 50100293847291
Issue: Landlord refuses to return security deposit of ₹85,000 for flat at Koramangala, Bengaluru.`);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Client-Side Privacy & PII Redactor</h2>
              <p className="text-[11px] text-stone-500">Safely mask personal IDs, phone numbers, and financial details before analysis.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-stone-700">Paste your raw text or contract excerpt:</label>
            <button
              onClick={loadSampleWithPii}
              className="text-stone-500 hover:text-stone-900 underline underline-offset-2 text-[11px] cursor-pointer"
            >
              Load Sample Text with PII
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setResult(null);
            }}
            placeholder="Paste contract text, notice, email, or factual description here..."
            className="w-full h-32 p-3 rounded border border-stone-200 bg-stone-50/50 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white resize-none"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleSanitize}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Scan & Redact Sensitive Data</span>
            </button>

            {result && (
              <div className="flex items-center gap-3 text-stone-600 text-[11px]">
                <span>Emails: {result.redactionsCount.emails}</span>
                <span>·</span>
                <span>Phones: {result.redactionsCount.phones}</span>
                <span>·</span>
                <span>Aadhaar/SSN: {result.redactionsCount.aadhaarOrSSN}</span>
                <span>·</span>
                <span>PAN/Cards: {result.redactionsCount.panCards + result.redactionsCount.financialNumbers}</span>
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Sanitized Output ({result.totalCount} sensitive items masked)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors cursor-pointer text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  {onApplyToInput && (
                    <button
                      onClick={handleApply}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-amber-800 hover:bg-amber-900 text-white font-medium transition-colors cursor-pointer text-[11px]"
                    >
                      <span>Insert Sanitized Text</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded font-mono text-[11px] text-stone-800 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {result.sanitizedText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-[11px] text-stone-500">
          <span>Processing occurs entirely inside your local browser. No unredacted data is transmitted.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-stone-200 rounded hover:bg-stone-100 text-stone-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
