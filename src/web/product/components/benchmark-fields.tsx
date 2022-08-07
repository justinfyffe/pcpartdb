import React, { FunctionComponent } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';
import { ProductReviewKey } from '../../../types/product-review';
import { Field } from '../../shared/components/field';
import { Input } from '../../shared/components/input';

interface ProductReviewFormData {
  key: ProductReviewKey;
  value: number;
  source?: string;
}

interface BenchmarkFieldsProps {
  className?: string;
}

export const BenchmarkFields: FunctionComponent<BenchmarkFieldsProps> = (
  props,
) => {
  const { className } = props;

  return (
    <>
      <BenchmarkField />
      <BenchmarkField />
      <BenchmarkField />
    </>
  );
};

export const BenchmarkField: FunctionComponent = () => {
  return (
    <div className="flex">
      <Field>
        Benchmark
        <Input />
      </Field>

      <Field>
        Value
        <Input />
      </Field>

      <Field>
        Source
        <Input />
      </Field>
    </div>
  );
};
