import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  Cpu,
  formatCpuName,
  getAdminEditCpuPath,
  UpdateCpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services/automationService';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
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

  const enqueueCpuUpdate = useCallback(async () => {
    await automationService.createAction<UpdateCpuActionData>({
      type: AutomationActionType.UpdateCpu,
      description: formatCpuName(cpu),
      data: { cpuId: cpu.id },
    });
  }, [cpu]);

  return (
    <Tr key={cpu.id}>
      <Td className="text-left">{cpu.id}</Td>
      <Td>
        <a href={href}>{name}</a>
      </Td>
      <Td className="p-0">
        <MissingCpuDataChip cpu={cpu} />
      </Td>
      <Td className="text-right">
        <GenericButton
          disableAfterClickSeconds={5}
          showDisabledTimer
          onClick={enqueueCpuUpdate}
        >
          <ArrowPathIcon className="w-4" />
        </GenericButton>
      </Td>
    </Tr>
  );
};
