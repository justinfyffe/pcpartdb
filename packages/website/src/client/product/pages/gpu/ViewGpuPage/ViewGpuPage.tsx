import {
  Config,
  formatProductName,
  getAdminEditGpuPath,
  getGpuChipset,
  getHomePath,
  getListGpusPath,
  getViewGpuPath,
  ProductType,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
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
  RetailModels,
  TechnicalSpecs,
} from './components';
import { PerformanceAndValue } from './components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './components/Related/RelatedComparisons';
import { RelatedGpus } from './components/Related/RelatedGpus';
import { ViewPageContextProvider } from './context/ViewPageContextProvider';

export const ViewGpuPage = (props: ViewGpuViewModel & { config: Config }) => {
  const { config, ...viewModel } = props;
  const { gpu } = viewModel;

  useProductCache(ProductType.Gpu, gpu);

  const isRetailModel = gpu.parent != null;

  const chipset = useMemo(() => getGpuChipset(gpu), [gpu]);
  const chipsetShortName = useMemo(
    () => formatProductName(chipset, { company: false }),
    [chipset],
  );
  const chipsetHref = useMemo(() => getViewGpuPath(chipset), [chipset]);
  const gpuName = useMemo(() => formatProductName(gpu), [gpu]);
  const gpuShortName = useMemo(
    () => formatProductName(gpu, { company: false }),
    [gpu],
  );

  const pageTitle = useMemo(() => gpuName, [gpuName]);
  const seoTitle = `${formatProductName(gpu)}: Specs, performance, and value`;
  const seoDescription = useMemo(() => {
    const fullGpuName = formatProductName(gpu);

    return (
      `View the specs, benchmarks, and performance per dollar of the ${fullGpuName}. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.'
    );
  }, [gpu]);
  const seoCanonical = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const seoKeywords = useMemo(() => [formatProductName(gpu)], [gpu]);

  const homeHref = useMemo(() => getHomePath(), []);
  const listGpusHref = useMemo(() => getListGpusPath(), []);
  const editThisPage = useMemo(
    () =>
      config.isStaff
        ? [{ href: getAdminEditGpuPath(gpu), name: gpuShortName }]
        : null,
    [config.isStaff, gpu, gpuShortName],
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
          <Breadcrumb href={listGpusHref}>Graphics Cards</Breadcrumb>
          {isRetailModel && (
            <Breadcrumb href={chipsetHref}>{chipsetShortName}</Breadcrumb>
          )}
          <Breadcrumb>{gpuShortName}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-8">
          <section className="flex flex-col w-full">
            <h1 className="font-semibold">{pageTitle}</h1>

            <CompareProductsForm
              productType={ProductType.Gpu}
              values={[chipset?.id]}
            />
          </section>

          <article className="flex-1 flex flex-col gap-8 max-w-full">
            <Highlights />
            <Overview />
            <GeneralInfo />
            <PerformanceAndValue />
            <TechnicalSpecs />
            <RetailModels />
            <RelatedGpus />
            <RelatedComparisons />
            <Disclaimer />
          </article>
        </div>
      </WebsiteLayout>
    </ViewPageContextProvider>
  );
};
