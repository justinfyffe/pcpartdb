import 'reflect-metadata';
import {
  AdminListGpusViewModel,
  generateGpusQueryFromPath,
  getAdminEditGpuPath,
  getAdminListGpusPath,
  getAdminNewGpuPath,
  GpusQuery,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { gpuService } from '../../../gpus';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Pagination,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export const AdminListGpusPage = (props: AdminListGpusViewModel) => {
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const [gpus, setGpus] = useState(props.gpus);
  const [totalResults, setTotalResults] = useState(props.totalResults);
  const [query, setQuery] = useState(props.query);

  const fetchGpus = useCallback(async (q: GpusQuery) => {
    const response = await gpuService.list({ query: q });
    setGpus(response.gpus);
    setTotalResults(response.totalGpus);
    setQuery(q);
  }, []);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchGpus(generateGpusQueryFromPath(cb.as));
      return true;
    });
  }, [fetchGpus, router]);

  const updateQuery = useCallback(
    async (q: GpusQuery) => {
      await fetchGpus(q);
      const url = getAdminListGpusPath(q);
      router.push(url, undefined, { shallow: true });
    },
    [fetchGpus, router],
  );

  const paginationPageClick = useCallback(
    (page: number, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      updateQuery({ ...query, offset: query.limit * (page - 1) });
    },
    [query, updateQuery],
  );

  const paginationHrefBuilder = useCallback(
    (page: number) =>
      getAdminListGpusPath({ ...query, offset: query.limit * (page - 1) }),
    [query],
  );

  return (
    <AdminLayout>
      <article>
        <section>
          {saved && (
            <Alert variant={AlertVariant.Success}>
              The GPU has been saved.
            </Alert>
          )}

          {deleted && (
            <Alert variant={AlertVariant.Success}>
              The GPU has been deleted.
            </Alert>
          )}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">GPUs</h1>

          <Button href={getAdminNewGpuPath()} variant={ButtonVariant.Default}>
            Add
          </Button>
        </div>

        <section>
          {gpus.length > 0 && (
            <>
              <Table border responsive>
                <THead>
                  <Tr className="font-medium">
                    <Th className="text-left">ID</Th>
                    <Th>Name</Th>
                  </Tr>
                </THead>
                <TBody>
                  {gpus.map((gpu) => (
                    <Tr key={gpu.id}>
                      <Td className="text-left">{gpu.id}</Td>
                      <Td>
                        <a href={getAdminEditGpuPath(gpu)}>{gpu.name}</a>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>

              <Pagination
                currentPage={Math.ceil(1 + query.offset / query.limit)}
                resultsPerPage={query.limit}
                totalResults={totalResults}
                onPageClick={paginationPageClick}
                hrefBuilder={paginationHrefBuilder}
                neighborPagesClassName="lg:hidden"
                hidePages={false}
              />
            </>
          )}

          {gpus.length === 0 && (
            <Alert variant={AlertVariant.Info}>There are no GPUs.</Alert>
          )}
        </section>
      </article>
    </AdminLayout>
  );
};
