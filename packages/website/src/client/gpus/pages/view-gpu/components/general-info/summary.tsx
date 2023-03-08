import React, { useContext } from 'react';
import { formatGpuField, getGpuName } from '../../../../../gpus';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '../../../../../shared/content';
import { formatOrdinalNumber } from '../../../../../shared/format';
import { ViewPageContext } from '../../context';

export const GeneralInfoSummarySentence1 = compileContent({
  deps: ['gpuName', 'architecture', 'launchWindow'],
  component: (props) => (
    <>
      The {props.gpuName} is a {props.architecture} architecture GPU with a
      launch window of {props.launchWindow}.
    </>
  ),
});

export const GeneralInfoSummarySentence2 = compileContent({
  deps: ['marketSegment', 'msrp'],
  component: (props) => (
    <>
      It is targeted towards the {props.marketSegment} market and has a MSRP of{' '}
      {props.msrp}.
    </>
  ),
});

export const GeneralInfoSummarySentence3 = compileContent({
  deps: ['performanceRank', 'totalRatedGpus', 'valueRank'],
  component: (props) => (
    <>
      This GPU is the{' '}
      <a href="#">{props.performanceRank} best performing graphics card</a>{' '}
      compared to the {props.totalRatedGpus} benchmarked cards in our database.
    </>
  ),
});

export const GeneralInfoSummarySentence4 = compileContent({
  deps: ['valueRank'],
  component: (props) => (
    <>
      It is the <a href="#">{props.valueRank} best in value</a>.
    </>
  ),
});

export const GeneralInfoSummary = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const { specs, ranks } = gpu;
  const { totalPerformanceRatedGpus: totalRatedGpus } = contentData;

  const params: ContentParams = {
    gpuName: getGpuName(gpu),
    architecture: formatGpuField(specs.architecture),
    marketSegment: formatGpuField(gpu.marketSegment),
    launchWindow: formatGpuField(gpu.releaseDate),
    msrp: formatGpuField(gpu.launchPrice),
    performanceRank: formatOrdinalNumber(ranks.performanceRank),
    valueRank: formatOrdinalNumber(ranks.valueRank),
    totalRatedGpus,
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <GeneralInfoSummarySentence1 /> <GeneralInfoSummarySentence2 />
      </p>

      <p>
        <GeneralInfoSummarySentence3 /> <GeneralInfoSummarySentence4 />
      </p>
    </ContentContext.Provider>
  );
};
