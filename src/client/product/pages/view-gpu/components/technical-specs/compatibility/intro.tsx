import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      {props.productName}&apos;s dimensions, bus interface, power consumption,
      and output ports. These specs are useful for verifying that the{' '}
      {props.productName} fits within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getGpuName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
