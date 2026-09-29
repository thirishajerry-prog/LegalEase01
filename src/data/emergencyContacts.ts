export interface EmergencyResource {
  title: string;
  category: 'Immediate Safety' | 'Free Legal Aid' | 'Cyber Crime' | 'Consumer & Citizen Rights';
  phone: string;
  portalOrEmail: string;
  description: string;
  jurisdiction: string;
}

export const EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    title: 'NALSA Free Legal Aid Services (India)',
    category: 'Free Legal Aid',
    phone: '15100 (Toll-Free 24x7)',
    portalOrEmail: 'nalsa.gov.in',
    description: 'National Legal Services Authority provides free legal aid, advocates, and Lok Adalat services to women, SC/ST citizens, industrial workmen, and persons in custody under Legal Services Authorities Act, 1987.',
    jurisdiction: 'India (All States & UTs)',
  },
  {
    title: 'Tele-Law Portal & Mobile App (India)',
    category: 'Free Legal Aid',
    phone: 'Via CSC Center or App',
    portalOrEmail: 'tele-law.in',
    description: 'Government of India initiative connecting citizens with panel advocates via video conferencing and telephone for pre-litigation advice.',
    jurisdiction: 'India',
  },
  {
    title: 'Women’s Emergency National Helpline',
    category: 'Immediate Safety',
    phone: '181 / 1091 / 112',
    portalOrEmail: 'ncw.nic.in',
    description: 'Round-the-clock emergency support for domestic violence, stalking, harassment, and immediate protection orders under Domestic Violence Act (PWDVA).',
    jurisdiction: 'India',
  },
  {
    title: 'National Cyber Crime Reporting Portal',
    category: 'Cyber Crime',
    phone: '1930 (Financial Cyber Fraud Helpline)',
    portalOrEmail: 'cybercrime.gov.in',
    description: 'Immediate reporting of online financial frauds, frozen bank transfers within the golden hour, identity theft, and non-consensual imagery.',
    jurisdiction: 'India',
  },
  {
    title: 'National Consumer Helpline (NCH)',
    category: 'Consumer & Citizen Rights',
    phone: '1915 / 1800-11-4000',
    portalOrEmail: 'consumerhelpline.gov.in',
    description: 'Direct pre-litigation grievance redressal with over 700 registered corporate convergence partners before filing before District Consumer Commission.',
    jurisdiction: 'India',
  },
  {
    title: 'Legal Services Corporation (LSC - United States)',
    category: 'Free Legal Aid',
    phone: '1-800-CALL-LAW',
    portalOrEmail: 'lsc.gov.in or lawhelp.org',
    description: 'Federally funded legal aid organizations providing civil legal assistance to low-income Americans facing eviction, domestic violence, or denial of benefits.',
    jurisdiction: 'United States',
  },
  {
    title: 'National Domestic Violence Hotline (US)',
    category: 'Immediate Safety',
    phone: '1-800-799-SAFE (7233)',
    portalOrEmail: 'thehotline.org',
    description: '24/7 confidential support for anyone experiencing domestic violence or seeking resources.',
    jurisdiction: 'United States',
  },
  {
    title: 'Civil Legal Advice (CLA - United Kingdom)',
    category: 'Free Legal Aid',
    phone: '0345 345 4 345',
    portalOrEmail: 'gov.uk/civil-legal-advice',
    description: 'Legal aid advice in England and Wales on housing, debt, domestic abuse, family problems, or discrimination.',
    jurisdiction: 'United Kingdom',
  },
];

export const ARREST_AND_CUSTODY_RIGHTS = [
  {
    rule: 'Right to Know Grounds of Arrest',
    details: 'The police must inform the person being arrested of the full particulars of the offence and whether the offence is bailable or non-bailable (Section 50 CrPC / Section 47 BNSS).',
  },
  {
    rule: 'Right to Inform a Nominated Relative/Friend',
    details: 'The arresting officer is duty-bound to inform an identified friend, relative, or person of choice about the arrest and the location where they are detained without delay (D.K. Basu guidelines).',
  },
  {
    rule: 'Production Before Magistrate Within 24 Hours',
    details: 'A person arrested without warrant cannot be detained for more than 24 hours (excluding travel time) without being produced before the nearest judicial magistrate (Article 22(2) Constitution & Section 57 CrPC / Section 58 BNSS).',
  },
  {
    rule: 'Right to Legal Counsel and Medical Checkup',
    details: 'The arrested person has the right to consult and be defended by a legal practitioner of their choice during interrogation and undergo medical examination by a registered medical practitioner.',
  },
];
