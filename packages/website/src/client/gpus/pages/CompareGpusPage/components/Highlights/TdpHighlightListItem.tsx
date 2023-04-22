import { BoltIcon } from '@heroicons/react/24/outline';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  HighlightLabel,
  HighlightListItem,
  HighlightValue,
  HighlightValues,
} from './HighlightList';

interface TdpHighlightListItemProps {
  className?: string;
}

export const TdpHighlightListItem: FunctionComponent<
  TdpHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const names = useMemo(
    () => [
      getGpuName(gpu1, { company: false, brand: false }),
      getGpuName(gpu2, { company: false, brand: false }),
    ],
    [gpu1, gpu2],
  );

  const values = useMemo(() => {
    return [
      formatGpuField(gpu1.thermalDesignPower) || '--',
      formatGpuField(gpu2.thermalDesignPower) || '--',
    ];
  }, [gpu1.thermalDesignPower, gpu2.thermalDesignPower]);

  const [bold1, bold2] = useMemo(() => {
    return [
      gpu1.thermalDesignPower?.value > gpu2.thermalDesignPower?.value,
      gpu1.thermalDesignPower?.value < gpu2.thermalDesignPower?.value,
    ];
  }, [gpu1.thermalDesignPower?.value, gpu2.thermalDesignPower?.value]);

  return (
    <HighlightListItem className={className}>
      <HighlightLabel icon={<BoltIcon className="md:hidden" />}>
        TDP
      </HighlightLabel>

      <HighlightValues>
        <HighlightValue className={bold1 ? 'font-bold' : ''}>
          {names[0]}: {values[0]}
        </HighlightValue>
        <HighlightValue className={bold2 ? 'font-bold' : ''}>
          {names[1]}: {values[1]}
        </HighlightValue>
      </HighlightValues>
    </HighlightListItem>
  );
};
