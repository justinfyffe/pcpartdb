import { GpuProduct, Product, ProductType } from '@pcpartdb/shared';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, { FunctionComponent } from 'react';
import { getCpuAiPrompt } from './cpu';
import { getGpuAiPrompt } from './gpu';

interface AiPromptProps {
  productType: ProductType;
  product: Product;
}

export const AiPrompt: FunctionComponent<AiPromptProps> = (props) => {
  const { productType, product } = props;

  let prompt = '';
  if (productType === ProductType.Cpu) {
    prompt = getCpuAiPrompt({});
  } else if (productType === ProductType.Gpu) {
    prompt = getGpuAiPrompt(product as GpuProduct);
  }

  return <Textarea value={prompt} className="h-full" />;
};
