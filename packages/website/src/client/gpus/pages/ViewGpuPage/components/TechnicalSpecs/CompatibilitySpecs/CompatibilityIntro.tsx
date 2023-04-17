import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: ['gpuName', 'shortGpuName'],
  component: (props) => (
    <>
      {props.gpuName}&apos;s dimensions, bus interface, power consumption, and
      output ports. These specs are useful for verifying that the{' '}
      {props.shortGpuName} fits within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
