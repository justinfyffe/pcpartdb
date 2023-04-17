import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewGpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const DimensionsBlurbSentence1 = compileContentComponent(
  {
    tags: [ViewGpuContentTag.ExtraLargeSize],
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} is a very large card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ViewGpuContentTag.LargeSize],
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} is a large card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ViewGpuContentTag.SmallSize],
    deps: ['dimensions', 'gpuName'],
    component: (props) => (
      <>
        The {props.gpuName} is a low-profile card with dimensions measuring{' '}
        {props.dimensions}.
      </>
    ),
  },
  {
    tags: [ViewGpuContentTag.CompactSize],
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
    deps: ['marketSegment', 'slotWidthNoUnits', 'slotWidthUnits'],
    component: (props) => (
      <>
        This {props.marketSegment} card takes up {props.slotWidthNoUnits} PCIe{' '}
        {props.slotWidthUnits}.
      </>
    ),
  },
  {
    deps: ['slotWidthNoUnits', 'slotWidthUnits'],
    component: (props) => (
      <>
        This card takes up {props.slotWidthNoUnits} PCIe {props.slotWidthUnits}.
      </>
    ),
  },
);

export const DimensionsBlurb = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <DimensionsBlurbSentence1 /> <DimensionsBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
