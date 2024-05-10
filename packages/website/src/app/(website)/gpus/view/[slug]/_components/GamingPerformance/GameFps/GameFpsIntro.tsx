'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const GameFpsIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Gaming FPS benchmarks for the {props.nameWithNoCompany}. For gamers, these
      are usually the best indicator for determing a GPUs performance and value.
      This data is based on its FPS performance across different games.
    </>
  ),
});
export const GameFpsIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <GameFpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
