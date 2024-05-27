import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React, { FunctionComponent } from 'react';

interface RelatedCpusProps {
  relatedCpus: Partial<CpuProduct>[];
}

export const RelatedCpus: FunctionComponent<RelatedCpusProps> = (
  props: RelatedCpusProps,
) => {
  const { relatedCpus } = props;

  const hasRelatedCpus = relatedCpus?.length && relatedCpus.length > 0;

  if (!hasRelatedCpus) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="related-cpus">Related CPUs</SectionHeader>
      <p className="mb-0">
        Looking for alternatives? Check out these similar CPUs:
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
};
