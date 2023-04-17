import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const IntroSentence1 = compileContentComponent({
  deps: ['gpuName1', 'shoppingUrl1', 'gpuName2', 'shoppingUrl2'],
  component: (props: ContentComponentParams) => (
    <>
      View the current availability and price for the{' '}
      <a href={props.shoppingUrl1 as string}>{props.gpuName1}</a> and{' '}
      <a href={props.shoppingUrl2 as string}>{props.gpuName2}</a>.
    </>
  ),
});

export const IntroSentence2 = compileContentComponent({
  component: () => (
    <>
      Check below for a comprehensive comparison of performance, benchmarks, and
      specs.
    </>
  ),
});

export const IntroSummary = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
