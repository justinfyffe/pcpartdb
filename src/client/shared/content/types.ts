import React, { FunctionComponent } from 'react';

export type ContentKeys = string[] | Record<string, boolean>;
export type ContentParams = Record<string, string | React.ReactNode>;
export type ContentDependencies = string[];

export interface RawContentVariant {
  deps?: ContentDependencies;
  component: FunctionComponent<ContentParams>;
}

export interface RawContent {
  key?: ContentKeys;
  variants: RawContentVariant | RawContentVariant[];
}

export interface ContentVariant {
  deps: string[];
  component: FunctionComponent<ContentParams>;
}

export interface CompiledContent {
  [key: string]: ContentVariant[];
}
