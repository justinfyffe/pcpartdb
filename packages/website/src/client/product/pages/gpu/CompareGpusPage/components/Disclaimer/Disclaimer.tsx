import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../context';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  deps: ['chipsetShortName1', 'chipsetShortName2'],
  component: (props) => (
    <p className="text-dimmed mb-0">
      *Performance rating, performance per dollar, and rankings are approximate
      values based on the {props.chipsetShortName1} and{' '}
      {props.chipsetShortName2}&apos;s benchmarks and MSRP.
    </p>
  ),
});

export const Disclaimer = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <RatingDisclaimer />
    </ContentContext.Provider>
  );
};
