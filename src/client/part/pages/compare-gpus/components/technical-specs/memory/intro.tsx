import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const MemoryIntroSentence1 = compileContent({
  deps: ['partName1', 'partName2'],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the {props.partName1} and{' '}
      {props.partName2}. GPU memory stores graphics data like frames, textures,
      and shadows which helps display rendered images. These specs are critical
      for graphics-intense applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  const params = {
    partName1: getGpuName(part1),
    partName2: getGpuName(part2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
