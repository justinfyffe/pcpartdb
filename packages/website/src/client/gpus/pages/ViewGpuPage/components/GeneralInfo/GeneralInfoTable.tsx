import React, { FunctionComponent, useContext, useMemo } from 'react';
import { Table, TBody } from '../../../../../shared/components';
import { formatGpuField, getGpuName } from '../../../..';
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
  const { chipset: parent } = gpu;

  const performanceRank =
    gpu.ranks.performanceRank || parent?.ranks?.performanceRank || null;
  const valueRank = gpu.ranks.valueRank || parent?.ranks?.valueRank || null;

  const chipset = useMemo(() => {
    return getGpuName(parent || gpu);
  }, [parent, gpu]);

  const performanceScoreValue = useMemo(() => {
    const performanceScore =
      formatGpuField(gpu.performanceScore) ||
      formatGpuField(parent?.performanceScore);

    if (performanceScore != null && performanceRank != null) {
      return `${performanceScore} (${performanceRank})`;
    } else {
      return '--';
    }
  }, [gpu.performanceScore, parent?.performanceScore, performanceRank]);

  const valueScoreValue = useMemo(() => {
    const valueScore =
      formatGpuField(gpu.valueScore) || formatGpuField(parent?.valueScore);

    if (valueScore != null && valueRank != null) {
      return `${valueScore} (${valueRank})`;
    } else {
      return '--';
    }
  }, [gpu.valueScore, parent?.valueScore, valueRank]);

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
          <CustomRowLabel>Performance Rating (Rank)*</CustomRowLabel>
          <CustomRowValue>{performanceScoreValue}</CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)*</CustomRowLabel>
          <CustomRowValue>{valueScoreValue}</CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Chipset</CustomRowLabel>
          <CustomRowValue>{chipset}</CustomRowValue>
        </CustomRow>
        <FieldRow field="company" />
        <FieldRow field="architecture" />
        <FieldRow field="marketSegment" />
        <FieldRow field="releaseDate" />
        <FieldRow field="launchPrice" />
        <FieldRow field="productionStatus" />
      </TBody>
    </Table>
  );
};
