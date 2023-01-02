import { getGpuName, getShoppingUrl } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const IntroSentence1 = compileContent({
  deps: ['partName', 'shoppingUrl'],
  component: (props) => (
    <>
      <a href={props.shoppingUrl as string}>
        View the current availability and price
      </a>{' '}
      for the {props.partName}.
    </>
  ),
});

export const IntroSentence2 = compileContent({
  component: () => (
    <>Check below for a comprehensive list of benchmarks and specs.</>
  ),
});

export const IntroSummary = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    partName: getGpuName(part),
    shoppingUrl: getShoppingUrl(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
