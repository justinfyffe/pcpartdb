import { ContentTag } from '@pcpartdb/shared';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuDimensions, formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const DimensionsBlurbSentence1 = compileContentComponent(
  {
    tags: [ContentTag.ExtraLargeSize],
    deps: ['dimensions', 'shortGpuName'],
    component: (props) => (
      <>
        The {props.shortGpuName} is a very large card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ContentTag.LargeSize],
    deps: ['dimensions', 'shortGpuName'],
    component: (props) => (
      <>
        The {props.shortGpuName} is a large card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ContentTag.SmallSize],
    deps: ['dimensions', 'shortGpuName'],
    component: (props) => (
      <>
        The {props.shortGpuName} is a low-profile card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ContentTag.CompactSize],
    deps: ['dimensions', 'shortGpuName'],
    component: (props) => (
      <>
        The {props.shortGpuName} is a compact, low-profile card with dimensions
        measuring {props.dimensions}.
      </>
    ),
  },
  {
    deps: ['dimensions', 'shortGpuName'],
    component: (props) => (
      <>
        The {props.shortGpuName} has dimensions measuring {props.dimensions}.
      </>
    ),
  },
);

const DimensionsBlurbSentence2 = compileContentComponent(
  {
    deps: ['marketSegment', 'slotWidth'],
    component: (props) => (
      <>
        This {props.marketSegment} component takes up {props.slotWidth} PCIe
        slots.
      </>
    ),
  },
  {
    deps: ['slotWidth'],
    component: (props) => (
      <>This component takes up {props.slotWidth} PCIe slots.</>
    ),
  },
);

const DimensionsBlurbSentence3 = compileContentComponent(
  {
    tags: [ContentTag.ExtraLargeSize],
    component: () => <>This is much larger in size than most modern GPUs.</>,
  },
  {
    tags: [ContentTag.LargeSize],
    component: () => <>This is larger than most modern GPUs.</>,
  },
  {
    tags: [ContentTag.CommonSize],
    component: () => (
      <>This is similar in size to the majority of modern GPUs.</>
    ),
  },
  {
    tags: [ContentTag.SmallSize],
    component: () => <>This size is smaller than most modern GPUs.</>,
  },
);

export const DimensionsBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const tags = contentData.contentTags;
    const params = {
      dimensions: formatGpuDimensions(gpu),
      height: formatGpuField(gpu.specs?.height),
      marketSegment: formatGpuField(gpu.marketSegment).toLowerCase(),
      shortGpuName: getGpuName(gpu, { company: false }),
      slotWidth: formatGpuField(gpu.specs?.slotWidth),
    };

    return { tags, params };
  }, [contentData.contentTags, gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <DimensionsBlurbSentence1 /> <DimensionsBlurbSentence2 />{' '}
        <DimensionsBlurbSentence3 />
      </p>
    </ContentContext.Provider>
  );
};
