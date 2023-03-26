import React, { FunctionComponent } from 'react';

export type ContentFilters = string[] | Record<string, boolean>;
export type ContentDependencies = string[];
export type ContentComponentParams = Record<string, string | React.ReactNode>;
export type ContentFunctionParams = Record<string, string>;

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

export interface RawContentFunction {
  filters?: string[];
  deps?: string[];
  hook: (props?: ContentFunctionParams) => string;
}

export interface CompiledContentFunctionVariant {
  filters?: string[];
  deps?: string[];
  hook: (props?: ContentFunctionParams) => string;
}

export type CompiledContentFunctionVariants = CompiledContentFunctionVariant[];

export type ContentFunction = (props?: {
  filters?: ContentFilters;
  params?: ContentFunctionParams;
  required?: boolean;
}) => string;
