import type { IntelNode } from '../types/intel';
import MongoPanel from './MongoPanel';
import S3Panel from './S3Panel';
import ManualEntryForm from './ManualEntryForm';
import FileDropZone from './FileDropZone';

interface Props {
  mongoLoaded: boolean;
  s3Loaded: boolean;
  onMongoNodes: (nodes: IntelNode[]) => void;
  onS3Nodes: (nodes: IntelNode[]) => void;
  onManualNode: (node: IntelNode) => void;
  onFileNodes: (nodes: IntelNode[]) => void;
}

export default function IngestionPanel({ mongoLoaded, s3Loaded, onMongoNodes, onS3Nodes, onManualNode, onFileNodes }: Props) {
  return (
    <aside
      className="flex flex-col border-r overflow-y-auto shrink-0"
      style={{ width: 320, background: '#0a0f1e', borderColor: '#1e293b' }}
    >
      <div className="px-3 py-2 border-b text-xs font-mono text-slate-500 tracking-widest" style={{ borderColor: '#1e293b' }}>
        ⬡ INGESTION PANEL
      </div>
      <MongoPanel onNodesLoaded={onMongoNodes} loaded={mongoLoaded} />
      <S3Panel onNodesLoaded={onS3Nodes} loaded={s3Loaded} />
      <ManualEntryForm onAdd={onManualNode} />
      <FileDropZone onNodesLoaded={onFileNodes} />
    </aside>
  );
}
