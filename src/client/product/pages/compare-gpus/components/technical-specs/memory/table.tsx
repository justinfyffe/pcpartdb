import { getGpuName } from '@client/product';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { SpecRow } from '../../spec-row';

interface MemoryTableProps {
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(product1, { company: false })}</Th>
          <Th>{getGpuName(product2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <SpecRow spec="memorySize" />
        <SpecRow spec="memoryType" />
        <SpecRow spec="memoryBandwidth" />
        <SpecRow spec="memoryClock" />
        <SpecRow spec="memoryInterface" />
      </TBody>
    </Table>
  );
};
