'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React from 'react';

export const TheoreticalPerfIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      Theoretical performance numbers derived from the raw specifications of the
      different components like core count and clock speeds. While these provide
      a glimpse into peak processing power, they do not represent real-world
      performance.
    </>
  ),
});

export const TheoreticalPerfIntro = () => {
  return (
    <ContentProvider>
      <p>
        <TheoreticalPerfIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
