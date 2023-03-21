import { getViewGpuPath } from '@pcpartdb/shared';
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
      This makes it the {props.valueRank} best value card in our database.
    </>
  ),
});

const ValueBlurbSentence2 = compileContentComponent({
  deps: ['bestValueSegmentGpuName', 'bestValueSegmentGpuValue'],
  component: (props) => (
    <>
      The card with the highest value,{' '}
      <a href={props.bestValueSegmentGpuPath as string}>
        {props.bestValueSegmentGpuName}
      </a>
      , has a performance per dollar of {props.bestValueSegmentGpuValue}.
    </>
  ),
});

export const ValueBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const bestValueSegmentGpu = contentData.bestValueSegmentGpu;

    const tags = contentData.contentTags;
    const params = {
      bestValueSegmentGpuName: getGpuName(bestValueSegmentGpu),
      bestValueSegmentGpuPath: getViewGpuPath(bestValueSegmentGpu),
      bestValueSegmentGpuValue: formatGpuField(
        bestValueSegmentGpu.benchmarks?.valueScore,
      ),
      gpuName: getGpuName(gpu),
      launchPrice: formatGpuField(gpu.launchPrice),
      performanceRating: formatGpuField(gpu.benchmarks?.performanceScore),
      valueRank:
        gpu.ranks?.valueRank > 1
          ? formatOrdinalNumber(gpu.ranks?.valueRank)
          : '',
      valueRating: formatGpuField(gpu.benchmarks?.valueScore),
    };

    return { tags, params };
  }, [contentData.bestValueSegmentGpu, contentData.contentTags, gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <ValueBlurbSentence1 /> <ValueBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
