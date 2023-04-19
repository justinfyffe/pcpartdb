import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

const DimensionsBlurbSentence1 = compileContentComponent({
  tags: [],
  deps: [],
  component: (props) => <></>,
});

export const DimensionsBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <DimensionsBlurbSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
