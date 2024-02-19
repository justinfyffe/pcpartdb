'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const Title = compileContentComponent({
  component: (props) => <>{props.chipsetNameWithNoCompany} Graphics Cards</>,
});

export const RetailModelsTitle = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <h2 className="mb-0 font-semibold">
        <Title />
      </h2>
    </ContentProvider>
  );
};
