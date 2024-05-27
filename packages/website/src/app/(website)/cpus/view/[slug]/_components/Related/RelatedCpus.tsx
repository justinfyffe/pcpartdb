import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
  Product,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';

interface RelatedCpusProps {
  cpu: Partial<Product>;
  relatedCpus: Partial<CpuProduct>[];
}

export function RelatedCpus(props: RelatedCpusProps) {
  const { cpu, relatedCpus } = props;

  const cpuName = formatProductName(cpu);
  const hasRelatedCpus = relatedCpus?.length && relatedCpus.length > 0;

  if (!hasRelatedCpus) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="related-cpus">Related CPUs</SectionHeader>
      <p className="mb-0">
        Looking for alternatives? Check out these CPUs similar to the {cpuName}:
      </p>

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
