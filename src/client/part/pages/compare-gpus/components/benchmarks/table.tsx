import { getGpuName } from '@client/part';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { BenchmarkRow } from './benchmark-row';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
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
        <BenchmarkRow benchmark="g3dMark" />
        <BenchmarkRow benchmark="g2dMark" />
        <BenchmarkRow benchmark="timeSpyGraphics" />
      </TBody>
    </Table>
  );
};
