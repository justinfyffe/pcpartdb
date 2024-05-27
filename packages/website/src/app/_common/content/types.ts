import React, { FunctionComponent } from 'react';

export type ContentTag = string | number;
export type ContentTags = ContentTag[] | Record<string | number, boolean>;
export type ContentComponentParams = Record<string, any>;
export type ContentFunctionParams = Record<string, string>;
export type ContentParams = ContentComponentParams | ContentFunctionParams;

export interface RawContentComponent {
  tags?: ContentTag[];
  deps?: string[];
  Component: FunctionComponent<ContentComponentParams>;
}

export type CompiledContentComponentVariants =
  CompiledContentComponentVariant[];

export interface CompiledContentComponentVariant {
  tags?: ContentTag[];
  deps?: string[];
  component: FunctionComponent<ContentComponentParams>;
}

export interface RawContentFunction {
  tags?: ContentTag[];
  deps?: string[];
  hook: (props?: ContentFunctionParams) => string;
}

export interface CompiledContentFunctionVariant {
  tags?: ContentTag[];
  deps?: string[];
  hook: (props?: ContentFunctionParams) => string;
}

export type CompiledContentFunctionVariants = CompiledContentFunctionVariant[];

export type ContentFunction = (props?: {
  tags?: ContentTags;
  params?: ContentFunctionParams;
  required?: boolean;
}) => string;
