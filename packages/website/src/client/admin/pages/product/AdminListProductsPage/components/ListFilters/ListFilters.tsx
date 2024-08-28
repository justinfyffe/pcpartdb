import { ListGpusFilter, ProductType } from '@pcpartdb/shared';
import { ProductTypeInput } from 'packages/website/src/client/admin/components/product/ProductTypeInput/ProductTypeInput';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { AdminListProductsContext } from '../../context/AdminListProductsContext';

interface ListFiltersProps {
  //
}

export const ListFilters: FunctionComponent<ListFiltersProps> = () => {
  const context = useContext(AdminListProductsContext);
  const { query, updateQuery } = context;

  const [initialSearch] = useState(query.filter.search ?? '');

  const handleTypeChange = useCallback(
    async (type: ProductType) => {
      const newFilter = { ...query.filter, productType: type };
      await updateQuery({ ...query, filter: newFilter });
    },
    [query, updateQuery],
  );

  const handleSearchChange = useCallback(
    async (value: string) => {
      const newFilter = { ...query.filter };
      if (value) {
        newFilter.search = value;
      } else {
        delete newFilter.search;
      }

      await updateQuery({
        ...query,
        filter: newFilter,
        pagination: { ...(query.pagination ?? {}), offset: 0 },
      });
    },
    [query, updateQuery],
  );

  const handleMissingMarketSegmentChange = useCallback(
    (value: boolean) => {
      const newFilter = { ...query.filter } as ListGpusFilter;
      if (value) {
        newFilter.missingMarketSegment = true;
      } else {
        delete newFilter.missingMarketSegment;
      }

      updateQuery({ ...query, filter: newFilter });
    },
    [query, updateQuery],
  );
  const handleMissingProductionStatusChange = useCallback(
    (value: boolean) => {
      const newFilter = { ...query.filter } as ListGpusFilter;
      if (value) {
        newFilter.missingProductionStatus = true;
      } else {
        delete newFilter.missingProductionStatus;
      }

      updateQuery({ ...query, filter: newFilter });
    },
    [query, updateQuery],
  );

  return (
    <div className="flex flex-col mb-4 gap-4 flex-wrap">
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col flex-auto">
          <span className="font-medium">Product Type</span>
          <ProductTypeInput
            value={query.filter.productType}
            onChange={handleTypeChange}
          />
        </div>

        <div className="flex flex-col flex-auto">
          <span className="font-medium">Search Products</span>
          <TextInput
            value={initialSearch}
            placeholder="Name of product"
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-4 justify-between flex-wrap">
        <div className="flex gap-4 flex-wrap">
          <span>Missing:</span>
          <Checkbox
            value={(query.filter as ListGpusFilter).missingMarketSegment}
            onChange={handleMissingMarketSegmentChange}
          >
            Market Segment?
          </Checkbox>
          <Checkbox
            value={(query.filter as ListGpusFilter).missingProductionStatus}
            onChange={handleMissingProductionStatusChange}
          >
            Production Status?
          </Checkbox>
        </div>
      </div>
    </div>
  );
};
