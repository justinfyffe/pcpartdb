import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

export const GeneralInfoIntroSentence1 = compileContent({
  deps: ['productName1', 'productName2'],
  component: (props) => (
    <>
      General information about the {props.productName1} and{' '}
      {props.productName2} like their performance rating, release date, and
      launch price.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  const params = {
    productName1: getGpuName(product1),
    productName2: getGpuName(product2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
