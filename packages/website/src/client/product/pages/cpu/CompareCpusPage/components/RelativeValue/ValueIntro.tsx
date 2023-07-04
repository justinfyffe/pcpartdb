import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../context';

const ValueIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Compare {props.shortCpuName1} and {props.shortCpuName2}&apos;s value with
      similar CPUs. Relative value provides insight into which CPUs gives the
      best bang for your buck. This data is based on performance and MSRP.
    </p>
  ),
});

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <ValueIntroParagraph />
    </ContentContext.Provider>
  );
};
