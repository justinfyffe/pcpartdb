import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { AdminListImagesContext } from '../../context/AdminListImagesContext';

interface ListFiltersProps {
  //
}

export const ListFilters: FunctionComponent<ListFiltersProps> = () => {
  const context = useContext(AdminListImagesContext);
  const { query, updateQuery } = context;

  const [initialSearch] = useState(query.filter.search ?? '');

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
    <div className="flex flex-col mb-4 gap-4 flex-wrap">
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col flex-auto">
          <span className="font-medium">Search Images</span>
          <TextInput
            value={initialSearch}
            placeholder="Name of image"
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};
