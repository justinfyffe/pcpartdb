import { ProductSource, ProductSourceKey, ProductType } from '@pcpartdb/shared';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useCallback } from 'react';

const SOURCES = {
  [ProductType.Cpu]: [
    { key: ProductSourceKey.GeekBench, label: 'Geekbench' },
    { key: ProductSourceKey.NotebookCheck, label: 'Notebookcheck' },
    { key: ProductSourceKey.PassMark, label: 'PassMark' },
    { key: ProductSourceKey.TechPowerUp, label: 'TechPowerUp' },
  ],
  [ProductType.Gpu]: [
    { key: ProductSourceKey.NotebookCheck, label: 'Notebookcheck' },
    { key: ProductSourceKey.PassMark, label: 'PassMark' },
    { key: ProductSourceKey.TechPowerUp, label: 'TechPowerUp' },
  ],
};

interface ProductSourceInputProps {
  productType: ProductType;
  value?: ProductSource;
  onChange?: (value: ProductSource) => void;

  className?: string;
  ref?: unknown;
}

export const ProductSourceInput: FunctionComponent<ProductSourceInputProps> = (
  props,
) => {
  const { productType, value, onChange, className } = props;

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      if (key != null) {
        onChange?.({ sourceKey: key as ProductSourceKey, sourceUrl: '' });
      } else {
        onChange?.(null);
      }
    },
    [onChange],
  );

  const handleUrlChange = useCallback(
    (url: string) => {
      onChange?.({
        sourceKey: value?.sourceKey as ProductSourceKey,
        sourceUrl: url,
      });
    },
    [onChange, value?.sourceKey],
  );

  return (
    <div className={classNames('flex gap-4', className)}>
      <Select
        placeholder="Select Source"
        value={value?.sourceKey}
        onChange={handleKeyChange}
        className="flex-1"
        clearable
      >
        {SOURCES[productType].map((source) => (
          <SelectOption
            key={source.key}
            label={source.label}
            value={source.key}
          >
            {source.label}
          </SelectOption>
        ))}
      </Select>

      <TextInput
        placeholder="Source URL"
        disabled={value?.sourceKey == null}
        value={value?.sourceUrl}
        onChange={handleUrlChange}
        className="flex-1"
      />
    </div>
  );
};
