import { formatOrdinalNumber } from 'packages/website/src/client/shared/format';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const PerformanceBlurbSentence1 = compileContentComponent({
  deps: ['gpuName', 'performanceRank', 'totalPerformanceGpus'],
  component: (props) => (
    <>
      The {props.gpuName} is the {props.performanceRank} best performing GPU
      among the {props.totalPerformanceGpus} benchmarked graphics cards in our
      database.
    </>
  ),
});

const PerformanceBlurbSentence2 = compileContentComponent({
  deps: ['companyPerformanceRank'],
  component: (props) => (
    <>
      It is the {props.companyPerformanceRank} most powerful NVIDIA GPU, and is
      the 3rd most powerful among the 8 GPUs released in 2016.
    </>
  ),
});

export const PerformanceBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      totalPerformanceGpus: contentData.totalPerformanceGpus,
      gpuName: getGpuName(gpu),
      companyPerformanceRank: formatOrdinalNumber(
        gpu.ranks?.companyPerformanceRank,
      ),
      performanceRank: formatOrdinalNumber(gpu.ranks?.performanceRank),
    };

    return { params };
  }, [gpu, contentData]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PerformanceBlurbSentence1 /> <PerformanceBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
