import { ContentTag } from '@pcpartdb/shared';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuDimensions, formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

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
    tags: [ContentTag.ExtraLargeSize],
    component: () => <>This is much larger in size than most modern GPUs.</>,
  },
  {
    tags: [ContentTag.LargeSize],
    component: () => <>This is slightly larger than most modern GPUs.</>,
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
      gpuName: getGpuName(gpu),
      height: formatGpuField(gpu.specs?.height),
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
