import { formatSpec, getGpuName, getViewGpuSlug } from '@client/product';
import { Table, TBody, Td, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { formatProductMeta } from '@shared/product-meta';
import React, { FunctionComponent, useContext } from 'react';
import { ListPageContext } from '../../context';

export const ListTable: FunctionComponent = () => {
  const { gpus } = useContext(ListPageContext);

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
          <Tr key={gpu.id}>
            <Td>
              <a
                href={getViewGpuPath(getViewGpuSlug(gpu))}
                className="font-semibold"
              >
                {getGpuName(gpu)}
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
