import { formatProductName } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.name1} and {props.name2}&apos;s dimensions, bus interface, power
      consumption, and output ports. These specs are useful for verifying that
      these GPUs fit within your case and is compatible with your motherboard,
      power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
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
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
