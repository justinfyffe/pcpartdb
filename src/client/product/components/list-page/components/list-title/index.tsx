import React, { FunctionComponent, useContext } from 'react';
import { ListPageContext } from '../../context';

// const TITLES = {
//   [ListPreset.BestPerformance]: 'Best Graphics Cards by Performance',
//   [ListPreset.BestPerformanceAmd]: 'Best AMD Graphics Cards by Performance',
//   [ListPreset.BestPerformanceNvidia]:
//     'Best NVIDIA Graphics Cards by Performance',
//   [ListPreset.BestValue]: 'Best Graphics Cards by Value',
//   [ListPreset.BestValueAmd]: 'Best AMD Graphics Cards by Value',
//   [ListPreset.BestValueNvidia]: 'Best NVIDIA Graphics Cards by Value',
// };

// const SUBTITLES = {
//   [ListPreset.BestPerformance]: 'Sorted by highest performance benchmarks',
//   [ListPreset.BestPerformanceAmd]: 'Sorted by highest performance benchmarks',
//   [ListPreset.BestPerformanceNvidia]:
//     'Sorted by highest performance benchmarks',
//   [ListPreset.BestValue]: 'Sorted by performance per dollar',
//   [ListPreset.BestValueAmd]: 'Sorted by performance per dollar',
//   [ListPreset.BestValueNvidia]: 'Sorted by performance per dollar',
// };

export const ListTitle: FunctionComponent = () => {
  const { query } = useContext(ListPageContext);

  const title = '';
  const subtitle = '';

  return (
    <div>
      <h1 className="md:text-2xl text-3xl mb-0">{title}</h1>
      <p className="text-content-dimmed mb-0">{subtitle}</p>
    </div>
  );
};
