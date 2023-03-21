import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const ValueSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const ValueSummary = () => {
  const { comparison, contentData } = useContext(ComparePageContext);

  const params: ContentComponentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ValueSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
