import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.shortGpuName1} and {props.shortGpuName2}&apos;s performance
      with similar GPUs. Relative performance provides insight into how their
      benchmarks compare to their peers.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
