import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.shortGpuName1} and {props.shortGpuName2}&apos;s dimensions, bus
      interface, power consumption, and output ports. These specs are useful for
      verifying that these GPUs fit within your case and is compatible with your
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
