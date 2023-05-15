import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewGpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const PerformanceIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.shortGpuName}&apos;s performance with similar GPUs.
      Relative performance provides insight into how its benchmarks compare to
      its peers. This data is based on chipset performance.
    </>
  ),
});

const PerformanceIntroSentence2 = compileContentComponent({
  tags: [ViewGpuContentTag.IsRetailModel],
  deps: ['chipsetShortName'],
  component: (props) => (
    <>The following data is based on the {props.chipsetShortName}.</>
  ),
});

export const PerformanceIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 /> <PerformanceIntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
