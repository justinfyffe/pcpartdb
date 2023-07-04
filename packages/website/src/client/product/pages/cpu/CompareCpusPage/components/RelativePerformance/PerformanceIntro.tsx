import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const PerformanceIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s performance
      with similar CPUs. Relative performance provides insight into how its
      benchmarks compare to its peers.
    </p>
  ),
});

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <PerformanceIntroParagraph />
    </ContentContext.Provider>
  );
};
