import React, { useContext } from 'react';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CoresSummarySentence1 = compileContent({
  deps: [],
  component: (props) => <></>,
});

export const CoresSummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CoresSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
