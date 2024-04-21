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
      <a href="#gaming-performance">Gaming Performance</a>
      <a href="#benchmark-performance">Benchmark Performance</a>
      <a href="#tech-specs">Technical Specs</a>
      {!!viewModel?.gpu?.children?.length && (
        <a href="#retail-models">Retail Models</a>
      )}
      {!!viewModel?.relatedGpus?.length && (
        <a href="#related-gpus">Related GPUs</a>
      )}
      {!!viewModel?.relatedGpuComparisons?.length && (
        <a href="#related-comparisons">Related Comparisons</a>
      )}
    </div>
  );
}
