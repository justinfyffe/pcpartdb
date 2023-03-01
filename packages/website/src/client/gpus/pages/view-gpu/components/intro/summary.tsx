import { getGpuName, getShoppingUrl } from '@pcpartdb/website/client/gpus';
import {
  compileContent,
  ContentContext,
} from '@pcpartdb/website/client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const IntroSentence1 = compileContent({
  deps: ['gpuName', 'shoppingUrl'],
  component: (props) => (
    <>
      <a href={props.shoppingUrl as string}>
        View the current availability and price
      </a>{' '}
      for the {props.gpuName}.
    </>
  ),
});

export const IntroSentence2 = compileContent({
  component: () => (
    <>Check below for a comprehensive list of benchmarks and specs.</>
  ),
});

export const IntroSummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    gpuName: getGpuName(gpu),
    shoppingUrl: getShoppingUrl(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
