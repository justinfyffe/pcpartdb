import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);

  return (
    <>
      <h3 className="mb-1">Compared to BLANK GPUs</h3>
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th className="border-0"></Th>
            <Th className="text-left border-0">Relative Performance</Th>
            <Th className="text-right border-0">Rank</Th>
          </Tr>
        </THead>
        <TBody></TBody>
      </Table>
    </>
  );
};
