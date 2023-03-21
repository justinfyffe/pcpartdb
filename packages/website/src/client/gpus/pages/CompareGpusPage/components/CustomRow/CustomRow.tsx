import React from 'react';
import { Td, Tr } from '../../../../../shared/components';
import { classNames } from '../../../../../shared/ui';

interface CustomRowProps {
  highlight?: boolean;
  secondary?: boolean;
  children?: React.ReactElement<CustomRowLabelProps | CustomRowValueProps>[];
}

export const CustomRow = (props: CustomRowProps) => {
  const { children, highlight, secondary } = props;

  return (
    <Tr
      className={classNames(
        highlight ? 'font-bold !bg-indigo-100' : '',
        secondary ? 'font-bold !bg-fuchsia-100' : '',
      )}
    >
      {children}
    </Tr>
  );
};

interface CustomRowLabelProps {
  children?: React.ReactNode;
}

export const CustomRowLabel = (props: CustomRowLabelProps) => {
  const { children } = props;

  return <Td className="text-left w-[33%]">{children}</Td>;
};

interface CustomRowValueProps {
  children?: React.ReactNode;

  className?: string;
}

export const CustomRowValue = (props: CustomRowValueProps) => {
  const { children, className } = props;

  return (
    <Td className={classNames('text-left w-[33%]', className)}>{children}</Td>
  );
};
