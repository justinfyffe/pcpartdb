import { XIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback } from 'react';
import { ProductReviewRequest } from '../../../../types/product-review';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { ProductReviewField } from './product-review-field';

interface ProductReviewFieldsProps {
  name: string;
  value: ProductReviewRequest[];
  fields: (ProductReviewRequest & { id: string })[];

  onChange: (values: ProductReviewRequest[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;

  ref?: unknown;
}

export const ProductReviewFields: FunctionComponent<
  ProductReviewFieldsProps
> = (props) => {
  const { fields, value, onAppend, onChange, onRemove } = props;

  const handleFieldChange = useCallback(
    (i: number, review: ProductReviewRequest) => {
      fields[i] = { ...fields[i], ...review };
      value[i] = { ...review, metadata: { order: i } };
      onChange(value);
    },
    [fields, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-6">
          <ProductReviewField
            key={field.id}
            value={value[i]}
            onChange={(value) => handleFieldChange(i, value)}
            className="flex-1"
          />
          <Button
            variant={ButtonVariant.Default}
            onClick={() => onRemove(i)}
            className="self-start px-3 py-3 mt-6"
          >
            <XIcon className="w-4" />
          </Button>
        </div>
      ))}

      <Button
        className="self-end"
        variant={ButtonVariant.Secondary}
        onClick={() => onAppend && onAppend()}
      >
        Add Review
      </Button>
    </div>
  );
};
