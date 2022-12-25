import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { BenchmarkRow } from '../../benchmark-row';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <Table border responsive className="mb-4">
        <TBody>
          <BenchmarkRow benchmark="g3dMark" />
          <BenchmarkRow benchmark="g2dMark" />
          <BenchmarkRow benchmark="timeSpyGraphics" />
        </TBody>
      </Table>
    </Table>
  );
};
