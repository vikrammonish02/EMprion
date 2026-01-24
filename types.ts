
export enum CycleStatus {
  NEW = 'NEW',
  EGG_RETRIEVAL = 'EGG_RETRIEVAL',
  FERTILIZATION = 'FERTILIZATION',
  ASSESSMENT = 'ASSESSMENT',
  DISPOSITION = 'DISPOSITION',
  TRANSFER_FREEZE = 'TRANSFER_FREEZE',
  COMPLETED = 'COMPLETED'
}

export enum Disposition {
  IMPLANT = 'Implant Now',
  FREEZE = 'Freeze',
  NEXT_CYCLE = 'Transfer to Next Cycle',
  DISCARD = 'Discard',
  REASSESS = 'Reassess',
  HOLD = 'Hold'
}

export interface PartnerDetails {
  name: string;
  preferredName?: string;
  dob: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  relationshipStatus: 'Married' | 'Single' | 'Cohabiting' | 'Other';
  nationality: string;
  idType: 'Aadhaar' | 'Passport' | 'PAN' | 'Other';
  idLast4: string;
  mrn: string;
  mobile: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
}

export interface ClinicalSummary {
  primaryIndication: string;
  indicationDetails?: string;
  obstetricHistory?: string;
  previousCycles: 'None' | '1' | '2-3' | '>3';
  previousCyclesDetails?: string;
  medicalConditions: string[];
  medicalConditionsDetails?: string;
  medications?: string;
  allergies?: string;
}

export interface DonorEligibility {
  status: 'Not applicable' | 'Planned' | 'Completed';
  determinationDate?: string;
  tests: string[];
  otherTests?: string;
  riskSummary: 'No increased risk' | 'Increased risk';
  riskNotes?: string;
  finalDecision: 'Eligible' | 'Ineligible' | 'Temporarily deferred';
}

export interface RegistrationConsents {
  treatmentSigned: boolean;
  treatmentDate?: string;
  storageSigned: boolean;
  storageDate?: string;
  donorSigned: boolean;
  donorDate?: string;
  grievanceSigned: boolean;
  grievanceDate?: string;
  qualityImprovementConsent: boolean;
}

export interface Patient {
  id: string;
  displayId: string; // MRN of Partner 1
  partner1: PartnerDetails;
  partner2Present: boolean;
  partner2?: PartnerDetails;
  clinicalSummary: ClinicalSummary;
  donorFlags: {
    sperm: boolean;
    oocytes: boolean;
    embryos: boolean;
    surrogate: boolean;
  };
  donorEligibility?: DonorEligibility;
  privacy: {
    registryReportAgreement: boolean;
    noticeReceived: boolean;
    channels: ('SMS' | 'WhatsApp' | 'Phone' | 'Email')[];
  };
  consents: RegistrationConsents;
  clinicId: string;
  staffSignatureInitials?: string;
}

export interface Cycle {
  id: string;
  displayId: string;
  patientId: string;
  status: CycleStatus;
  eggRetrievalDate: string;
  embryoCount: number;
}

export interface GardnerScore {
  expansion: number;
  icm: 'A' | 'B' | 'C';
  te: 'A' | 'B' | 'C';
  cell_count?: string;
  cavity_symmetry?: string;
  fragmentation?: string;
}

export interface MorphokineticData {
  t2: number;
  t3: number;
  t5: number;
  t8: number;
  tEB: number;
  s3: number;
}

export interface Embryo {
  id: string;
  displayId: string;
  cycleId: string;
  gardner: GardnerScore;
  morpho?: MorphokineticData;
  viabilityIndex: number; // 0-100
  disposition?: Disposition;
  confidence: number;
  status: 'PENDING' | 'COMPLETED';
  assetType: 'IMAGE' | 'VIDEO';
  analysisModel: 'GARDNER' | 'MORPHOKINETICS';
  file?: File;
  commentary?: string;
}
