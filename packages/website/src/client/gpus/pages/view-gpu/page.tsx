import {
  getHomePath,
  getListGpusPath,
  getViewGpuPath,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import React from 'react';
import { getGpuName } from '../../../gpus';
import { CompareGpusForm } from '../../../gpus/components';
import { useGpuCache } from '../../../shared/cache';
import { Breadcrumb, Breadcrumbs, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { Sidenav, SidenavComparisons, SidenavGpus } from '../../../sidenav';
import {
  Benchmarks,
  GeneralInfo,
  Highlights,
  Intro,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { createViewPageContextState, ViewPageContext } from './context';

export const ViewGpuPage = (props: ViewGpuViewModel) => {
  const { gpu, relatedGpus, relatedComparisons, contentData } = props;
  useGpuCache(gpu);

  const context = createViewPageContextState({ gpu: gpu, contentData });

  const title = getGpuName(gpu);
  const canonical = getViewGpuPath(gpu);
  const keywords = [getGpuName(gpu)];

  return (
    <ViewPageContext.Provider value={context}>
      <Seo title={title} keywords={keywords} canonical={canonical} />
      <WebsiteLayout>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
          <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <section className="flex flex-col w-full">
            <h1 className="md:text-2xl text-3xl">{title}</h1>
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
