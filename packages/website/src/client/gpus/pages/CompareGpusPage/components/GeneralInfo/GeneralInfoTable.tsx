import React, { FunctionComponent, useContext } from 'react';
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

  const ranks1 = gpu1.ranks;
  const ranks2 = gpu2.ranks;

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
          <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
          <CustomRowValue>
            {gpu1.performanceScore != null && ranks1.performanceRank != null ? (
              <>
                {formatGpuField(gpu1.performanceScore)} (
                {ranks1.performanceRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {gpu2.performanceScore != null && ranks2.performanceRank != null ? (
              <>
                {formatGpuField(gpu2.performanceScore)} (
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
            {gpu1.valueScore != null && ranks1.valueRank != null ? (
              <>
                {formatGpuField(gpu1.valueScore)} ({ranks1.valueRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {gpu2.valueScore != null && ranks2.valueRank != null ? (
              <>
                {formatGpuField(gpu2.valueScore)} ({ranks2.valueRank})
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
