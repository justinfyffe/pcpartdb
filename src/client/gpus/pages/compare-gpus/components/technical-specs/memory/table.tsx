import { getGpuName } from '@client/gpus';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { FieldRow } from '../../field-row';

interface MemoryTableProps {
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(gpu1, { company: false })}</Th>
          <Th>{getGpuName(gpu2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <FieldRow field="memorySize" />
        <FieldRow field="memoryType" />
        <FieldRow field="memoryBandwidth" />
        <FieldRow field="memoryClock" />
        <FieldRow field="memoryInterface" />
      </TBody>
    </Table>
  );
};
