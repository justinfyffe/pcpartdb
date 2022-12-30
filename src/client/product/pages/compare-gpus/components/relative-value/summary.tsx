import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

export const ValueSummarySentence1 = compileContent({
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
