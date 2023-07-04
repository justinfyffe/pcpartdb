import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context';
import { ApiIntro } from './ApiIntro';
import { ApiTable } from './ApiTable';

interface ApiSpecsProps {
  className?: string;
}

export const ApiSpecs: FunctionComponent<ApiSpecsProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(gpu.directxVersion) &&
    !hasProductFieldValue(gpu.openClVersion) &&
    !hasProductFieldValue(gpu.openGlVersion) &&
    !hasProductFieldValue(gpu.shaderModelVersion)
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
