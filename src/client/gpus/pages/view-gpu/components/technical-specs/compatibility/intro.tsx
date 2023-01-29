import { getGpuName } from '@client/gpus';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContent({
  deps: ['longGpuName', 'shortGpuName'],
  component: (props) => (
    <>
      {props.longGpuName}&apos;s dimensions, bus interface, power consumption,
      and output ports. These specs are useful for verifying that the{' '}
      {props.shortGpuName} fits within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    longGpuName: getGpuName(gpu),
    shortGpuName: getGpuName(gpu, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
