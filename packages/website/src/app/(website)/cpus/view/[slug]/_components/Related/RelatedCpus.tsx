import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Contents } from '../Contents/Contents';

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
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="related-cpus" menu={<Contents />}>
        Related CPUs
      </SectionHeader>

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
