import { getProductDetailsSlug, getProductName } from '@client/product';
import { Table, TBody, Td, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { formatProductMeta } from '@shared/product-meta';
import { formatSpec } from '@shared/spec';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ListPageContext } from '../../context';

export const ListTable: FunctionComponent = () => {
  const { gpus } = useContext(ListPageContext);
  const router = useRouter();

  const handleGpuRowClick = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router],
  );

  return (
    <Table border responsive className="flex-1">
      <THead>
        <Tr>
          <Th>GPU</Th>
          <Th>Performance Rank</Th>
          <Th>Value Rank</Th>
          <Th>Release Date</Th>
        </Tr>
      </THead>

      <TBody>
        {gpus.map((gpu) => (
          <Tr
            key={gpu.id}
            className="cursor-pointer hover:bg-slate-100"
            onClick={() => handleGpuRowClick(getProductDetailsSlug(gpu))}
          >
            <Td>
              <a href={getViewGpuPath(getProductDetailsSlug(gpu))}>
                {getProductName(gpu)}
              </a>
            </Td>
            <Td>{formatProductMeta(gpu.metas.performanceRank) || '--'}</Td>
            <Td>{formatProductMeta(gpu.metas.valueRank) || '--'}</Td>
            <Td>{formatSpec(gpu.specs.releaseDate) || '--'}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
};
