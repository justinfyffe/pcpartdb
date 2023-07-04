import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
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
    !hasProductFieldValue(gpu1.directxVersion) &&
    !hasProductFieldValue(gpu2.directxVersion) &&
    !hasProductFieldValue(gpu1.openClVersion) &&
    !hasProductFieldValue(gpu2.openClVersion) &&
    !hasProductFieldValue(gpu1.openGlVersion) &&
    !hasProductFieldValue(gpu2.openGlVersion) &&
    !hasProductFieldValue(gpu1.shaderModelVersion) &&
    !hasProductFieldValue(gpu2.shaderModelVersion)
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
