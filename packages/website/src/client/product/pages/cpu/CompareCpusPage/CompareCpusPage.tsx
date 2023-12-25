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
import { ComparePageContextProvider } from './context/ComparePageContextProvider';

export const CompareCpusPage = (
  props: CompareCpusViewModel & { config: Config },
) => {
  const { config, ...viewModel } = props;

  const { comparison } = viewModel;

  const [cpu1, cpu2] = comparison;
  useProductCache(ProductType.Cpu, cpu1, cpu2);

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
  const seoCanonical = getCompareCpusPath({ comparison, ordered: true });

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
    <ComparePageContextProvider viewModel={viewModel}>
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

        <div className="flex flex-col gap-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{pageTitle}</h1>

            <CompareProductsForm
              productType={ProductType.Cpu}
              values={[cpu1?.id, cpu2?.id]}
            />
          </section>

          <DisplayAd unit={AdUnit.ComparePagePreHighlightsDisplay} />

          <article className="flex-1 flex flex-col gap-8 max-w-full">
            <Highlights />
            <Overview />
            <DisplayAd unit={AdUnit.ComparePagePostSummaryDisplay} />
            <GeneralInfo />
            <PerformanceAndValue />
            <DisplayAd unit={AdUnit.ComparePagePostPerfValueDisplay} />
            <TechnicalSpecs />
            <MultiplexAd unit={AdUnit.ComparePagePostTechSpecsMultiplex} />
            <RelatedComparisons />
            <RelatedCpus />
            <Disclaimer />
          </article>
        </div>
      </WebsiteLayout>
    </ComparePageContextProvider>
  );
};
