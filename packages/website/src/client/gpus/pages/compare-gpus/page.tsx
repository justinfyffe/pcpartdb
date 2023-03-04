import { CompareGpusViewModel } from '@pcpartdb/shared/view-models';
import React from 'react';
import {
  getCompareGpusSlug,
  getGpuComparisonName,
  getGpuName,
} from '../../../gpus';
import { CompareGpusForm } from '../../../gpus/components';
import { useGpuCache } from '../../../shared/cache';
import { Breadcrumb, Breadcrumbs } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { getCompareGpusPath, getListGpusPath } from '../../../shared/website';
import { Sidenav, SidenavComparisons, SidenavGpus } from '../../../sidenav';
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

export const CompareGpuPage = (props: CompareGpusViewModel) => {
  const { comparison, contentData, relatedGpus, relatedComparisons } = props;
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
            <SidenavComparisons comparisons={relatedComparisons.comparisons} />
            <SidenavGpus gpus={relatedGpus.gpus} />
          </Sidenav>
        </div>
      </WebsiteLayout>
    </ComparePageContext.Provider>
  );
};
