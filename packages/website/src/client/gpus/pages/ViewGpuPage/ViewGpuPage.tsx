import {
  Config,
  getAdminEditGpuPath,
  getHomePath,
  getListGpusPath,
  getViewGpuPath,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { useGpuCache } from '../../../shared/cache';
import { Breadcrumb, Breadcrumbs, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { Sidenav, SidenavComparisons, SidenavGpus } from '../../../sidenav';
import { getGpuName } from '../..';
import { CompareGpusForm } from '../../components';
import {
  Benchmarks,
  GeneralInfo,
  Highlights,
  Overview,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { ViewPageContext } from './context';
import { useViewPageContextProps } from './hooks';

export const ViewGpuPage = (props: ViewGpuViewModel & { config: Config }) => {
  const { gpu, relatedGpus, relatedComparisons, contentData, config } = props;
  useGpuCache(gpu);

  const context = useViewPageContextProps({ gpu, contentData });

  const pageTitle = useMemo(() => getGpuName(gpu), [gpu]);
  const seoTitle = `${getGpuName(gpu, {
    company: false,
  })}: Specs, performance, and value`;
  const seoDescription = useMemo(() => {
    const fullGpuName = getGpuName(gpu);

    return (
      `View the specs, benchmarks, and performance per dollar of the ${fullGpuName}. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.'
    );
  }, [gpu]);
  const seoCanonical = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const seoKeywords = useMemo(() => [getGpuName(gpu)], [gpu]);

  const homeHref = useMemo(() => getHomePath(), []);
  const listGpusHref = useMemo(() => getListGpusPath(), []);
  const editHref = useMemo(
    () => (config.isStaff ? getAdminEditGpuPath(gpu) : null),
    [config.isStaff, gpu],
  );

  return (
    <ViewPageContext.Provider value={context}>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />

      <WebsiteLayout config={config} editThisPageHref={editHref}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={homeHref}>Home</Breadcrumb>
          <Breadcrumb href={listGpusHref}>Graphics Cards</Breadcrumb>
          <Breadcrumb>{pageTitle}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <section className="flex flex-col w-full">
            <h1 className="md:text-2xl text-3xl">{pageTitle}</h1>
            <CompareGpusForm values={[gpu.id]} />
          </section>

          <article className="md:min-w-full flex-1 flex flex-col gap-8">
            <section className="flex flex-wrap justify-start gap-8">
              {/* <GpuImages gpu={gpu} className="flex-1 min-w-80" /> */}
              <Highlights className="flex-1" />
            </section>

            <Overview />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />
          </article>

          <Sidenav>
            <SidenavGpus gpus={relatedGpus.gpus} />
            <SidenavComparisons comparisons={relatedComparisons.comparisons} />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ViewPageContext.Provider>
  );
};
