import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const RetailModelsIntroSentence1 = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentChipset],
    deps: ['chipsetShortName1', 'chipsetShortName2'],
    component: (props) => (
      <>
        Retail models based on the {props.chipsetShortName1} and{' '}
        {props.chipsetShortName2} chipsets.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameChipset],
    deps: ['chipsetShortName1'],
    component: (props) => (
      <>Retail models based on the {props.chipsetShortName1} chipset.</>
    ),
  },
);
export const RetailModelsIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <RetailModelsIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
