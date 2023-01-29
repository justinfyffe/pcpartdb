import {
  getCompareGpusSlug,
  getGpuComparisonName,
  getGpuName,
  getViewGpuSlug,
} from '@client/gpus';
import { classNames } from '@client/shared/ui';
import { getCompareGpusPath, getViewGpuPath } from '@client/shared/website';
import { RelatedGpus } from '@shared/gpus';
import React, { FunctionComponent } from 'react';

interface CompareGpusFormLinksProps {
  relatedGpus: RelatedGpus;
  className?: string;
}

export const CompareGpusFormLinks: FunctionComponent<
  CompareGpusFormLinksProps
> = (props) => {
  const { relatedGpus, className } = props;
  const { comparisons, gpus } = relatedGpus;

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
              <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                {getGpuName(gpu)}
              </a>
              {i < gpus.length - 1 && <>,</>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
