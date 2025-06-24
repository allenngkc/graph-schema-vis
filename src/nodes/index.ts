import type { NodeTypes } from '@xyflow/react';

import { SchemaNode } from './schemaNode';
import { AppNode } from './types';
import { onNameChange } from './schemaNode';

export const initialNodes: AppNode[] = [
  {
    id: 'a',
    type: 'schema-node',
    position: { x: -100, y: 100 },
    data: { schemaName: '', onNameChange},
  }
];

export const nodeTypes = {
  'schema-node': SchemaNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
