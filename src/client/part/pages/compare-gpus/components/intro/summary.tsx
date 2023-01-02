import { getGpuName, getShoppingUrl } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

interface Params extends ContentParams {
  partName?: string;
  shoppingUrl?: string;
}

export const IntroSentence1 = compileContent({
  deps: ['partName1', 'shoppingUrl1', 'partName2', 'shoppingUrl2'],
  component: (props: Params) => (
    <>
      View the current availability and price for the{' '}
      <a href={props.shoppingUrl1 as string}>{props.partName1}</a> and{' '}
      <a href={props.shoppingUrl2 as string}>{props.partName2}</a>.
    </>
  ),
});

export const IntroSentence2 = compileContent({
  component: () => (
    <>
      Check below for a comprehensive comparison of performance, benchmarks, and
      specs.
    </>
  ),
});

export const IntroSummary = () => {
  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  const params: Params = {
    partName1: getGpuName(part1),
    shoppingUrl1: getShoppingUrl(part1),
    partName2: getGpuName(part2),
    shoppingUrl2: getShoppingUrl(part2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
