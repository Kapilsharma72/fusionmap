export type IntelType = 'OSINT' | 'HUMINT' | 'IMINT';
export type IntelSource = 'mongodb' | 's3' | 'manual' | 'csv' | 'json' | 'excel' | 'image';
export type ReviewStatus = 'pending' | 'reviewed' | 'flagged' | 'dismissed';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface IntelNode {
  id: string;
  type: IntelType;
  lat: number;
  lng: number;
  title: string;
  source: string;
  sourceType: IntelSource;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  timestamp: string;
  summary: string;
  imageUrl: string | null;
  imageCaption: string | null;
  location: string;
  tags: string[];
  status: ReviewStatus;
  classification: 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET';
}
