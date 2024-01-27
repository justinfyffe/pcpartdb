import { Product, ProductType } from '@pcpartdb/shared';
import Markdown from 'markdown-to-jsx';
import { Tab } from 'packages/website/src/client/shared/components/Tabs/Tab';
import { Tabs } from 'packages/website/src/client/shared/components/Tabs/Tabs';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, { FunctionComponent, useCallback } from 'react';
import { AiPrompt } from './AiPrompt/AiPrompt';

export interface ProductSummaryInputProps {
  productType: ProductType;
  product?: Product;

  value?: string;
  onChange?: (value: string) => void;

  placeholder?: string;

  ref?: unknown;
}

export const ProductSummaryInput: FunctionComponent<
  ProductSummaryInputProps
> = (props) => {
  const { productType, onChange, value, placeholder, product } = props;

  const handleValueChange = useCallback(
    (newValue: string) => {
      onChange?.(newValue);
    },
    [onChange],
  );

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
        <AiPrompt productType={productType} product={product} />
      </Tab>
    </Tabs>
  );
};
