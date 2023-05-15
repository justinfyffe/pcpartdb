import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  showDialog,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { formatGpuField, getGpuName } from '../../../..';
import { ListPageContext } from '../../context';
import { RetailModelsDialog } from '../RetailModelsDialog';

export const ListTable: FunctionComponent = () => {
  const { gpus } = useContext(ListPageContext);

  return (
    <Table border responsive className="flex-1">
      <THead>
        <Tr>
          <Th>GPU</Th>
          <Th className="text-left">Retail Models</Th>
          <Th className="text-right">Performance</Th>
          <Th className="text-right">Performance / $</Th>
          <Th className="text-right">Release Date</Th>
        </Tr>
      </THead>

      <TBody>
        {gpus.map((gpu) => (
          <ListTableRow key={gpu.id} gpu={gpu} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  gpu: Gpu;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { gpu } = props;

  const href = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const name = useMemo(() => getGpuName(gpu), [gpu]);
  const retailModels = useMemo(() => gpu.retailModels || [], [gpu]);
  const performance = useMemo(() => {
    return formatGpuField(gpu.performanceScore) || '--';
  }, [gpu.performanceScore]);
  const performancePerDollar = useMemo(() => {
    return formatGpuField(gpu.valueScore) || '--';
  }, [gpu.valueScore]);
  const releaseDate = useMemo(
    () => formatGpuField(gpu.releaseDate) || '--',
    [gpu.releaseDate],
  );

  const openProductsDialog = useCallback(() => {
    showDialog(<RetailModelsDialog gpu={gpu} />);
  }, [gpu]);

  return (
    <Tr>
      <Td>
        <a href={href} className="font-semibold">
          {name}
        </a>
      </Td>
      <Td className="text-left">
        {retailModels.length > 0 && (
          <a onClick={openProductsDialog} className="cursor-pointer">
            {retailModels.length === 1 && <>1 product</>}
            {retailModels.length > 1 && <>{retailModels.length} products</>}
          </a>
        )}
        {retailModels.length === 0 && <>--</>}
      </Td>
      <Td className="text-right">{performance}</Td>
      <Td className="text-right">{performancePerDollar}</Td>
      <Td className="text-right">{releaseDate}</Td>
    </Tr>
  );
};
