import type { NodeTypes } from '@xyflow/react';

import { InitNode } from './initNode';
import { AppNode } from './types';
import { onNameChange } from './initNode';

export const initialNodes: AppNode[] = [
  {
    id: 'a',
    type: 'init-node',
    position: { x: -100, y: 100 },
    data: { schemaName: '', onNameChange},
  }
];

export const nodeTypes = {
  'init-node': InitNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
