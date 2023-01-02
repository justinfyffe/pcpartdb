import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

export const ValueIntroSentence1 = compileContent({
  deps: ['partName1', 'partName2'],
  component: (props) => (
    <>
      Compare {props.partName1} and {props.partName2}&apos;s value with similar
      GPUs. Relative value provides insight into which GPUs give the better bang
      for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  const params = {
    partName1: getGpuName(part1),
    partName2: getGpuName(part2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
