import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName } from '@shared/product';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  return (
    <>
      <div className="mb-1 text-right">
        Baseline: <span className="font-bold">{getProductName(product1)}</span>{' '}
        or <a href="#">{getProductName(product2)}</a>
      </div>
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th className="border-0"></Th>
            <Th className="text-left border-0">Relative Value</Th>
            <Th className="text-right border-0">Rank</Th>
          </Tr>
        </THead>
        <TBody></TBody>
      </Table>
    </>
  );
};
