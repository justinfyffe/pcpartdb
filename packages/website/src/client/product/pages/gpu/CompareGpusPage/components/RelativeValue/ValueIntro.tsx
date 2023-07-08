import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

export const ValueIntroSentence1 = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentMarketSegment],
    deps: ['marketSegment1', 'marketSegment2'],
    component: (props) => (
      <>
        Compare {props.shortGpuName1} and {props.shortGpuName2}&apos;s value
        with similar {props.marketSegment1} and {props.marketSegment2} GPUs.
        Relative value provides insight into which GPUs give the better bang for
        your buck. This data is based on chipset performance and MSRP.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameMarketSegment],
    deps: ['marketSegment1'],
    component: (props) => (
      <>
        Compare {props.shortGpuName1} and {props.shortGpuName2}&apos;s value
        with similar {props.marketSegment1} GPUs. Relative value provides
        insight into which GPUs give the better bang for your buck. This data is
        based on chipset performance and MSRP.
      </>
    ),
  },
  {
    tags: [],
    deps: [],
    component: (props) => (
      <>
        Compare {props.shortGpuName1} and {props.shortGpuName2}&apos;s value
        with similar GPUs. Relative value provides insight into which GPUs give
        the better bang for your buck. This data is based on chipset performance
        and MSRP.
      </>
    ),
  },
);

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
