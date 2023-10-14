import { formatProductName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

interface ArchitectureTableProps {
  className?: string;
}

export const FeatureTable: FunctionComponent<ArchitectureTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(cpu1, { company: false }),
      formatProductName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.bundledCooler, cpu2.fields?.bundledCooler]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[
            cpu1.fields?.integratedGraphics,
            cpu2.fields?.integratedGraphics,
          ]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[
            cpu1.fields?.extensionsTechnologies,
            cpu2.fields?.extensionsTechnologies,
          ]}
        />
      </TBody>
    </Table>
  );
};
