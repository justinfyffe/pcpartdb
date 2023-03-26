import React, { FunctionComponent } from 'react';

export type ContentFilters = string[] | Record<string, boolean>;
export type ContentDependencies = string[];
export type ContentComponentParams = Record<string, string | React.ReactNode>;
export type ContentHookParams = Record<string, string>;

export interface RawContentComponent {
  filters?: string[];
  deps?: string[];
  component: FunctionComponent<ContentComponentParams>;
}

export type CompiledContentComponentVariants =
  CompiledContentComponentVariant[];

export interface CompiledContentComponentVariant {
  filters?: string[];
  deps?: string[];
  component: FunctionComponent<ContentComponentParams>;
}

export interface RawContentHook {
  filters?: string[];
  deps?: string[];
  hook: (props?: ContentHookParams) => string;
}

export interface CompiledContentHookVariant {
  filters?: string[];
  deps?: string[];
  hook: (props?: ContentHookParams) => string;
}

export type CompiledContentHookVariants = CompiledContentHookVariant[];

export type ContentHookFunction = (props?: {
  filters?: ContentFilters;
  params?: ContentHookParams;
  required?: boolean;
}) => string;
