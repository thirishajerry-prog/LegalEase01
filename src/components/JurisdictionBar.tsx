import React, { useState } from 'react';
import { Globe, MapPin, Scale, ChevronDown, Check } from 'lucide-react';
import { JURISDICTIONS } from '../data/jurisdictions';
import { SupportedCountry, JurisdictionState, SupportedLanguage } from '../types/legal';

interface JurisdictionBarProps {
  jurisdiction: JurisdictionState;
  onJurisdictionChange: (next: JurisdictionState) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenPrivacyRedactor: () => void;
}

export const JurisdictionBar: React.FC<JurisdictionBarProps> = ({
  jurisdiction,
  onJurisdictionChange,
  language,
  onLanguageChange,
  onOpenPrivacyRedactor,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const countryInfo = JURISDICTIONS[jurisdiction.country] || JURISDICTIONS['India'];

  const handleCountrySelect = (c: SupportedCountry) => {
    const nextInfo = JURISDICTIONS[c];
    onJurisdictionChange({
      country: c,
      region: nextInfo.regions[0] || 'Central Laws',
      courtLevel: nextInfo.courts[0] || 'District Court',
    });
  };

  const handleRegionSelect = (region: string) => {
    onJurisdictionChange({
      ...jurisdiction,
      region,
    });
  };

  const handleCourtSelect = (court: string) => {
    onJurisdictionChange({
      ...jurisdiction,
      courtLevel: court,
    });
  };

  return (
    <div className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Jurisdiction Context indicator & dropdown trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-stone-500 font-medium uppercase tracking-wider text-[11px]">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>Jurisdiction First:</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center gap-2 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200/80 text-stone-900 font-medium transition-colors border border-stone-200 cursor-pointer"
            title="Change Country, State, or Legal Forum"
          >
            <span className="text-sm">{countryInfo.flag}</span>
            <span>{jurisdiction.country}</span>
            <span className="text-stone-400 font-normal">·</span>
            <span className="text-stone-700 max-w-[140px] truncate">{jurisdiction.region}</span>
            <span className="text-stone-400 font-normal">·</span>
            <span className="text-stone-600 max-w-[160px] truncate">{jurisdiction.courtLevel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Right: Language switch + Privacy Shield */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPrivacyRedactor}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Privacy Redaction Shield: Mask personal IDs before sharing"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium">Redact PII</span>
          </button>

          <div className="h-3.5 w-px bg-stone-200" />

          {/* Language selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded border border-stone-200 text-[11px]">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'en' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ta')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'ta' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="தமிழ் - Tamil Legal Assistance"
            >
              தமிழ்
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'hi' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="हिन्दी - Hindi Legal Assistance"
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'es' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Jurisdiction Drawer */}
      {isOpen && (
        <div className="border-t border-stone-200 bg-stone-50/95 backdrop-blur-md p-4 sm:p-6 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Country Column */}
            <div>
              <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                <Globe className="w-3.5 h-3.5 text-stone-700" />
                1. Select Country / System
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {(Object.keys(JURISDICTIONS) as SupportedCountry[]).map((c) => {
                  const isSelected = jurisdiction.country === c;
                  return (
                    <button
                      key={c}
                      onClick={() => handleCountrySelect(c)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 text-stone-900 font-semibold'
                          : 'hover:bg-stone-200/70 text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{JURISDICTIONS[c].flag}</span>
                        <span>{c}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* State / Province Column */}
            <div>
              <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                <MapPin className="w-3.5 h-3.5 text-stone-700" />
                2. State / Province / Territory
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {countryInfo.regions.map((reg) => {
                  const isSelected = jurisdiction.region === reg;
                  return (
                    <button
                      key={reg}
                      onClick={() => handleRegionSelect(reg)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 text-stone-900 font-semibold'
                          : 'hover:bg-stone-200/70 text-stone-700'
                      }`}
                    >
                      <span>{reg}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Court / Forum Context */}
            <div>
              <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                <Scale className="w-3.5 h-3.5 text-stone-700" />
                3. Court / Forum Authority
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {countryInfo.courts.map((court) => {
                  const isSelected = jurisdiction.courtLevel === court;
                  return (
                    <button
                      key={court}
                      onClick={() => {
                        handleCourtSelect(court);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 text-stone-900 font-semibold'
                          : 'hover:bg-stone-200/70 text-stone-700'
                      }`}
                    >
                      <span>{court}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
            <span>Laws vary substantially between state/central jurisdictions. LegalEase prioritizes statutes from the selected region.</span>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
