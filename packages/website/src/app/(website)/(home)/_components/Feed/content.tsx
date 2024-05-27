'use client';

import React from 'react';
import { compileContentComponent } from '../../../../_common/content/utils/compileContentComponent';
import { ProductComparisonFeedTag, ProductFeedTag } from './types';

export const ProductItemSubtitle = compileContentComponent(
  {
    tags: [ProductFeedTag.GreatPerformance],
    deps: ['name'],
    Component: (props) => (
      <>The {props!.name} has great performance, but is it worth the money?</>
    ),
  },
  {
    tags: [ProductFeedTag.GreatValue],
    deps: ['name'],
    Component: (props) => (
      <>The {props!.name} has great value, but how well does it perform?</>
    ),
  },
  {
    deps: ['name'],
    Component: (props) => <>Learn more about the {props!.name}.</>,
  },
);

export const ProductComparisonItemSubtitle = compileContentComponent(
  {
    tags: [ProductComparisonFeedTag.ComparePerformance],
    deps: ['name1', 'name2'],
    Component: (props) => (
      <>
        Does the {props!.name1} outperform the {props!.name2}?
      </>
    ),
  },
  {
    tags: [ProductComparisonFeedTag.CompareValue],
    Component: () => <>Which of these have the better bang for your buck?</>,
  },
  {
    deps: ['name1', 'name2'],
    Component: (props) => (
      <>
        How does the {props!.name1} compare with the {props!.name2}?
      </>
    ),
  },
);
