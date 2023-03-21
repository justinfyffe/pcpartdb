import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const MemorySummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const MemorySummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentComponentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <MemorySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
