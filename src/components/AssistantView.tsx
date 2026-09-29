import React, { useState, useRef, useEffect } from 'react';
import { Send, Scale, Copy, Check, FileText, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage, JurisdictionState, SupportedLanguage } from '../types/legal';

interface AssistantViewProps {
  jurisdiction: JurisdictionState;
  language: SupportedLanguage;
  onOpenLawyerBrief: (topic: string, summary: string, questions: string[], docs: string[]) => void;
  onOpenPrivacyRedactor: () => void;
}

const SAMPLE_QUESTIONS = [
  {
    category: 'Tenancy',
    title: 'Landlord withholding rental deposit without bills',
    prompt: 'My landlord in Bengaluru is refusing to refund my security deposit of ₹75,000 after I vacated the flat on 1st of this month. They claim "repairs" but refuse to provide any receipts or inspection report. What are my legal rights and steps?',
  },
  {
    category: 'Consumer Rights',
    title: 'Defective laptop repair refused under warranty',
    prompt: 'I purchased a laptop 4 months ago which stopped booting. The authorized service center claims "internal liquid ingress" and rejected warranty without providing photo evidence or diagnostic log. How can I challenge this?',
  },
  {
    category: 'Financial / Cheque',
    title: 'Client cheque bounced due to insufficient funds',
    prompt: 'A business client gave me a cheque for ₹1,20,000 for consulting services, which was returned dishonoured by the bank marked "Funds Insufficient" yesterday. What is the statutory procedure under Section 138?',
  },
  {
    category: 'Employment',
    title: 'Employer withholding relieving letter & FnF salary',
    prompt: 'I served my complete 60 days notice period at an IT company, but HR is refusing to release my relieving letter and last month salary because I joined a competitor. Is this non-compete enforceable?',
  },
];

export const AssistantView: React.FC<AssistantViewProps> = ({
  jurisdiction,
  language,
  onOpenLawyerBrief,
  onOpenPrivacyRedactor,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to LegalEase

I am your legal information assistant. I explain legal concepts in plain language, help you understand rights and obligations, identify missing facts, and prepare you for discussions with qualified lawyers.

**Active Jurisdiction Context:** ${jurisdiction.country} · ${jurisdiction.region} (${jurisdiction.courtLevel})

Feel free to describe your situation, upload a clause, or choose one of the common legal scenarios below.`,
      timestamp: Date.now(),
      jurisdiction,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
      jurisdiction,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Build conversational payload
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/legal/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          jurisdiction,
          language,
          mode: 'structured_assessment',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve legal guidance');
      }

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        timestamp: Date.now(),
        jurisdiction,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `### LegalEase Communication Notice\n\nI encountered an issue processing your request: **${err?.message || 'Server connection error'}**.\n\nPlease check your query or verify your server configuration.`,
          timestamp: Date.now(),
          jurisdiction,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateLawyerBriefFromMessage = (content: string) => {
    // Parse out likely questions and documents from response structure
    const questionsMatch = content.match(/Questions? to Discuss[\s\S]*?(?=###|$)/i);
    const docsMatch = content.match(/Documents?\s*(?:\/|&)?\s*Evidence[\s\S]*?(?=###|$)/i);

    const questions = questionsMatch
      ? questionsMatch[0].split('\n').filter((l) => l.trim().startsWith('-') || l.trim().match(/^\d+\./)).map((l) => l.replace(/^[-*\d.]+\s*/, ''))
      : [
          'What are the statutory limitation periods applicable to this claim?',
          'What are the chances of settling this through pre-litigation mediation?',
          'What documents must be formally served before filing in court?',
        ];

    const docs = docsMatch
      ? docsMatch[0].split('\n').filter((l) => l.trim().startsWith('-') || l.trim().match(/^\d+\./)).map((l) => l.replace(/^[-*\d.]+\s*/, ''))
      : [
          'Original contracts / agreements',
          'Bank statement showing transaction records',
          'Notice communications and WhatsApp/Email logs',
        ];

    onOpenLawyerBrief(
      'Case Review & Assessment',
      content.slice(0, 500) + '...',
      questions.slice(0, 5),
      docs.slice(0, 5)
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-145px)] max-w-5xl mx-auto w-full px-4 sm:px-6 py-4">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded bg-stone-900 text-stone-100 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-lg p-4 border transition-shadow ${
                  isUser
                    ? 'bg-amber-900 text-white border-amber-950 font-sans shadow-xs'
                    : 'bg-white text-stone-800 border-stone-200/90 shadow-xs'
                }`}
              >
                {/* Meta details header for assistant messages */}
                {!isUser && msg.jurisdiction && (
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100 text-[11px] text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-stone-700">LegalEase Assessment</span>
                      <span>·</span>
                      <span>{msg.jurisdiction.country}</span>
                      <span>·</span>
                      <span className="truncate max-w-[130px]">{msg.jurisdiction.region}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Content body with markdown formatting support */}
                <div className="space-y-3 font-sans">
                  {msg.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      const heading = paragraph.replace('### ', '');
                      return (
                        <h4
                          key={idx}
                          className={`font-bold text-xs uppercase tracking-wider mt-3 pt-2 border-t first:border-t-0 first:mt-0 ${
                            isUser ? 'text-amber-100 border-amber-800' : 'text-stone-900 border-stone-100'
                          }`}
                        >
                          {heading}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={idx} className="space-y-1 pl-4 list-disc text-stone-700">
                          {items.map((item, itemIdx) => (
                            <li key={itemIdx} className="pl-1">
                              {item.replace(/^[-*]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className={isUser ? 'text-white' : 'text-stone-700'}>
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Assistant Action Bar: Lawyer Brief trigger */}
                {!isUser && msg.id !== 'welcome' && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-stone-400 italic">Not a substitute for professional counsel</span>
                    <button
                      onClick={() => handleCreateLawyerBriefFromMessage(msg.content)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-medium transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-800" />
                      <span>Create Lawyer Briefing Sheet</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded bg-amber-800 text-white flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs">
                  You
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-stone-500 py-2">
            <div className="w-8 h-8 rounded bg-stone-900 text-stone-100 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-xs">
              <span className="font-medium text-stone-800">Reviewing applicable statutes & precedents...</span>
              <span className="block text-[11px] text-stone-400 mt-0.5">
                Applying rules for {jurisdiction.country} ({jurisdiction.region})
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel if conversation is fresh */}
      {messages.length <= 2 && (
        <div className="mt-3 pt-3 border-t border-stone-200">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
            Frequently Explored Legal Situations:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_QUESTIONS.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sq.prompt)}
                className="text-left p-2.5 rounded bg-white hover:bg-stone-100/80 border border-stone-200 transition-colors text-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium mb-1">
                  <span>{sq.category}</span>
                  <span className="group-hover:text-amber-800 transition-colors">Ask →</span>
                </div>
                <div className="font-medium text-stone-800 line-clamp-1 group-hover:text-stone-950">
                  {sq.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="mt-3 pt-2 border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative rounded-lg border border-stone-300 bg-white shadow-xs focus-within:ring-2 focus-within:ring-amber-800 focus-within:border-transparent transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe your legal matter, notice, contract clause, or rights inquiry (e.g. 'Can my landlord deduct painting costs from deposit without notice?')..."
            rows={2}
            className="w-full p-3 pr-24 text-xs font-sans placeholder:text-stone-400 focus:outline-none resize-none bg-transparent"
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenPrivacyRedactor}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              title="Redact sensitive phone/ID numbers before asking"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            </button>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>

        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
          <span>Enter to submit · Shift + Enter for new line</span>
          <span>Responses follow Section 15 structured legal response standards</span>
        </div>
      </div>
    </div>
  );
};
