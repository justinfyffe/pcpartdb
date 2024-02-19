'use client';

import React from 'react';
import { compileContentComponent } from '../../../../_common/content/utils/compileContentComponent';
import { ProductComparisonFeedTag, ProductFeedTag } from './types';

export const ProductItemSubtitle = compileContentComponent(
  {
    tags: [ProductFeedTag.GreatPerformance],
    deps: ['name'],
    component: (props) => (
      <>The {props!.name} has great performance, but is it worth the money?</>
    ),
  },
  {
    tags: [ProductFeedTag.GreatValue],
    deps: ['name'],
    component: (props) => (
      <>The {props!.name} has great value, but how well does it perform?</>
    ),
  },
  {
    deps: ['name'],
    component: (props) => <>Learn more about the {props!.name}.</>,
  },
);

export const ProductComparisonItemSubtitle = compileContentComponent(
  {
    tags: [ProductComparisonFeedTag.ComparePerformance],
    deps: ['name1', 'name2'],
    component: (props) => (
      <>
        Does the {props!.name1} outperform the {props!.name2}?
      </>
    ),
  },
  {
    tags: [ProductComparisonFeedTag.CompareValue],
    component: () => <>Which of these have the better bang for your buck?</>,
  },
  {
    deps: ['name1', 'name2'],
    component: (props) => (
      <>
        How does the {props!.name1} compare with the {props!.name2}?
      </>
    ),
  },
);
