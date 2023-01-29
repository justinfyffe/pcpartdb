import { getGpuName } from '@client/gpus';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const ValueIntroSentence1 = compileContent({
  deps: ['gpuName'],
  component: (props) => (
    <>
      Compare {props.gpuName}&apos;s value with similar GPUs. Relative value
      provides insight into which GPU gives the best bang for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    gpuName: getGpuName(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
