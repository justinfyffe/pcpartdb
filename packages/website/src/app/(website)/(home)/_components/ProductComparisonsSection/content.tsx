'use client';

import { ProductType } from '@pcpartdb/shared';
import React from 'react';
import { compileContentComponent } from '../../../../_common/content/utils/compileContentComponent';
import { ProductComparisonCardTag } from './types';

export const CardSubtitle = compileContentComponent(
  {
    tags: [ProductType.Cpu, ProductComparisonCardTag.ComparePerformance],
    deps: [],
    Component: () => (
      <>
        Want better performance? Compare the strongest processors from Intel and
        AMD.
      </>
    ),
  },
  {
    tags: [ProductType.Cpu, ProductComparisonCardTag.CompareValue],
    Component: () => (
      <>
        Want the best value for your money? Compare two of the best performance
        per dollar CPUs.
      </>
    ),
  },
  {
    tags: [ProductType.Gpu, ProductComparisonCardTag.ComparePerformance],
    deps: [],
    Component: () => (
      <>
        Want better performance? Compare the strongest graphics cards from
        NVIDIA and AMD.
      </>
    ),
  },
  {
    tags: [ProductType.Gpu, ProductComparisonCardTag.CompareValue],
    Component: () => (
      <>
        Want the best value for your money? Compare two of the best performance
        per dollar GPUs.
      </>
    ),
  },
);
