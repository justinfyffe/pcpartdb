import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getProductName } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import { formatSpec } from '@shared/spec';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const GeneralInfoSummarySentence1 = compileContent({
  deps: ['productName', 'architecture', 'launchWindow'],
  component: (props) => (
    <>
      The {props.productName} is a {props.architecture} architecture GPU with a
      launch window of {props.launchWindow}.
    </>
  ),
});

export const GeneralInfoSummarySentence2 = compileContent({
  deps: ['marketSegment', 'msrp'],
  component: (props) => (
    <>
      It is targeted towards the {props.marketSegment} market and has a MSRP of{' '}
      {props.msrp}.
    </>
  ),
});

export const GeneralInfoSummarySentence3 = compileContent({
  deps: ['performanceRank', 'totalPerformanceRatedGpus', 'valueRank'],
  component: (props) => (
    <>
      This GPU is the{' '}
      <a href="#">{props.performanceRank} best performing graphics card</a>{' '}
      compared to the {props.totalPerformanceRatedGpus} ranked cards in our
      database.
    </>
  ),
});

export const GeneralInfoSummarySentence4 = compileContent({
  deps: ['valueRank'],
  component: (props) => (
    <>
      It is the <a href="#">{props.valueRank} best in value</a>.
    </>
  ),
});

export const GeneralInfoSummary = () => {
  const { product, contentData } = useContext(ViewPageContext);

  const { specs, metas } = product;
  const { totalPerformanceRatedGpus } = contentData;

  const params: ContentParams = {
    productName: getProductName(product),
    architecture: formatSpec(specs.architecture),
    marketSegment: formatSpec(specs.marketSegment),
    launchWindow: formatSpec(specs.releaseDate),
    msrp: formatSpec(specs.launchPrice),
    performanceRank: formatProductMeta(metas.performanceRank, {
      ordinalSuffix: true,
    }),
    valueRank: formatProductMeta(metas.valueRank, {
      ordinalSuffix: true,
    }),
    totalPerformanceRatedGpus,
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <GeneralInfoSummarySentence1 /> <GeneralInfoSummarySentence2 />
      </p>

      <p>
        <GeneralInfoSummarySentence3 /> <GeneralInfoSummarySentence4 />
      </p>
    </ContentContext.Provider>
  );
};
