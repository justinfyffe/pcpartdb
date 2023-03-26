import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { getGpuName } from '../../../../..';
import { ViewPageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContentComponent({
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

  const context = useMemo(() => {
    const params = {
      longGpuName: getGpuName(gpu),
      shortGpuName: getGpuName(gpu, { company: false }),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
