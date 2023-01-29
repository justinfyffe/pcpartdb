import {
  getCompareGpusSlug,
  getGpuComparisonName,
  getGpuName,
} from '@client/gpus';
import { CompareGpusForm } from '@client/gpus/components';
import { useGpuCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { getCompareGpusPath, getListGpusPath } from '@client/shared/website';
import { Sidenav, SidenavComparisons, SidenavGpus } from '@client/sidenav';
import { GpuComparison, RelatedGpus } from '@shared/gpus';
import React from 'react';
import {
  Benchmarks,
  GeneralInfo,
  Intro,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { GpuHeader } from './components/gpu-header';
import { ComparePageContext, createComparePageContextState } from './context';
import { ComparePageContentData } from './types';

export interface CompareGpuPageProps {
  comparison: GpuComparison;
  contentData: ComparePageContentData;
  relatedGpus: RelatedGpus;
}

export const CompareGpuPage = (props: CompareGpuPageProps) => {
  const { comparison, contentData, relatedGpus } = props;
  useGpuCache(comparison);

  const [gpu1, gpu2] = comparison;

  const context = createComparePageContextState({ comparison, contentData });

  const title = getGpuComparisonName(comparison);
  const keywords = [
    getGpuName(comparison[0]),
    getGpuName(comparison[1]),
    getGpuComparisonName(comparison),
  ];
  const canonical = getCompareGpusPath(
    getCompareGpusSlug(comparison, { ordered: true }),
  );

  return (
    <ComparePageContext.Provider value={context}>
      <WebsiteLayout seo={{ title, keywords, canonical }}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
          <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap gap-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{title}</h1>

            <CompareGpusForm values={[gpu1.id, gpu2.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            <section className="flex md:flex-wrap gap-8 justify-evenly">
              <GpuHeader gpu={gpu1} />
              <GpuHeader gpu={gpu2} />
            </section>

            <Intro />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />

            <section>
              <p className="text-xs">
                The ranks on this page considers the{' '}
                {contentData.totalPerformanceRatedGpus} performance-rated and
                value-rated GPUs that we track in our database. GPUs without
                performance or value ratings are excluded. Check which graphics
                cards we are tracking on our{' '}
                <a href={getListGpusPath()}>GPU list</a> page.
              </p>
            </section>
          </article>

          <Sidenav>
            <SidenavComparisons comparisons={relatedGpus.comparisons} />
            <SidenavGpus gpus={relatedGpus.gpus} />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
