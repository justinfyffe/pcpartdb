import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { formatGpuField, getGpuName } from '../../../..';
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
          <ListTableRow key={gpu.id} gpu={gpu} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  gpu: Gpu;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { gpu } = props;

  const href = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const name = useMemo(() => getGpuName(gpu), [gpu]);
  const performance = useMemo(() => {
    return gpu.ranks?.performanceRank || '--';
  }, [gpu.ranks?.performanceRank]);
  const value = useMemo(() => {
    return gpu.ranks?.valueRank || '--';
  }, [gpu.ranks?.valueRank]);
  const releaseDate = useMemo(
    () => formatGpuField(gpu.releaseDate) || '--',
    [gpu.releaseDate],
  );

  return (
    <Tr>
      <Td>
        <a href={href} className="font-semibold">
          {name}
        </a>
      </Td>
      <Td>{performance}</Td>
      <Td>{value}</Td>
      <Td>{releaseDate}</Td>
    </Tr>
  );
};
