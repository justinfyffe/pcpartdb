'use client';

import React, { useContext, useMemo } from 'react';
import { ContentContext } from './ContentProvider';
import {
  CompiledContentComponentVariants,
  ContentComponentParams,
  ContentTags,
} from './types';
import { processContentComponent } from './utils/processContentComponent';

export interface ContentComponentProps {
  variants: CompiledContentComponentVariants;

  tags?: ContentTags;
  params?: ContentComponentParams;
  required?: boolean;
}

export function ContentComponent(props: ContentComponentProps) {
  const { variants } = props;

  const context = useContext(ContentContext);

  const tags = props.tags || context.tags;
  const params = props.params || context.params;
  const required = props.required || false;

  const component = useMemo(() => {
    return processContentComponent({
      variants,
      tags,
      params,
      required,
    });
  }, [tags, params, required, variants]);

  return <>{component}</>;
}
