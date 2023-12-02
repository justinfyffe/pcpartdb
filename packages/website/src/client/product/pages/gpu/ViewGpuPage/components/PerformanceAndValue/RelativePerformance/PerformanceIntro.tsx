import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

const PerformanceIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetNameWithNoCompany}&apos;s performance with similar{' '}
      {props.marketSegment} GPUs. Relative performance provides insight into how
      its benchmarks compare to its peers. This data is based on chipset
      performance.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
