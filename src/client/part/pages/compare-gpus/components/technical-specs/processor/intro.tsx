import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const ProcessorIntroSentence1 = compileContent({
  deps: ['partName1', 'partName2'],
  component: (props) => (
    <>
      General information about the processors for the {props.partName1} and{' '}
      {props.partName2}.
    </>
  ),
});

export const ProcessorIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  const params = {
    partName1: getGpuName(part1),
    partName2: getGpuName(part2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ProcessorIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
