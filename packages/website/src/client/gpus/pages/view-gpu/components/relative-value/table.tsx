import { Gpu } from '@pcpartdb/shared/gpus';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { getGpuName, getViewGpuSlug } from '../../../../../gpus';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { getViewGpuPath } from '../../../../../shared/website';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { gpu, contentData } = useContext(ViewPageContext);
  const { relativeValueGpus } = contentData;

  const getRelativeValue = useCallback(
    (relatedGpu: Gpu) => {
      const baseline = gpu.benchmarks.valueScore.value;
      const relatedValue = relatedGpu.benchmarks.valueScore.value;

      return ((relatedValue / baseline) * 100).toFixed(0);
    },
    [gpu],
  );

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th className="text-left">Relative Value</Th>
          <Th className="text-left">Rank</Th>
        </Tr>
      </THead>
      <TBody>
        {relativeValueGpus.map((relativeGpu) => (
          <CustomRow key={relativeGpu.id} highlight={relativeGpu.id === gpu.id}>
            <CustomRowLabel>
              <a href={getViewGpuPath(getViewGpuSlug(relativeGpu))}>
                {getGpuName(relativeGpu, { company: false })}
              </a>
            </CustomRowLabel>
            <CustomRowValue className="text-left">
              {getRelativeValue(relativeGpu)}%
            </CustomRowValue>
            <CustomRowValue className="text-left">
              {relativeGpu.ranks?.valueRank}
            </CustomRowValue>
          </CustomRow>
        ))}
      </TBody>
    </Table>
  );
};
