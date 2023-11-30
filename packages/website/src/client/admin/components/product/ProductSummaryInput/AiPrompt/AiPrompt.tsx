import { ProductType } from '@pcpartdb/shared';
import { Textarea } from 'packages/website/src/client/shared/components/Textarea/Textarea';
import React, { FunctionComponent } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { getCpuAiPrompt } from './cpu';
import { getGpuAiPrompt } from './gpu';

interface AiPromptProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  productType: ProductType;
}

export const AiPrompt: FunctionComponent<AiPromptProps> = (props) => {
  const { control, productType } = props;

  const name: string = useWatch({ control, name: 'name' });

  let prompt = '';
  if (productType === ProductType.Cpu) {
    prompt = getCpuAiPrompt({});
  } else if (productType === ProductType.Gpu) {
    prompt = getGpuAiPrompt({});
  }

  return <Textarea value={prompt} className="h-full" />;
};
