'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React from 'react';

const GameFpsIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      Gaming performance benchmarks based on their average frame rate (FPS) in
      popular games. These provide a strong indicator of a GPU&apos;s ability to
      handle demanding titles and help assess its value for the money.
    </>
  ),
});
export const GameFpsIntro = () => {
  return (
    <ContentProvider>
      <p>
        <GameFpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
