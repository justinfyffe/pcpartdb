import { ContentTag, getViewGpuPath } from '@pcpartdb/shared';
import { formatOrdinalNumber } from 'packages/website/src/client/shared/format';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const ValueBlurbSentence1 = compileContentComponent({
  deps: [
    'gpuName',
    'valueRank',
    'valueRating',
    'performanceRating',
    'launchPrice',
  ],
  component: (props) => (
    <>
      Its {props.performanceRating} performance rating and {props.launchPrice}{' '}
      launch price gives it a performance per dollar of {props.valueRating}.
    </>
  ),
});

const ValueBlurbSentence2 = compileContentComponent(
  {
    tags: [ContentTag.BestValue],
    deps: ['marketSegment'],
    component: (props) => (
      <>It is the best value {props.marketSegment} card in our database.</>
    ),
  },
  {
    deps: ['valueRankForSegment', 'marketSegment'],
    component: (props) => (
      <>
        This makes it the {props.valueRankForSegment} best value{' '}
        {props.marketSegment} card in our database.
      </>
    ),
  },
);

export const ValueBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const tags = contentData.contentTags;
    const params = {
      gpuName: getGpuName(gpu),
      launchPrice: formatGpuField(gpu.launchPrice),
      marketSegment: formatGpuField(gpu.marketSegment).toLowerCase(),
      performanceRating: formatGpuField(gpu.benchmarks?.performanceScore),
      valueRank:
        gpu.ranks?.valueRank > 1
          ? formatOrdinalNumber(gpu.ranks?.valueRank)
          : '',
      valueRankForSegment:
        gpu.ranks?.valueRankForSegment > 1
          ? formatOrdinalNumber(gpu.ranks?.valueRankForSegment)
          : '',
      valueRating: formatGpuField(gpu.benchmarks?.valueScore),
    };

    return { tags, params };
  }, [contentData.contentTags, gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <ValueBlurbSentence1 /> <ValueBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
