import React, { FunctionComponent, useContext, useMemo } from 'react';
import { Table, TBody } from '../../../../../shared/components';
import { formatGpuField } from '../../../..';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../CustomRow';
import { FieldRow } from '../FieldRow';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const { benchmarks, ranks } = gpu;

  const performanceScoreValue = useMemo(() => {
    if (benchmarks.performanceScore != null && ranks.performanceRank != null) {
      const score = formatGpuField(benchmarks.performanceScore);
      const rank = ranks.performanceRank;

      return `${score} (${rank})`;
    } else {
      return '--';
    }
  }, [benchmarks.performanceScore, ranks.performanceRank]);

  const valueScoreValue = useMemo(() => {
    if (benchmarks.valueScore != null && ranks.valueRank != null) {
      const score = formatGpuField(benchmarks.valueScore);
      const rank = ranks.valueRank;

      return `${score} (${rank})`;
    } else {
      return '--';
    }
  }, [benchmarks.valueScore, ranks.valueRank]);

  return (
    <Table border responsive className={className}>
      <TBody>
        {/* <CustomRow>
          <CustomRowLabel>Shop</CustomRowLabel>
          <CustomRowValue>
            {shoppingUrl != null ? (
              <a
                href={shoppingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-green-600 font-bold"
              >
                Check current price
              </a>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow> */}
        <CustomRow>
          <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
          <CustomRowValue>{performanceScoreValue}</CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)</CustomRowLabel>
          <CustomRowValue>{valueScoreValue}</CustomRowValue>
        </CustomRow>
        <FieldRow field="company" />
        <FieldRow field="architecture" />
        <FieldRow field="marketSegment" />
        <FieldRow field="releaseDate" />
        <FieldRow field="launchPrice" />
      </TBody>
    </Table>
  );
};
