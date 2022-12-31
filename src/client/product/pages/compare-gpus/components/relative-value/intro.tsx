import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

export const ValueIntroSentence1 = compileContent({
  deps: ['productName1', 'productName2'],
  component: (props) => (
    <>
      Compare {props.productName1} and {props.productName2}&apos;s value with
      similar GPUs. Relative value provides insight into which GPUs give the
      better bang for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  const params = {
    productName1: getGpuName(product1),
    productName2: getGpuName(product2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
