import { formatProductName } from '@pcpartdb/shared';
import { ProductSummary } from 'packages/website/src/client/product/components/ProductSummary/ProductSummary';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { PowerSupplyBlurb } from './PowerSupplyBlurb';

export const Overview: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  if (gpu.summary) {
    return (
      <section className="mb-0">
        <h2>About the {formatProductName(gpu, { company: false })}</h2>
        <ProductSummary product={gpu} />
      </section>
    );
  }

  // No summary provided? We'll try to generate one.
  return (
    <section className="mb-0">
      <IntroBlurb />
      <PerformanceBlurb />
      <MemoryBlurb />
      <CompatibilityBlurb />
      <PowerSupplyBlurb />
    </section>
  );
};
