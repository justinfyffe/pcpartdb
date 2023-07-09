import { Cpu, getAdminEditCpuPath } from '@pcpartdb/shared';
import { formatCpuName } from 'packages/website/src/client/product';
import React, { FunctionComponent, useMemo } from 'react';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { MissingCpuDataChip } from '../MissingCpuDataChip';

interface CpuTableProps {
  cpus: Cpu[];
}

export const CpuTable: FunctionComponent<CpuTableProps> = (props) => {
  const { cpus } = props;

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
        {cpus.map((cpu) => (
          <CpuTableRow key={cpu.id} cpu={cpu} />
        ))}
      </TBody>
    </Table>
  );
};

interface CpuTableRowProps {
  cpu: Cpu;
}

const CpuTableRow: FunctionComponent<CpuTableRowProps> = (props) => {
  const { cpu } = props;

  const href = useMemo(() => getAdminEditCpuPath(cpu), [cpu]);
  const name = useMemo(() => formatCpuName(cpu), [cpu]);

  return (
    <Tr key={cpu.id}>
      <Td className="text-left">{cpu.id}</Td>
      <Td>
        <a href={href}>{name}</a>
      </Td>
      <Td className="p-0">
        <MissingCpuDataChip cpu={cpu} />
      </Td>
    </Tr>
  );
};
