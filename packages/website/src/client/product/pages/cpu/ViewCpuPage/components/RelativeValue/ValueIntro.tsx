import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../context';

const ValueIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Compare {props.shortCpuName}&apos;s value with similar{' '}
      {props.marketSegments} CPUs. Relative value provides insight into which
      CPUs gives the best bang for your buck. This data is based on performance
      and MSRP.
    </p>
  ),
});

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <ValueIntroParagraph />
    </ContentContext.Provider>
  );
};
