import { getGpuName } from '@client/product';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getShoppingUrl } from '@shared/retail-model';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

interface Params extends ContentParams {
  productName?: string;
  shoppingUrl?: string;
}

export const IntroSentence1 = compileContent({
  deps: ['productName1', 'shoppingUrl1', 'productName2', 'shoppingUrl2'],
  component: (props: Params) => (
    <>
      View the current availability and price for the{' '}
      <a href={props.shoppingUrl1 as string}>{props.productName1}</a> and{' '}
      <a href={props.shoppingUrl2 as string}>{props.productName2}</a>.
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
  const [product1, product2] = comparison;

  const params: Params = {
    productName1: getGpuName(product1),
    shoppingUrl1: getShoppingUrl(product1),
    productName2: getGpuName(product2),
    shoppingUrl2: getShoppingUrl(product2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
