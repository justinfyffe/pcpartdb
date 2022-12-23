import { Td, Tr } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
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

  return <Td className="border-r-0 text-left w-[50%]">{children}</Td>;
};

interface CustomRowValueProps {
  children?: React.ReactNode;

  className?: string;
}

export const CustomRowValue = (props: CustomRowValueProps) => {
  const { children, className } = props;

  return (
    <Td className={classNames('border-l-0 text-left w-[50%]', className)}>
      {children}
    </Td>
  );
};
