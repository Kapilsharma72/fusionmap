import { S3_NODES } from '../data/mockDatabase';
import type { IntelNode } from '../types/intel';

export type S3Status = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface S3Log {
  time: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

const STEPS: Array<{ msg: string; level: S3Log['level']; delay: number }> = [
  { msg: 'Loading AWS SDK credentials from environment...', level: 'info', delay: 350 },
  { msg: 'Assuming IAM role: arn:aws:iam::XXXXXXXXXXXX:role/IntelReader', level: 'info', delay: 600 },
  { msg: 'STS token acquired. Expiry: 3600s', level: 'success', delay: 500 },
  { msg: 'Connecting to s3://cyberjoar-intel (ap-south-1)...', level: 'info', delay: 700 },
  { msg: `Scanning prefix: imint/ — ${S3_NODES.length} objects found`, level: 'success', delay: 800 },
  { msg: `Parsed ${S3_NODES.length} IMINT records with embedded imagery`, level: 'success', delay: 600 },
];

export async function fetchS3Nodes(
  onLog: (log: S3Log) => void,
  onStatus: (s: S3Status) => void
): Promise<IntelNode[]> {
  onStatus('connecting');
  for (const step of STEPS) {
    await delay(step.delay);
    onLog({ time: utcNow(), message: step.msg, level: step.level });
  }
  onStatus('connected');
  return S3_NODES;
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function utcNow() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19) + 'Z';
}
