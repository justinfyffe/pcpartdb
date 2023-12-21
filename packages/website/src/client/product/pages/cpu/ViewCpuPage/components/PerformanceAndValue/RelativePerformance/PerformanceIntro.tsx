import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

export const PerformanceIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.nameWithNoCompany}&apos;s performance with similar{' '}
      {props.marketSegment} CPUs. Relative performance provides insight into how
      its benchmark compares to its peers. This data is based on its{' '}
      {props.preferredBenchmarkName} performance.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <PerformanceIntroParagraph />
      </p>
    </ContentContext.Provider>
  );
};
