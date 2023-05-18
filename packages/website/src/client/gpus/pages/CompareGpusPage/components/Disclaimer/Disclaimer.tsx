import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  deps: ['chipsetShortName1', 'chipsetShortName2'],
  component: (props) => (
    <p className="text-content-dimmed mb-0">
      * Performance rating, performance per dollar, rankings, and benchmarks are
      approximate values based on the {props.chipsetShortName1} and{' '}
      {props.chipsetShortName2} chipsets.
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
