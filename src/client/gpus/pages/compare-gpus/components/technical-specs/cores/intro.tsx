import { getGpuName } from '@client/gpus';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const CoresIntroSentence1 = compileContent({
  deps: ['longGpuName1', 'longGpuName2', 'shortGpuName1', 'shortGpuName2'],
  component: (props) => (
    <>
      {props.longGpuName1} and {props.longGpuName2}&apos;s cores, clock speed,
      and cache. These specs have an impact on how fast the{' '}
      {props.shortGpuName1} and {props.shortGpuName2} can process graphics. Each
      type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    longGpuName1: getGpuName(gpu1),
    longGpuName2: getGpuName(gpu2),
    shortGpuName1: getGpuName(gpu1, { company: false }),
    shortGpuName2: getGpuName(gpu2, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
