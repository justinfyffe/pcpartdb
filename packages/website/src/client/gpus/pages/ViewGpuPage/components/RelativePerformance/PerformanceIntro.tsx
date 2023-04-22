import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.shortGpuName}&apos;s performance with similar GPUs.
      Relative performance provides insight into how its benchmarks compare to
      its peers.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
