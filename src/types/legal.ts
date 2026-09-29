export type SupportedCountry = 'India' | 'United States' | 'United Kingdom' | 'Canada' | 'Australia' | 'General Common Law';

export interface JurisdictionState {
  country: SupportedCountry;
  region: string;
  courtLevel: string;
}

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'es';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  jurisdiction?: JurisdictionState;
}

export interface DocumentParty {
  name: string;
  role: string;
  keyObligations: string[];
}

export interface CriticalDeadline {
  eventOrClause: string;
  timeframe: string;
  urgency: 'High' | 'Medium' | 'Low' | string;
  consequence: string;
}

export interface ClauseBreakdown {
  clauseTitle: string;
  originalSnippetGist?: string;
  plainLanguageExplanation: string;
  riskAssessment: 'Low' | 'Balanced' | 'Attention Required' | string;
  practicalImpact: string;
}

export interface DocumentAnalysisResult {
  summary: string;
  documentType: string;
  governingJurisdiction: string;
  parties: DocumentParty[];
  criticalDeadlines: CriticalDeadline[];
  clauseBreakdown: ClauseBreakdown[];
  ambiguousOrUnusualProvisions: string[];
  questionsForLawyer: string[];
  redactionNotice?: string;
}

export interface LegalGlossaryTerm {
  term: string;
  phonetic?: string;
  plainMeaning: string;
  example: string;
  category: 'Contract Law' | 'Litigation & Courts' | 'Criminal & Police' | 'Consumer & Property' | 'Corporate & Employment';
}

export interface LegalTemplateConfig {
  id: string;
  title: string;
  jurisdictionCategory: string;
  description: string;
  statutoryBasis: string;
  defaultFactsPlaceholder: string;
  keyTermsPlaceholder: string;
}
