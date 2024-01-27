import { getListGpusPath, ListGpusPresetSlug } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';

interface ListPresetsProps {
  className?: string;
}

export const ListPresets: FunctionComponent<ListPresetsProps> = (props) => {
  const presets = [
    {
      slug: ListGpusPresetSlug.BestPerformance,
      label: 'Best performance GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestPerformanceAmd,
      label: 'Best performance AMD GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestPerformanceNvidia,
      label: 'Best performance NVIDIA GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestValue,
      label: 'Best performance per dollar GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestValueAmd,
      label: 'Best performance per dollar AMD GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestValueNvidia,
      label: 'Best performance per dollar NVIDIA GPUs',
    },
  ];

  return (
    <section className={props.className}>
      <div className="font-bold p-2">Popular Queries:</div>
      <div className="flex flex-col">
        {presets.map((preset) => (
          <a
            key={preset.slug}
            href={getListGpusPath(preset.slug)}
            className="block p-2 hover:bg-mouse-hover"
          >
            {preset.label}
          </a>
        ))}
      </div>
    </section>
  );
};
