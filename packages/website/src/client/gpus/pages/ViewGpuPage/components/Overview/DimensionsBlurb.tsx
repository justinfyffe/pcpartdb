import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuDimensions, formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

enum Filter {
  ExtraLargeSize = 'EXTRA_LARGE_SIZE',
  LargeSize = 'LARGE_SIZE',
  CommonSize = 'COMMON_SIZE',
  SmallSize = 'SMALL_SIZE',
}

const DimensionsBlurbSentence1 = compileContentComponent({
  deps: ['dimensions', 'gpuName'],
  component: (props) => (
    <>
      The {props.gpuName} has dimensions measuring {props.dimensions}.
    </>
  ),
});

const DimensionsBlurbSentence2 = compileContentComponent({
  deps: ['slotWidth'],
  component: (props) => (
    <>The graphics card takes up {props.slotWidth} PCIe slots.</>
  ),
});

const DimensionsBlurbSentence3 = compileContentComponent(
  {
    filters: [Filter.ExtraLargeSize],
    component: () => (
      <>This is much larger than most GPUs than the typical dual-slot card.</>
    ),
  },
  {
    filters: [Filter.LargeSize],
    component: () => (
      <>This is slightly larger than the typical dual-slot card.</>
    ),
  },
  {
    filters: [Filter.CommonSize],
    component: () => (
      <>
        This is in line with most other GPUs as dual-slot cards are the most
        common.
      </>
    ),
  },
  {
    filters: [Filter.SmallSize],
    component: () => <>This is smaller than the typical dual-slot card.</>,
  },
);

export const DimensionsBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const slots = gpu.specs?.slotWidth?.value;
    const filters = {
      [Filter.ExtraLargeSize]: slots >= 3,
      [Filter.LargeSize]: slots > 2.5 && slots < 3,
      [Filter.CommonSize]: slots <= 2.5 && slots >= 2,
      [Filter.SmallSize]: slots < 2,
    };

    const params = {
      dimensions: formatGpuDimensions(gpu),
      gpuName: getGpuName(gpu),
      height: formatGpuField(gpu.specs?.height),
      slotWidth: formatGpuField(gpu.specs?.slotWidth),
    };

    return { filters, params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <DimensionsBlurbSentence1 /> <DimensionsBlurbSentence2 />{' '}
        <DimensionsBlurbSentence3 />
      </p>
    </ContentContext.Provider>
  );
};
