import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const CoresIntroSentence1 = compileContent({
  deps: [
    'longProductName1',
    'longProductName2',
    'shortProductName1',
    'shortProductName2',
  ],
  component: (props) => (
    <>
      {props.longProductName1} and {props.longProductName2}&apos;s cores, clock
      speed, and cache. These specs have an impact on how fast the{' '}
      {props.shortProductName1} and {props.shortProductName2} can process
      graphics. Each type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  const params = {
    longProductName1: getGpuName(product1),
    longProductName2: getGpuName(product2),
    shortProductName1: getGpuName(product1, { company: false }),
    shortProductName2: getGpuName(product2, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
