import { getGpuName } from '@client/part';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { SpecRow } from '../../spec-row';

interface ProcessorTableProps {
  className?: string;
}

export const ProcessorTable: FunctionComponent<ProcessorTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(part1, { company: false })}</Th>
          <Th>{getGpuName(part2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <SpecRow spec="gpuName" />
        <SpecRow spec="architecture" />
        <SpecRow spec="processSize" />
        <SpecRow spec="transistors" />
      </TBody>
    </Table>
  );
};
