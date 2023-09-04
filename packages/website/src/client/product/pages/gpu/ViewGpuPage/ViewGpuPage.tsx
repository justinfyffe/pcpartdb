import {
  Config,
  formatGpuName,
  getAdminEditGpuPath,
  getGpuChipset,
  getHomePath,
  getListGpusPath,
  getViewGpuPath,
  ProductType,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { Breadcrumb } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from 'packages/website/src/client/shared/components/Seo/Seo';
import React, { useMemo } from 'react';
import { useProductCache } from '../../../../shared/cache';
import { WebsiteLayout } from '../../../../shared/layouts';
import {
  Sidenav,
  SidenavRelatedComparisons,
  SidenavRelatedProducts,
} from '../../../../sidenav';
import { CompareProductsForm } from '../../../components';
import {
  Benchmarks,
  Disclaimer,
  GeneralInfo,
  Highlights,
  Overview,
  RelativePerformance,
  RelativeValue,
  RetailModels,
  TechnicalSpecs,
} from './components';
import { ViewPageContext } from './context';
import { useViewPageContextProps } from './hooks';

export const ViewGpuPage = (props: ViewGpuViewModel & { config: Config }) => {
  const { gpu, relatedGpus, relatedComparisons, contentData, config } = props;
  useProductCache(ProductType.Gpu, gpu.chipset, gpu);

  const context = useViewPageContextProps({ gpu, contentData });
  const isRetailModel = gpu.chipset != null;

  const chipset = useMemo(() => getGpuChipset(gpu), [gpu]);
  const chipsetShortName = useMemo(
    () => formatGpuName(chipset, { company: false }),
    [chipset],
  );
  const chipsetHref = useMemo(() => getViewGpuPath(chipset), [chipset]);
  const gpuName = useMemo(() => formatGpuName(gpu), [gpu]);
  const gpuShortName = useMemo(
    () => formatGpuName(gpu, { company: false }),
    [gpu],
  );

  const pageTitle = useMemo(() => gpuName, [gpuName]);
  const seoTitle = `${formatGpuName(gpu)}: Specs, performance, and value`;
  const seoDescription = useMemo(() => {
    const fullGpuName = formatGpuName(gpu);

    return (
      `View the specs, benchmarks, and performance per dollar of the ${fullGpuName}. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.'
    );
  }, [gpu]);
  const seoCanonical = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const seoKeywords = useMemo(() => [formatGpuName(gpu)], [gpu]);

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
    <ViewPageContext.Provider value={context}>
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
            <div className="mb-4">
              <h1 className="md:text-2xl text-3xl mb-0">{pageTitle}</h1>
            </div>
            <CompareProductsForm
              productType={ProductType.Gpu}
              values={[chipset?.id]}
            />
          </section>

          <article className="md:min-w-full flex-1 flex flex-col gap-4">
            <section className="flex flex-wrap justify-start gap-4">
              {/* <GpuImages gpu={gpu} className="flex-1 min-w-80" /> */}
              <Highlights className="flex-1" />
            </section>

            <Overview />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />

            <RetailModels />

            <Disclaimer />
          </article>

          <Sidenav>
            <SidenavRelatedProducts
              productType={ProductType.Gpu}
              products={relatedGpus.gpus}
            />
            <SidenavRelatedComparisons
              productType={ProductType.Gpu}
              comparisons={relatedComparisons.comparisons}
            />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ViewPageContext.Provider>
  );
};
