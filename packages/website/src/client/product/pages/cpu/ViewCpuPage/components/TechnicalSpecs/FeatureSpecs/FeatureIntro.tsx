import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

export const FeatureIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.nameWithNoCompany}&apos;s features like bundled cooler, integrated
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
