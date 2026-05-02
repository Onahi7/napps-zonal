/**
 * North Central Zone Configuration
 * Based on MOU between NAPPS North Central Zonal Executive Council, Pre Campus College Schs Ltd & Pre Campus College Computers
 * States: Benue, Kogi, Kwara, Niger, Nasarawa, Plateau & FCT
 */

// States in North Central Zone
export const NORTH_CENTRAL_STATES = [
  'Benue',
  'Kogi',
  'Kwara',
  'Niger',
  'Nasarawa',
  'Plateau',
  'FCT'
] as const;

export type NorthCentralState = typeof NORTH_CENTRAL_STATES[number];

// Dues Structure (Total: ₦20,500)
export const DUES_STRUCTURE = {
  local: 6000,      // Local Dues
  state: 4000,      // State Dues
  zonal: 2000,      // Zonal Dues
  national: 5000,   // National Dues
  idCard: 3500      // NAPPS ID Card
};

export const TOTAL_DUES = Object.values(DUES_STRUCTURE).reduce((a, b) => a + b, 0); // ₦20,500

// Operational Deductions (Total: ₦3,000)
export const OPERATIONAL_DEDUCTIONS = {
  national: 1500,   // System maintenance & platform support
  zonal: 500,       // Coordination & logistics
  state: 1000       // ICT operations & local logistics
};

export const TOTAL_DEDUCTIONS = Object.values(OPERATIONAL_DEDUCTIONS).reduce((a, b) => a + b, 0); // ₦3,000

// Net amount to NAPPS
export const NET_AMOUNT_TO_NAPPS = TOTAL_DUES - TOTAL_DEDUCTIONS; // ₦17,500

// Payment Gateway
export const PAYMENT_GATEWAY = {
  provider: 'Fidelity',
  accountName: 'Pre Campus College',
  // Add Fidelity API credentials in .env
  apiKey: import.meta.env.VITE_FIDELITY_API_KEY || '',
  merchantId: import.meta.env.VITE_FIDELITY_MERCHANT_ID || ''
};

// Sample chapters by state (needs to be populated with actual chapters)
export const CHAPTERS_BY_STATE: Record<NorthCentralState, string[]> = {
  'Benue': [
    'Makurdi 1',
    'Makurdi 2',
    'Gboko',
    'Otukpo',
    'Katsina-Ala'
    // Add more chapters as needed
  ],
  'Kogi': [
    'Lokoja 1',
    'Lokoja 2',
    'Okene',
    'Kabba',
    'Idah'
    // Add more chapters as needed
  ],
  'Kwara': [
    'Ilorin 1',
    'Ilorin 2',
    'Offa',
    'Jebba',
    'Omu-Aran'
    // Add more chapters as needed
  ],
  'Niger': [
    'Minna 1',
    'Minna 2',
    'Bida',
    'Kontagora',
    'Suleja'
    // Add more chapters as needed
  ],
  'Nasarawa': [
    'Asakioo',
    'Karu 1',
    'Doma',
    'Karu 2',
    'Mararaba Udege',
    'Masaka Ado',
    'Panda',
    'Akwanga',
    'Lafia A',
    'Shabu',
    'Lafia B',
    'Keffi',
    'Kokona',
    'Mararaba Guruku',
    'Jenkwe',
    'Uke Chapter',
    'Nasarawa Eggon',
    'Nas Poly'
  ],
  'Plateau': [
    'Jos 1',
    'Jos 2',
    'Barkin Ladi',
    'Pankshin',
    'Langtang'
    // Add more chapters as needed
  ],
  'FCT': [
    'Abuja Municipal',
    'Bwari',
    'Gwagwalada',
    'Kuje',
    'Abaji',
    'Kwali'
    // Add more chapters as needed
  ]
};

// Get all chapters across all states
export const ALL_CHAPTERS = Object.values(CHAPTERS_BY_STATE).flat();

// Utility function to get chapters by state
export function getChaptersByState(state: NorthCentralState): string[] {
  return CHAPTERS_BY_STATE[state] || [];
}

// Utility function to validate if a state is valid
export function isValidState(state: string): state is NorthCentralState {
  return NORTH_CENTRAL_STATES.includes(state as NorthCentralState);
}

// Unique School ID prefix
export const SCHOOL_ID_PREFIX = 'NC'; // North Central
export const SCHOOL_ID_LENGTH = 8;

// QR Code settings for ID cards
export const QR_CODE_SETTINGS = {
  size: 200,
  margin: 2,
  errorCorrectionLevel: 'H' as const
};

// Payment status
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

// Data capturing status
export type DataCapturingStatus = 'Not Started' | 'In Progress' | 'Completed';

// ID Card status
export type IDCardStatus = 'Not Generated' | 'Generated' | 'Printed' | 'Delivered';
