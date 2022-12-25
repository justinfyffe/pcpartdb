import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { SpecRow } from '../../../spec-row';

interface TheoreticalPerformanceTableProps {
  className?: string;
}

export const TheoreticalPerformanceTable: FunctionComponent<
  TheoreticalPerformanceTableProps
> = (props) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <SpecRow spec="pixelFillRate" />
        <SpecRow spec="textureFillRate" />
        <SpecRow spec="fp32Performance" />
        <SpecRow spec="fp64Performance" />
      </TBody>
    </Table>
  );
};
