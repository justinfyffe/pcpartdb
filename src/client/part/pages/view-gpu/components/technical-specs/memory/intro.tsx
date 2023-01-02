import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const MemoryIntroSentence1 = compileContent({
  deps: ['partName'],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the {props.partName}. GPU
      memory stores graphics data like frames, textures, and shadows which helps
      display rendered images. These specs are critical for graphics-intense
      applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    partName: getGpuName(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
