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
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} is a very large card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ContentTag.LargeSize],
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} is a large card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ContentTag.SmallSize],
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} is a low-profile card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ContentTag.CompactSize],
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} is a compact, low-profile card with dimensions
        measuring {props.dimensions}.
      </>
    ),
  },
  {
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} has dimensions measuring {props.dimensions}.
      </>
    ),
  },
);

const DimensionsBlurbSentence2 = compileContentComponent(
  {
    deps: ['marketSegment', 'slotWidth', 'slotsUnit'],
    component: (props) => (
      <>
        This {props.marketSegment} card takes up {props.slotWidth} PCIe{' '}
        {props.slotsUnit}.
      </>
    ),
  },
  {
    deps: ['slotWidth', 'slotsUnit'],
    component: (props) => (
      <>
        This card takes up {props.slotWidth} PCIe {props.slotsUnit}.
      </>
    ),
  },
);

export const DimensionsBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const tags = contentData.contentTags;
    const params = {
      dimensions: formatGpuDimensions(gpu, { allowMissingDimensions: true }),
      marketSegment: formatGpuField(gpu.marketSegment).toLowerCase(),
      gpuName: getGpuName(gpu),
      slotWidth: formatGpuField(gpu.specs?.slotWidth, { showUnits: false }),
      slotsUnit: gpu.specs?.slotWidth?.value === 1 ? 'slot' : 'slots',
    };

    return { tags, params };
  }, [contentData.contentTags, gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <DimensionsBlurbSentence1 /> <DimensionsBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
