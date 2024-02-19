import React, { HTMLProps } from 'react';
import { classNames } from '../../utils/classNames';

interface TableProps extends HTMLProps<HTMLTableElement> {
  responsive?: boolean;
  border?: boolean;
}

export function Table(props: TableProps) {
  const { children, border = false, responsive = false, ...htmlProps } = props;

  return (
    <React.Fragment>
      {responsive && (
        <div
          className={classNames(
            'block overflow-x-auto w-full',
            props.className,
          )}
        >
          <table
            {...htmlProps}
            className={classNames(
              'border-collapse w-full max-w-full',
              border ? 'bordered-table' : '',
            )}
          >
            {children}
          </table>
        </div>
      )}
      {!responsive && (
        <table
          {...htmlProps}
          className={classNames(
            'border-collapse w-full max-w-full',
            border ? 'bordered-table' : '',
            props.className,
          )}
        >
          {children}
        </table>
      )}
    </React.Fragment>
  );
}
