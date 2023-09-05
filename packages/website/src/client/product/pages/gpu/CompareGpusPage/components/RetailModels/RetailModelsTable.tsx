import {
  formatGpuName,
  getGpuChipset,
  getViewGpuPath,
  Gpu,
} from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context';

interface RetailModelsTableProps {
  className?: string;
}

export const RetailModelsTable: FunctionComponent<RetailModelsTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison, contentData } = useContext(ComparePageContext);
  const [currentGpu1, currentGpu2] = comparison;
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);
  const { retailModels1, retailModels2 } = contentData;

  const chipsetShortName1 = useMemo(
    () => formatGpuName(chipset1, { company: false }),
    [chipset1],
  );
  const chipsetShortName2 = useMemo(
    () => formatGpuName(chipset2, { company: false }),
    [chipset2],
  );

  return (
    <div className="flex md:flex-wrap gap-4">
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
    </div>
  );
};

interface RetailModelsTableRowProps {
  currentGpu: Gpu;
  retailModel: Gpu;
}

const RetailModelsTableRow: FunctionComponent<RetailModelsTableRowProps> = (
  props,
) => {
  const { currentGpu, retailModel } = props;

  const name = useMemo(() => formatGpuName(retailModel), [retailModel]);
  const viewHref = useMemo(() => getViewGpuPath(retailModel), [retailModel]);

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
