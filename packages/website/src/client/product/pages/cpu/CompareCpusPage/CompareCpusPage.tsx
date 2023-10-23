import {
  CompareCpusViewModel,
  Config,
  formatProductComparisonName,
  formatProductName,
  getAdminEditCpuPath,
  getCompareCpusPath,
  getHomePath,
  getListCpusPath,
  ProductType,
} from '@pcpartdb/shared';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
import { Breadcrumb } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from 'packages/website/src/client/shared/components/Seo/Seo';
import { WebsiteLayout } from 'packages/website/src/client/shared/layouts/website/WebsiteLayout';
import { Sidenav } from 'packages/website/src/client/sidenav/components/Sidenav/Sidenav';
import { SidenavRelatedComparisons } from 'packages/website/src/client/sidenav/components/SidenavRelatedComparisons/SidenavRelatedComparisons';
import { SidenavRelatedProducts } from 'packages/website/src/client/sidenav/components/SidenavRelatedProducts/SidenavRelatedProducts';
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
import { ComparePageContext } from './context/ComparePageContext';
import { useComparePageContextProps } from './hooks/useComparePageContextProps';

export const CompareCpusPage = (
  props: CompareCpusViewModel & { config: Config },
) => {
  const {
    comparison,
    additionalData: contentData,
    relatedCpus,
    relatedCpuComparisons: relatedComparisons,
    config,
  } = props;
  const [cpu1, cpu2] = comparison;
  useProductCache(ProductType.Cpu, cpu1, cpu2);

  const context = useComparePageContextProps({
    comparison,
    additionalData: contentData,
  });

  const pageTitle = useMemo(
    () => formatProductComparisonName(comparison),
    [comparison],
  );
  const shortPageTitle = useMemo(
    () => formatProductComparisonName(comparison, { company: false }),
    [comparison],
  );

  const shortCpuName1 = useMemo(
    () => formatProductName(cpu1, { company: false, brand: true }),
    [cpu1],
  );
  const shortCpuName2 = useMemo(
    () => formatProductName(cpu2, { company: false, brand: true }),
    [cpu2],
  );

  const seoTitle = useMemo(
    () =>
      `${formatProductComparisonName(comparison, {
        company: false,
      })}: Compare specs, performance, and value`,
    [comparison],
  );
  const seoKeywords = [
    pageTitle,
    formatProductName(cpu1),
    formatProductName(cpu2),
    formatProductName(cpu1, { company: false }),
    formatProductName(cpu2, { company: false }),
  ];
  const seoDescription = useMemo(() => {
    const shortestCpuName1 = formatProductName(cpu1, {
      company: false,
      brand: false,
    });
    const shortestCpuName2 = formatProductName(cpu2, {
      company: false,
      brand: false,
    });

    return (
      `Compare the specs, benchmarks, and performance per dollar of the ${shortestCpuName1} and ${shortestCpuName2}. ` +
      'Our database of processors will help you choose the best CPU for your computer.'
    );
  }, [cpu1, cpu2]);
  const seoCanonical = getCompareCpusPath({ comparison });

  const homeHref = useMemo(() => getHomePath(), []);
  const listHref = useMemo(() => getListCpusPath(), []);
  const editThisPage = useMemo(
    () =>
      config.isStaff
        ? [
            { href: getAdminEditCpuPath(cpu1), name: shortCpuName1 },
            { href: getAdminEditCpuPath(cpu2), name: shortCpuName2 },
          ]
        : null,
    [config.isStaff, cpu1, cpu2, shortCpuName1, shortCpuName2],
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
          <Breadcrumb href={homeHref}>Home</Breadcrumb>
          <Breadcrumb href={listHref}>Processors</Breadcrumb>
          <Breadcrumb>{shortPageTitle}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap gap-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{pageTitle}</h1>

            <CompareProductsForm
              productType={ProductType.Cpu}
              values={[cpu1?.id, cpu2?.id]}
            />
          </section>

          <article className="md:min-w-full flex-1 flex flex-col gap-4">
            <Highlights />
            <Overview />
            <GeneralInfo />
            <PerformanceAndValue />
            <TechnicalSpecs />
            <Disclaimer />
          </article>

          <Sidenav>
            <SidenavRelatedComparisons
              productType={ProductType.Cpu}
              comparisons={relatedComparisons.comparisons}
            />
            <SidenavRelatedProducts
              productType={ProductType.Cpu}
              products={relatedCpus.products}
            />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
