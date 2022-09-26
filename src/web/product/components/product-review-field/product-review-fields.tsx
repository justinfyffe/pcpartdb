import React, { FunctionComponent, useCallback } from 'react';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { ProductReviewField, ProductReviewValue } from './product-review-field';

interface ProductReviewFieldsProps {
  name: string;
  value: ProductReviewValue[];
  fields: (ProductReviewValue & { id: string })[];

  onChange: (values: ProductReviewValue[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;

  ref?: unknown;
}

export const ProductReviewFields: FunctionComponent<
  ProductReviewFieldsProps
> = (props) => {
  const { fields, value, onAppend, onChange, onRemove } = props;

  const handleFieldChange = useCallback(
    (i: number, review: ProductReviewValue) => {
      fields[i] = { ...fields[i], ...review };
      value[i] = { ...review };
      onChange(value);
    },
    [fields, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {fields.map((review, i) => (
        <ProductReviewField
          key={review.id}
          value={review}
          onChange={(value) => handleFieldChange(i, value)}
        />
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
