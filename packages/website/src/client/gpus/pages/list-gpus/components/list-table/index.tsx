import React, { FunctionComponent, useContext } from 'react';
import {
  formatGpuField,
  getGpuName,
  getViewGpuSlug,
} from '../../../../../gpus';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { getViewGpuPath } from '../../../../../shared/website';
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
            <Td>{gpu.ranks?.performanceRank || '--'}</Td>
            <Td>{gpu.ranks?.valueRank || '--'}</Td>
            <Td>{formatGpuField(gpu.releaseDate) || '--'}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
};
