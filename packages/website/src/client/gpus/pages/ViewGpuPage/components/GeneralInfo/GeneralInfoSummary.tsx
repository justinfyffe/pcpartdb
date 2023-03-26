import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { formatOrdinalNumber } from '../../../../../shared/format';
import { formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

export const GeneralInfoSummarySentence1 = compileContentComponent({
  deps: ['gpuName', 'architecture', 'launchWindow'],
  component: (props) => (
    <>
      The {props.gpuName} is a {props.architecture} architecture GPU with a
      launch window of {props.launchWindow}.
    </>
  ),
});

export const GeneralInfoSummarySentence2 = compileContentComponent({
  deps: ['marketSegment', 'msrp'],
  component: (props) => (
    <>
      It is targeted towards the {props.marketSegment} market and has a MSRP of{' '}
      {props.msrp}.
    </>
  ),
});

export const GeneralInfoSummarySentence3 = compileContentComponent({
  deps: ['performanceRank', 'valueRank'],
  component: (props) => (
    <>
      This GPU is the{' '}
      <a href="#">{props.performanceRank} best performing graphics card</a>{' '}
      compared to the benchmarked cards in our database.
    </>
  ),
});

export const GeneralInfoSummarySentence4 = compileContentComponent({
  deps: ['valueRank'],
  component: (props) => (
    <>
      It is the <a href="#">{props.valueRank} best in value</a>.
    </>
  ),
});

export const GeneralInfoSummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const { specs, ranks } = gpu;

  const context = useMemo(() => {
    const params: ContentComponentParams = {
      gpuName: getGpuName(gpu),
      architecture: formatGpuField(specs.architecture),
      marketSegment: formatGpuField(gpu.marketSegment),
      launchWindow: formatGpuField(gpu.releaseDate),
      msrp: formatGpuField(gpu.launchPrice),
      performanceRank: formatOrdinalNumber(ranks.performanceRank),
      valueRank: formatOrdinalNumber(ranks.valueRank),
    };
    return { params };
  }, [gpu, ranks.performanceRank, ranks.valueRank, specs.architecture]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <GeneralInfoSummarySentence1 /> <GeneralInfoSummarySentence2 />
      </p>

      <p>
        <GeneralInfoSummarySentence3 /> <GeneralInfoSummarySentence4 />
      </p>
    </ContentContext.Provider>
  );
};
