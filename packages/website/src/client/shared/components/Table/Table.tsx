import React, {
  createContext,
  FunctionComponent,
  HTMLProps,
  useContext,
  useState,
} from 'react';
import { classNames } from '../../ui/classNames';

interface TableState {
  border: boolean;
}

const TableContext = createContext<TableState>({
  border: false,
});

interface TableProps extends HTMLProps<HTMLTableElement> {
  responsive?: boolean;
  border?: boolean;
}

export const Table: FunctionComponent<TableProps> = (props) => {
  const { children, border = false, responsive = false, ...htmlProps } = props;
  const [context] = useState<TableState>({ border });

  return (
    <React.Fragment>
      <TableContext.Provider value={context}>
        {responsive && (
          <div className="block overflow-x-auto w-full">
            <table
              {...htmlProps}
              className={classNames(
                'border-collapse w-full max-w-full',
                props.className,
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
              props.className,
            )}
          >
            {children}
          </table>
        )}
      </TableContext.Provider>
    </React.Fragment>
  );
};

interface THeadProps extends HTMLProps<HTMLTableSectionElement> {}

export const THead: FunctionComponent<THeadProps> = (props) => {
  const { children, ...htmlProps } = props;

  return <thead {...htmlProps}>{children}</thead>;
};

interface TBodyProps extends HTMLProps<HTMLTableSectionElement> {}

export const TBody: FunctionComponent<TBodyProps> = (props) => {
  const { children, ...htmlProps } = props;

  return <tbody {...htmlProps}>{children}</tbody>;
};

interface TrProps extends HTMLProps<HTMLTableRowElement> {
  sticky?: boolean;
}

export const Tr: FunctionComponent<TrProps> = (props) => {
  const { children, className, sticky, ...htmlProps } = props;

  return (
    <tr
      className={classNames(
        sticky
          ? 'sticky shadow-[inset_0px_-1px_0px_0px_#e5e7eb] top-[-1px] z-10 '
          : '',
        className,
      )}
      {...htmlProps}
    >
      {children}
    </tr>
  );
};

interface ThProps extends HTMLProps<HTMLTableCellElement> {}

export const Th: FunctionComponent<ThProps> = (props) => {
  const { children, className, ...htmlProps } = props;
  const context = useContext(TableContext);

  return (
    <th
      {...htmlProps}
      className={classNames(
        'text-left p-2 font-medium',
        context.border ? 'border-y-px first:border-l-px last:border-r-px' : '',
        className,
      )}
    >
      {children}
    </th>
  );
};

interface TdProps extends HTMLProps<HTMLTableCellElement> {}

export const Td: FunctionComponent<TdProps> = (props) => {
  const { children, className, ...htmlProps } = props;
  const context = useContext(TableContext);

  return (
    <td
      {...htmlProps}
      className={classNames(
        'p-2 text-left',
        context.border ? 'border-y-px first:border-l-px last:border-r-px' : '',
        className,
      )}
    >
      {children}
    </td>
  );
};
