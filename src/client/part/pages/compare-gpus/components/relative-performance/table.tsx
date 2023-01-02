import { getGpuName, getViewGpuSlug } from '@client/part';
import { Table, TBody, Td, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Part } from '@shared/part';
import { formatPartMeta } from '@shared/part-meta';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ComparePageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const [part1, part2] = comparison;
  const { relativePerformanceGpus } = contentData;

  const [baselinePart, setBaselinePart] = useState(part1);
  const [secondaryPart, setSecondaryPart] = useState(part2);

  // Add nulls to rank gaps
  const gpus = useMemo(() => {
    const ret: Part[] = [];
    for (let i = 0; i < relativePerformanceGpus.length; ++i) {
      if (i > 0) {
        const rankDiff =
          relativePerformanceGpus[i].metas.performanceRank.value -
          relativePerformanceGpus[i - 1].metas.performanceRank.value;
        if (rankDiff > 1) {
          ret.push(null);
        }
      }
      ret.push(relativePerformanceGpus[i]);
    }
    return ret;
  }, [relativePerformanceGpus]);

  useEffect(() => {
    setBaselinePart(part1);
    setSecondaryPart(part2);
  }, [part1, part2]);

  const getRelativePerformance = useCallback(
    (relatedGpu: Part) => {
      const baseline = baselinePart.benchmarks.performanceScore.value;
      const relatedPerf = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerf / baseline) * 100).toFixed(0);
    },
    [baselinePart],
  );

  const toggleBaselinePart = useCallback(
    (part: Part) => {
      setSecondaryPart(baselinePart);
      setBaselinePart(part);
    },
    [baselinePart],
  );

  return (
    <>
      <div className="mb-1 text-right">
        Baseline:{' '}
        <BaselineToggle
          part={part1}
          active={baselinePart.id === part1.id}
          onClick={() => toggleBaselinePart(part1)}
        />{' '}
        or{' '}
        <BaselineToggle
          part={part2}
          active={baselinePart.id === part2.id}
          onClick={() => toggleBaselinePart(part2)}
        />
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
          {gpus.map((gpu) =>
            gpu != null ? (
              <CustomRow
                key={gpu.id}
                highlight={gpu.id === baselinePart.id}
                secondary={gpu.id === secondaryPart.id}
              >
                <CustomRowLabel>
                  <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                    {getGpuName(gpu, { company: false })}
                  </a>
                </CustomRowLabel>
                <CustomRowValue className="text-left">
                  {getRelativePerformance(gpu)}%
                </CustomRowValue>
                <CustomRowValue className="text-left">
                  {formatPartMeta(gpu.metas?.performanceRank)}
                </CustomRowValue>
              </CustomRow>
            ) : (
              <Tr>
                <Td colSpan={3} className="text-center">
                  &#8230;
                </Td>
              </Tr>
            ),
          )}
        </TBody>
      </Table>
    </>
  );
};

interface BaselineToggleProps {
  part: Part;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { part, active, onClick } = props;

  if (active) {
    return <span className="font-bold">{getGpuName(part)}</span>;
  } else {
    return (
      <a className="cursor-pointer" onClick={onClick}>
        {getGpuName(part)}
      </a>
    );
  }
};
