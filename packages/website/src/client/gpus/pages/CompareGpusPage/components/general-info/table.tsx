import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { formatGpuField, getGpuName, getShoppingUrl } from '../../../..';
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

  const benchmarks1 = gpu1.benchmarks;
  const ranks1 = gpu1.ranks;
  const benchmarks2 = gpu2.benchmarks;
  const ranks2 = gpu2.ranks;

  const shoppingUrl1 = getShoppingUrl(gpu1);
  const shoppingUrl2 = getShoppingUrl(gpu2);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(gpu1, { company: false })}</Th>
          <Th>{getGpuName(gpu2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <CustomRow>
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
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks1.performanceScore != null &&
            ranks1.performanceRank != null ? (
              <>
                {formatGpuField(benchmarks1.performanceScore)} (
                {ranks1.performanceRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {benchmarks2.performanceScore != null &&
            ranks2.performanceRank != null ? (
              <>
                {formatGpuField(benchmarks2.performanceScore)} (
                {ranks2.performanceRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks1.valueScore != null && ranks1.valueRank != null ? (
              <>
                {formatGpuField(benchmarks1.valueScore)} ({ranks1.valueRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {benchmarks2.valueScore != null && ranks2.valueRank != null ? (
              <>
                {formatGpuField(benchmarks2.valueScore)} ({ranks2.valueRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <FieldRow field="company" />
        <FieldRow field="marketSegment" />
        <FieldRow field="releaseDate" />
        <FieldRow field="launchPrice" />
      </TBody>
    </Table>
  );
};
