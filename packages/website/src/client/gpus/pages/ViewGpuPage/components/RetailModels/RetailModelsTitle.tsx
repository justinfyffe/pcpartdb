import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

const Title = compileContentComponent({
  deps: ['chipsetShortName'],
  component: (props) => <>{props.chipsetShortName} Graphics Cards</>,
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
