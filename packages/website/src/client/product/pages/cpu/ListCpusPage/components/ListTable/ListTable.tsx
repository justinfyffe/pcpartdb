import {
  Cpu,
  formatCpuField,
  formatCpuName,
  getViewCpuPath,
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
import { ListPageContext } from '../../context';

export const ListTable: FunctionComponent = () => {
  const { cpus } = useContext(ListPageContext);

  return (
    <Table border responsive className="flex-1">
      <THead>
        <Tr>
          <Th>CPU</Th>
          <Th className="text-right">Performance</Th>
          <Th className="text-right">Performance / $ (MSRP)</Th>
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
  cpu: Cpu;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { cpu } = props;

  const href = useMemo(() => getViewCpuPath(cpu), [cpu]);
  const name = useMemo(() => formatCpuName(cpu), [cpu]);
  const performance = useMemo(() => {
    return formatCpuField(cpu.performanceScore) || '--';
  }, [cpu.performanceScore]);
  const performancePerDollar = useMemo(() => {
    return formatCpuField(cpu.valueScore) || '--';
  }, [cpu.valueScore]);
  const releaseDate = useMemo(
    () => formatCpuField(cpu.releaseDate) || '--',
    [cpu.releaseDate],
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
