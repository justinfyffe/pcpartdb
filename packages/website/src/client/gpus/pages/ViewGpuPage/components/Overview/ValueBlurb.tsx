import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewGpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const ValueBlurbSentence1 = compileContentComponent({
  deps: [
    'gpuName',
    'valueRank',
    'valueRating',
    'performanceRating',
    'launchPrice',
  ],
  component: (props) => (
    <>
      Its {props.performanceRating} performance rating and {props.launchPrice}{' '}
      launch price gives it a performance per dollar of {props.valueRating}.
    </>
  ),
});

const ValueBlurbSentence2 = compileContentComponent(
  {
    tags: [ViewGpuContentTag.BestValue],
    deps: ['marketSegment'],
    component: (props) => (
      <>It is the best value {props.marketSegment} card in our database.</>
    ),
  },
  {
    deps: ['valueRankForSegment', 'marketSegment'],
    component: (props) => (
      <>
        This makes it the {props.valueRankForSegment} best value{' '}
        {props.marketSegment} card in our database.
      </>
    ),
  },
);

export const ValueBlurb = () => {
  const { gpu, contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  if (gpu.valueScore == null) {
    return <></>;
  }

  return (
    <ContentContext.Provider value={context}>
      <p>
        <ValueBlurbSentence1 /> <ValueBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
