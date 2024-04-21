import {
  formatProductName,
  getViewGpuPath,
  GpuProduct,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Contents } from '../Contents/Contents';

interface RelatedGpusProps {
  relatedGpus: Partial<GpuProduct>[];
}

export function RelatedGpus(props: RelatedGpusProps) {
  const { relatedGpus } = props;

  const hasRelatedGpus = relatedGpus?.length && relatedGpus.length > 0;

  if (!hasRelatedGpus) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="related-gpus" menu={<Contents />}>
        Related GPUs
      </SectionHeader>

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
    </section>
  );
}
