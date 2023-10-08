import {
  formatProductName,
  getAdminEditGpuPath,
  GpuProduct,
} from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useMemo } from 'react';
import { MissingDataChip } from '../MissingDataChip';

interface GpuTableProps {
  gpus: GpuProduct[];
}

export const GpuTable: FunctionComponent<GpuTableProps> = (props) => {
  const { gpus } = props;

  return (
    <Table border responsive>
      <THead>
        <Tr className="font-medium">
          <Th className="text-left">ID</Th>
          <Th className="text-left">Name</Th>
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
  gpu: GpuProduct;
}

const GpuTableRow: FunctionComponent<GpuTableRowProps> = (props) => {
  const { gpu } = props;

  const href = useMemo(() => getAdminEditGpuPath(gpu), [gpu]);
  const name = useMemo(() => formatProductName(gpu), [gpu]);

  return (
    <Tr key={gpu.id}>
      <Td className="text-left">{gpu.id}</Td>
      <Td>
        <a href={href}>{name}</a>
      </Td>
      <Td className="p-0">
        <MissingDataChip gpu={gpu} />
      </Td>
    </Tr>
  );
};
