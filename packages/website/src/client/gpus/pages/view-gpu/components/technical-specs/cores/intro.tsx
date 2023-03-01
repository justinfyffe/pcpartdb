import { getGpuName } from '@pcpartdb/website/client/gpus';
import {
  compileContent,
  ContentContext,
} from '@pcpartdb/website/client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CoresIntroSentence1 = compileContent({
  deps: ['longGpuName', 'shortGpuName'],
  component: (props) => (
    <>
      {props.longGpuName}&apos;s cores, clock speed, and cache. These specs have
      an impact on how fast the {props.shortGpuName} can process graphics. Each
      type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    longGpuName: getGpuName(gpu),
    shortGpuName: getGpuName(gpu, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
