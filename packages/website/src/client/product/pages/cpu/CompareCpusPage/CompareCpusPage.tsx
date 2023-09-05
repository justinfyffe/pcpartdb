import {
  CompareCpusViewModel,
  Config,
  formatCpuComparisonName,
  formatCpuName,
  getAdminEditCpuPath,
  getCompareCpusPath,
  getHomePath,
  getListCpusPath,
  ProductType,
} from '@pcpartdb/shared';
import { Breadcrumb } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from 'packages/website/src/client/shared/components/Seo/Seo';
import { WebsiteLayout } from 'packages/website/src/client/shared/layouts/website/WebsiteLayout';
import { Sidenav } from 'packages/website/src/client/sidenav/components/Sidenav/Sidenav';
import { SidenavRelatedComparisons } from 'packages/website/src/client/sidenav/components/SidenavRelatedComparisons/SidenavRelatedComparisons';
import { SidenavRelatedProducts } from 'packages/website/src/client/sidenav/components/SidenavRelatedProducts/SidenavRelatedProducts';
import React, { useMemo } from 'react';
import { useProductCache } from '../../../../shared/cache/ProductCache';
import { CompareProductsForm } from '../../../components/CompareProductsForm/CompareProductsForm';
import {
  Benchmarks,
  Disclaimer,
  GeneralInfo,
  Highlights,
  Overview,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { ComparePageContext } from './context';
import { useComparePageContextProps } from './hooks';

export const CompareCpusPage = (
  props: CompareCpusViewModel & { config: Config },
) => {
  const { comparison, contentData, relatedCpus, relatedComparisons, config } =
    props;
  const [cpu1, cpu2] = comparison;
  useProductCache(ProductType.Cpu, cpu1, cpu2);

  const context = useComparePageContextProps({ comparison, contentData });

  const pageTitle = useMemo(
    () => formatCpuComparisonName(comparison),
    [comparison],
  );
  const shortPageTitle = useMemo(
    () => formatCpuComparisonName(comparison, { company: false }),
    [comparison],
  );

  const shortCpuName1 = useMemo(
    () => formatCpuName(cpu1, { company: false, brand: true }),
    [cpu1],
  );
  const shortCpuName2 = useMemo(
    () => formatCpuName(cpu2, { company: false, brand: true }),
    [cpu2],
  );

  const seoTitle = useMemo(
    () =>
      `${formatCpuComparisonName(comparison, {
        company: false,
      })}: Compare specs, performance, and value`,
    [comparison],
  );
  const seoKeywords = [
    pageTitle,
    formatCpuName(cpu1),
    formatCpuName(cpu2),
    formatCpuName(cpu1, { company: false }),
    formatCpuName(cpu2, { company: false }),
  ];
  const seoDescription = useMemo(() => {
    const shortestCpuName1 = formatCpuName(cpu1, {
      company: false,
      brand: false,
    });
    const shortestCpuName2 = formatCpuName(cpu2, {
      company: false,
      brand: false,
    });

    return (
      `Compare the specs, benchmarks, and performance per dollar of the ${shortestCpuName1} and ${shortestCpuName2}. ` +
      'Our database of processors will help you choose the best CPU for your computer.'
    );
  }, [cpu1, cpu2]);
  const seoCanonical = getCompareCpusPath(comparison);

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
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
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
              products={relatedCpus.cpus}
            />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
