import { ProductType } from '@pcpartdb/shared';
import { Tab } from 'packages/website/src/app/_common/components/Tabs/Tab';
import { Tabs } from 'packages/website/src/app/_common/components/Tabs/Tabs';
import { TabsVariant } from 'packages/website/src/app/_common/components/Tabs/types';
import { CompareProductsForm } from 'packages/website/src/app/_common/product/components/CompareProductsForm/CompareProductsForm';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React from 'react';

interface ComparisonFormSectionProps {
  className?: string;
}

export function ComparisonFormSection(props: ComparisonFormSectionProps) {
  return (
    <section
      className={classNames(
        'flex flex-col justify-center gap-4',
        props.className,
      )}
    >
      <h1 className="md:text-2xl text-2xl mb-0">
        Build Smarter: Compare PC part benchmarks &amp; specs
      </h1>

      <Tabs variant={TabsVariant.Horizontal}>
        <Tab label="Graphics cards" className="py-4">
          <p>
            Select 1 or 2 graphics cards to get a comparison of their gaming
            performance, benchmarks, and technical specs.
          </p>
          <CompareProductsForm
            productType={ProductType.Gpu}
            values={[null, null]}
          />
        </Tab>
        <Tab label="Processors" className="py-4">
          <p>
            Select 1 or 2 processors to get a comparison of their benchmark
            performance and technical specs.
          </p>
          <CompareProductsForm
            productType={ProductType.Cpu}
            values={[null, null]}
          />
        </Tab>
      </Tabs>
    </section>
  );
}
