import { getListCpusPath, ListCpusPresetSlug } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';

interface ListPresetsProps {
  className?: string;
}

export const ListPresets: FunctionComponent<ListPresetsProps> = (props) => {
  const presets = [
    {
      slug: ListCpusPresetSlug.BestPerformance,
      label: 'Best performance CPUs',
    },
    {
      slug: ListCpusPresetSlug.BestPerformanceAmd,
      label: 'Best performance AMD CPUs',
    },
    {
      slug: ListCpusPresetSlug.BestPerformanceIntel,
      label: 'Best performance Intel CPUs',
    },
    {
      slug: ListCpusPresetSlug.BestPerformancePerDollar,
      label: 'Best performance per dollar CPUs',
    },
    {
      slug: ListCpusPresetSlug.BestPerformancePerDollarAmd,
      label: 'Best performance per dollar AMD CPUs',
    },
    {
      slug: ListCpusPresetSlug.BestPerformancePerDollarIntel,
      label: 'Best performance per dollar Intel CPUs',
    },
  ];

  return (
    <section className={props.className}>
      <div className="font-bold p-2">Popular Queries:</div>
      <div className="flex flex-col">
        {presets.map((preset) => (
          <a
            key={preset.slug}
            href={getListCpusPath(preset.slug)}
            className="block p-2 hover:bg-mouse-hover"
          >
            {preset.label}
          </a>
        ))}
      </div>
    </section>
  );
};
