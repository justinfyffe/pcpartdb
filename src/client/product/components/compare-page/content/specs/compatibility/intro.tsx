import { compileContent, ContentContext } from '@client/shared/content';
import { getProductName } from '@shared/product';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContent({
  deps: ['productName1', 'productName2'],
  component: (props) => (
    <>
      {props.productName1} and {props.productName2}&apos;s dimensions, bus
      interface, power consumption, and output ports. These specs are useful for
      verifying that these GPUs fit within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  const params = {
    productName1: getProductName(product1),
    productName2: getProductName(product2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed mb-0">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
