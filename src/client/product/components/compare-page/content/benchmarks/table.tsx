import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName } from '@shared/product';
import React, { FunctionComponent, useContext } from 'react';
import { BenchmarkRow } from '../../benchmark-row';
import { ComparePageContext } from '../../context';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getProductName(product1, { company: false })}</Th>
          <Th>{getProductName(product2, { company: false })}</Th>
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
