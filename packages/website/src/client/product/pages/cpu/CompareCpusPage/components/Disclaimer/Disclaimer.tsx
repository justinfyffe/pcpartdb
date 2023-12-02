import { formatProductName } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

const DisclaimerParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: (props) => (
    <p className="text-dimmed mb-0">
      *Performance rating, performance per dollar, and rankings are approximate
      values based on the {props.name1} and {props.name2}&apos;s benchmarks and
      MSRP.
    </p>
  ),
});

export const Disclaimer = () => {
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const name1 = useMemo(() => formatProductName(cpu1), [cpu1]);
  const name2 = useMemo(() => formatProductName(cpu2), [cpu2]);

  const context = useMemo(() => ({ params: { name1, name2 } }), [name1, name2]);

  return (
    <ContentContext.Provider value={context}>
      <DisclaimerParagraph />
    </ContentContext.Provider>
  );
};
