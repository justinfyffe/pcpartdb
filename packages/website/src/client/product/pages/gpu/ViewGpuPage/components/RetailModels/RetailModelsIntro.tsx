import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

const RetailModelsIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>Retail models based on the {props.chipsetNameWithNoCompany} chipset.</>
  ),
});
export const RetailModelsIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <RetailModelsIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
