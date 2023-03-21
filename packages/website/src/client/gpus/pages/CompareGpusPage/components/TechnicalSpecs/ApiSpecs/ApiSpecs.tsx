import React, { FunctionComponent } from 'react';
import { ApiIntro } from './ApiIntro';
import { ApiTable } from './ApiTable';

interface ApiSpecsProps {
  className?: string;
}

export const ApiSpecs: FunctionComponent<ApiSpecsProps> = (props) => {
  const { className } = props;

  return (
    <section className={className}>
      <h3 className="mb-0">API Support</h3>
      <ApiIntro />
      <ApiTable className="mb-4" />
    </section>
  );
};
