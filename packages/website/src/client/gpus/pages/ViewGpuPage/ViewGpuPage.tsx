import {
  Config,
  getAdminEditGpuPath,
  getChipset,
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
  Disclaimer,
  GeneralInfo,
  Highlights,
  Overview,
  RelativePerformance,
  RelativeValue,
  RetailModels,
  TechnicalSpecs,
} from './components';
import { ViewPageContext } from './context';
import { useViewPageContextProps } from './hooks';

export const ViewGpuPage = (props: ViewGpuViewModel & { config: Config }) => {
  const { gpu, relatedGpus, relatedComparisons, contentData, config } = props;
  useGpuCache(gpu.chipset, gpu);

  const context = useViewPageContextProps({ gpu, contentData });
  const isRetailModel = gpu.chipset != null;

  const chipset = useMemo(() => getChipset(gpu), [gpu]);
  const chipsetShortName = useMemo(
    () => getGpuName(chipset, { company: false }),
    [chipset],
  );
  const chipsetHref = useMemo(() => getViewGpuPath(chipset), [chipset]);
  const gpuName = useMemo(() => getGpuName(gpu), [gpu]);
  const gpuShortName = useMemo(
    () => getGpuName(gpu, { company: false }),
    [gpu],
  );

  const pageTitle = useMemo(() => gpuName, [gpuName]);
  const seoTitle = `${getGpuName(gpu)}: Specs, performance, and value`;
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
          {isRetailModel && (
            <Breadcrumb href={chipsetHref}>{chipsetShortName}</Breadcrumb>
          )}
          <Breadcrumb>{gpuShortName}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-wrap justify-center gap-8">
          <section className="flex flex-col w-full">
            <div className="mb-4">
              <h1 className="md:text-2xl text-3xl mb-0">{pageTitle}</h1>
            </div>
            <CompareGpusForm values={[chipset?.id]} />
          </section>

          <article className="md:min-w-full flex-1 flex flex-col gap-4">
            <section className="flex flex-wrap justify-start gap-4">
              {/* <GpuImages gpu={gpu} className="flex-1 min-w-80" /> */}
              <Highlights className="flex-1" />
            </section>

            <Overview />
            <GeneralInfo />
            <RelativePerformance />
            <RelativeValue />
            <Benchmarks />
            <TechnicalSpecs />

            <RetailModels />

            <Disclaimer />
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
