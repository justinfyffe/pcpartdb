import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContent({
  deps: ['longPartName', 'shortPartName'],
  component: (props) => (
    <>
      {props.longPartName}&apos;s dimensions, bus interface, power consumption,
      and output ports. These specs are useful for verifying that the{' '}
      {props.shortPartName} fits within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    longPartName: getGpuName(part),
    shortPartName: getGpuName(part, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
