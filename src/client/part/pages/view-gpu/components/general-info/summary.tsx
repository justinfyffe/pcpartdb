import { formatSpec, getGpuName } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { formatPartMeta } from '@shared/part-meta';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const GeneralInfoSummarySentence1 = compileContent({
  deps: ['partName', 'architecture', 'launchWindow'],
  component: (props) => (
    <>
      The {props.partName} is a {props.architecture} architecture GPU with a
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
  const { part, contentData } = useContext(ViewPageContext);

  const { specs, metas } = part;
  const { totalPerformanceRatedGpus: totalRatedGpus } = contentData;

  const params: ContentParams = {
    partName: getGpuName(part),
    architecture: formatSpec(specs.architecture),
    marketSegment: formatSpec(specs.marketSegment),
    launchWindow: formatSpec(specs.releaseDate),
    msrp: formatSpec(specs.launchPrice),
    performanceRank: formatPartMeta(metas.performanceRank, {
      ordinalNumber: true,
    }),
    valueRank: formatPartMeta(metas.valueRank, {
      ordinalNumber: true,
    }),
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
