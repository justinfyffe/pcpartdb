import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

const RetailModelsIntroSentence1 = compileContentComponent({
  deps: ['chipsetShortName'],
  component: (props) => (
    <>Retail models based on the {props.chipsetShortName} chipset.</>
  ),
});
export const RetailModelsIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <RetailModelsIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
