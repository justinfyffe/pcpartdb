import { getAdminEditGpuPath, Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../../../gpus';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { MissingDataChip } from '../MissingDataChip';

interface GpuTableProps {
  gpus: Gpu[];
}

export const GpuTable: FunctionComponent<GpuTableProps> = (props) => {
  const { gpus } = props;

  return (
    <Table border responsive>
      <THead>
        <Tr className="font-medium">
          <Th className="text-left">ID</Th>
          <Th className="text-left">Name</Th>
          <Th className="text-left">Market Segment</Th>
          <Th></Th>
        </Tr>
      </THead>
      <TBody>
        {gpus.map((gpu) => (
          <GpuTableRow key={gpu.id} gpu={gpu} />
        ))}
      </TBody>
    </Table>
  );
};

interface GpuTableRowProps {
  gpu: Gpu;
}

const GpuTableRow: FunctionComponent<GpuTableRowProps> = (props) => {
  const { gpu } = props;

  const href = useMemo(() => getAdminEditGpuPath(gpu), [gpu]);
  const name = useMemo(() => getGpuName(gpu), [gpu]);
  const segment = useMemo(
    () => formatGpuField(gpu.marketSegment),
    [gpu.marketSegment],
  );

  return (
    <Tr key={gpu.id}>
      <Td className="text-left">{gpu.id}</Td>
      <Td>
        <a href={href}>{name}</a>
      </Td>
      <Td>{segment}</Td>
      <Td className="p-0">
        <MissingDataChip gpu={gpu} />
      </Td>
    </Tr>
  );
};
