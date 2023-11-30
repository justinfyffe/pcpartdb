import { ProductType } from '@pcpartdb/shared';
import Markdown from 'markdown-to-jsx';
import { Tab } from 'packages/website/src/client/shared/components/Tabs/Tab';
import { Tabs } from 'packages/website/src/client/shared/components/Tabs/Tabs';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, { FunctionComponent, useCallback } from 'react';
import { Control } from 'react-hook-form';
import { AiPrompt } from './AiPrompt/AiPrompt';

interface ProductSummaryInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  productType: ProductType;

  value?: string;
  onChange?: (value: string) => void;

  placeholder?: string;
}

export const ProductSummaryInput: FunctionComponent<
  ProductSummaryInputProps
> = (props) => {
  const { control, productType, onChange, value, placeholder } = props;

  const handleValueChange = useCallback(
    (newValue: string) => {
      onChange?.(newValue);
    },
    [onChange],
  );

  // TODO: input should verify valid variables (variable has value)

  return (
    <Tabs className="h-120">
      <Tab label="Edit">
        <Textarea
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleValueChange}
          className="h-full"
        />
      </Tab>
      <Tab label="Preview">
        <Markdown>{value ?? ''}</Markdown>
      </Tab>
      <Tab label="AI Prompt">
        <AiPrompt control={control} productType={productType} />
      </Tab>
    </Tabs>
  );
};
