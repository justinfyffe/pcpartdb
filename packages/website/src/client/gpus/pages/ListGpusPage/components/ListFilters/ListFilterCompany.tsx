import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Checkbox } from '../../../../../shared/components';
import { classNames } from '../../../../../shared/ui';
import { formatGpuCompany } from '../../../../gpu-utils';
import { ListPageContext } from '../../context';

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
        offset: 0,
        filter: {
          ...query.filter,
          company: companies.size > 0 ? [...companies.keys()] : undefined,
        },
      });
    },
    [companies, query, updateQuery],
  );

  return (
    <div className={classNames('flex flex-col gap-2', props.className)}>
      <div className="font-bold">Company:</div>
      <ListFilterComnpanyItem company="amd" onChange={handleCompanyToggle} />
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
  const name = useMemo(() => formatGpuCompany(company), [company]);

  return (
    <Checkbox value={value} onChange={(value) => onChange(company, value)}>
      {name}
    </Checkbox>
  );
};
