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

  return (
    <AutocompleteOption index={index} label={name} value={source}>
      <div className="flex flex-1 flex-col gap-1 items-start justify-center">
        <span className="flex-1 text-base">{name}</span>
        <span className="flex-1 text-sm text-dimmed">
          ID: {id} {source.archived ? '(Archived)' : ''}
        </span>
      </div>
    </AutocompleteOption>
  );
};
