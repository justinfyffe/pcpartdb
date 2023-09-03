import { formatCpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../../shared/components';
import { ComparePageContext } from '../../../context';

interface PowerTableProps {
  className?: string;
}

export const PowerTable: FunctionComponent<PowerTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatCpuName(cpu1, { company: false }),
      formatCpuName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu1.tdp, cpu2.tdp]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu1.pl1, cpu2.pl1]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu1.pl2, cpu2.pl2]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu1.ppt, cpu2.ppt]} />
      </TBody>
    </Table>
  );
};
