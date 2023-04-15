import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  CustomRow,
  CustomRowLabel,
  CustomRowValue,
} from '../CustomRow/CustomRow';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;
  const { relativeValueGpus } = contentData;

  const [baselineGpu, setBaselineGpu] = useState(() => {
    if (gpu1.valueScore?.value == null && gpu2.valueScore?.value == null) {
      return null;
    } else {
      return gpu1.valueScore?.value != null ? gpu1 : gpu2;
    }
  });
  const [secondaryGpu, setSecondaryGpu] = useState(() => {
    if (gpu1.valueScore?.value == null || gpu2.valueScore?.value == null) {
      return null;
    } else {
      return gpu2;
    }
  });

  // Add nulls to rank gaps
  const gpus = useMemo(() => {
    const ret: Gpu[] = [];
    let dontNullGap = false;
    for (let i = 0; i < relativeValueGpus.length; ++i) {
      if (i > 0) {
        const rankDiff =
          relativeValueGpus[i].ranks.valueRank -
          relativeValueGpus[i - 1].ranks.valueRank;

        if (rankDiff !== 1) {
          if (rankDiff === 0) {
            dontNullGap = true;
          } else if (dontNullGap) {
            dontNullGap = false;
          } else {
            ret.push(null);
          }
        }
      }
      ret.push(relativeValueGpus[i]);
    }
    return ret;
  }, [relativeValueGpus]);

  useEffect(() => {
    if (gpu1.valueScore?.value == null && gpu2.valueScore?.value == null) {
      setBaselineGpu(null);
    } else {
      setBaselineGpu(gpu1.valueScore?.value != null ? gpu1 : gpu2);
    }

    if (gpu1.valueScore?.value == null || gpu2.valueScore?.value == null) {
      setSecondaryGpu(null);
    } else {
      setSecondaryGpu(gpu2);
    }
  }, [gpu1, gpu2]);

  const getRelativeValue = useCallback(
    (relatedGpu: Gpu) => {
      const baseline = baselineGpu?.valueScore.value;
      const relatedValue = relatedGpu.valueScore.value;

      return ((relatedValue / baseline) * 100).toFixed(0);
    },
    [baselineGpu],
  );

  const toggleBaselineGpu = useCallback(
    (gpu: Gpu) => {
      setSecondaryGpu(baselineGpu);
      setBaselineGpu(gpu);
    },
    [baselineGpu],
  );

  return (
    <>
      <div className="mb-1 text-right">
        Baseline:{' '}
        <BaselineToggle
          gpu={gpu1}
          active={baselineGpu?.id === gpu1.id}
          onClick={() => toggleBaselineGpu(gpu1)}
        />{' '}
        or{' '}
        <BaselineToggle
          gpu={gpu2}
          active={baselineGpu?.id === gpu2.id}
          onClick={() => toggleBaselineGpu(gpu2)}
        />
      </div>
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th></Th>
            <Th className="text-right">Performance Per Dollar</Th>
            <Th className="text-right">Relative Value</Th>
          </Tr>
        </THead>
        <TBody>
          {gpus.map((gpu, i) =>
            gpu != null ? (
              <CustomRow
                key={gpu.id}
                highlight={gpu.id === baselineGpu?.id}
                secondary={gpu.id === secondaryGpu?.id}
              >
                <CustomRowLabel>
                  <a href={getViewGpuPath(gpu)}>
                    {getGpuName(gpu, { company: false })}
                  </a>
                </CustomRowLabel>
                <CustomRowValue className="text-right">
                  {formatGpuField(gpu.valueScore)}
                </CustomRowValue>
                <CustomRowValue className="text-right">
                  {getRelativeValue(gpu)}%
                </CustomRowValue>
              </CustomRow>
            ) : (
              <Tr key={`idx-${i}`}>
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
  gpu: Gpu;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { gpu, active, onClick } = props;

  if (gpu.valueScore?.value == null) {
    return (
      <span className="text-content-dimmed cursor-not-allowed">
        {getGpuName(gpu)}
      </span>
    );
  }

  if (active) {
    return <span className="font-bold">{getGpuName(gpu)}</span>;
  } else {
    return (
      <a className="cursor-pointer" onClick={onClick}>
        {getGpuName(gpu)}
      </a>
    );
  }
};
