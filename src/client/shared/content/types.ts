import React, { FunctionComponent } from 'react';

export type ContentHints = string[] | Record<string, boolean>;
export type ContentParams = Record<string, string | React.ReactNode>;
export type ContentDependencies = string[];

export interface RawContent {
  hints?: ContentHints;
  deps?: string[];
  component: FunctionComponent<ContentParams>;
}

export interface CompiledContent {
  // Hints key to variant
  [key: string]: CompiledContentVariant[];
}

export interface CompiledContentVariant {
  deps?: string[];
  component: FunctionComponent<ContentParams>;
}
