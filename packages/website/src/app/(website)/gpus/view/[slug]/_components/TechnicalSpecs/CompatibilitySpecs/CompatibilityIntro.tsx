'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s slots, bus interface, power consumption,
      and output ports. These specs are useful for verifying that the{' '}
      {props.nameWithNoCompanyNoBrand} is compatible with your motherboard,
      power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
