import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { getGpuName } from '../../../../..';
import { ViewPageContext } from '../../../context';

export const MemoryIntroSentence1 = compileContentComponent({
  deps: ['gpuName'],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the {props.gpuName}. GPU
      memory stores graphics data like frames, textures, and shadows which helps
      display rendered images. These specs are critical for graphics-intense
      applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      gpuName: getGpuName(gpu),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
