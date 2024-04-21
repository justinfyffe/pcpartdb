'use client';

import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';
import { Contents } from '../Contents/Contents';

const Title = compileContentComponent({
  component: (props) => <>{props.chipsetNameWithNoCompany} Graphics Cards</>,
});

export const RetailModelsTitle = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <SectionHeader linkId="retail-models" menu={<Contents />}>
        <Title />
      </SectionHeader>
    </ContentProvider>
  );
};
