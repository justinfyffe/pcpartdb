import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
  ContentParams,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const ValueSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const ValueSummary = () => {
  const { comparison, contentData } = useContext(ComparePageContext);

  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ValueSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
