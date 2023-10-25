import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { ApiIntro } from './ApiIntro';
import { ApiTable } from './ApiTable';

interface ApiSpecsProps {
  className?: string;
}

export const ApiSpecs: FunctionComponent<ApiSpecsProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(gpu.fields?.directxVersion) &&
    !hasProductFieldFormattedValue(gpu.fields?.openClVersion) &&
    !hasProductFieldFormattedValue(gpu.fields?.openGlVersion) &&
    !hasProductFieldFormattedValue(gpu.fields?.shaderModelVersion)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">API Support</h3>
      <ApiIntro />
      <ApiTable />
    </section>
  );
};
