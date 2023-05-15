import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  deps: ['chipsetShortName'],
  component: (props) => (
    <p className="text-content-dimmed mb-0">
      * Performance rating, performance per dollar, rankings, and benchmarks are
      approximate values based on the {props.chipsetShortName} chipset.
    </p>
  ),
});

export const Disclaimer = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <RatingDisclaimer />
    </ContentContext.Provider>
  );
};
