import 'reflect-metadata';
import {
  Cpu,
  DEFAULT_LIST_CPUS_LIMIT,
  DEFAULT_LIST_CPUS_OFFSET,
  generateListCpusQueryFromPath,
  getAdminImportCpusPath,
  getAdminListCpusPath,
  getAdminNewCpuPath,
  ListCpusQuery,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { SuccessAlert } from 'packages/website/src/client/shared/components/Alert/SuccessAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import React, { useCallback, useEffect, useState } from 'react';
import { cpuService } from '../../../../product/services/cpuService';
import { AdminLayout } from '../../../../shared/layouts';
import { CpuPagination, CpuTable } from './components';

export const AdminListCpusPage = () => {
  const router = useRouter();
  const offset = Number(router.query.offset || DEFAULT_LIST_CPUS_OFFSET);
  const limit = Number(router.query.limit || DEFAULT_LIST_CPUS_LIMIT);

  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const [cpus, setCpus] = useState<Cpu[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState<ListCpusQuery>({
    pagination: { offset, limit },
  });

  const [_loading, setLoading] = useState(false);

  const fetchCpus = useCallback(async (q: ListCpusQuery) => {
    setLoading(true);
    const response = await cpuService.list(q);
    setCpus(response.cpus);
    setTotalResults(response.totalCpus);
    setQuery(q);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCpus(query);
  }, [fetchCpus, query]);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchCpus(generateListCpusQueryFromPath(cb.as));
      return true;
    });
  }, [fetchCpus, router]);

  const handlePageClick = useCallback(
    (query: ListCpusQuery) => {
      setQuery(query);
      const url = getAdminListCpusPath(query);
      router.push(url, undefined, { shallow: true });
    },
    [router],
  );

  const pageTitle = 'CPUs';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <section>
          {saved && <SuccessAlert>The CPU has been saved.</SuccessAlert>}

          {deleted && <SuccessAlert>The CPU has been deleted.</SuccessAlert>}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <div className="flex gap-4">
            <GenericButton href={getAdminImportCpusPath()}>
              Import Bulk
            </GenericButton>
            <GenericButton href={getAdminNewCpuPath()}>Add</GenericButton>
          </div>
        </div>

        <section>
          {cpus.length > 0 && (
            <>
              <CpuTable cpus={cpus} />
              <CpuPagination
                query={query}
                totalCpus={totalResults}
                onPageClick={handlePageClick}
              />
            </>
          )}

          {cpus.length === 0 && <InfoAlert>There are no CPUs.</InfoAlert>}
        </section>
      </article>
    </AdminLayout>
  );
};
