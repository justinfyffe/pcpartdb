import {
  ProductField,
  productFieldFormattedValue,
  ProductFieldKey,
} from '@pcpartdb/shared';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { useCallback, useEffect, useState } from 'react';

export interface ProductFieldInputProps {
  fieldKey: ProductFieldKey;

  label?: string;
  value?: ProductField;
  onChange?: (value: ProductField) => void;

  disabled?: boolean;
  children?: React.ReactNode;

  suggestedFormats?: string[];
  excludeDisplayValue?: boolean;
}

export const ProductFieldInput = (props: ProductFieldInputProps) => {
  const { fieldKey, label, value, disabled, onChange, suggestedFormats } =
    props;

  const [autoFormat, setAutoFormat] = useState(false);
  const [suggestedIndex, setSuggestedIndex] = useState(0);

  const handleFormattedChange = useCallback(
    (formatted: string) => {
      const newValue = {
        ...value,
        meta: { ...(value.meta ?? {}), fieldKey, formattedValue: formatted },
      };
      onChange?.(newValue);
    },
    [fieldKey, onChange, value],
  );

  const handleApplyFormat = useCallback(
    (format: string, idx: number) => {
      setSuggestedIndex(idx);

      const newValue = {
        ...value,
        meta: { ...(value.meta ?? {}), fieldKey, formattedValue: format },
      };
      onChange?.(newValue);
    },
    [fieldKey, onChange, value],
  );

  const handleAutoUpdateChange = useCallback(
    (checked: boolean) => {
      const newValue = {
        ...value,
        meta: { ...(value?.meta ?? {}), fieldKey, autoUpdate: checked },
      };
      onChange?.(newValue);
    },
    [fieldKey, value, onChange],
  );

  useEffect(() => {
    if (autoFormat && suggestedFormats != null && suggestedFormats.length > 0) {
      handleFormattedChange(
        suggestedFormats[
          suggestedIndex < suggestedFormats.length ? suggestedIndex : 0
        ],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.value]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between">
            <span>{label}</span>

            <div className="text-xs">
              <Checkbox
                value={value?.meta?.autoUpdate ?? true}
                onChange={handleAutoUpdateChange}
              >
                Auto Update
              </Checkbox>
            </div>
          </div>

          {props.children}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between">
            <span>Display Value</span>

            <div className="text-xs">
              <Checkbox
                value={autoFormat}
                onChange={() => setAutoFormat(!autoFormat)}
              >
                Auto Format
              </Checkbox>
            </div>
          </div>

          <TextInput
            disabled={disabled}
            value={productFieldFormattedValue(value)}
            onChange={handleFormattedChange}
          />

          <div className="flex gap-2 items-end justify-end text-xs">
            {suggestedFormats != null && suggestedFormats.length > 0 && (
              <span>Suggested: </span>
            )}
            {suggestedFormats?.map((format, i) => (
              <React.Fragment key={format}>
                {i > 0 && <> &bull; </>}
                <a
                  onClick={() => handleApplyFormat(format, i)}
                  className="cursor-pointer"
                >
                  {format}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
