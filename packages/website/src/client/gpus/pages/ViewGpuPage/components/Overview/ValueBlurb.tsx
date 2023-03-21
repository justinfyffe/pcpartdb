import { formatOrdinalNumber } from 'packages/website/src/client/shared/format';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const ValueBlurbSentence1 = compileContentComponent({
  deps: ['gpuName', 'valueRank', 'performanceRating', 'launchPrice'],
  component: (props) => (
    <>
      The {props.gpuName} has the {props.valueRank} best performance per dollar
      based on its {props.performanceRating} performance rating and{' '}
      {props.launchPrice} launch price.
    </>
  ),
});

export const ValueBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      gpuName: getGpuName(gpu),
      launchPrice: formatGpuField(gpu.launchPrice),
      performanceRating: formatGpuField(gpu.benchmarks?.performanceScore),
      valueRank: formatOrdinalNumber(gpu.ranks?.valueRank),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <ValueBlurbSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
