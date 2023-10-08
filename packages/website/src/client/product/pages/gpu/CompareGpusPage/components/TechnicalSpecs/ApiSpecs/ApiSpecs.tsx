import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { ApiIntro } from './ApiIntro';
import { ApiTable } from './ApiTable';

interface ApiSpecsProps {
  className?: string;
}

export const ApiSpecs: FunctionComponent<ApiSpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.directxVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.directxVersion) &&
    !hasProductFieldFormattedValue(gpu1.fields?.openClVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.openClVersion) &&
    !hasProductFieldFormattedValue(gpu1.fields?.openGlVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.openGlVersion) &&
    !hasProductFieldFormattedValue(gpu1.fields?.shaderModelVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.shaderModelVersion)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">API Support</h3>
      <ApiIntro />
      <ApiTable className="mb-4" />
    </section>
  );
};
