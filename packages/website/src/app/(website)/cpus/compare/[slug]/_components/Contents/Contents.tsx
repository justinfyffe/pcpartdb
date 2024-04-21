'use client';

import React from 'react';
import { usePageContext } from '../../PageProvider';

interface ContentsProps {}

export function Contents(_props: ContentsProps) {
  const { viewModel } = usePageContext();

  return (
    <div className="flex gap-x-6 gap-y-2 justify-between flex-wrap xs:justify-center">
      <span className="xs:w-full xs:text-center font-semibold">Contents:</span>
      <a href="#contents">Highlights</a>
      <a href="#summary">Summary</a>
      <a href="#benchmark-performance">Benchmark Performance</a>
      <a href="#tech-specs">Technical Specs</a>
      <a href="#related-cpus">Related CPUs</a>
      {!!viewModel?.relatedCpus?.length && (
        <a href="#related-cpus">Related CPUs</a>
      )}
      {!!viewModel?.relatedCpuComparisons?.length && (
        <a href="#related-comparisons">Related Comparisons</a>
      )}
    </div>
  );
}
