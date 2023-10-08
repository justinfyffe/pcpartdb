import { formatCompanyName } from '@pcpartdb/shared';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { ListPageContext } from '../../context/ListPageContext';

interface ListFilterComnpanyProps {
  className?: string;
}

export const ListFilterComnpany: FunctionComponent<ListFilterComnpanyProps> = (
  props,
) => {
  const { query, updateQuery } = useContext(ListPageContext);

  const companies = useMemo(
    () => new Set<string>(query.filter?.company),
    [query.filter?.company],
  );

  const handleCompanyToggle = useCallback(
    (company: string, enabled: boolean) => {
      if (enabled) {
        companies.add(company);
      } else {
        companies.delete(company);
      }

      updateQuery({
        ...query,
        pagination: { ...(query.pagination ?? {}), offset: 0 },
        filter: {
          ...query.filter,
          company: companies.size > 0 ? [...companies.keys()] : undefined,
        },
      });
    },
    [companies, query, updateQuery],
  );

  return (
    <div className={classNames('flex flex-col', props.className)}>
      <div className="font-bold m-2">Manufacturer:</div>
      <ListFilterComnpanyItem company="amd" onChange={handleCompanyToggle} />
      <ListFilterComnpanyItem company="ati" onChange={handleCompanyToggle} />
      <ListFilterComnpanyItem company="intel" onChange={handleCompanyToggle} />
      <ListFilterComnpanyItem company="nvidia" onChange={handleCompanyToggle} />
    </div>
  );
};

interface ListFilterComnpanyItemProps {
  company: string;
  onChange: (company: string, value: boolean) => void;
}

const ListFilterComnpanyItem: FunctionComponent<ListFilterComnpanyItemProps> = (
  props,
) => {
  const { company, onChange } = props;
  const { query } = useContext(ListPageContext);

  const value = useMemo(
    () => query.filter?.company?.includes(company) ?? false,
    [company, query.filter?.company],
  );
  const name = useMemo(() => formatCompanyName(company), [company]);

  return (
    <Checkbox
      value={value}
      onChange={(value) => onChange(company, value)}
      className="p-2 hover:bg-mouse-hover"
    >
      {name}
    </Checkbox>
  );
};
