import type { Node, BuiltInNode } from '@xyflow/react';

export type InitNode = Node<{ schemaName: string; onNameChange?: (name: string) => void }, 'init-node'>;
export type AppNode = BuiltInNode | InitNode;
