import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ListPageContext } from '../../context/ListPageContext';

export const ListTable: FunctionComponent = () => {
  const { cpus } = useContext(ListPageContext);

  return (
    <Table border responsive className="flex-1">
      <THead>
        <Tr>
          <Th>CPU</Th>
          <Th className="text-right">Performance Rating</Th>
          <Th className="text-right">Value Rating</Th>
          <Th className="text-right">Release Date</Th>
        </Tr>
      </THead>

      <TBody>
        {cpus.map((cpu) => (
          <ListTableRow key={cpu.id} cpu={cpu} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  cpu: CpuProduct;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { cpu } = props;

  const href = useMemo(() => getViewCpuPath(cpu), [cpu]);
  const name = useMemo(() => formatProductName(cpu), [cpu]);
  const performance = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.performanceRating) ?? '--';
  }, [cpu.fields?.performanceRating]);
  const performancePerDollar = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.performancePerMsrp) ?? '--';
  }, [cpu.fields?.performancePerMsrp]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(cpu.fields?.releaseDate) ?? '--',
    [cpu.fields?.releaseDate],
  );

  return (
    <Tr>
      <Td>
        <a href={href} className="font-semibold">
          {name}
        </a>
      </Td>

      <Td className="text-right">{performance}</Td>
      <Td className="text-right">{performancePerDollar}</Td>
      <Td className="text-right">{releaseDate}</Td>
    </Tr>
  );
};
