import { formatProductName } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

export const MemoryIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the {props.name1} and{' '}
      {props.name2}. GPU memory stores graphics data like frames, textures, and
      shadows which helps display rendered images. These specs are critical for
      graphics-intense applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const name1 = useMemo(
    () => formatProductName(gpu1, { company: false }),
    [gpu1],
  );
  const name2 = useMemo(
    () => formatProductName(gpu2, { company: false }),
    [gpu2],
  );

  const context = useMemo(() => ({ params: { name1, name2 } }), [name1, name2]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
