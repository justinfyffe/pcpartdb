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
          <Th className="text-right">Performance Rating</Th>
          <Th className="text-right">Performance Per Dollar</Th>
          <Th className="text-right">Release Date</Th>
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
    return formatGpuField(gpu.performanceScore) || '--';
  }, [gpu.performanceScore]);
  const performancePerDollar = useMemo(() => {
    return formatGpuField(gpu.valueScore) || '--';
  }, [gpu.valueScore]);
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
      <Td className="text-right">{performance}</Td>
      <Td className="text-right">{performancePerDollar}</Td>
      <Td className="text-right">{releaseDate}</Td>
    </Tr>
  );
};
