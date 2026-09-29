import React, { useState } from 'react';
import {
  Scale,
  MessageSquare,
  FileSearch,
  FileEdit,
  BookOpen,
  GitBranch,
  ShieldAlert,
  Printer,
} from 'lucide-react';
import { JurisdictionState, SupportedLanguage } from './types/legal';
import { JURISDICTIONS } from './data/jurisdictions';
import { JurisdictionBar } from './components/JurisdictionBar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { RedactionModal } from './components/RedactionModal';
import { LawyerBriefModal } from './components/LawyerBriefModal';
import { AssistantView } from './components/AssistantView';
import { DocumentAnalyzerView } from './components/DocumentAnalyzerView';
import { DocumentDrafterView } from './components/DocumentDrafterView';
import { SimplifierGlossaryView } from './components/SimplifierGlossaryView';
import { ProceduralRoadmapView } from './components/ProceduralRoadmapView';
import { EmergencyHubView } from './components/EmergencyHubView';

export default function App() {
  // Navigation mode
  const [currentTab, setCurrentTab] = useState<
    'ask' | 'analyze' | 'draft' | 'simplify' | 'procedure' | 'emergency'
  >('ask');

  // Active Jurisdiction state (defaulting to India Central/TN as requested in prompt)
  const [jurisdiction, setJurisdiction] = useState<JurisdictionState>({
    country: 'India',
    region: 'Central Laws (All India)',
    courtLevel: 'District & Sessions Court',
  });

  // Language preference
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Modals
  const [isRedactorOpen, setIsRedactorOpen] = useState(false);
  const [isLawyerBriefOpen, setIsLawyerBriefOpen] = useState(false);
  const [briefDetails, setBriefDetails] = useState({
    topic: 'General Case Assessment',
    summary: '',
    questions: [] as string[],
    docs: [] as string[],
  });

  const handleOpenLawyerBrief = (
    topic: string,
    summary: string,
    questions: string[],
    docs: string[]
  ) => {
    setBriefDetails({ topic, summary, questions, docs });
    setIsLawyerBriefOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* 1. Topmost Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 2. Brand & Main Navigation Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-serif font-bold tracking-tight text-stone-950">
                  LegalEase
                </span>
                <span className="text-[11px] text-stone-400 font-sans">·</span>
                <span className="text-[11px] text-stone-500 font-sans tracking-wide">
                  Master Legal Intelligence Platform
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Clear plain-language legal guidance, document analysis & procedural pathways
              </p>
            </div>
          </div>

          {/* Navigation Segmented Tabs */}
          <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 overflow-x-auto text-xs">
            <button
              onClick={() => setCurrentTab('ask')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentTab === 'ask'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
              <span>Legal Assistant</span>
            </button>

            <button
              onClick={() => setCurrentTab('analyze')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentTab === 'analyze'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-amber-800" />
              <span>Document Analyzer</span>
            </button>

            <button
              onClick={() => setCurrentTab('draft')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentTab === 'draft'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-800" />
              <span>Document Drafter</span>
            </button>

            <button
              onClick={() => setCurrentTab('simplify')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentTab === 'simplify'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>Simplifier & Glossary</span>
            </button>

            <button
              onClick={() => setCurrentTab('procedure')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentTab === 'procedure'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-800" />
              <span>Litigation Roadmaps</span>
            </button>

            <button
              onClick={() => setCurrentTab('emergency')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentTab === 'emergency'
                  ? 'bg-red-50 text-red-900 border border-red-200'
                  : 'text-red-700 hover:text-red-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Emergency Aid</span>
            </button>
          </nav>
        </div>
      </header>

      {/* 3. Global Jurisdiction Bar (Country, State/Province, Court Level, Language & Redactor) */}
      <JurisdictionBar
        jurisdiction={jurisdiction}
        onJurisdictionChange={setJurisdiction}
        language={language}
        onLanguageChange={setLanguage}
        onOpenPrivacyRedactor={() => setIsRedactorOpen(true)}
      />

      {/* 4. Active Tab Content View */}
      <main className="flex-1">
        {currentTab === 'ask' && (
          <AssistantView
            jurisdiction={jurisdiction}
            language={language}
            onOpenLawyerBrief={handleOpenLawyerBrief}
            onOpenPrivacyRedactor={() => setIsRedactorOpen(true)}
          />
        )}

        {currentTab === 'analyze' && (
          <DocumentAnalyzerView
            jurisdiction={jurisdiction}
            language={language}
            onOpenPrivacyRedactor={() => setIsRedactorOpen(true)}
            onOpenLawyerBrief={handleOpenLawyerBrief}
          />
        )}

        {currentTab === 'draft' && (
          <DocumentDrafterView
            jurisdiction={jurisdiction}
            language={language}
            onOpenPrivacyRedactor={() => setIsRedactorOpen(true)}
          />
        )}

        {currentTab === 'simplify' && (
          <SimplifierGlossaryView
            jurisdiction={jurisdiction}
            language={language}
          />
        )}

        {currentTab === 'procedure' && (
          <ProceduralRoadmapView
            jurisdiction={jurisdiction}
            language={language}
          />
        )}

        {currentTab === 'emergency' && (
          <EmergencyHubView jurisdiction={jurisdiction} />
        )}
      </main>

      {/* 5. Modals */}
      <RedactionModal
        isOpen={isRedactorOpen}
        onClose={() => setIsRedactorOpen(false)}
      />

      <LawyerBriefModal
        isOpen={isLawyerBriefOpen}
        onClose={() => setIsLawyerBriefOpen(false)}
        jurisdiction={jurisdiction}
        caseTopic={briefDetails.topic}
        factsSummary={briefDetails.summary}
        questionsForLawyer={briefDetails.questions}
        documentsToBring={briefDetails.docs}
      />
    </div>
  );
}
