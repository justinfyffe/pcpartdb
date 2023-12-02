import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

export const PerformanceIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Compare {props.nameWithNoCompany}&apos;s performance with similar{' '}
      {props.marketSegment} CPUs. Relative performance provides insight into how
      its benchmarks compare to its peers.
    </p>
  ),
});

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <PerformanceIntroParagraph />
    </ContentContext.Provider>
  );
};
