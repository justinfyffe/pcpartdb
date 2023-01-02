import { Field, TextInput } from '@client/shared/components';
import { RetailModel } from '@shared/retail-model';
import React, { FunctionComponent, useCallback } from 'react';

interface RetailModelFieldProps {
  value?: RetailModel;
  onChange?: (value: RetailModel) => void;

  className?: string;
  ref?: unknown;
}

export const RetailModelField: FunctionComponent<RetailModelFieldProps> = (
  props,
) => {
  const { value, onChange } = props;

  const handleNameChange = useCallback(
    (name: string) => {
      onChange?.({ ...value, name });
    },
    [value, onChange],
  );

  const handleModelNumberChange = useCallback(
    (modelNumber: string) => {
      onChange?.({ ...value, modelNumber });
    },
    [value, onChange],
  );

  const handleManufacturerChange = useCallback(
    (manufacturer: string) => {
      onChange?.({ ...value, manufacturer });
    },
    [value, onChange],
  );

  const handleAmazonChange = useCallback(
    (amazonUrl: string) => {
      onChange?.({ ...value, amazonUrl });
    },
    [value, onChange],
  );

  return (
    <div className="flex gap-6">
      <Field className="flex-1">
        Name
        <TextInput
          value={value?.name ?? null}
          onChange={handleNameChange}
          ref={null}
        />
      </Field>

      <Field className="flex-1">
        Model Number
        <TextInput
          value={value?.modelNumber ?? null}
          onChange={handleModelNumberChange}
          ref={null}
        />
      </Field>

      <Field className="flex-1">
        Manufacturer
        <TextInput
          value={value?.manufacturer ?? null}
          onChange={handleManufacturerChange}
          ref={null}
        />
      </Field>

      <Field className="flex-1">
        Amazon URL
        <TextInput
          value={value?.amazonUrl ?? null}
          onChange={handleAmazonChange}
          ref={null}
        />
      </Field>
    </div>
  );
};
