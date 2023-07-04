import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CoresIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName1} and {props.shortCpuName2}&apos;s core and clock
      speed specs like its core count, thread count, clock frequency, and turbo
      clock.
    </p>
  ),
});

export const CoresIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <CoresIntroParagraph />
    </ContentContext.Provider>
  );
};
