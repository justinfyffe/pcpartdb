import {
  Config,
  formatCpuName,
  getAdminEditCpuPath,
  getHomePath,
  getListCpusPath,
  getViewCpuPath,
  ProductType,
  ViewCpuViewModel,
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
  Benchmarks,
  Disclaimer,
  GeneralInfo,
  Highlights,
  Overview,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { ViewPageContext } from './context';
import { useViewPageContextProps } from './hooks';

export const ViewCpuPage = (props: ViewCpuViewModel & { config: Config }) => {
  const { cpu, relatedCpus, relatedComparisons, contentData, config } = props;
  useProductCache(ProductType.Cpu, cpu);

  const context = useViewPageContextProps({ cpu, contentData });

  const cpuName = useMemo(() => formatCpuName(cpu), [cpu]);
  const shortCpuName = useMemo(
    () => formatCpuName(cpu, { company: false }),
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
          <Breadcrumb href={listCpusHref}>Processors</Breadcrumb>
          <Breadcrumb>{shortCpuName}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-8">
          <section className="flex flex-col w-full">
            <div className="mb-4">
              <h1 className="md:text-2xl text-3xl mb-0">{pageTitle}</h1>
            </div>
            <CompareProductsForm
              productType={ProductType.Cpu}
              values={[cpu?.id]}
            />
          </section>

          <article className="md:min-w-full flex-1 flex flex-col gap-4">
            <section className="flex flex-wrap justify-start gap-4">
              <Highlights className="flex-1" />
            </section>
            <Overview />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />
            <Disclaimer />
          </article>

          <Sidenav>
            <SidenavRelatedProducts
              productType={ProductType.Cpu}
              products={relatedCpus.cpus}
            />
            <SidenavRelatedComparisons
              productType={ProductType.Cpu}
              comparisons={relatedComparisons.comparisons}
            />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ViewPageContext.Provider>
  );
};
