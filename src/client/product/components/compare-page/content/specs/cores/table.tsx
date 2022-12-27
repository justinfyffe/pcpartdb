import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName } from '@shared/product';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { SpecRow } from '../../../spec-row';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
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
        <SpecRow spec="shaderUnitsCudaCores" />
        <SpecRow spec="textureMappingUnits" />
        <SpecRow spec="renderOutputUnits" />
        <SpecRow spec="tensorCores" />
        <SpecRow spec="rayTracingCores" />
        <SpecRow spec="coreClockSpeedBase" />
        <SpecRow spec="coreClockSpeedBoost" />
        <SpecRow spec="l1Cache" />
        <SpecRow spec="l2Cache" />
        <SpecRow spec="pixelFillRate" />
        <SpecRow spec="textureFillRate" />
        <SpecRow spec="fp32Performance" />
        <SpecRow spec="fp64Performance" />
      </TBody>
    </Table>
  );
};

interface CoresPerformanceTableProps {
  className?: string;
}

export const CoresPerformanceTable: FunctionComponent<
  CoresPerformanceTableProps
> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
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
        <SpecRow spec="pixelFillRate" />
        <SpecRow spec="textureFillRate" />
        <SpecRow spec="fp32Performance" />
        <SpecRow spec="fp64Performance" />
      </TBody>
    </Table>
  );
};
