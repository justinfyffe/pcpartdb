import { Checkbox } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ProductsSort } from '@shared/product';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { ListPageContext } from '../../context';

export const ListFilters: FunctionComponent = () => {
  const { query, setQuery } = useContext(ListPageContext);

  console.log(query);

  const [companies] = useState(() => new Set<string>(query.filter?.company));

  const handleBestPerformanceClick = useCallback(() => {
    setQuery({
      ...query,
      orderBy: { sort: ProductsSort.PerformanceRating },
    });
  }, [query, setQuery]);

  const handleBestValueClick = useCallback(() => {
    setQuery({
      ...query,
      orderBy: { sort: ProductsSort.ValueRating },
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
    <section className="flex flex-col gap-4 min-w-40 border-px p-2">
      <div className="flex flex-col gap-2">
        <div className="font-bold">Sort:</div>
        <a
          onClick={handleBestPerformanceClick}
          className={classNames(
            'cursor-pointer',
            query.orderBy?.sort === ProductsSort.PerformanceRating
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
            query.orderBy?.sort === ProductsSort.ValueRating ? 'font-bold' : '',
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
          value={query.filter?.company?.includes('nvidia') ?? false}
          onChange={(value) => handleCompanyToggle('nvidia', value)}
        >
          NVIDIA
        </Checkbox>
      </div>
    </section>
  );
};
