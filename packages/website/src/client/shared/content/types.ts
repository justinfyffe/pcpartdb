import React, { FunctionComponent } from 'react';

export type ContentTags = string[] | Record<string, boolean>;
export type ContentComponentParams = Record<string, any>;
export type ContentFunctionParams = Record<string, string>;
export type ContentParams = ContentComponentParams | ContentFunctionParams;

export interface RawContentComponent {
  tags?: string[];
  deps?: string[];
  component: FunctionComponent<ContentComponentParams>;
}

export type CompiledContentComponentVariants =
  CompiledContentComponentVariant[];

export interface CompiledContentComponentVariant {
  tags?: string[];
  deps?: string[];
  component: FunctionComponent<ContentComponentParams>;
}

export interface RawContentFunction {
  tags?: string[];
  deps?: string[];
  hook: (props?: ContentFunctionParams) => string;
}

export interface CompiledContentFunctionVariant {
  tags?: string[];
  deps?: string[];
  hook: (props?: ContentFunctionParams) => string;
}

export type CompiledContentFunctionVariants = CompiledContentFunctionVariant[];

export type ContentFunction = (props?: {
  tags?: ContentTags;
  params?: ContentFunctionParams;
  required?: boolean;
}) => string;
