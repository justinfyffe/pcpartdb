import { Td, Tr } from '@client/shared/components';
import React from 'react';

interface CustomRowProps {
  label?: string;

  children?: React.ReactNode;
}

export const CustomRow = (props: CustomRowProps) => {
  const { label, children } = props;

  return (
    <Tr>
      <Td className="border-r-0 text-left">{label}</Td>
      <Td className="border-l-0 text-right">{children}</Td>
    </Tr>
  );
};
