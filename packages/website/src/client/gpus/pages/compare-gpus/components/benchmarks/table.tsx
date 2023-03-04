import React, { FunctionComponent, useContext } from 'react';
import { getGpuName } from '../../../../../gpus';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { ComparePageContext } from '../../context';
import { BenchmarkRow } from './benchmark-row';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
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
        <BenchmarkRow benchmark="g3dMark" />
        <BenchmarkRow benchmark="g2dMark" />
        <BenchmarkRow benchmark="timespyGraphics" />
      </TBody>
    </Table>
  );
};
