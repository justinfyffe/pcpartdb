import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

const GeneralInfoIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      General information about the {props.nameWithNoCompany} like its
      manufacturer, release date, launch price, and production status.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
