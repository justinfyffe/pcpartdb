import {
  getChipset,
  getCompareGpusPath,
  getViewGpuPath,
  Gpu,
} from '@pcpartdb/shared';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { getGpuName } from '../../../..';
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
  const chipset1 = getChipset(comparison[0]);
  const chipset2 = getChipset(comparison[1]);
  const { retailModels1, retailModels2 } = contentData;

  const chipsetShortName1 = useMemo(
    () => getGpuName(chipset1, { company: false }),
    [chipset1],
  );
  const chipsetShortName2 = useMemo(
    () => getGpuName(chipset2, { company: false }),
    [chipset2],
  );

  return (
    <div className="flex md:flex-wrap gap-4">
      <Table border responsive className={classNames('flex-1', className)}>
        <THead>
          <Tr>
            <Th>{chipsetShortName1}</Th>
            <Th></Th>
          </Tr>
        </THead>
        <TBody>
          {retailModels1.map((retailModel) => (
            <RetailModelsTableRow
              key={currentGpu1?.id + '-' + retailModel?.id}
              currentGpu={currentGpu1}
              otherGpu={currentGpu2}
              retailModel={retailModel}
              side="left"
            />
          ))}
        </TBody>
      </Table>

      <Table border responsive className={classNames('flex-1', className)}>
        <THead>
          <Tr>
            <Th>{chipsetShortName2}</Th>
            <Th></Th>
          </Tr>
        </THead>
        <TBody>
          {retailModels2.map((retailModel) => (
            <RetailModelsTableRow
              key={currentGpu2?.id + '-' + retailModel?.id}
              currentGpu={currentGpu2}
              otherGpu={currentGpu1}
              retailModel={retailModel}
              side="right"
            />
          ))}
        </TBody>
      </Table>
    </div>
  );
};

interface RetailModelsTableRowProps {
  currentGpu: Gpu;
  otherGpu: Gpu;
  retailModel: Gpu;
  side: 'left' | 'right';
}

const RetailModelsTableRow: FunctionComponent<RetailModelsTableRowProps> = (
  props,
) => {
  const { currentGpu, otherGpu, retailModel, side } = props;

  const name = useMemo(() => getGpuName(retailModel), [retailModel]);
  const viewHref = useMemo(() => getViewGpuPath(retailModel), [retailModel]);
  const compareHref = useMemo(
    () =>
      getCompareGpusPath(
        side === 'left' ? [retailModel, otherGpu] : [otherGpu, retailModel],
      ),
    [retailModel, otherGpu, side],
  );

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
      <Td>
        {currentGpu?.id !== retailModel?.id && (
          <a href={compareHref}>(compare)</a>
        )}
      </Td>
    </Tr>
  );
};
