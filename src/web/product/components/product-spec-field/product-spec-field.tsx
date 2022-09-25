import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ProductSpecKey,
  ProductSpecMetadata,
} from '../../../../types/product-spec';
import { ProductSpecAutocompleteField } from './product-spec-autocomplete-field';
import { ProductSpecBooleanField } from './product-spec-boolean-field';
import { ProductSpecDateField } from './product-spec-date-field';
import { ProductSpecEnumField } from './product-spec-enum-field';
import { ProductSpecFloatField } from './product-spec-float-field';
import { ProductSpecStringField } from './product-spec-string-field';
import { ProductSpecTextField } from './product-spec-text-field';

type InputType =
  | 'autocomplete'
  | 'string'
  | 'text'
  | 'float'
  | 'date'
  | 'boolean'
  | 'enum';

interface ProductSpecValue {
  key: ProductSpecKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductSpecMetadata;
  source?: string;
}

const INPUT_TYPES: { [key: string]: InputType } = {
  [ProductSpecKey.Architecture]: 'autocomplete',
  [ProductSpecKey.BusInterface]: 'autocomplete',
  [ProductSpecKey.ClockSpeedBase]: 'float',
  [ProductSpecKey.ClockSpeedBoost]: 'float',
  [ProductSpecKey.Company]: 'autocomplete',
  [ProductSpecKey.CudaCores]: 'float',
  [ProductSpecKey.DieSize]: 'float',
  [ProductSpecKey.DirectXVersion]: 'float',
  [ProductSpecKey.DisplayPorts]: 'autocomplete',
  [ProductSpecKey.Foundry]: 'autocomplete',
  [ProductSpecKey.Fp32Performance]: 'float',
  [ProductSpecKey.Fp64Performance]: 'float',
  [ProductSpecKey.Generation]: 'autocomplete',
  [ProductSpecKey.GpuName]: 'autocomplete',
  [ProductSpecKey.GpuVariant]: 'autocomplete',
  [ProductSpecKey.GSyncFreeSyncSupport]: 'boolean',
  [ProductSpecKey.HdmiPorts]: 'autocomplete',
  [ProductSpecKey.Height]: 'float',
  [ProductSpecKey.L1Cache]: 'float',
  [ProductSpecKey.L2Cache]: 'float',
  [ProductSpecKey.LaunchPrice]: 'float',
  [ProductSpecKey.Length]: 'float',
  [ProductSpecKey.Lithography]: 'float',
  [ProductSpecKey.MarketSegment]: 'enum',
  [ProductSpecKey.MaxMemoryBandwidth]: 'float',
  [ProductSpecKey.MaxMemorySize]: 'float',
  [ProductSpecKey.MaxResolution]: 'autocomplete',
  [ProductSpecKey.MemoryBandwidth]: 'float',
  [ProductSpecKey.MemoryInterface]: 'float',
  [ProductSpecKey.MemorySize]: 'float',
  [ProductSpecKey.MemoryType]: 'autocomplete',
  [ProductSpecKey.OpenClVersion]: 'float',
  [ProductSpecKey.OpenGlVersion]: 'float',
  [ProductSpecKey.PixelFillRate]: 'float',
  [ProductSpecKey.PowerConnectors]: 'autocomplete',
  [ProductSpecKey.ProductionStatus]: 'enum',
  [ProductSpecKey.ReleaseDate]: 'date',
  [ProductSpecKey.Rops]: 'float',
  [ProductSpecKey.RtCores]: 'float',
  [ProductSpecKey.ShaderModelVersion]: 'float',
  [ProductSpecKey.SliCrossfireSupport]: 'boolean',
  [ProductSpecKey.SlotWidth]: 'autocomplete',
  [ProductSpecKey.SuggestedPsu]: 'float',
  [ProductSpecKey.Tdp]: 'float',
  [ProductSpecKey.TensorCores]: 'float',
  [ProductSpecKey.TextureRate]: 'float',
  [ProductSpecKey.Tmus]: 'float',
  [ProductSpecKey.Transistors]: 'float',
  [ProductSpecKey.VrReady]: 'boolean',
  [ProductSpecKey.Weight]: 'float',
  [ProductSpecKey.Width]: 'float',
};

interface ProductSpecFieldProps {
  type?: InputType;
  field: ProductSpecKey;

  value?: ProductSpecValue;
  onChange?: (value: ProductSpecValue) => void;
}

export const ProductSpecField = forwardRef<unknown, ProductSpecFieldProps>(
  (props, ref) => {
    const { type, field, value: propsValue, onChange } = props;

    const [value, setValue] = useState(propsValue ?? null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (value: ProductSpecValue) => {
        setValue(value);
        onChange?.(value);
      },
      [onChange],
    );

    const inputType = type ?? INPUT_TYPES[field];
    if (inputType === 'autocomplete') {
      return (
        <ProductSpecAutocompleteField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'string') {
      return (
        <ProductSpecStringField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'text') {
      return (
        <ProductSpecTextField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'float') {
      return (
        <ProductSpecFloatField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'date') {
      return (
        <ProductSpecDateField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'boolean') {
      return (
        <ProductSpecBooleanField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLSelectElement>}
        />
      );
    } else if (inputType === 'enum') {
      return (
        <ProductSpecEnumField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLSelectElement>}
        />
      );
    } else {
      return (
        <ProductSpecStringField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    }
  },
);
ProductSpecField.displayName = 'ProductSpecField';
