import { getGpuName, getViewGpuSlug } from '@client/gpus';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Gpu } from '@shared/gpus';
import React, { FunctionComponent, useCallback, useContext } from 'react';
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
          <Th className="text-left">Relative Performance</Th>
          <Th className="text-left">Rank</Th>
        </Tr>
      </THead>
      <TBody>
        {relativeValueGpus.map((gpu) => (
          <CustomRow key={gpu.id} highlight={gpu.id === gpu.id}>
            <CustomRowLabel>
              <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                {getGpuName(gpu, { company: false })}
              </a>
            </CustomRowLabel>
            <CustomRowValue className="text-left">
              {getRelativeValue(gpu)}%
            </CustomRowValue>
            <CustomRowValue className="text-left">
              {gpu.ranks?.valueRank}
            </CustomRowValue>
          </CustomRow>
        ))}
      </TBody>
    </Table>
  );
};
