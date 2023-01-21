import { Checkbox } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { PartSort } from '@shared/part';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { ListPageContext } from '../../context';

interface ListFiltersProps {
  className?: string;
}

export const ListFilters: FunctionComponent<ListFiltersProps> = (props) => {
  const { query, setQuery } = useContext(ListPageContext);

  const [companies] = useState(() => new Set<string>(query.filter?.company));

  const handleBestPerformanceClick = useCallback(() => {
    setQuery({
      ...query,
      orderBy: { sort: PartSort.PerformanceRating },
    });
  }, [query, setQuery]);

  const handleBestValueClick = useCallback(() => {
    setQuery({
      ...query,
      orderBy: { sort: PartSort.ValueRating },
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
            query.orderBy?.sort === PartSort.PerformanceRating
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
            query.orderBy?.sort === PartSort.ValueRating ? 'font-bold' : '',
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
