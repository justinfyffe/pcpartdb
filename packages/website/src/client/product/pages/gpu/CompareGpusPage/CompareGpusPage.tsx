import {
  CompareGpusViewModel,
  Config,
  formatProductComparisonName,
  formatProductName,
  getAdminEditGpuPath,
  getCompareGpusPath,
  getHomePath,
  getListGpusPath,
  ProductType,
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
import {
  ComparePageContext,
  createComparePageContext,
} from './context/ComparePageContext';

export const CompareGpusPage = (
  props: CompareGpusViewModel & { config: Config },
) => {
  const { config, ...viewModel } = props;
  const { comparison } = viewModel;

  const [gpu1, gpu2] = comparison;
  useProductCache(ProductType.Gpu, gpu1, gpu2);

  const pageTitle = formatProductComparisonName(comparison);
  const shortPageTitle = formatProductComparisonName(comparison, {
    company: false,
  });

  const context = useMemo(
    () => createComparePageContext(viewModel),
    [viewModel],
  );

  const shortGpuName1 = useMemo(
    () => formatProductName(gpu1, { company: false, brand: true }),
    [gpu1],
  );
  const shortGpuName2 = useMemo(
    () => formatProductName(gpu2, { company: false, brand: true }),
    [gpu2],
  );

  const seoTitle = `${formatProductComparisonName(comparison, {
    company: false,
  })}: Compare specs, performance, and value`;
  const seoKeywords = [
    pageTitle,
    formatProductName(comparison[0]),
    formatProductName(comparison[1]),
    formatProductName(comparison[0], { company: false }),
    formatProductName(comparison[1], { company: false }),
  ];
  const seoDescription = useMemo(() => {
    const shortestGpuName1 = formatProductName(gpu1, {
      company: false,
      brand: false,
    });
    const shortestGpuName2 = formatProductName(gpu2, {
      company: false,
      brand: false,
    });

    return (
      `Compare the specs, benchmarks, and performance per dollar of the ${shortestGpuName1} and ${shortestGpuName2}. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.'
    );
  }, [gpu1, gpu2]);
  const seoCanonical = getCompareGpusPath({ comparison, ordered: true });

  const editThisPage = useMemo(
    () =>
      config.isStaff
        ? [
            { href: getAdminEditGpuPath(gpu1), name: shortGpuName1 },
            { href: getAdminEditGpuPath(gpu2), name: shortGpuName2 },
          ]
        : null,
    [config.isStaff, gpu1, gpu2, shortGpuName1, shortGpuName2],
  );

  return (
    <ComparePageContext.Provider value={context}>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />
      <WebsiteLayout config={config} editThisPage={editThisPage}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
          <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
          <Breadcrumb>{shortPageTitle}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap gap-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{pageTitle}</h1>

            <CompareProductsForm
              productType={ProductType.Gpu}
              values={[gpu1?.id, gpu2?.id]}
            />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <Highlights />
            <Overview />
            <GeneralInfo />
            <PerformanceAndValue />
            <TechnicalSpecs />
            <RetailModels />
            <RelatedComparisons />
            <RelatedGpus />
            <Disclaimer />
          </article>
        </div>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
