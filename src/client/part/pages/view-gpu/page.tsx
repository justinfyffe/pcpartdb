import { getGpuName, getViewGpuSlug } from '@client/part';
import { ComparePartsForm, PartImages } from '@client/part/components';
import { usePartCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { getListGpusPath, getViewGpuPath } from '@client/shared/website';
import { Sidenav, SidenavComparisons, SidenavParts } from '@client/sidenav';
import { Part, RelatedParts } from '@shared/part';
import React from 'react';
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
import { ViewPageContentData } from './types';

export interface ViewGpuPageProps {
  gpu: Part;

  contentData: ViewPageContentData;
  relatedParts: RelatedParts;
}

export const ViewGpuPage = (props: ViewGpuPageProps) => {
  const { gpu, relatedParts, contentData } = props;
  usePartCache(gpu);

  const context = createViewPageContextState({ part: gpu, contentData });

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
            <ComparePartsForm values={[gpu.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex flex-wrap justify-start gap-8">
              <PartImages part={gpu} className="flex-1 min-w-80" />
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
            <SidenavParts parts={relatedParts.gpus} />
            <SidenavComparisons comparisons={relatedParts.comparisons} />
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
