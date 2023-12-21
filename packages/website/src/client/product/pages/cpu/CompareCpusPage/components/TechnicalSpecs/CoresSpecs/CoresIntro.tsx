import { formatProductName } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

export const CoresIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.name1} and {props.name2}&apos;s core and clock speed specs like its
      core count, thread count, clock frequency, and turbo clock.
    </p>
  ),
});

export const CoresIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const name1 = useMemo(
    () => formatProductName(cpu1, { company: false }),
    [cpu1],
  );
  const name2 = useMemo(
    () => formatProductName(cpu2, { company: false }),
    [cpu2],
  );

  const context = useMemo(() => ({ params: { name1, name2 } }), [name1, name2]);

  return (
    <ContentContext.Provider value={context}>
      <CoresIntroParagraph />
    </ContentContext.Provider>
  );
};
