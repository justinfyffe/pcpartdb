import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../context';

const DisclaimerParagraph = compileContentComponent({
  tags: [],
  deps: ['shortCpuName'],
  component: (props) => (
    <p className="text-dimmed mb-0">
      *Performance rating, performance per dollar, rankings, and benchmarks are
      approximate values based on {props.shortCpuName}&apos;s benchmarks.
    </p>
  ),
});

export const Disclaimer = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <DisclaimerParagraph />
    </ContentContext.Provider>
  );
};
