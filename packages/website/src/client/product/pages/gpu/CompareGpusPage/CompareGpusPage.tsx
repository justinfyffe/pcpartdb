import {
  CompareGpusViewModel,
  Config,
  formatGpuComparisonName,
  formatGpuName,
  getAdminEditGpuPath,
  getCompareGpusPath,
  getHomePath,
  getListGpusPath,
  ProductType,
} from '@pcpartdb/shared';
import { Breadcrumb } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from 'packages/website/src/client/shared/components/Seo/Seo';
import { WebsiteLayout } from 'packages/website/src/client/shared/layouts/website/WebsiteLayout';
import React, { useMemo } from 'react';
import { useProductCache } from '../../../../shared/cache/ProductCache';
import {
  Sidenav,
  SidenavRelatedComparisons,
  SidenavRelatedProducts,
} from '../../../../sidenav';
import { CompareProductsForm } from '../../../components/CompareProductsForm/CompareProductsForm';
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
import { ComparePageContext } from './context';
import { useComparePageContextProps } from './hooks';

export const CompareGpusPage = (
  props: CompareGpusViewModel & { config: Config },
) => {
  const { comparison, contentData, relatedGpus, relatedComparisons, config } =
    props;
  const [gpu1, gpu2] = comparison;
  useProductCache(ProductType.Gpu, gpu1, gpu2);

  const context = useComparePageContextProps({ comparison, contentData });

  const pageTitle = formatGpuComparisonName(comparison);
  const shortPageTitle = formatGpuComparisonName(comparison, {
    company: false,
  });

  const shortGpuName1 = useMemo(
    () => formatGpuName(gpu1, { company: false, brand: true }),
    [gpu1],
  );
  const shortGpuName2 = useMemo(
    () => formatGpuName(gpu2, { company: false, brand: true }),
    [gpu2],
  );

  const seoTitle = `${formatGpuComparisonName(comparison, {
    company: false,
  })}: Compare specs, performance, and value`;
  const seoKeywords = [
    pageTitle,
    formatGpuName(comparison[0]),
    formatGpuName(comparison[1]),
    formatGpuName(comparison[0], { company: false }),
    formatGpuName(comparison[1], { company: false }),
  ];
  const seoDescription = useMemo(() => {
    const shortestGpuName1 = formatGpuName(gpu1, {
      company: false,
      brand: false,
    });
    const shortestGpuName2 = formatGpuName(gpu2, {
      company: false,
      brand: false,
    });

    return (
      `Compare the specs, benchmarks, and performance per dollar of the ${shortestGpuName1} and ${shortestGpuName2}. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.'
    );
  }, [gpu1, gpu2]);
  const seoCanonical = getCompareGpusPath(comparison);

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

          <article className="flex-1 flex flex-col gap-4">
            {/* <section className="flex md:flex-wrap gap-8 justify-evenly">
              <GpuHeader gpu={gpu1} />
              <GpuHeader gpu={gpu2} />
            </section> */}

            <Highlights />
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
            <SidenavRelatedComparisons
              productType={ProductType.Gpu}
              comparisons={relatedComparisons.comparisons}
            />
            <SidenavRelatedProducts
              productType={ProductType.Gpu}
              products={relatedGpus.gpus}
            />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
