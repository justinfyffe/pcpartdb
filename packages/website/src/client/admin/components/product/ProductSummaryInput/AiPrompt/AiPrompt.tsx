import { CpuProduct, GpuProduct, Product, ProductType } from '@pcpartdb/shared';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, { FunctionComponent, useMemo } from 'react';
import { getCpuAiPrompt } from './getCpuAiPrompt';
import { getGpuAiPrompt } from './getGpuAiPrompt';

interface AiPromptProps {
  productType: ProductType;
  product: Partial<Product>;
}

export const AiPrompt: FunctionComponent<AiPromptProps> = (props) => {
  const { productType, product } = props;

  const prompt = useMemo(() => {
    if (productType === ProductType.Cpu) {
      return getCpuAiPrompt(product as CpuProduct);
    } else if (productType === ProductType.Gpu) {
      return getGpuAiPrompt(product as GpuProduct);
    }
    return '';
  }, [productType, product]);

  return <Textarea value={prompt} className="h-full" />;
};
