import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const MemoryIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the {props.shortGpuName1}{' '}
      and {props.shortGpuName2}. GPU memory stores graphics data like frames,
      textures, and shadows which helps display rendered images. These specs are
      critical for graphics-intense applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
