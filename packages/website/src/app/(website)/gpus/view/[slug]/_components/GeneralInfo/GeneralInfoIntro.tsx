'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const GeneralInfoIntro1 = compileContentComponent({
  component: (props: any) => (
    <>
      General information about the {props.nameWithNoCompany} like its
      manufacturer, release date, launch price, and production status.
    </>
  ),
});

export function GeneralInfoIntro() {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <GeneralInfoIntro1 />
      </p>
    </ContentProvider>
  );
}
