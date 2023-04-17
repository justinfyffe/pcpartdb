import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      {props.gpuName1} and {props.gpuName2}&apos;s dimensions, bus interface,
      power consumption, and output ports. These specs are useful for verifying
      that these GPUs fit within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
