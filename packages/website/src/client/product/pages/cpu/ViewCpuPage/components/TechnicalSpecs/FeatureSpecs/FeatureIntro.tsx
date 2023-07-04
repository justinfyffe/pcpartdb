import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const FeatureIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName}&apos;s features like bundled cooler, integrated
      graphics, and extensions/technologies.
    </p>
  ),
});

export const FeatureIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <FeatureIntroParagraph />
    </ContentContext.Provider>
  );
};
