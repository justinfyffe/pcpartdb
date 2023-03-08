import React, { FunctionComponent, useContext } from 'react';
import { formatGpuField, getShoppingUrl } from '../../../../../gpus';
import { Table, TBody } from '../../../../../shared/components';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';
import { FieldRow } from '../field-row';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const { benchmarks, ranks } = gpu;

  const shoppingUrl = getShoppingUrl(gpu);

  return (
    <Table border responsive className={className}>
      <TBody>
        <CustomRow>
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
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks.performanceScore != null &&
            ranks.performanceRank != null ? (
              <>
                {formatGpuField(benchmarks.performanceScore)} (
                {ranks.performanceRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks.valueScore != null && ranks.valueRank != null ? (
              <>
                {formatGpuField(benchmarks.valueScore)} ({ranks.valueRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
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
