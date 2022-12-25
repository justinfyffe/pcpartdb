import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const MemorySummarySentence1 = compileContent({
  deps: [],
  component: (props) => <></>,
});

export const MemorySummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <MemorySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
