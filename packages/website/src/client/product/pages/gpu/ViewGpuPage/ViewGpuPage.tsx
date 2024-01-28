import {
  Config,
  formatProductName,
  getAdminEditProductPath,
  getGpuChipset,
  getHomePath,
  getListGpusPath,
  getViewGpuPath,
  ProductType,
  ViewGpuViewModel,
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
  const chipsetName = useMemo(() => formatProductName(chipset), [chipset]);
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
  const seoTitle = `${formatProductName(gpu)} GPU Benchmarks and Specs`;
  const seoDescription = useMemo(() => {
    const fullGpuName = formatProductName(gpu);

    return (
      `Specs, benchmarks, and performance per dollar of the ${fullGpuName}. ` +
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
        ? [
            {
              href: getAdminEditProductPath({ product: gpu }),
              name: gpuShortName,
            },
          ]
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

        <div className="flex flex-col justify-center gap-6">
          <section className="flex flex-col w-full">
            <div className="mb-4">
              <h1 className="font-semibold mb-0">{pageTitle}</h1>
              {isRetailModel && (
                <span className="text-sm">
                  Retail card for the <a href={chipsetHref}>{chipsetName}</a>
                </span>
              )}
            </div>

            <CompareProductsForm
              productType={ProductType.Gpu}
              values={[chipset?.id]}
            />
          </section>

          <DisplayAd unit={AdUnit.ViewPagePreHighlightsDisplay} />

          <article className="flex-1 flex flex-col gap-6 max-w-full">
            <Highlights />
            <Overview />
            <DisplayAd unit={AdUnit.ViewPagePostSummaryDisplay} />
            <GeneralInfo />
            <PerformanceAndValue />
            <DisplayAd unit={AdUnit.ViewPagePostPerfValueDisplay} />
            <TechnicalSpecs />
            <RetailModels />
            <MultiplexAd unit={AdUnit.ViewPagePostTechSpecsMultiplex} />
            <RelatedGpus />
            <RelatedComparisons />
            <Disclaimer />
          </article>
        </div>
      </WebsiteLayout>
    </ViewPageContextProvider>
  );
};
