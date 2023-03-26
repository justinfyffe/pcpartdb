import React, { useContext } from 'react';
import { getGpuName, getShoppingUrl } from '../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
  ContentComponentParams,
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
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params: ContentComponentParams = {
    gpuName1: getGpuName(gpu1),
    shoppingUrl1: getShoppingUrl(gpu1),
    gpuName2: getGpuName(gpu2),
    shoppingUrl2: getShoppingUrl(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
