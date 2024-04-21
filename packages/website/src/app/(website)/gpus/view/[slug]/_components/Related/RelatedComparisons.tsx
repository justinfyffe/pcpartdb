import {
  formatProductName,
  getCompareGpusPath,
  GpuProduct,
  GpuProductComparison,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Contents } from '../Contents/Contents';

interface RelatedComparisonsProps {
  gpu: Partial<GpuProduct>;
  relatedGpuComparisons: GpuProductComparison[];
}

export function RelatedComparisons(props: RelatedComparisonsProps) {
  const { gpu, relatedGpuComparisons } = props;

  const gpuName = formatProductName(gpu);
  const hasRelatedComparison =
    relatedGpuComparisons?.length && relatedGpuComparisons.length > 0;

  if (!hasRelatedComparison) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="related-comparisons" menu={<Contents />}>
        Related Comparisons
      </SectionHeader>

      {hasRelatedComparison && (
        <div className="flex flex-row flex-wrap gap-4 font-semibold">
          {relatedGpuComparisons.map((comparison, i) => (
            <ComparisonCard key={i} comparison={comparison} />
          ))}
        </div>
      )}

      {!hasRelatedComparison && (
        <div className="text-center py-8">
          We did find any related comparisons for the {gpuName}.
        </div>
      )}
    </section>
  );
}

interface ComparisonCardProps {
  comparison: GpuProductComparison;
}

function ComparisonCard(props: ComparisonCardProps) {
  const { comparison } = props;

  const name1 = formatProductName(comparison[0]);
  const name2 = formatProductName(comparison[1]);

  return (
    <Button
      variant={ButtonVariant.Card}
      href={getCompareGpusPath({ comparison })}
    >
      {name1}
      <br />
      vs
      <br />
      {name2}
    </Button>
  );
}
