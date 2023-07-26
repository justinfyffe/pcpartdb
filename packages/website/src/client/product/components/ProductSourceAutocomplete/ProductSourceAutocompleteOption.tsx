import { ProductSource } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { AutocompleteOption } from '../../../shared/components';

interface ProductSourceAutocompleteOptionProps {
  index: number;
  source: ProductSource;
}

export const ProductSourceAutocompleteOption: FunctionComponent<
  ProductSourceAutocompleteOptionProps
> = (props) => {
  const { index, source } = props;

  const id = source.id;
  const name = source.sourceName;
  const sourceKey = source.sourceKey;

  return (
    <AutocompleteOption index={index} label={name} value={source}>
      <div className="flex flex-1 items-center gap-4">
        <div className="flex flex-1 flex-col gap-0.5 items-start justify-center">
          <span className="flex-1 text-base">{name}</span>
          <span className="flex-1 text-sm text-dimmed">{sourceKey}</span>
        </div>

        <div className="flex flex-col gap-0.5 items-end justify-center text-dimmed text-sm">
          <span className="flex-1">{id}</span>
          <span className="flex-1">{source.archived ? 'Archived' : ''}</span>
        </div>
      </div>
    </AutocompleteOption>
  );
};
