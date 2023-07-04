import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const FeatureIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName1} and {props.shortCpuName2}&apos;s features like
      bundled cooler, integrated graphics, and extensions/technologies.
    </p>
  ),
});

export const FeatureIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <FeatureIntroParagraph />
    </ContentContext.Provider>
  );
};
