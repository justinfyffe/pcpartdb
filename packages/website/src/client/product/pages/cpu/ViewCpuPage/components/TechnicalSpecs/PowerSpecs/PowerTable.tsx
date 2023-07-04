import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product';
import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody } from '../../../../../../../shared/components';
import { ViewPageContext } from '../../../context';

interface PowerTableProps {
  className?: string;
}

export const PowerTable: FunctionComponent<PowerTableProps> = (props) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.tdp]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.pl1]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.pl2]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.ppt]} />
      </TBody>
    </Table>
  );
};
