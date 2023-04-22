import {
  CompareGpusViewModel,
  getCompareGpusPath,
  getHomePath,
  getListGpusPath,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { useGpuCache } from '../../../shared/cache';
import { Breadcrumb, Breadcrumbs, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { Sidenav, SidenavComparisons, SidenavGpus } from '../../../sidenav';
import { getGpuComparisonName, getGpuName } from '../..';
import { CompareGpusForm } from '../../components';
import {
  Benchmarks,
  GeneralInfo,
  Overview,
  RelativePerformance,
  RelativeValue,
  TechnicalSpecs,
} from './components';
import { ComparePageContext } from './context';
import { useComparePageContextProps } from './hooks';

export const CompareGpuPage = (props: CompareGpusViewModel) => {
  const { comparison, contentData, relatedGpus, relatedComparisons } = props;
  useGpuCache(comparison);

  const [gpu1, gpu2] = comparison;

  const context = useComparePageContextProps({ comparison, contentData });

  const pageTitle = getGpuComparisonName(comparison);
  const seoTitle = `${getGpuComparisonName(comparison, {
    company: false,
  })}: Compare specs, performance, and value`;
  const seoKeywords = [
    pageTitle,
    getGpuName(comparison[0]),
    getGpuName(comparison[1]),
    getGpuName(comparison[0], { company: false }),
    getGpuName(comparison[1], { company: false }),
  ];
  const seoDescription = useMemo(() => {
    const shortGpuName1 = getGpuName(gpu1, { company: false, brand: false });
    const shortGpuName2 = getGpuName(gpu2, { company: false, brand: false });

    return (
      `Compare the specs, benchmarks, and performance per dollar of the ${shortGpuName1} and ${shortGpuName2}. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.'
    );
  }, [gpu1, gpu2]);
  const seoCanonical = getCompareGpusPath(comparison, { ordered: true });

  return (
    <ComparePageContext.Provider value={context}>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />
      <WebsiteLayout>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
          <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
          <Breadcrumb>{pageTitle}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap gap-8 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{pageTitle}</h1>

            <CompareGpusForm values={[gpu1.id, gpu2.id]} />
          </section>

          <article className="flex-1 flex flex-col gap-8">
            {/* <section className="flex md:flex-wrap gap-8 justify-evenly">
              <GpuHeader gpu={gpu1} />
              <GpuHeader gpu={gpu2} />
            </section> */}

            {/* <Intro /> */}
            <Overview />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />
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
