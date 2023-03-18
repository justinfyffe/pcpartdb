import { GpuSort } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Checkbox } from '../../../../../shared/components';
import { classNames } from '../../../../../shared/ui';
import { ListPageContext } from '../../context';

interface ListFiltersProps {
  className?: string;
}

export const ListFilters: FunctionComponent<ListFiltersProps> = (props) => {
  const { query, updateQuery: setQuery } = useContext(ListPageContext);

  const [companies] = useState(() => new Set<string>(query.filter?.company));

  const handleBestPerformanceClick = useCallback(() => {
    setQuery({
      ...query,
      offset: 0,
      orderBy: { sort: GpuSort.PerformanceRating },
    });
  }, [query, setQuery]);

  const handleBestValueClick = useCallback(() => {
    setQuery({
      ...query,
      offset: 0,
      orderBy: { sort: GpuSort.ValueRating },
    });
  }, [query, setQuery]);

  const handleCompanyToggle = useCallback(
    (company: string, enabled: boolean) => {
      if (enabled) {
        companies.add(company);
      } else {
        companies.delete(company);
      }

      setQuery({
        ...query,
        offset: 0,
        filter: {
          ...query.filter,
          company: companies.size > 0 ? [...companies.keys()] : undefined,
        },
      });
    },
    [companies, query, setQuery],
  );

  return (
    <div
      className={classNames(
        'flex flex-col gap-4 min-w-62 p-2',
        props.className,
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="font-bold">Sort:</div>
        <a
          onClick={handleBestPerformanceClick}
          className={classNames(
            'cursor-pointer',
            query.orderBy?.sort === GpuSort.PerformanceRating
              ? 'font-bold'
              : '',
          )}
        >
          Best Performance
        </a>
        <a
          onClick={handleBestValueClick}
          className={classNames(
            'cursor-pointer',
            query.orderBy?.sort === GpuSort.ValueRating ? 'font-bold' : '',
          )}
        >
          Best Value
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-bold">Company:</div>
        <Checkbox
          value={query.filter?.company?.includes('amd') ?? false}
          onChange={(value) => handleCompanyToggle('amd', value)}
        >
          AMD
        </Checkbox>
        <Checkbox
          value={query.filter?.company?.includes('intel') ?? false}
          onChange={(value) => handleCompanyToggle('intel', value)}
        >
          Intel
        </Checkbox>
        <Checkbox
          value={query.filter?.company?.includes('nvidia') ?? false}
          onChange={(value) => handleCompanyToggle('nvidia', value)}
        >
          NVIDIA
        </Checkbox>
      </div>
    </div>
  );
};
