import { formatOrdinalNumber } from 'packages/website/src/client/shared/format';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const ValueBlurbSentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const ValueBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      gpuName: getGpuName(gpu),
      performanceRank: formatOrdinalNumber(gpu.ranks?.performanceRank),
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
