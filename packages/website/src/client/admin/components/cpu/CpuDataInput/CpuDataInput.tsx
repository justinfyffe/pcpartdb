import { CpuField, CpuFieldKey, ProductField } from '@pcpartdb/shared';
import { cpuService } from 'packages/website/src/client/product';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Checkbox } from '../../../../shared/components';
import {
  ProductAutocompleteDataInput,
  ProductBooleanInput,
  ProductChipsInput,
  ProductCurrencyInput,
  ProductDateInput,
  ProductEnumInput,
  ProductFloatInput,
  ProductTextareaInput,
  ProductTextInput,
} from '../../product';
import { ENUMS } from './enums';
import { MEASUREMENT_UNITS } from './units';

type InputType =
  | 'autocomplete'
  | 'boolean'
  | 'chips'
  | 'currency'
  | 'date'
  | 'enum'
  | 'enum_multiple'
  | 'float'
  | 'text'
  | 'textarea';

const INPUT_TYPES: Record<string, InputType> = {
  // General
  partNumber: 'text',
  company: 'autocomplete',
  marketSegment: 'enum',
  launchPrice: 'currency',
  releaseDate: 'date',
  productionStatus: 'enum',
  bundledCooler: 'autocomplete',

  // Physical
  socket: 'autocomplete',
  foundry: 'autocomplete',
  processSize: 'float',
  transistors: 'float',
  tCaseMax: 'float',
  tjMax: 'float',

  // Technical
  architecture: 'autocomplete',
  codename: 'autocomplete',
  generation: 'autocomplete',
  pciExpress: 'chips',
  chipsets: 'chips',

  // Memory
  memorySupport: 'chips',
  memoryChannels: 'float',
  hasEccMemory: 'boolean',

  // Cores & Clock Speed
  coresCount: 'float',
  threadsCount: 'float',
  performanceCoresCount: 'float',
  efficientCoresCount: 'float',
  clock: 'float',
  turboClock: 'float',
  performanceCoreClock: 'float',
  performanceCoreTurboClock: 'float',
  efficientCoreClock: 'float',
  efficientCoreTurboClock: 'float',
  baseClock: 'float',
  multiplier: 'float',
  isMultiplierUnlocked: 'boolean',

  // Power Consumption
  tdp: 'float',
  pl1: 'float',
  pl2: 'float',
  ppt: 'float',

  // Cache
  l1Cache: 'float',
  l2Cache: 'float',
  l3Cache: 'float',
  efficientCoreL1Cache: 'float',
  efficientCoreL2Cache: 'float',

  // Graphics & Features
  integratedGraphics: 'autocomplete',
  extensionsTechnologies: 'chips',

  // Benchmarks
  cpuMarkMultiThread: 'float',
  cpuMarkSingleThread: 'float',
  geekbenchSingleCore: 'float',
  geekbenchMultiCore: 'float',
};

interface CpuDataInputProps {
  type?: InputType;
  field: CpuFieldKey;

  value?: CpuField;
  onChange?: (value: CpuField) => void;
}

export const CpuDataInput = forwardRef<unknown, CpuDataInputProps>(
  (props, ref) => {
    const { type, field, value: propsValue, onChange } = props;

    const [value, setValue] = useState(propsValue || null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const disabled = useMemo(
      () => value?.meta?.autoUpdate,
      [value?.meta?.autoUpdate],
    );

    const handleAutocompleteQuery = useCallback(
      async (query: string) => {
        const results = await cpuService.autocompleteField(query, field);
        const filtered = results.filter((value) => value != null);
        return filtered;
      },
      [field],
    );

    const handleChange = useCallback(
      (newProductValue: ProductField) => {
        const newCpuValue = newProductValue as CpuField;

        if (newCpuValue != null) {
          newCpuValue.meta = { fieldKey: field, ...(newCpuValue?.meta ?? {}) };
        }
        newCpuValue.meta.autoUpdate = false;

        setValue(newCpuValue);
        onChange?.(newCpuValue);
      },
      [field, onChange],
    );

    const handleAutoUpdateChange = useCallback(
      (checked: boolean) => {
        const newValue = value || { value: null, meta: { fieldKey: field } };
        newValue.meta.autoUpdate = checked;

        setValue(newValue);
        onChange?.(newValue);
      },
      [field, onChange, value],
    );

    const inputType = type ?? INPUT_TYPES[field];
    const renderInput = useCallback(() => {
      if (inputType === 'autocomplete') {
        return (
          <ProductAutocompleteDataInput
            fieldKey={field}
            value={value as ProductField<string>}
            disabled={disabled}
            onChange={handleChange}
            onQuery={handleAutocompleteQuery}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'boolean') {
        return (
          <ProductBooleanInput
            fieldKey={field}
            value={value as ProductField<boolean>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLSelectElement>}
          />
        );
      } else if (inputType === 'chips') {
        return (
          <ProductChipsInput
            fieldKey={field}
            value={value as ProductField<string[]>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'currency') {
        return (
          <ProductCurrencyInput
            fieldKey={field}
            value={value as ProductField<number>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'date') {
        return (
          <ProductDateInput
            fieldKey={field}
            value={value as ProductField<string>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'enum') {
        const items = ENUMS[field];
        return (
          <ProductEnumInput
            fieldKey={field}
            items={items}
            value={value as ProductField<string>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLSelectElement>}
          />
        );
      } else if (inputType === 'enum_multiple') {
        const items = ENUMS[field];
        return (
          <ProductEnumInput
            fieldKey={field}
            items={items}
            value={value as ProductField<string[]>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLSelectElement>}
            multiple
          />
        );
      } else if (inputType === 'float') {
        const units = MEASUREMENT_UNITS[field] || [];
        return (
          <ProductFloatInput
            fieldKey={field}
            units={units}
            value={value as ProductField<number>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'text') {
        return (
          <ProductTextInput
            fieldKey={field}
            value={value as ProductField<string>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'textarea') {
        return (
          <ProductTextareaInput
            fieldKey={field}
            value={value as ProductField<string>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLTextAreaElement>}
          />
        );
      } else {
        return (
          <ProductTextInput
            fieldKey={field}
            value={value as ProductField<string>}
            disabled={disabled}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      }
    }, [
      inputType,
      field,
      value,
      disabled,
      handleChange,
      handleAutocompleteQuery,
      ref,
    ]);

    return (
      <div className="flex flex-col">
        {renderInput()}
        <div className="flex gap-4 items-end justify-end text-xs">
          <Checkbox
            value={value?.meta?.autoUpdate === true}
            onChange={handleAutoUpdateChange}
          >
            Auto Update
          </Checkbox>
        </div>
      </div>
    );
  },
);
CpuDataInput.displayName = 'CpuDataInput';
