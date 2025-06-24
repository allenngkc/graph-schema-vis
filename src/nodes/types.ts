import type { Node, BuiltInNode } from '@xyflow/react';

export type SchemaNode = Node<{ schemaName: string; onNameChange?: (name: string) => void }, 'schema-node'>;
export type AppNode = BuiltInNode | SchemaNode;
