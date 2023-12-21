import { CpuProduct, GpuProduct, Product, ProductType } from '@pcpartdb/shared';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useMemo } from 'react';
import { getCpuAiPrompt } from './getCpuAiPrompt';
import { getGpuAiPrompt } from './getGpuAiPrompt';

interface AiPromptProps {
  productType: ProductType;
  product: Product;
}

export const AiPrompt: FunctionComponent<AiPromptProps> = (props) => {
  const { productType, product } = props;
  const cpuPreferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const gpuPreferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const prompt = useMemo(() => {
    if (productType === ProductType.Cpu) {
      return getCpuAiPrompt(product as CpuProduct, cpuPreferredBenchmark);
    } else if (productType === ProductType.Gpu) {
      return getGpuAiPrompt(product as GpuProduct, gpuPreferredBenchmark);
    }
    return '';
  }, [productType, product, cpuPreferredBenchmark, gpuPreferredBenchmark]);

  return <Textarea value={prompt} className="h-full" />;
};
