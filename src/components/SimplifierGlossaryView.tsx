import React, { useState } from 'react';
import { BookOpen, Sparkles, Search, ArrowRight, Check, Copy } from 'lucide-react';
import { JurisdictionState, SupportedLanguage } from '../types/legal';
import { LEGAL_GLOSSARY } from '../data/glossary';

interface SimplifierGlossaryViewProps {
  jurisdiction: JurisdictionState;
  language: SupportedLanguage;
}

const SAMPLE_LEGALESE = [
  {
    title: 'Convoluted Indemnity & Defense Clause',
    text: 'The Consultant shall indemnify, defend, and hold harmless the Client and its officers, directors, and employees against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys’ fees) arising out of or resulting from any negligent act, omission, willful misconduct, or breach of representation by the Consultant, regardless of whether caused in part by a party indemnified hereunder.',
  },
  {
    title: 'Aggressive Limitation of Liability & Consequential Damages Waiver',
    text: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, REVENUE, DATA, OR USE), EVEN IF ADVISED OF THE POSSIBILITY THEREOF. VENDOR’S TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY CUSTOMER IN THE PRECEDING ONE (1) MONTH.',
  },
  {
    title: 'Force Majeure & Frustration Clause',
    text: 'Neither party shall be in default or liable for delay in performance if such delay is caused by acts of God, flood, war, strikes, cyber attacks, governmental embargo, pandemic, or other events beyond reasonable control; provided, however, that payment obligations for accrued deliverables shall not be suspended thereby.',
  },
];

export const SimplifierGlossaryView: React.FC<SimplifierGlossaryViewProps> = ({
  jurisdiction,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'simplifier' | 'glossary'>('simplifier');

  // Simplifier State
  const [legaleseInput, setLegaleseInput] = useState('');
  const [simplifiedOutput, setSimplifiedOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Glossary State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Contract Law', 'Litigation & Courts', 'Criminal & Police', 'Consumer & Property'];

  const filteredGlossary = LEGAL_GLOSSARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plainMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.example.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSimplify = async () => {
    if (!legaleseInput.trim() || loading) return;

    setLoading(true);
    setSimplifiedOutput(null);

    try {
      const res = await fetch('/api/legal/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legaleseText: legaleseInput,
          jurisdiction,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to simplify legal clause');
      }

      setSimplifiedOutput(data.simplifiedText);
    } catch (err: any) {
      setSimplifiedOutput(`Simplification error: ${err?.message || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (simplifiedOutput) {
      navigator.clipboard.writeText(simplifiedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            Plain-Language Legal Hub
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Translate confusing legal jargon into clear language or explore standard concepts with everyday examples.
          </p>
        </div>

        {/* Clean Segmented Tab Control */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab('simplifier')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'simplifier'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Legalese Simplifier
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Legal Concepts & Glossary
          </button>
        </div>
      </div>

      {/* VIEW 1: Legalese Simplifier */}
      {activeTab === 'simplifier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
              <label className="text-xs font-semibold text-stone-800 block">
                Paste any confusing clause or contract sentence:
              </label>
              <textarea
                value={legaleseInput}
                onChange={(e) => setLegaleseInput(e.target.value)}
                rows={9}
                className="w-full p-3 rounded border border-stone-200 bg-stone-50/50 font-mono text-[11px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white resize-none"
                placeholder="Paste confusing clause text here (e.g. indemnity, liability cap, arbitration clause, without prejudice statement)..."
              />

              <button
                onClick={handleSimplify}
                disabled={!legaleseInput.trim() || loading}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Translating to plain language...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Explain in Plain Language</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Clauses */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Or Try These Common Jargon Clauses:
              </span>
              {SAMPLE_LEGALESE.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLegaleseInput(sample.text);
                    setSimplifiedOutput(null);
                  }}
                  className="w-full text-left p-2.5 rounded bg-white hover:bg-stone-100 border border-stone-200 text-xs transition-colors cursor-pointer"
                >
                  <span className="font-medium text-stone-800 block">{sample.title}</span>
                  <span className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{sample.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Output (7 cols) */}
          <div className="lg:col-span-7">
            {!simplifiedOutput && !loading && (
              <div className="h-full min-h-[400px] bg-white border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center p-8 text-center text-stone-400">
                <Sparkles className="w-10 h-10 text-stone-300 mb-3" />
                <h3 className="text-sm font-semibold text-stone-700">Plain Translation Appears Here</h3>
                <p className="text-xs text-stone-500 max-w-md mt-1">
                  LegalEase strips away convoluted syntax and gives you the plain meaning, a real-life analogy, and the practical financial or liability impact.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[400px] bg-white border border-stone-200 rounded-lg flex flex-col items-center justify-center p-8 text-center text-stone-500 space-y-3">
                <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
                <h3 className="text-sm font-semibold text-stone-800">Translating Legalese...</h3>
                <p className="text-xs text-stone-500 max-w-md">
                  Formulating plain-language explanations, real-world examples, and defined terms.
                </p>
              </div>
            )}

            {simplifiedOutput && !loading && (
              <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4 text-xs text-stone-800">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <span className="font-bold text-sm text-stone-900">Plain-Language Translation</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors cursor-pointer text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-3 text-stone-700 leading-relaxed font-sans">
                  {simplifiedOutput.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ') || paragraph.startsWith('## ')) {
                      return (
                        <h4 key={idx} className="font-bold text-xs uppercase tracking-wider text-stone-900 mt-3 pt-2 border-t first:border-t-0 first:mt-0">
                          {paragraph.replace(/^#+\s*/, '')}
                        </h4>
                      );
                    }
                    if (paragraph.match(/^\d+\./)) {
                      return (
                        <div key={idx} className="p-3 bg-stone-50 rounded border border-stone-200/70 text-xs">
                          {paragraph}
                        </div>
                      );
                    }
                    return <p key={idx}>{paragraph}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Legal Concepts Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search legal term (e.g. indemnity, caveat)..."
                className="w-full pl-9 pr-3 py-2 rounded border border-stone-200 bg-stone-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white"
              />
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-100 text-stone-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Glossary Term Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs hover:border-amber-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-stone-900">{item.term}</h3>
                    <span className="text-[10px] text-stone-400 font-medium">{item.category}</span>
                  </div>

                  {item.phonetic && (
                    <span className="text-[10px] font-mono text-stone-400 block mb-2">/{item.phonetic}/</span>
                  )}

                  <p className="text-xs text-stone-700 leading-relaxed mb-3">
                    {item.plainMeaning}
                  </p>
                </div>

                <div className="p-2.5 bg-amber-50/60 rounded border border-amber-200/50 text-[11px] text-stone-700">
                  <span className="font-semibold text-amber-950 block mb-0.5">Everyday Example:</span>
                  <span>{item.example}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <div className="p-8 text-center bg-white border border-stone-200 rounded-lg text-xs text-stone-500">
              No matching terms found for "{searchTerm}". Try searching for terms like "Indemnity", "Injunction", or "Limitation".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
