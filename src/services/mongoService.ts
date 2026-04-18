import { MONGO_NODES } from '../data/mockDatabase';
import type { IntelNode } from '../types/intel';

export type MongoStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MongoLog {
  time: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

const STEPS: Array<{ msg: string; level: MongoLog['level']; delay: number }> = [
  { msg: 'Initializing MongoDB driver v6.3.0...', level: 'info', delay: 400 },
  { msg: 'Resolving host: intel-db.cyberjoar.internal', level: 'info', delay: 700 },
  { msg: 'TLS handshake complete. Certificate verified.', level: 'success', delay: 900 },
  { msg: 'Authenticating with SCRAM-SHA-256...', level: 'info', delay: 600 },
  { msg: 'Connected to replica set: rs0 (PRIMARY)', level: 'success', delay: 500 },
  { msg: `Fetched ${MONGO_NODES.length} documents from collection: intel_nodes`, level: 'success', delay: 800 },
];

export async function fetchMongoNodes(
  onLog: (log: MongoLog) => void,
  onStatus: (s: MongoStatus) => void
): Promise<IntelNode[]> {
  onStatus('connecting');
  for (const step of STEPS) {
    await delay(step.delay);
    onLog({ time: utcNow(), message: step.msg, level: step.level });
  }
  onStatus('connected');
  return MONGO_NODES;
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function utcNow() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19) + 'Z';
}
