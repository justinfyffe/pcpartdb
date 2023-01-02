import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const CoresIntroSentence1 = compileContent({
  deps: ['longPartName1', 'longPartName2', 'shortPartName1', 'shortPartName2'],
  component: (props) => (
    <>
      {props.longPartName1} and {props.longPartName2}&apos;s cores, clock speed,
      and cache. These specs have an impact on how fast the{' '}
      {props.shortPartName1} and {props.shortPartName2} can process graphics.
      Each type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  const params = {
    longPartName1: getGpuName(part1),
    longPartName2: getGpuName(part2),
    shortPartName1: getGpuName(part1, { company: false }),
    shortPartName2: getGpuName(part2, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
