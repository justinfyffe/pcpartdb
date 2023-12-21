import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

export const ApiIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      API versions that the {props.nameWithNoCompany} supports. Older GPUs may
      not support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
