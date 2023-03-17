import {
  getListGpusPath,
  getViewGpuPath,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import React from 'react';
import { getGpuName, getViewGpuSlug } from '../../../gpus';
import { CompareGpusForm, GpuImages } from '../../../gpus/components';
import { useGpuCache } from '../../../shared/cache';
import { Breadcrumb, Breadcrumbs } from '../../../shared/components';
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
  const canonical = getViewGpuPath(getViewGpuSlug(gpu));
  const keywords = [getGpuName(gpu)];

  return (
    <ViewPageContext.Provider value={context}>
      <WebsiteLayout seo={{ title, canonical, keywords }}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
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
              <GpuImages gpu={gpu} className="flex-1 min-w-80" />
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

        <section>
          <p className="text-xs">
            The ranks on this page considers the{' '}
            {contentData.totalPerformanceRatedGpus} GPUs that we track in our
            database. Check which graphics cards we are tracking on our{' '}
            <a href={getListGpusPath()}>GPU list</a> page.
          </p>
        </section>
      </WebsiteLayout>
    </ViewPageContext.Provider>
  );
};
