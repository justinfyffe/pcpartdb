import React, { FunctionComponent } from 'react';
import { Table, TBody } from '../../../../../shared/components';
import { BenchmarkRow } from './benchmark-row';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <BenchmarkRow benchmark="g3dMark" />
        <BenchmarkRow benchmark="g2dMark" />
        <BenchmarkRow benchmark="timespyGraphics" />
      </TBody>
    </Table>
  );
};
