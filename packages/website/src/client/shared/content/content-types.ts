import React, { FunctionComponent } from 'react';

export type ContentFilters = string[] | Record<string, boolean>;
export type ContentDependencies = string[];
export type ContentParams = Record<string, string | React.ReactNode>;

export interface RawContent {
  filters?: string[];
  deps?: string[];
  component: FunctionComponent<ContentParams>;
}

export type CompiledContent = CompiledContentVariant[];

export interface CompiledContentVariant {
  filters?: string[];
  deps?: string[];
  component: FunctionComponent<ContentParams>;
}
