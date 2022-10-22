import { ProductSpecKey, ProductSpecRequest } from '@shared/product-spec';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
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

const INPUT_TYPES: { [key: string]: InputType } = {
  // General
  [ProductSpecKey.Company]: 'autocomplete',
  [ProductSpecKey.MarketSegment]: 'enum',
  [ProductSpecKey.LaunchPriceMsrp]: 'float',
  [ProductSpecKey.ReleaseDate]: 'date',

  // Processor
  [ProductSpecKey.GpuName]: 'autocomplete',
  [ProductSpecKey.Architecture]: 'autocomplete',
  [ProductSpecKey.ProcessSize]: 'float',
  [ProductSpecKey.Transistors]: 'float',

  // Memory
  [ProductSpecKey.MemorySize]: 'float',
  [ProductSpecKey.MemoryType]: 'autocomplete',
  [ProductSpecKey.MemoryClock]: 'float',
  [ProductSpecKey.MemoryInterface]: 'float',
  [ProductSpecKey.MemoryBandwidth]: 'float',

  // Board Design
  [ProductSpecKey.SlotWidth]: 'autocomplete',
  [ProductSpecKey.Length]: 'float',
  [ProductSpecKey.Width]: 'float',
  [ProductSpecKey.Height]: 'float',
  [ProductSpecKey.Weight]: 'float',
  [ProductSpecKey.SuggestedPsu]: 'float',
  [ProductSpecKey.ThermalDesignPower]: 'float',
  [ProductSpecKey.BusInterface]: 'autocomplete',
  [ProductSpecKey.PowerConnectors]: 'autocomplete',
  [ProductSpecKey.Outputs]: 'autocomplete',

  // Cores & Clock Speeds
  [ProductSpecKey.ShaderUnitsCudaCores]: 'float',
  [ProductSpecKey.TextureMappingUnits]: 'float',
  [ProductSpecKey.RenderOutputUnits]: 'float',
  [ProductSpecKey.TensorCores]: 'float',
  [ProductSpecKey.RayTracingCores]: 'float',
  [ProductSpecKey.CoreClockSpeedBase]: 'float',
  [ProductSpecKey.CoreClockSpeedBoost]: 'float',
  [ProductSpecKey.L1Cache]: 'float',
  [ProductSpecKey.L2Cache]: 'float',

  // Theoretical Performance
  [ProductSpecKey.PixelFillRate]: 'float',
  [ProductSpecKey.TextureFillRate]: 'float',
  [ProductSpecKey.Fp32Performance]: 'float',
  [ProductSpecKey.Fp64Performance]: 'float',

  // API Support
  [ProductSpecKey.GSyncFreeSyncSupport]: 'boolean',
  [ProductSpecKey.SliCrossfireSupport]: 'boolean',
  [ProductSpecKey.DirectXVersion]: 'float',
  [ProductSpecKey.OpenClVersion]: 'float',
  [ProductSpecKey.OpenGlVersion]: 'float',
  [ProductSpecKey.ShaderModelVersion]: 'float',
};

interface ProductSpecFieldProps {
  type?: InputType;
  field: ProductSpecKey;

  value?: ProductSpecRequest;
  onChange?: (value: ProductSpecRequest) => void;
}

export const ProductSpecField = forwardRef<unknown, ProductSpecFieldProps>(
  (props, ref) => {
    const { type, field, value: propsValue, onChange } = props;

    const [value, setValue] = useState(propsValue ?? null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (value: ProductSpecRequest) => {
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
          ref={ref as Ref<HTMLTextAreaElement>}
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
