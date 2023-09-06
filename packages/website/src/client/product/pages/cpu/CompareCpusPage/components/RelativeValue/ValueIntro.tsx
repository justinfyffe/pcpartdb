import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { CompareCpusContentTag } from '../../content';
import { ComparePageContext } from '../../context/ComparePageContext';

const ValueIntroParagraph = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentMarketSegment],
    deps: ['marketSegment1', 'marketSegment2'],
    component: (props) => (
      <p className="text-dimmed">
        Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s value
        with similar {props.marketSegment1} and {props.marketSegment2} CPUs.
        Relative value provides insight into which CPUs gives the best bang for
        your buck. This data is based on performance and MSRP.
      </p>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameMarketSegment],
    deps: ['marketSegment1'],
    component: (props) => (
      <p className="text-dimmed">
        Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s value
        with similar {props.marketSegment1} CPUs. Relative value provides
        insight into which CPUs gives the best bang for your buck. This data is
        based on performance and MSRP.
      </p>
    ),
  },
  {
    tags: [],
    deps: [],
    component: (props) => (
      <p className="text-dimmed">
        Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s value
        with similar CPUs. Relative value provides insight into which CPUs gives
        the best bang for your buck. This data is based on performance and MSRP.
      </p>
    ),
  },
);

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <ValueIntroParagraph />
    </ContentContext.Provider>
  );
};
