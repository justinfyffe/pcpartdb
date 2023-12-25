import {
  Config,
  formatProductName,
  getAdminEditCpuPath,
  getHomePath,
  getListCpusPath,
  getViewCpuPath,
  ProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
import { DisplayAd } from 'packages/website/src/client/shared/components/Ad/DisplayAd';
import { MultiplexAd } from 'packages/website/src/client/shared/components/Ad/MultiplexAd';
import { AdUnit } from 'packages/website/src/client/shared/components/Ad/types';
import { Breadcrumb } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from 'packages/website/src/client/shared/components/Seo/Seo';
import { WebsiteLayout } from 'packages/website/src/client/shared/layouts/website/WebsiteLayout';
import React, { useMemo } from 'react';
import { CompareProductsForm } from '../../../components/CompareProductsForm/CompareProductsForm';
import {
  Disclaimer,
  GeneralInfo,
  Highlights,
  Overview,
  TechnicalSpecs,
} from './components';
import { PerformanceAndValue } from './components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './components/Related/RelatedComparisons';
import { RelatedCpus } from './components/Related/RelatedCpus';
import { ViewPageContextProvider } from './context/ViewPageContextProvider';

export const ViewCpuPage = (props: ViewCpuViewModel & { config: Config }) => {
  const { config, ...viewModel } = props;
  const { cpu } = viewModel;

  useProductCache(ProductType.Cpu, cpu);

  const cpuName = useMemo(() => formatProductName(cpu), [cpu]);
  const shortCpuName = useMemo(
    () => formatProductName(cpu, { company: false }),
    [cpu],
  );

  const pageTitle = useMemo(() => cpuName, [cpuName]);
  const seoTitle = `${cpuName}: Specs, performance, and value`;
  const seoDescription = useMemo(() => {
    return (
      `View the specs, benchmarks, and performance per dollar of the ${cpuName}. ` +
      'Our database of processors will help you choose the best CPU for your computer.'
    );
  }, [cpuName]);
  const seoCanonical = useMemo(() => getViewCpuPath(cpu), [cpu]);
  const seoKeywords = useMemo(() => [cpuName], [cpuName]);

  const homeHref = useMemo(() => getHomePath(), []);
  const listCpusHref = useMemo(() => getListCpusPath(), []);
  const editThisPage = useMemo(
    () =>
      config.isStaff
        ? [{ href: getAdminEditCpuPath(cpu), name: shortCpuName }]
        : null,
    [config.isStaff, cpu, shortCpuName],
  );

  return (
    <ViewPageContextProvider viewModel={viewModel}>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />

      <WebsiteLayout config={config} editThisPage={editThisPage}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={homeHref}>Home</Breadcrumb>
          <Breadcrumb href={listCpusHref}>Processors</Breadcrumb>
          <Breadcrumb>{shortCpuName}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-col justify-center gap-8">
          <section className="flex flex-col w-full">
            <h1 className="font-semibold">{pageTitle}</h1>
            <CompareProductsForm
              productType={ProductType.Cpu}
              values={[cpu?.id]}
            />
          </section>

          <DisplayAd unit={AdUnit.ViewPagePreHighlightsDisplay} />

          <article className="flex-1 flex flex-col gap-8 max-w-full">
            <Highlights />
            <Overview />
            <DisplayAd unit={AdUnit.ViewPagePostSummaryDisplay} />
            <GeneralInfo />
            <PerformanceAndValue />
            <DisplayAd unit={AdUnit.ViewPagePostPerfValueDisplay} />
            <TechnicalSpecs />
            <MultiplexAd unit={AdUnit.ViewPagePostTechSpecsMultiplex} />
            <RelatedCpus />
            <RelatedComparisons />
            <Disclaimer />
          </article>
        </div>
      </WebsiteLayout>
    </ViewPageContextProvider>
  );
};
