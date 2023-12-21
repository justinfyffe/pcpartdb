import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

const GeneralInfoParagraph = compileContentComponent({
  component: (props) => (
    <p className="text-dimmed">
      General information about the {props.nameWithNoCompany} like its
      manufacturer, release date, launch price, and production status.
    </p>
  ),
});

export const GeneralInfoIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <GeneralInfoParagraph />
    </ContentContext.Provider>
  );
};
