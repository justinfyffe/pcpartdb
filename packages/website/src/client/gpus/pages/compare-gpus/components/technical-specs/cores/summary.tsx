import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@pcpartdb/website/client/shared/content';
import React, { useContext } from 'react';
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
