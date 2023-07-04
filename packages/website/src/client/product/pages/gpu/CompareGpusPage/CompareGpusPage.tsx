import {
  CompareGpusViewModel,
  getCompareGpusPath,
  getHomePath,
  getListGpusPath,
  ProductType,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { useProductCache } from '../../../../shared/cache';
import { Breadcrumb, Breadcrumbs, Seo } from '../../../../shared/components';
import { WebsiteLayout } from '../../../../shared/layouts';
import {
  Sidenav,
  SidenavRelatedComparisons,
  SidenavRelatedProducts,
} from '../../../../sidenav';
import { CompareProductsForm } from '../../../components';
import { formatGpuComparisonName, formatGpuName } from '../../../utils';
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

export const CompareGpusPage = (props: CompareGpusViewModel) => {
  const { comparison, contentData, relatedGpus, relatedComparisons } = props;
  const [gpu1, gpu2] = comparison;
  useProductCache(ProductType.Gpu, gpu1, gpu2);

  const context = useComparePageContextProps({ comparison, contentData });

  const pageTitle = formatGpuComparisonName(comparison);
  const shortPageTitle = formatGpuComparisonName(comparison, {
    company: false,
  });
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
    const shortGpuName1 = formatGpuName(gpu1, { company: false, brand: false });
    const shortGpuName2 = formatGpuName(gpu2, { company: false, brand: false });

    return (
      `Compare the specs, benchmarks, and performance per dollar of the ${shortGpuName1} and ${shortGpuName2}. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.'
    );
  }, [gpu1, gpu2]);
  const seoCanonical = getCompareGpusPath(comparison);

  return (
    <ComparePageContext.Provider value={context}>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />
      <WebsiteLayout>
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
