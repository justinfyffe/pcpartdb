import { ListGpusFilter, ProductType, SubProductType } from '@pcpartdb/shared';
import { ProductTypeInput } from 'packages/website/src/client/admin/components/product/ProductTypeInput/ProductTypeInput';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
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

  const productType = query.filter.productType;
  let subProductType: SubProductType = null;
  if (productType === ProductType.Gpu) {
    const filter = query.filter as ListGpusFilter;
    if (filter.isChipset) {
      subProductType = SubProductType.GpuChipset;
    } else if (filter.isRetailModel) {
      subProductType = SubProductType.GpuRetailModel;
    }
  }

  const [initialSearch] = useState(query.filter.search ?? '');

  const handleTypeChange = useCallback(
    async (type: ProductType) => {
      const newFilter = { ...query.filter, productType: type };
      if (type === ProductType.Gpu) {
        delete (newFilter as ListGpusFilter).isChipset;
        delete (newFilter as ListGpusFilter).isRetailModel;
      }
      await updateQuery({ ...query, filter: newFilter });
    },
    [query, updateQuery],
  );

  const handleSubTypeChange = useCallback(
    async (selectValue: SelectValue) => {
      const newFilter = { ...query.filter } as ListGpusFilter;
      delete newFilter.isChipset;
      delete newFilter.isRetailModel;

      if (productType === ProductType.Gpu) {
        if (selectValue === SubProductType.GpuChipset) {
          newFilter.isChipset = true;
        } else if (selectValue === SubProductType.GpuRetailModel) {
          newFilter.isRetailModel = true;
        }
      }

      updateQuery({ ...query, filter: newFilter });
    },
    [productType, query, updateQuery],
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

  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <div className="flex flex-col flex-auto">
        <span className="font-medium">Product Type</span>
        <ProductTypeInput
          value={query.filter.productType}
          onChange={handleTypeChange}
        />
      </div>

      <div className="flex flex-col flex-auto">
        <span className="font-medium">Sub Product Type</span>
        <Select
          disabled={productType !== ProductType.Gpu}
          value={subProductType}
          onChange={handleSubTypeChange}
        >
          <SelectOption label="Chipset" value={SubProductType.GpuChipset}>
            Chipset
          </SelectOption>
          <SelectOption
            label="Retail Model"
            value={SubProductType.GpuRetailModel}
          >
            Retail Model
          </SelectOption>
        </Select>
      </div>

      <div className="flex flex-col flex-auto">
        <span className="font-medium">Filter Products</span>
        <TextInput
          value={initialSearch}
          placeholder="Search products"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};
