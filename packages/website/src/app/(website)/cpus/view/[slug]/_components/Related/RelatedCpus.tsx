import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import React from 'react';

interface RelatedCpusProps {
  relatedCpus: Partial<CpuProduct>[];
}

export function RelatedCpus(props: RelatedCpusProps) {
  const { relatedCpus } = props;

  const hasRelatedCpus = relatedCpus?.length && relatedCpus.length > 0;

  if (!hasRelatedCpus) {
    return <></>;
  }

  return (
    <section>
      <h2>Related CPUs</h2>

      <div className="flex flex-row flex-wrap gap-4 font-semibold">
        {relatedCpus.map((product, i) => (
          <Button
            key={i}
            variant={ButtonVariant.Card}
            href={getViewCpuPath(product)}
          >
            {formatProductName(product)}
          </Button>
        ))}
      </div>
    </section>
  );
}
