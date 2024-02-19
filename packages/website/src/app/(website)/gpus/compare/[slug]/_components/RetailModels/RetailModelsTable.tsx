import {
  formatProductName,
  getGpuChipset,
  getViewGpuPath,
  GpuProduct,
  GpuProductComparison,
} from '@pcpartdb/shared';
import { Card } from 'packages/website/src/app/_common/components/Card/Card';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';

interface RetailModelsTableProps {
  comparison: GpuProductComparison;
  retailModels1: Partial<GpuProduct>[];
  retailModels2: Partial<GpuProduct>[];
  className?: string;
}

export const RetailModelsTable: FunctionComponent<RetailModelsTableProps> = (
  props,
) => {
  const { comparison, retailModels1, retailModels2, className } = props;

  const [currentGpu1, currentGpu2] = comparison;
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);

  const chipsetShortName1 = formatProductName(chipset1, { company: false });
  const chipsetShortName2 = formatProductName(chipset2, { company: false });

  return (
    <div className="flex flex-row md:flex-col gap-6">
      {retailModels1 != null && retailModels1.length > 0 ? (
        <Table border responsive className={classNames('flex-1', className)}>
          <THead>
            <Tr>
              <Th>{chipsetShortName1}</Th>
            </Tr>
          </THead>
          <TBody>
            {retailModels1.map((retailModel) => (
              <RetailModelsTableRow
                key={currentGpu1?.id + '-' + retailModel?.id}
                currentGpu={currentGpu1}
                retailModel={retailModel}
              />
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="flex-1">
          <Card className="items-center justify-center h-auto font-medium text-content">
            No retail cards for the {chipsetShortName1}
          </Card>
        </div>
      )}

      {retailModels2 != null && retailModels2.length > 0 ? (
        <Table border responsive className={classNames('flex-1', className)}>
          <THead>
            <Tr>
              <Th>{chipsetShortName2}</Th>
            </Tr>
          </THead>
          <TBody>
            {retailModels2.map((retailModel) => (
              <RetailModelsTableRow
                key={currentGpu2?.id + '-' + retailModel?.id}
                currentGpu={currentGpu2}
                retailModel={retailModel}
              />
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="flex-1">
          <Card className="items-center justify-center h-auto font-medium text-content">
            No retail cards for the {chipsetShortName2}
          </Card>
        </div>
      )}
    </div>
  );
};

interface RetailModelsTableRowProps {
  currentGpu: GpuProduct;
  retailModel: Partial<GpuProduct>;
}

const RetailModelsTableRow: FunctionComponent<RetailModelsTableRowProps> = (
  props,
) => {
  const { currentGpu, retailModel } = props;

  const name = formatProductName(retailModel);
  const viewHref = getViewGpuPath(retailModel);

  return (
    <Tr
      className={classNames(
        currentGpu?.id === retailModel?.id ? '!bg-indigo-100' : '',
      )}
    >
      <Td
        className={classNames(
          currentGpu?.id === retailModel?.id ? 'font-bold' : '',
        )}
      >
        <a href={viewHref}>{name}</a>
      </Td>
    </Tr>
  );
};
