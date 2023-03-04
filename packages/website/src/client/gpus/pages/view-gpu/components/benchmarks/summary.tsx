import React from 'react';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '../../../../../shared/content';

export const BenchmarksSummarySentence1 = compileContent({
  deps: [],
  component: () => (
    <>
      The G3D Mark score represents a summary of the 3D Graphics Test Suite from
      PassMark PerformanceTEST.
    </>
  ),
});

export const BenchmarksSummarySentence2 = compileContent({
  deps: [],
  component: () => (
    <>
      The G2D Mark score represents a summary of the 2D Graphics Test Suite from
      PassMark PerformanceTEST.
    </>
  ),
});

export const BenchmarksSummarySentence3 = compileContent({
  deps: [],
  component: () => (
    <>
      The 3Dmark Time Spy Graphics benchmark is often known as the go-to modern
      benchmark test for testing GPU performance. It is built on DirectX
      12&apos;s Graphics API.
    </>
  ),
});

export const BenchmarksSummary = () => {
  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <BenchmarksSummarySentence1 />
      </p>

      <p>
        <BenchmarksSummarySentence2 />
      </p>

      <p>
        <BenchmarksSummarySentence3 />
      </p>
    </ContentContext.Provider>
  );
};
