import { formatGpuName, ProductType } from '@pcpartdb/shared';
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

interface ProcessorTableProps {
  className?: string;
}

export const ProcessorTable: FunctionComponent<ProcessorTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatGpuName(gpu1, { company: false }),
      formatGpuName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

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
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.codename, gpu2.codename]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.architecture, gpu2.architecture]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.processSize, gpu2.processSize]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.transistors, gpu2.transistors]}
        />
      </TBody>
    </Table>
  );
};
