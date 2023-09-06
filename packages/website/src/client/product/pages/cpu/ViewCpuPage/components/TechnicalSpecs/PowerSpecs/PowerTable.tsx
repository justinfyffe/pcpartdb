import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

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
