import {
  getCompareGpusPath,
  getViewGpuPath,
  RelatedComparisons,
  RelatedGpus,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import {
  getCompareGpusSlug,
  getGpuComparisonName,
  getGpuName,
} from '../../../gpus';
import { classNames } from '../../../shared/ui';

interface CompareGpusFormLinksProps {
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
  className?: string;
}

export const CompareGpusFormLinks: FunctionComponent<
  CompareGpusFormLinksProps
> = (props) => {
  const { relatedGpus, relatedComparisons, className } = props;
  const { gpus } = relatedGpus;
  const { comparisons } = relatedComparisons;

  return (
    <section className={classNames('flex flex-col gap-1 text-xs', className)}>
      <div className="flex gap-2">
        Popular Comparisons:
        <ul className="flex gap-3">
          {comparisons.map((comparison, i) => (
            <li key={i}>
              <a href={getCompareGpusPath(getCompareGpusSlug(comparison))}>
                {getGpuComparisonName(comparison)}
              </a>
              {i < comparisons.length - 1 && <>,</>}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        Popular GPUs:
        <ul className="flex gap-3">
          {gpus.map((gpu, i) => (
            <li key={i}>
              <a href={getViewGpuPath(gpu)}>{getGpuName(gpu)}</a>
              {i < gpus.length - 1 && <>,</>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
