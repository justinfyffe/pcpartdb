import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../context';

export const PerformanceIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Compare {props.shortCpuName}&apos;s performance with similar{' '}
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
