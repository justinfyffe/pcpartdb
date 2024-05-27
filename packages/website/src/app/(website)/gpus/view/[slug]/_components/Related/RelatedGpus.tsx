import {
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  Product,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';

interface RelatedGpusProps {
  gpu: Partial<Product>;
  relatedGpus: Partial<GpuProduct>[];
}

export function RelatedGpus(props: RelatedGpusProps) {
  const { gpu, relatedGpus } = props;

  const gpuName = formatProductName(gpu);
  const hasRelatedGpus = relatedGpus?.length && relatedGpus.length > 0;

  if (!hasRelatedGpus) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="related-gpus">Related GPUs</SectionHeader>
      <p className="mb-0">
        Looking for alternatives? Check out these GPUs similar to the {gpuName}:
      </p>

      {hasRelatedGpus && (
        <div className="flex flex-row flex-wrap gap-4 font-semibold">
          {relatedGpus.map((product, i) => (
            <Button
              key={i}
              variant={ButtonVariant.Card}
              href={getViewGpuPath(product)}
            >
              {formatProductName(product)}
            </Button>
          ))}
        </div>
      )}

      {!hasRelatedGpus && (
        <div className="text-center py-8">
          We did find any related GPUs for the {gpuName}.
        </div>
      )}
    </section>
  );
}
