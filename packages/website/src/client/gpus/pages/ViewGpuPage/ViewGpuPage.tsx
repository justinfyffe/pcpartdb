import {
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
  Intro,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { ViewPageContext } from './context';
import { useViewPageContextProps } from './hooks';

export const ViewGpuPage = (props: ViewGpuViewModel) => {
  const { gpu, relatedGpus, relatedComparisons, contentData } = props;
  useGpuCache(gpu);

  const context = useViewPageContextProps({ gpu, contentData });

  const pageTitle = useMemo(() => getGpuName(gpu), [gpu]);
  const seoTitle = `${pageTitle} - GPU specs, benchmarks, and value`;
  const seoCanonical = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const seoKeywords = useMemo(() => [getGpuName(gpu)], [gpu]);

  const homeHref = useMemo(() => getHomePath(), []);
  const listGpusHref = useMemo(() => getListGpusPath(), []);

  return (
    <ViewPageContext.Provider value={context}>
      <Seo title={seoTitle} keywords={seoKeywords} canonical={seoCanonical} />

      <WebsiteLayout>
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

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex flex-wrap justify-start gap-8">
              {/* <GpuImages gpu={gpu} className="flex-1 min-w-80" /> */}
              <Highlights className="flex-1" />
            </section>

            <Intro />
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
