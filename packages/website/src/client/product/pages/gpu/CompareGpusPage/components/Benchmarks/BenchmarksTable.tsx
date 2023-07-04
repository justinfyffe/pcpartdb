import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components';
import { formatGpuName } from 'packages/website/src/client/product/utils';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { ComparePageContext } from '../../context';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
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
          fields={[gpu1.g3dMark, gpu2.g3dMark]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.g2dMark, gpu2.g2dMark]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.timespyGraphics, gpu2.timespyGraphics]}
        />
      </TBody>
    </Table>
  );
};
