import { Table, TBody, Td, Th, THead, Tr } from '@client/shared/components';
import { getProductName } from '@shared/product';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../../custom-row';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
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
            <Th></Th>
            <Th className="text-left">Relative Performance</Th>
            <Th className="text-left">Rank</Th>
          </Tr>
        </THead>
        <TBody>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 4090</CustomRowLabel>
            <CustomRowValue className="text-left">210%</CustomRowValue>
            <CustomRowValue className="text-left">10</CustomRowValue>
          </CustomRow>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 3090</CustomRowLabel>
            <CustomRowValue className="text-left">120%</CustomRowValue>
            <CustomRowValue className="text-left">11</CustomRowValue>
          </CustomRow>
          <CustomRow secondary>
            <CustomRowLabel>GeForceRTX 3070</CustomRowLabel>
            <CustomRowValue className="text-left">110%</CustomRowValue>
            <CustomRowValue className="text-left">12</CustomRowValue>
          </CustomRow>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 3060</CustomRowLabel>
            <CustomRowValue className="text-left">105%</CustomRowValue>
            <CustomRowValue className="text-left">13</CustomRowValue>
          </CustomRow>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 2080</CustomRowLabel>
            <CustomRowValue className="text-left">102%</CustomRowValue>
            <CustomRowValue className="text-left">14</CustomRowValue>
          </CustomRow>
          <Tr>
            <Td colSpan={3} className="text-center">
              &#8230;
            </Td>
          </Tr>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 2080</CustomRowLabel>
            <CustomRowValue className="text-left">102%</CustomRowValue>
            <CustomRowValue className="text-left">42</CustomRowValue>
          </CustomRow>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 2080</CustomRowLabel>
            <CustomRowValue className="text-left">102%</CustomRowValue>
            <CustomRowValue className="text-left">43</CustomRowValue>
          </CustomRow>
          <CustomRow highlight>
            <CustomRowLabel>GeForceRTX 2070</CustomRowLabel>
            <CustomRowValue className="text-left">100%</CustomRowValue>
            <CustomRowValue className="text-left">44</CustomRowValue>
          </CustomRow>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 2060</CustomRowLabel>
            <CustomRowValue className="text-left">90%</CustomRowValue>
            <CustomRowValue className="text-left">45</CustomRowValue>
          </CustomRow>
          <CustomRow>
            <CustomRowLabel>GeForceRTX 3050</CustomRowLabel>
            <CustomRowValue className="text-left">0%</CustomRowValue>
            <CustomRowValue className="text-left">46</CustomRowValue>
          </CustomRow>
        </TBody>
      </Table>
    </>
  );
};
