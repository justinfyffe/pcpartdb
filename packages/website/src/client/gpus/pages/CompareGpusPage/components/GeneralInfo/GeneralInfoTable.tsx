import React, { FunctionComponent, useContext, useMemo } from 'react';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  CustomRow,
  CustomRowLabel,
  CustomRowValue,
} from '../CustomRow/CustomRow';
import { FieldRow } from '../FieldRow/FieldRow';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;
  const { chipset: parent1 } = gpu1;
  const { chipset: parent2 } = gpu2;

  const ranks1 = gpu1.ranks;
  const ranks2 = gpu2.ranks;

  const [gpuShortName1, gpuShortName2] = useMemo(() => {
    return [
      getGpuName(gpu1, { company: false }),
      getGpuName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

  const [performance1, performance2] = useMemo(() => {
    const rank1 = gpu1.ranks.performanceRank || parent1?.ranks?.performanceRank;
    const rank2 = gpu2.ranks.performanceRank || parent2?.ranks?.performanceRank;
    const score1 =
      formatGpuField(gpu1.performanceScore) ||
      formatGpuField(parent1?.performanceScore);
    const score2 =
      formatGpuField(gpu2.performanceScore) ||
      formatGpuField(parent2?.performanceScore);

    const formatted1 =
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--';
    const formatted2 =
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--';

    return [formatted1, formatted2];
  }, [
    gpu1.performanceScore,
    gpu1.ranks.performanceRank,
    gpu2.performanceScore,
    gpu2.ranks.performanceRank,
    parent1?.performanceScore,
    parent1?.ranks?.performanceRank,
    parent2?.performanceScore,
    parent2?.ranks?.performanceRank,
  ]);

  const [value1, value2] = useMemo(() => {
    const rank1 = gpu1.ranks.valueRank || parent1?.ranks?.valueRank;
    const rank2 = gpu2.ranks.valueRank || parent2?.ranks?.valueRank;
    const score1 =
      formatGpuField(gpu1.valueScore) || formatGpuField(parent1?.valueScore);
    const score2 =
      formatGpuField(gpu2.valueScore) || formatGpuField(parent2?.valueScore);

    const formatted1 =
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--';
    const formatted2 =
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--';

    return [formatted1, formatted2];
  }, [
    gpu1.ranks.valueRank,
    gpu1.valueScore,
    gpu2.ranks.valueRank,
    gpu2.valueScore,
    parent1?.ranks?.valueRank,
    parent1?.valueScore,
    parent2?.ranks?.valueRank,
    parent2?.valueScore,
  ]);

  const [chipset1, chipset2] = useMemo(() => {
    return [getGpuName(parent1 || gpu1), getGpuName(parent2 || gpu2)];
  }, [gpu1, gpu2, parent1, parent2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{gpuShortName1}</Th>
          <Th>{gpuShortName2}</Th>
        </Tr>
      </THead>
      <TBody>
        {/* <CustomRow>
          <CustomRowLabel>Shop</CustomRowLabel>
          <CustomRowValue>
            {shoppingUrl1 != null ? (
              <a
                href={shoppingUrl1}
                target="_blank"
                rel="noreferrer noopener"
                className="text-green-600 font-bold"
              >
                Check Price
              </a>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {shoppingUrl2 != null ? (
              <a
                href={shoppingUrl2}
                target="_blank"
                rel="noreferrer noopener"
                className="text-green-600 font-bold"
              >
                Check Price
              </a>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow> */}
        <CustomRow>
          <CustomRowLabel>Performance Rating (Rank)*</CustomRowLabel>
          <CustomRowValue>{performance1}</CustomRowValue>
          <CustomRowValue>{performance2}</CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)*</CustomRowLabel>
          <CustomRowValue>{value1}</CustomRowValue>
          <CustomRowValue>{value2}</CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Chipset</CustomRowLabel>
          <CustomRowValue>{chipset1}</CustomRowValue>
          <CustomRowValue>{chipset2}</CustomRowValue>
        </CustomRow>
        <FieldRow field="company" />
        <FieldRow field="marketSegment" />
        <FieldRow field="releaseDate" />
        <FieldRow field="launchPrice" />
        <FieldRow field="productionStatus" />
      </TBody>
    </Table>
  );
};
