import React from 'react';
import { ContentComponent } from '../ContentComponent';
import {
  CompiledContentComponentVariants,
  ContentComponentParams,
  ContentTags,
  RawContentComponent,
} from '../types';

export function compileContentComponent(...content: RawContentComponent[]) {
  const variants: CompiledContentComponentVariants = [];

  for (let i = 0; i < content.length; ++i) {
    const { tags, deps, component } = content[i];

    variants.push({
      tags: tags || [],
      deps: deps || [],
      component,
    });
  }

  // eslint-disable-next-line react/display-name
  return (props: {
    tags?: ContentTags;
    params?: ContentComponentParams;
    required?: boolean;
  }) => <ContentComponent variants={variants} {...props} />;
}
