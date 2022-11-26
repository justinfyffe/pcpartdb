import { Td, Tr } from '@client/shared/components';
import React from 'react';

interface CustomRowProps {
  children?: React.ReactElement<CustomRowLabelProps | CustomRowValueProps>[];
}

export const CustomRow = (props: CustomRowProps) => {
  const { children } = props;

  return <Tr>{children}</Tr>;
};

interface CustomRowLabelProps {
  children?: React.ReactNode;
}

export const CustomRowLabel = (props: CustomRowLabelProps) => {
  const { children } = props;

  return <Td className="border-r-0 text-left min-w-45">{children}</Td>;
};

interface CustomRowValueProps {
  children?: React.ReactNode;
}

export const CustomRowValue = (props: CustomRowValueProps) => {
  const { children } = props;

  return <Td className="border-l-0 text-left min-w-20">{children}</Td>;
};
