
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

export interface Patient {
  id: string;
  displayId: string;
  husbandName: string;
  wifeName: string;
  husbandAge: number;
  wifeAge: number;
  clinicId: string;
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
}
