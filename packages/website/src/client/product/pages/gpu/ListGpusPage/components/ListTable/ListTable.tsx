import {
  formatGpuField,
  formatGpuName,
  getViewGpuPath,
  Gpu,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
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
          <Th className="text-right">Performance / $ (MSRP)</Th>
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
  const { contentData } = useContext(ListPageContext);
  const retailModelsCount = contentData?.retailModelCounts?.[gpu.id] ?? 0;

  const href = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const name = useMemo(() => formatGpuName(gpu), [gpu]);
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
    showDialog(<RetailModelsDialog chipset={gpu} />);
  }, [gpu]);

  return (
    <Tr>
      <Td>
        <a href={href} className="font-semibold">
          {name}
        </a>
      </Td>
      <Td className="text-left">
        {retailModelsCount > 0 && (
          <Button
            variant={ButtonVariant.Link}
            onClick={openProductsDialog}
            className="cursor-pointer"
          >
            {retailModelsCount === 1 && <>1 product</>}
            {retailModelsCount > 1 && <>{retailModelsCount} products</>}
          </Button>
        )}
        {retailModelsCount === 0 && <>--</>}
      </Td>
      <Td className="text-right">{performance}</Td>
      <Td className="text-right">{performancePerDollar}</Td>
      <Td className="text-right">{releaseDate}</Td>
    </Tr>
  );
};
