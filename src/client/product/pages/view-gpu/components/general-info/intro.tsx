import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const GeneralInfoIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      General information about the {props.productName} like its performance
      rating, release date, and launch price.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getGpuName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
