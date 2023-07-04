import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../context';

const Title = compileContentComponent({
  tags: [],
  deps: ['chipsetShortName1', 'chipsetShortName2'],
  component: (props) => (
    <>
      {props.chipsetShortName1} and {props.chipsetShortName2} Graphics Cards
    </>
  ),
});

export const RetailModelsTitle = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <h2 className="mb-0 font-semibold">
        <Title />
      </h2>
    </ContentContext.Provider>
  );
};
