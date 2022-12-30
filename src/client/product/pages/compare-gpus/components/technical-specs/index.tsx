import React, { FunctionComponent } from 'react';
import { ApiIntro, ApiTable } from './api';
import { CompatibilityIntro, CompatibilityTable } from './compatibility';
import { CoresIntro, CoresTable } from './cores';
import { MemoryIntro, MemoryTable } from './memory';
import { ProcessorIntro, ProcessorTable } from './processor';

export const TechnicalSpecs: FunctionComponent = () => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="mb-0">Technical Specs</h2>

      <section>
        <h3 className="mb-0">Processor</h3>
        <ProcessorIntro />
        <ProcessorTable className="mb-4" />
      </section>

      <section>
        <h3 className="mb-0">Memory</h3>
        <MemoryIntro />
        <MemoryTable className="mb-4" />
      </section>

      <section>
        <h3 className="mb-0">Board Compatibility &amp; Dimensions</h3>
        <CompatibilityIntro />
        <CompatibilityTable className="mb-4" />
      </section>

      <section>
        <h3 className="mb-0">Cores &amp; Clock Speeds</h3>
        <CoresIntro />
        <CoresTable className="mb-4" />
      </section>

      <section>
        <h3 className="mb-0">API Support</h3>
        <ApiIntro />
        <ApiTable className="mb-4" />
      </section>
    </section>
  );
};
