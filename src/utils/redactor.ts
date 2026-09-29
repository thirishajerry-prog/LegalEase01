export interface RedactionResult {
  sanitizedText: string;
  redactionsCount: {
    emails: number;
    phones: number;
    aadhaarOrSSN: number;
    panCards: number;
    financialNumbers: number;
  };
  totalCount: number;
}

export function sanitizeSensitiveLegalData(rawText: string): RedactionResult {
  let emails = 0;
  let phones = 0;
  let aadhaarOrSSN = 0;
  let panCards = 0;
  let financialNumbers = 0;

  let text = rawText;

  // 1. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  text = text.replace(emailRegex, () => {
    emails++;
    return '[REDACTED_EMAIL]';
  });

  // 2. Indian PAN Card (5 letters, 4 digits, 1 letter)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
  text = text.replace(panRegex, () => {
    panCards++;
    return '[REDACTED_PAN]';
  });

  // 3. Indian Aadhaar Number (12 digits, often 4-4-4 separated)
  const aadhaarRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
  text = text.replace(aadhaarRegex, (match) => {
    // avoid replacing normal 12 digit years or numbers if not space separated or matching aadhaar format
    if (match.length >= 12) {
      aadhaarOrSSN++;
      return '[REDACTED_AADHAAR]';
    }
    return match;
  });

  // 4. US Social Security Number (SSN: 3 digits - 2 digits - 4 digits)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  text = text.replace(ssnRegex, () => {
    aadhaarOrSSN++;
    return '[REDACTED_SSN]';
  });

  // 5. Credit Card numbers (13 to 19 digits with dashes or spaces)
  const ccRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
  text = text.replace(ccRegex, () => {
    financialNumbers++;
    return '[REDACTED_CARD_NUMBER]';
  });

  // 6. Phone numbers (Indian +91 or 10-digit mobile, US (xxx) xxx-xxxx, UK)
  const phoneRegex = /(?:\+?\d{1,3}[ -]?)?(?:\(?\d{3}\)?[ -]?|\b\d{5}[ -]?)\d{3}[ -]?\d{4}\b/g;
  text = text.replace(phoneRegex, (match) => {
    // Only redact if looks like a phone (length between 10 and 15)
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 10 && digitsOnly.length <= 13) {
      phones++;
      return '[REDACTED_PHONE]';
    }
    return match;
  });

  const totalCount = emails + phones + aadhaarOrSSN + panCards + financialNumbers;

  return {
    sanitizedText: text,
    redactionsCount: {
      emails,
      phones,
      aadhaarOrSSN,
      panCards,
      financialNumbers,
    },
    totalCount,
  };
}
