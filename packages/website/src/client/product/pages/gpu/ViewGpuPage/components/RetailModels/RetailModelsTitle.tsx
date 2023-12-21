import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

const Title = compileContentComponent({
  component: (props) => <>{props.chipsetNameWithNoCompany} Graphics Cards</>,
});

export const RetailModelsTitle = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <h2 className="mb-0 font-semibold">
        <Title />
      </h2>
    </ContentContext.Provider>
  );
};
