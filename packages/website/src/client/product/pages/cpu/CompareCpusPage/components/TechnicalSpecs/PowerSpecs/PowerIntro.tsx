import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const PowerIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName1} and {props.shortCpuName2}&apos;s power consumption
      specs like its thermal design power and power limits.
    </p>
  ),
});

export const PowerIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <PowerIntroParagraph />
    </ContentContext.Provider>
  );
};
