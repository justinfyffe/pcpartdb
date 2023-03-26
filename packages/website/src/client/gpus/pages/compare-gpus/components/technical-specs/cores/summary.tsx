import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
  ContentComponentParams,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CoresSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const CoresSummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentComponentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CoresSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
